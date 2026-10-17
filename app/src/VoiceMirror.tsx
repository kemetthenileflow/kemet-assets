import React, { useEffect, useRef, useState } from 'react';
import { wordAsset } from './assets';
import { Media } from './ui';

type Phase = 'ready' | 'requesting' | 'recording' | 'stopping' | 'recorded' | 'error';
export function microphoneMessage(error: any) {
  switch (error?.name) {
    case 'NotAllowedError': case 'PermissionDeniedError':
      return 'Microphone permission was not granted. Allow the microphone in your browser’s site settings, then try again. An embedded preview may require opening the app separately.';
    case 'NotFoundError': case 'DevicesNotFoundError': return 'No microphone was found. Connect a microphone and try again.';
    case 'NotReadableError': case 'TrackStartError': return 'The microphone is busy or blocked by your device. Close other recording apps and check system permissions.';
    case 'SecurityError': return 'Microphone access is blocked by this page or embedded preview. Open the app in its own secure tab.';
    default: return 'Recording could not start. Check your microphone and browser permissions, then try again.';
  }
}
export function VoiceMirror({ prompt, word }: { prompt: string; word?: string }) {
  const [embeddedBlocked, setEmbeddedBlocked] = useState(false);
  const [phase, setPhase] = useState<Phase>('ready');
  const [message, setMessage] = useState('Ready. Your recording stays temporarily in this tab; it is never uploaded.');
  const [url, setUrl] = useState('');
  const [seconds, setSeconds] = useState(0);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const generation = useRef(0);
  const objectUrl = useRef('');
  const busy = useRef(false);
  const playback = useRef<HTMLAudioElement>(null);
  const model = word ? wordAsset(word) : undefined;
  const releaseStream = () => { stream.current?.getTracks().forEach(t => t.stop()); stream.current = null; };
  const clearUrl = () => { if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); objectUrl.current = ''; setUrl(''); };
  useEffect(() => () => {
    generation.current++; busy.current = false;
    const r = recorder.current;
    if (r) { r.onstop = null; r.ondataavailable = null; r.onerror = null; if (r.state !== 'inactive') r.stop(); }
    releaseStream();
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
  }, []);
  useEffect(() => {
    if (phase !== 'recording') return;
    const timer = window.setInterval(() => setSeconds(s => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [phase]);
  function stop() {
    const r = recorder.current;
    if (r?.state === 'recording' || r?.state === 'paused') { setPhase('stopping'); setMessage('Finishing your recording…'); r.stop(); }
  }
  useEffect(() => { if (seconds >= 120 && phase === 'recording') stop(); }, [seconds, phase]);
  async function start() {
    if (busy.current) return;
    busy.current = true;
    playback.current?.pause();
    const token = ++generation.current;
    setPhase('requesting'); setMessage('Waiting for microphone permission. Choose Allow in your browser, or cancel below.');
    try {
      if (window.isSecureContext === false) throw Object.assign(new Error(), { name: 'SecurityError' });
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
        busy.current = false; setPhase('error'); setMessage('Recording is unavailable in this browser. Use a current browser on HTTPS, or practise aloud.'); return;
      }
      const policy = (document as any).permissionsPolicy || (document as any).featurePolicy;
      if (policy?.allowsFeature && !policy.allowsFeature('microphone')) { setEmbeddedBlocked(true); throw Object.assign(new Error(), { name: 'SecurityError' }); }
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (token !== generation.current) { s.getTracks().forEach(t => t.stop()); return; }
      stream.current = s;
      const mime = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus'].find(t => MediaRecorder.isTypeSupported?.(t));
      const r = new MediaRecorder(s, mime ? { mimeType: mime } : undefined);
      recorder.current = r;
      const chunks: Blob[] = [];
      r.ondataavailable = e => { if (token === generation.current && e.data.size) chunks.push(e.data); };
      r.onerror = () => {
        if (token !== generation.current) return;
        generation.current++; busy.current = false; releaseStream();
        if (r.state !== 'inactive') r.stop();
        setPhase('error'); setMessage('The recorder failed. Your microphone has been released. Try recording again.');
      };
      r.onstop = () => {
        if (token !== generation.current) return;
        releaseStream(); busy.current = false;
        const blob = new Blob(chunks, { type: r.mimeType || chunks[0]?.type || 'audio/webm' });
        if (!blob.size) { setPhase('error'); setMessage('No audio was captured. Check your microphone and try again.'); return; }
        clearUrl(); objectUrl.current = URL.createObjectURL(blob); setUrl(objectUrl.current);
        setPhase('recorded'); setMessage('Recording ready. Replay, compare with the model, or record again. Nothing was uploaded.');
      };
      s.getAudioTracks().forEach(t => { t.onended = () => { if (token === generation.current) stop(); }; });
      r.start(); clearUrl(); setSeconds(0); setPhase('recording'); setMessage('Recording… speak now. Stop when you finish (maximum two minutes).');
    } catch (error) {
      if (token !== generation.current) return;
      busy.current = false; releaseStream(); setPhase('error'); setMessage(microphoneMessage(error));
    }
  }
  function cancel() { generation.current++; busy.current = false; setPhase(url ? 'recorded' : 'ready'); setMessage('Permission request cancelled. Any late microphone stream will be closed.'); }
  return <section className="panel voice-mirror" aria-label="Voice Mirror">
    <h3>Voice Mirror</h3><p>{prompt}</p>
    {model?.available ? <Media id={model.id} /> : <p>Read the prompt aloud, then listen to your own recording.</p>}
    <div className="voice-actions">
      <button disabled={['requesting','recording','stopping'].includes(phase)} onClick={start}>{url ? 'Record again' : 'Record my voice'}</button>
      <button disabled={phase !== 'recording'} onClick={stop}>Stop recording</button>
      {phase === 'requesting' && <button onClick={cancel}>Cancel permission request</button>}
    </div>
    {phase === 'recording' && <p className="recording-live">● Recording · {seconds}s / 120s</p>}
    {url && <div className="voice-playback"><audio ref={playback} aria-label="Your voice recording" controls src={url} />
      <button onClick={() => { if (playback.current) { playback.current.currentTime = 0; playback.current.play().catch(() => setMessage('Use the audio player’s Play button to listen.')); } }}>Replay recording</button>
      <button disabled={['requesting','recording','stopping'].includes(phase)} onClick={() => { playback.current?.pause(); clearUrl(); setPhase('ready'); setMessage('Recording deleted. Ready for another try.'); }}>Delete recording</button></div>}
    <p role="status" aria-live="polite" data-phase={phase}>{message}</p>
    {embeddedBlocked && <p><a href={window.location.origin + '/?practice=voice'} target="_blank" rel="noopener noreferrer">Open Voice Mirror in a separate tab / افتح التدريب الصوتي في تبويب مستقل</a></p>}
    <p>No automatic pronunciation score. Listen for clear meaning, sounds and rhythm; choose one improvement for your next try.</p>
  </section>;
}
