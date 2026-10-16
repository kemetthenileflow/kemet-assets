import React, { useState, useEffect } from 'react';
import core from './data/core.json';
import blueprint from './data/blueprint.json';
import catalog from './data/catalog.json';
import {
  queue,
  advance,
  profile,
  record,
  hash,
  shuffle,
  read,
  write,
  attempts,
  recallConfirmed,
  storageStatus,
  QueueConfig,
} from './engine';
import { Media, Pdf, VoiceMirror } from './ui';
import { wordAsset, byPath, unit1CardAsset, unit1AlternativeAssets } from './assets';

const version = 'source-2026-10-15';

export function BankPractice({
  bank,
  level = '',
  passage = '',
  support = 'independent',
  size = 5,
  close,
  timed = false,
}: {
  bank: string;
  level?: string;
  passage?: string;
  support?: string;
  size?: number;
  close: () => void;
  timed?: boolean;
}) {
  const pool = core.ALL_330_QUESTIONS.filter(
    (q) => q.bankId === bank && (!level || q.level === level) && (!passage || q.relatedPassageId === passage)
  );
  const uid = profile().uid;
  const config: QueueConfig = {
    mode: timed ? 'timed' : 'source-bank',
    bank,
    level,
    passage,
    dataset: 'source330',
    version,
  };
  const [qstate, setQueue] = useState(() => queue(uid, config, pool.map((q) => q.id)));
  const [session] = useState(() => crypto.randomUUID());
  const [round, setRound] = useState(0);
  const [response, setResponse] = useState('');
  const [result, setResult] = useState('');
  const [hint, setHint] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [transcript, setTranscript] = useState(false);
  const [replays, setReplays] = useState(0);
  const [quote, setQuote] = useState('');
  const [reason, setReason] = useState('');
  const [start, setStart] = useState(Date.now());
  const [seconds, setSeconds] = useState(60);

  const q = pool.find((q) => q.id === qstate.ids[qstate.cursor]);
  const count = Math.min(size, pool.length);
  const reading = q && core.READING_PASSAGES.find((p) => p.id === q.relatedPassageId);
  const audio = q && core.AUDIO_ITEMS.find((a) => a.id === q.relatedAudioId);
  const grammar = q && core.GRAMMAR_REFERENCES.find((g) => g.id === q.relatedGrammarId);

  useEffect(() => {
    if (!timed || result) return;
    const timer = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [timed, result, q?.id]);

  if (!q) {
    return (
      <section className="panel">
        <h2>No eligible source items</h2>
        <p>This filter has no supplied questions. Choose a different source level or passage.</p>
        <button onClick={close}>Back</button>
      </section>
    );
  }

  const options = shuffle(q.options || [], hash(q.id + qstate.seed + qstate.cycle));

  function submit() {
    if (!response.trim() || result) return;
    let outcome: 'correct' | 'incorrect' | 'pending' = 'pending';
    if (q!.grading === 'deterministic_choice') {
      outcome = response === q!.correctOptionId ? 'correct' : 'incorrect';
    }
    if (q!.grading === 'guided_exact_match') {
      outcome =
        response.normalize('NFKC').trim().toLowerCase() ===
        q!.sourceAnswer.normalize('NFKC').trim().toLowerCase()
          ? 'correct'
          : 'pending';
    }
    record({
      uid,
      session,
      contentId: q!.id,
      version,
      mode: config.mode,
      dataset: 'source330',
      support,
      response,
      result: outcome,
      hints: hint ? 1 : 0,
      reveal,
      transcript,
      replays,
      evidence: quote ? quote + '\nReason: ' + reason : undefined,
      review: outcome === 'pending' || !!quote ? 'pending' : 'none',
      durationMs: Date.now() - start,
    });
    setResult(outcome);
  }

  function next() {
    setQueue(advance(uid, config, pool.map((q) => q.id)));
    setRound(round + 1);
    setResponse('');
    setResult('');
    setHint(false);
    setReveal(false);
    setTranscript(false);
    setReplays(0);
    setQuote('');
    setReason('');
    setStart(Date.now());
    setSeconds(60);
  }

  if (round >= count) {
    return (
      <section className="panel">
        <h2>Round complete</h2>
        <p>
          {count} distinct source items practised. {pool.length} available in this filter.{' '}
          {count < size ? 'This pool is smaller than the requested round.' : ''}
        </p>
        <p>Instructor preview results; source approval remains pending.</p>
        <button onClick={() => setRound(0)}>Continue from saved queue</button>
        <button onClick={close}>Save and return</button>
      </section>
    );
  }

  return (
    <section className="panel">
      <span className="badge">Instructor preview — awaiting review</span>
      <h2>
        {bank} · {round + 1}/{count}
      </h2>
      <p>
        {q.id} · source label: {q.level} · support: {support} · cycle {qstate.cycle + 1}
      </p>
      {timed && (
        <p>
          Optional timer: {seconds}s · no penalty when it reaches zero{' '}
          <button onClick={() => setSeconds(60)}>Reset timer</button>
        </p>
      )}
      {reading && (
        <details open={support === 'supported'}>
          <summary>
            {reading.id} · {reading.title}
          </summary>
          <div data-testid="passage">
            {reading.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <label>
            Quote an exact evidence span
            <textarea value={quote} onChange={(e) => setQuote(e.target.value)} />
          </label>
          <button
            onClick={() => {
              const selected = window.getSelection()?.toString() || '';
              if (reading.paragraphs.join('\n').includes(selected)) setQuote(selected);
            }}
          >
            Use my selected text
          </button>
          {quote && !reading.paragraphs.join('\n').includes(quote) && (
            <p>That span is not in this passage. Copy an exact source span.</p>
          )}
          <label>
            Explain your reason
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} />
          </label>
        </details>
      )}
      {audio && (
        <>
          <Media
            id={audio.id}
            onSupport={(e) => {
              if (e === 'replay') setReplays(replays + 1);
            }}
          />
          <button onClick={() => setTranscript(!transcript)}>Transcript (support)</button>
          {transcript && <p>{audio.transcript} · alignment unverified</p>}
        </>
      )}
      <h3>{q.prompt}</h3>
      {q.grading === 'deterministic_choice' ? (
        <div className="choices">
          {options.map((o) => (
            <button
              className={response === o.id ? 'chosen' : ''}
              disabled={!!result}
              key={o.id}
              onClick={() => setResponse(o.id)}
            >
              {o.text}
            </button>
          ))}
        </div>
      ) : (
        <label>
          Your response
          <textarea value={response} disabled={!!result} onChange={(e) => setResponse(e.target.value)} />
        </label>
      )}
      <button onClick={() => setHint(true)}>Procedural hint</button>
      {hint && (
        <p>
          {grammar?.englishRules[0] ||
            'Read the whole context. Identify the relationship or evidence before answering.'}
        </p>
      )}
      <button
        disabled={!response.trim() || !!result || (!!quote && !reading?.paragraphs.join('\n').includes(quote))}
        onClick={submit}
      >
        Submit response
      </button>
      {result && (
        <div role="status">
          <h3>
            {result === 'pending'
              ? 'Pending teacher review'
              : result === 'correct'
              ? 'Correct for the supplied key'
              : 'Compare and try a new item'}
          </h3>
          <p>Source model — awaiting approval: {q.sourceAnswer}</p>
          <p>{q.explanation}</p>
          <p>{hint || transcript ? 'Support was used; this is not unassisted evidence.' : ''}</p>
          <button onClick={next}>Next source item</button>
        </div>
      )}
      <button onClick={close}>Save and exit</button>
    </section>
  );
}

export function WordActivity({
  dataset = 'unit1',
  group = 0,
  mode = 'learn',
  close,
}: {
  dataset?: string;
  group?: number;
  mode?: string;
  close: () => void;
}) {
  const base =
    dataset === 'unit1'
      ? core.UNIT_1_VOCABULARY
      : core.STORY_VOCABULARY_59.map((v) => ({
          ...v,
          englishMeaning: v.meaning,
          arabicMeaning: '',
          example: v.storyContext,
          ipa: '',
          partOfSpeech: '',
          synonym: '',
          antonymContrast: '',
          groupIndex: Math.floor((Number(v.id.slice(-3)) - 1) / 6),
        }));

  let words = base.filter((_, i) => Math.floor(i/6) === group);
  if (mode === 'review') {
    words = base.filter((w) =>
      attempts().some((a) => a.contentId === w.id && (a.result === 'incorrect' || a.hints > 0 || a.reveal))
    );
  }

  const uid = profile().uid;
  const c: QueueConfig = { mode, dataset, group, version };
  const [qs, setQs] = useState(() => queue(uid, c, words.map((w) => w.id)));
  const [session] = useState(() => crypto.randomUUID());
  const phaseKey = 'kemet_word_phase_' + uid + '_' + JSON.stringify(c);
  const [phase, setPhase] = useState(read(phaseKey, mode === 'learn' ? 'observe' : 'recall'));

  useEffect(() => write(phaseKey, phase), [phase, phaseKey]);

  // Current item and assets resolved cleanly before assist keys and state initializers
  const w = words.find((w) => w.id === qs.ids[qs.cursor]);
  const clip = w ? wordAsset(w.word) : undefined;
  const unit1Asset = w && dataset === 'unit1' ? unit1CardAsset(w.id) : undefined;
  const storyCard =
    w && dataset !== 'unit1'
      ? catalog.vocabularyAssets.find((v) => v.word.toLowerCase() === w.word.toLowerCase())?.learningCards[0]
      : undefined;
  const cardPath = unit1Asset?.path || storyCard?.path;
  const cardAvailable = unit1Asset?.available || (storyCard ? byPath(storyCard.path).available : false);

  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState('');
  const [hintLevel, setHintLevel] = useState(0);
  const [n, setN] = useState(0);

  const itemAssistKey = w ? `kemet_assist_${uid}_${session}_${w.id}` : '';
  const initialAssist = w ? read<{ everRevealed?: boolean; highestHint?: number; ttsReplays?: number }>(itemAssistKey, {}) : {};

  // Assisted flags preserved across phase switches within the same item session
  const [everRevealed, setEverRevealed] = useState(!!initialAssist.everRevealed);
  const [highestHint, setHighestHint] = useState(initialAssist.highestHint ?? 0);
  const [ttsReplays, setTtsReplays] = useState(initialAssist.ttsReplays ?? 0);

  function markPersistedAssist(type: 'reveal' | 'hint' | 'tts', val?: number) {
    if (!itemAssistKey) return;
    const cur = read<{ everRevealed?: boolean; highestHint?: number; ttsReplays?: number }>(itemAssistKey, {});
    const updated = {
      everRevealed: cur.everRevealed || type === 'reveal',
      highestHint: Math.max(cur.highestHint ?? 0, type === 'hint' ? (val ?? 1) : 0),
      ttsReplays: (cur.ttsReplays ?? 0) + (type === 'tts' ? 1 : 0),
    };
    write(itemAssistKey, updated);
  }

  // Independent visual reveal states
  const [showEng, setShowEng] = useState(false);
  const [showAr, setShowAr] = useState(false);
  const [showIpa, setShowIpa] = useState(false);
  const [showPos, setShowPos] = useState(false);
  const [showEx, setShowEx] = useState(false);
  const [showSyn, setShowSyn] = useState(false);
  const [showAnt, setShowAnt] = useState(false);
  const [showCard, setShowCard] = useState(false);

  if (!w) {
    return (
      <section className="panel">
        <h2>No review items yet</h2>
        <p>Practise words first; assisted and incorrect responses will appear here for spaced review.</p>
        <button onClick={close}>Return</button>
      </section>
    );
  }

  if (n >= words.length) {
    return (
      <section className="panel">
        <h2>Group cycle complete</h2>
        <p>{words.length} distinct words practised. Return later for another independent retrieval session.</p>
        <button onClick={close}>Save and return</button>
      </section>
    );
  }

  function resetVisibilities() {
    setShowEng(false);
    setShowAr(false);
    setShowIpa(false);
    setShowPos(false);
    setShowEx(false);
    setShowSyn(false);
    setShowAnt(false);
    setShowCard(false);
  }

  function toggleEng() {
    if (!showEng) {
      setEverRevealed(true);
      markPersistedAssist('reveal');
    }
    setShowEng(!showEng);
  }
  function toggleAr() {
    if (!showAr) {
      setEverRevealed(true);
      markPersistedAssist('reveal');
    }
    setShowAr(!showAr);
  }
  function toggleIpa() {
    if (!showIpa) {
      setEverRevealed(true);
      markPersistedAssist('reveal');
    }
    setShowIpa(!showIpa);
  }
  function togglePos() {
    if (!showPos) {
      setEverRevealed(true);
      markPersistedAssist('reveal');
    }
    setShowPos(!showPos);
  }
  function toggleEx() {
    if (!showEx) {
      setEverRevealed(true);
      markPersistedAssist('reveal');
    }
    setShowEx(!showEx);
  }
  function toggleSyn() {
    if (!showSyn) {
      setEverRevealed(true);
      markPersistedAssist('reveal');
    }
    setShowSyn(!showSyn);
  }
  function toggleAnt() {
    if (!showAnt) {
      setEverRevealed(true);
      markPersistedAssist('reveal');
    }
    setShowAnt(!showAnt);
  }
  function toggleCard() {
    if (!showCard) {
      setEverRevealed(true);
      markPersistedAssist('reveal');
    }
    setShowCard(!showCard);
  }

  function requestHint() {
    const nextH = Math.min(3, hintLevel + 1);
    setHintLevel(nextH);
    setHighestHint((h) => Math.max(h, nextH));
    markPersistedAssist('hint', nextH);
  }

  function playBrowserTts() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    setTtsReplays((r) => r + 1);
    markPersistedAssist('tts');
    const utterance = new SpeechSynthesisUtterance(w!.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  function submitSpelling() {
    if (feedback || !response.trim()) return;
    const correct = response.trim().toLowerCase() === w!.word.trim().toLowerCase();
    const curAssist = itemAssistKey ? read<{ everRevealed?: boolean; highestHint?: number; ttsReplays?: number }>(itemAssistKey, {}) : {};
    const finalRevealed = everRevealed || !!curAssist.everRevealed;
    const finalHint = Math.max(highestHint, curAssist.highestHint ?? 0);
    const finalTts = Math.max(ttsReplays, curAssist.ttsReplays ?? 0);
    const wasAssisted = finalRevealed || finalHint > 0 || finalTts > 0;

    record({
      uid,
      session,
      contentId: w!.id,
      version,
      mode: mode === 'learn' ? 'recall' : mode,
      dataset,
      support: wasAssisted ? 'supported' : 'independent',
      response,
      result: correct ? 'correct' : 'incorrect',
      hints: finalHint,
      reveal: finalRevealed,
      transcript: false,
      replays: finalTts,
      review: 'none',
      durationMs: 0,
    });
    setFeedback(
      correct
        ? wasAssisted
          ? 'Correct with study support. Try again in another session.'
          : 'Correct — independent retrieval recorded.'
        : 'Compare your spelling: ' + w!.word
    );
    if (!correct) {
      setEverRevealed(true);
      markPersistedAssist('reveal');
      setShowEng(true);
    }
  }

  function next() {
    setQs(advance(uid, c, words.map((w) => w.id)));
    setResponse('');
    setFeedback('');
    resetVisibilities();
    setHintLevel(0);
    setEverRevealed(false);
    setHighestHint(0);
    setTtsReplays(0);
    setN(n + 1);
    setPhase(mode === 'learn' ? 'observe' : 'recall');
  }

  const pairs = shuffle(words, hash(session));

  return (
    <section className="panel word-activity-panel">
      <h2>
        {mode === 'learn'
          ? 'Nile Memory — Multi-Facet Vocabulary Study'
          : mode === 'match'
          ? 'Rosetta Match — Meaning Pairs'
          : mode === 'dictation'
          ? 'Listen and Spell'
          : mode === 'review'
          ? 'My Spaced Review'
          : 'Lost Inscription — Spelling Challenge'}
      </h2>
      <p className="activity-meta">
        {dataset === 'unit1' ? 'Unit 1 — 66 words' : 'Separate Story — 59 words'} · Group {group + 1} · Item{' '}
        {n + 1}/{words.length}
      </p>

      {phase === 'observe' ? (
        <div className="observe-container">
          <h3>{w.word}</h3>
          <p className="context-sentence">
            <strong>Source context:</strong> "{w.example}"
          </p>

          <p className="predict-prompt">
            <em>💡 Predict or guess the meaning in context before using the independent reveal buttons below.</em>
          </p>

          {/* Graduated Non-Answer Hint */}
          <div className="graduated-hint-box">
            <button
              onClick={requestHint}
              className="btn-small"
            >
              Graduated Clue ({hintLevel}/3)
            </button>
            {hintLevel >= 1 && (
              <p className="hint-text">
                Clue 1: Part of Speech: {w.partOfSpeech || 'n/a'} · Length: {w.word.length} letters
              </p>
            )}
            {hintLevel >= 2 && (
              <p className="hint-text">
                Clue 2: Starts with "{w.word[0].toUpperCase()}" and ends with "{w.word.slice(-1)}"
              </p>
            )}
            {hintLevel >= 3 && (
              <p className="hint-text">
                Clue 3: Context usage: {w.synonym ? `Related concept: ${w.synonym}` : 'Check the example sentence.'}
              </p>
            )}
          </div>

          {/* Independent Reveal Buttons */}
          <div className="reveal-buttons-grid">
            <button
              className={showEng ? 'chosen' : ''}
              onClick={toggleEng}
            >
              {showEng ? 'Hide English Meaning' : 'Reveal English Meaning'}
            </button>
            <button
              className={showAr ? 'chosen' : ''}
              onClick={toggleAr}
            >
              {showAr ? 'Hide Arabic Meaning' : 'Reveal Arabic Meaning (عربي)'}
            </button>
            <button
              className={showIpa ? 'chosen' : ''}
              onClick={toggleIpa}
            >
              {showIpa ? 'Hide IPA' : 'Reveal IPA Pronunciation'}
            </button>
            <button
              className={showPos ? 'chosen' : ''}
              onClick={togglePos}
            >
              {showPos ? 'Hide Part of Speech' : 'Reveal Part of Speech'}
            </button>
            <button
              className={showEx ? 'chosen' : ''}
              onClick={toggleEx}
            >
              {showEx ? 'Hide Example' : 'Reveal Full Example'}
            </button>
            {w.synonym && (
              <button
                className={showSyn ? 'chosen' : ''}
                onClick={toggleSyn}
              >
                {showSyn ? 'Hide Synonym' : 'Reveal Vetted Synonym'}
              </button>
            )}
            {w.antonymContrast && (
              <button
                className={showAnt ? 'chosen' : ''}
                onClick={toggleAnt}
              >
                {showAnt ? 'Hide Contrast' : 'Reveal Contrast / Antonym'}
              </button>
            )}
            {cardPath && cardAvailable && (
              <button
                className={showCard ? 'chosen' : ''}
                onClick={toggleCard}
              >
                {showCard ? 'Hide Learning Card' : 'Reveal Approved Learning Card'}
              </button>
            )}
          </div>

          {/* Revealed Information Panels */}
          <div className="revealed-info">
            {showEng && (
              <p className="facet-item">
                <strong>English:</strong> {w.englishMeaning}
              </p>
            )}
            {showAr && (
              <p className="facet-item" dir="rtl">
                <strong>المعنى بالعربية:</strong> {w.arabicMeaning}
              </p>
            )}
            {showIpa && w.ipa && (
              <p className="facet-item">
                <strong>IPA:</strong> {w.ipa}
              </p>
            )}
            {showPos && w.partOfSpeech && (
              <p className="facet-item">
                <strong>Part of speech:</strong> {w.partOfSpeech}
              </p>
            )}
            {showEx && (
              <p className="facet-item">
                <strong>Example:</strong> {w.example}
              </p>
            )}
            {showSyn && w.synonym && (
              <p className="facet-item">
                <strong>Vetted Synonym:</strong> {w.synonym}
              </p>
            )}
            {showAnt && w.antonymContrast && (
              <p className="facet-item">
                <strong>Contrast / Antonym:</strong> {w.antonymContrast}
              </p>
            )}
            {showCard && cardPath && cardAvailable && (
              <div className="learning-card-display">
                <img
                  loading="lazy"
                  src={cardPath}
                  alt="Original answer-bearing learning card — study only"
                  className="vocab-card-img"
                />
                <span className="card-disclaimer">
                  Study edition · Image contains written answers; hidden in test modes.
                </span>
              </div>
            )}
          </div>

          {/* Audio Pronunciation with Device Voice Fallback */}
          <div className="pronunciation-box">
            {clip?.available ? (
              <div className="studio-audio">
                <span className="badge">Studio Recording</span>
                <Media id={clip.id} />
              </div>
            ) : (
              <div className="device-tts-fallback">
                <button onClick={playBrowserTts} className="btn-small tts-btn">
                  🔊 Speak word (Device Voice)
                </button>
                <span className="tts-notice">
                  Device pronunciation (en-US fallback) · not original studio recording
                </span>
              </div>
            )}
          </div>

          <VoiceMirror word={w.word} prompt={w.example} />

          <button
            className="primary-action-btn"
            onClick={() => {
              setPhase('recall');
              resetVisibilities();
            }}
          >
            Hide and recall
          </button>
        </div>
      ) : (
        <div className="recall-container">
          {/* NOTICE: In recall mode, answer-bearing images are completely hidden from DOM! */}
          {mode === 'dictation' ? (
            clip?.available ? (
              <Media id={clip.id} />
            ) : (
              <div className="dictation-prompt">
                <button onClick={playBrowserTts} className="btn-small">
                  🔊 Listen to prompt (Device voice)
                </button>
                <p>Listen and write down the word you hear.</p>
              </div>
            )
          ) : (
            <p className="prompt-definition">
              <strong>Definition:</strong> {w.englishMeaning}
            </p>
          )}

          {mode === 'match' ? (
            <div className="choices">
              {pairs.map((v) => (
                <button
                  key={v.id}
                  disabled={!!feedback}
                  onClick={() => {
                    setResponse(v.word);
                    const correct = v.id === w.id;
                    record({
                      uid,
                      session,
                      contentId: w.id,
                      version,
                      mode: 'match',
                      dataset,
                      support: 'independent',
                      response: v.id,
                      result: correct ? 'correct' : 'incorrect',
                      hints: 0,
                      reveal: false,
                      transcript: false,
                      replays: 0,
                      review: 'none',
                      durationMs: 0,
                    });
                    setFeedback(correct ? 'Correct pair.' : 'Compare the meanings again.');
                  }}
                >
                  {v.word}
                </button>
              ))}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSpelling();
              }}
            >
              <label>
                Your spelling
                <input
                  autoComplete="off"
                  value={response}
                  disabled={!!feedback}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type word spelling..."
                />
              </label>
              <button disabled={!response.trim() || !!feedback}>Check spelling</button>
            </form>
          )}

          <div className="recall-hints">
            <button
              onClick={() => setHintLevel(1)}
              className="btn-small"
              disabled={hintLevel > 0}
            >
              First-letter hint
            </button>
            {hintLevel > 0 && (
              <p className="hint-badge">
                Hint: Starts with "{w.word[0]}" · {w.word.length} characters
              </p>
            )}
            <button
              onClick={() => {
                setShowEng(true);
              }}
              className="btn-small"
            >
              Reveal target (assisted)
            </button>
            {showEng && <p className="revealed-target">{w.word}</p>}
          </div>

          <p role="status" className="feedback-message">
            {feedback}
          </p>
          <p className="mastery-status">
            {recallConfirmed(uid, w.id)
              ? '✓ Recall confirmed across separate sessions'
              : 'Independent recall still being practised'}
          </p>

          <button
            disabled={!feedback && !showEng && !(mode === 'dictation' && !clip?.available)}
            onClick={next}
          >
            Next word
          </button>
        </div>
      )}

      <button onClick={close} className="btn-exit">
        Save and exit
      </button>
    </section>
  );
}

export function SourceSequence({ id, close }: { id: string; close: () => void }) {
  const grammar = blueprint.grammarLessons.find((g) => g.id === id);
  const story = blueprint.storyModules.modules.find((m) => m.id === id);
  const sequence = (grammar || story) as any;
  const pages = sequence?.pages || [];
  const key = 'kemet_source_step_' + profile().uid + '_' + id;
  const [index, setIndex] = useState(read(key, 0));
  const [response, setResponse] = useState('');
  const [reveal, setReveal] = useState(false);
  const p = pages[index];
  const protects = ['hint', 'answer'].includes(p?.role);

  useEffect(() => {
    write(key, index);
    setResponse(read(key + '_' + index, ''));
    setReveal(false);
  }, [index, key]);

  if (!p) {
    return (
      <section className="panel">
        <p>Source sequence unavailable.</p>
        <Pdf id={id} />
        <button onClick={close}>Return</button>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>{id.replaceAll('_', ' ')}</h2>
      <p>
        Source step {index + 1}/{pages.length} · {p.role || 'source page'} · pending source comparison
      </p>
      {protects && !reveal ? (
        <p>This source page reveals support or an answer. Record your response first.</p>
      ) : (
        <>
          {p.imagePath && byPath(p.imagePath).available && (
            <img loading="lazy" src={p.imagePath} alt={'Original source page ' + p.page} />
          )}
          <details>
            <summary>Text alternative — OCR requires source review</summary>
            <p>{p.hasMeaningfulText ? p.text : p.ocrText || p.text || 'Image-only source; text comparison pending.'}</p>
          </details>
        </>
      )}
      <label>
        Your observation or response
        <textarea value={response} onChange={(e) => setResponse(e.target.value)} />
      </label>
      <button
        disabled={!response.trim()}
        onClick={() => {
          write(key + '_' + index, response);
          setReveal(true);
        }}
      >
        Save response / reveal support
      </button>
      <button disabled={index === 0} onClick={() => setIndex(index - 1)}>
        Previous
      </button>
      <button
        disabled={index === pages.length - 1 || (p.role === 'question' && !reveal)}
        onClick={() => setIndex(index + 1)}
      >
        Next source step
      </button>
      <Pdf id={id} page={p.page} />
      <button onClick={close}>Save and return</button>
    </section>
  );
}

export function Writer({ close }: { close: () => void }) {
  const key = 'kemet_draft_' + profile().uid;
  const [draft, setDraft] = useState(read(key, ''));
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => write(key, draft), [draft, key]);

  function submit() {
    const uid = profile().uid;
    record({
      uid,
      session: crypto.randomUUID(),
      contentId: 'DERIVED-WRITING-01',
      version,
      mode: 'writing',
      dataset: 'derived',
      support: show ? 'model-viewed' : 'independent',
      response: draft,
      result: 'pending',
      hints: 0,
      reveal: show,
      transcript: false,
      replays: 0,
      review: 'pending',
      durationMs: 0,
    });
    const revisions = read<any[]>(key + '_revisions', []);
    revisions.push({ draft, date: new Date().toISOString() });
    write(key + '_revisions', revisions);
    setMessage('Submitted locally — pending teacher review, not sent.');
  }

  return (
    <section className="panel writer-panel">
      <h2>Writer’s Papyrus / Socratic Council</h2>
      <h3>{core.SHARED_TASKS.writingPrompt}</h3>
      <p>Target: {core.SHARED_TASKS.writingTargetWords}</p>
      <ul>
        {core.SHARED_TASKS.writingRequirements.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <label>
        Your draft
        <textarea rows={8} value={draft} onChange={(e) => setDraft(e.target.value)} />
      </label>
      <p>
        {draft.trim() ? draft.trim().split(/\s+/).length : 0} words · autosaved · {storageStatus()}
      </p>
      <p>
        Review rubric: language accuracy, clarity, organization, evidence and reasoning. Open responses require human
        review.
      </p>
      <button disabled={!draft.trim()} onClick={submit}>
        Submit for review
      </button>
      <button onClick={() => setShow(!show)}>Show source model (support)</button>
      {show && <p>{core.SHARED_TASKS.modelParagraph}</p>}
      <p role="status">{message}</p>
      <details>
        <summary>Revision history</summary>
        {read<any[]>(key + '_revisions', []).map((r, i) => (
          <article key={i}>
            <time>{r.date}</time>
            <p>{r.draft}</p>
          </article>
        ))}
      </details>
      <VoiceMirror prompt={draft || 'Explain one reason from your response.'} />
      <button onClick={close}>Save and return</button>
    </section>
  );
}

export function Osiris({ close }: { close: () => void }) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const q = blueprint.osirisChallenges[index];

  return (
    <section className="panel osiris-panel">
      <h2>Osiris · {index + 1}/8</h2>
      <p>{q.id} · separate derived challenge · awaiting approval</p>
      <h3>{q.prompt}</h3>
      {q.options.map((o) => (
        <button
          key={o.id}
          disabled={!!choice}
          onClick={() => {
            setChoice(o.id);
            record({
              uid: profile().uid,
              session: crypto.randomUUID(),
              contentId: q.id,
              version,
              mode: 'osiris',
              dataset: 'osiris8',
              support: 'independent',
              response: o.id,
              result: o.id === q.correctOptionId ? 'correct' : 'incorrect',
              hints: 0,
              reveal: false,
              transcript: false,
              replays: 0,
              review: 'none',
              durationMs: 0,
            });
          }}
        >
          {o.text}
        </button>
      ))}
      {choice && (
        <>
          <p>{choice === q.correctOptionId ? 'Correct' : 'Compare with the source evidence'}</p>
          <p>{q.explanation}</p>
          <Pdf id="osiris" page={q.answerPage} />
          <button
            disabled={index === 7}
            onClick={() => {
              setIndex(index + 1);
              setChoice('');
            }}
          >
            Next challenge
          </button>
        </>
      )}
      <button onClick={close}>Return</button>
    </section>
  );
}

// -------------------------------------------------------------
// NEW PLAYABLE EDUCATIONAL GAMES
// -------------------------------------------------------------

export function RosettaDecoder({ close }: { close: () => void }) {
  const [round, setRound] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Select an English word and its matching meaning.');

  const vocabSlice = core.UNIT_1_VOCABULARY.slice(round * 4, round * 4 + 4);
  const words = vocabSlice.map((v) => ({ id: v.id, text: v.word }));
  const [meanings] = useState(() =>
    shuffle(
      vocabSlice.map((v) => ({ id: v.id, text: v.englishMeaning + ' (' + v.arabicMeaning + ')' })),
      100 + round
    )
  );

  function checkMatch(wordId: string, meaningId: string) {
    if (wordId === meaningId) {
      setMatches([...matches, wordId]);
      setScore((s) => s + 1);
      setMessage('Correct pair decoded!');
      record({
        uid: profile().uid,
        session: crypto.randomUUID(),
        contentId: wordId,
        version,
        mode: 'rosetta_decoder',
        dataset: 'unit1',
        support: 'independent',
        response: wordId,
        result: 'correct',
        hints: 0,
        reveal: false,
        transcript: false,
        replays: 0,
        review: 'none',
        durationMs: 0,
      });
    } else {
      setMessage('Not a match. Try again.');
    }
    setSelectedWord(null);
    setSelectedMeaning(null);
  }

  return (
    <section className="panel rosetta-decoder-panel">
      <h2>Rosetta Decoder · فك شفرة رشيد</h2>
      <p>Match target terms to authentic meanings with non-leaking clues.</p>
      <p className="score-badge">
        Score: {score} | Pairs decoded: {matches.length}/4
      </p>

      <div className="rosetta-grid">
        <div className="words-col">
          <h3>Target Terms</h3>
          {words.map((w) => (
            <button
              key={w.id}
              disabled={matches.includes(w.id)}
              className={selectedWord === w.id ? 'chosen' : matches.includes(w.id) ? 'matched' : ''}
              onClick={() => {
                setSelectedWord(w.id);
                if (selectedMeaning) checkMatch(w.id, selectedMeaning);
              }}
            >
              {w.text} {matches.includes(w.id) ? '✓' : ''}
            </button>
          ))}
        </div>
        <div className="meanings-col">
          <h3>Meanings</h3>
          {meanings.map((m) => (
            <button
              key={m.id}
              disabled={matches.includes(m.id)}
              className={selectedMeaning === m.id ? 'chosen' : matches.includes(m.id) ? 'matched' : ''}
              onClick={() => {
                setSelectedMeaning(m.id);
                if (selectedWord) checkMatch(selectedWord, m.id);
              }}
            >
              {m.text} {matches.includes(m.id) ? '✓' : ''}
            </button>
          ))}
        </div>
      </div>

      <p role="status" className="status-msg">
        {message}
      </p>

      {matches.length === 4 && (
        <div className="round-won">
          <h4>Round Complete!</h4>
          <button
            onClick={() => {
              setRound((r) => (r + 1) % 15);
              setMatches([]);
              setMessage('Select an English word and its matching meaning.');
            }}
          >
            Next Decoder Set
          </button>
        </div>
      )}

      <button onClick={close} className="btn-exit">
        Back
      </button>
    </section>
  );
}

export function GrammarPyramidGame({ mode = 'builder', close }: { mode?: 'builder' | 'detective'; close: () => void }) {
  const sentences = [
    {
      id: 'GP-01',
      topic: 'Relative Clauses',
      tokens: ['The student', 'who won the prize', 'studied ancient Egyptian history', 'every evening.'],
      full: 'The student who won the prize studied ancient Egyptian history every evening.',
      error: 'The student which won the prize studied ancient Egyptian history.',
      errorTarget: 'which',
      correction: 'who',
      explanation: "'Who' refers to people ('student'); 'which' is used for things.",
    },
    {
      id: 'GP-02',
      topic: 'Conditionals',
      tokens: ['If you visit the Grand Egyptian Museum,', 'you will discover', 'thousands of authentic treasures.'],
      full: 'If you visit the Grand Egyptian Museum, you will discover thousands of authentic treasures.',
      error: 'If you will visit the Grand Egyptian Museum, you will discover treasures.',
      errorTarget: 'will visit',
      correction: 'visit',
      explanation: 'In the first conditional, the if-clause uses present simple, not future will.',
    },
    {
      id: 'GP-03',
      topic: 'Participles',
      tokens: ['Having concluded the lecture,', 'the professor', 'answered questions', 'from the students.'],
      full: 'Having concluded the lecture, the professor answered questions from the students.',
      error: 'Having concluded the lecture, the questions were answered by the professor.',
      errorTarget: 'the questions were answered',
      correction: 'the professor answered questions',
      explanation: 'Avoid dangling participles: the subject following the participle must be the one performing the action.',
    },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const s = sentences[currentIdx];

  // Builder state
  const [shuffledTokens, setShuffledTokens] = useState(() => shuffle(s.tokens, 42));
  const [chosenTokens, setChosenTokens] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');

  // Detective state
  const [selectedError, setSelectedError] = useState('');

  useEffect(() => {
    setShuffledTokens(shuffle(sentences[currentIdx].tokens, 42 + currentIdx));
    setChosenTokens([]);
    setFeedback('');
    setSelectedError('');
  }, [currentIdx]);

  function handleTokenClick(tok: string) {
    if (chosenTokens.includes(tok)) return;
    const nextChosen = [...chosenTokens, tok];
    setChosenTokens(nextChosen);
    if (nextChosen.length === s.tokens.length) {
      const built = nextChosen.join(' ');
      if (built === s.full) {
        setFeedback('✓ Correct reconstruction! Grammatical hierarchy preserved.');
      } else {
        setFeedback('Sentence order does not match target. Click reset to try again.');
      }
    }
  }

  function handleDetectiveSubmit(choice: string) {
    setSelectedError(choice);
    if (choice === s.correction) {
      setFeedback('✓ Accurate detection! ' + s.explanation);
    } else {
      setFeedback('Incorrect repair. ' + s.explanation);
    }
  }

  return (
    <section className="panel grammar-pyramid-panel">
      <h2>{mode === 'builder' ? 'Grammar Pyramid · Sentence Builder' : 'Grammar Pyramid · Error Detective'}</h2>
      <p>Topic: {s.topic} · Step {currentIdx + 1}/{sentences.length}</p>

      {mode === 'builder' ? (
        <div className="builder-view">
          <p>Tap the scrambled clause tokens to reconstruct the sentence in correct syntactic order:</p>
          <div className="tokens-rack">
            {shuffledTokens.map((t) => (
              <button
                key={t}
                disabled={chosenTokens.includes(t)}
                onClick={() => handleTokenClick(t)}
                className="token-btn"
              >
                {t}
              </button>
            ))}
          </div>

          <div className="sentence-stage panel">
            <h4>Your Constructed Sentence:</h4>
            <p className="built-text">{chosenTokens.join(' ') || 'Select tokens from above...'}</p>
            <button onClick={() => setChosenTokens([])} className="btn-small">
              Reset Construction
            </button>
          </div>
        </div>
      ) : (
        <div className="detective-view">
          <p>Inspect the sentence below and identify the grammatical flaw:</p>
          <blockquote className="error-sentence">"{s.error}"</blockquote>
          <p>Choose the correct replacement for "{s.errorTarget}":</p>
          <div className="choices">
            {[s.correction, 'whom', 'where', 'had visited'].map((opt) => (
              <button
                key={opt}
                className={selectedError === opt ? 'chosen' : ''}
                onClick={() => handleDetectiveSubmit(opt)}
              >
                Replace with "{opt}"
              </button>
            ))}
          </div>
        </div>
      )}

      {feedback && <p role="status" className="feedback-banner">{feedback}</p>}

      <div className="pyramid-nav">
        <button
          disabled={currentIdx >= sentences.length - 1}
          onClick={() => setCurrentIdx((i) => i + 1)}
        >
          Next Grammar Challenge
        </button>
        <button onClick={close} className="btn-exit">
          Back
        </button>
      </div>
    </section>
  );
}

export function SeshatEvidenceHunt({ close }: { close: () => void }) {
  const p = core.READING_PASSAGES[0]; // Passage A1
  const [quote, setQuote] = useState('');
  const [feedback, setFeedback] = useState('');

  function checkEvidence() {
    const fullText = p.paragraphs.join(' ');
    if (!quote.trim()) {
      setFeedback('Highlight or type a text span first.');
      return;
    }
    if (fullText.includes(quote.trim())) {
      setFeedback('✓ Valid source evidence span found directly in the passage!');
      record({
        uid: profile().uid,
        session: crypto.randomUUID(),
        contentId: 'SESHAT-EVIDENCE-' + p.id,
        version,
        mode: 'evidence_hunt',
        dataset: 'source330',
        support: 'independent',
        response: quote,
        result: 'correct',
        hints: 0,
        reveal: false,
        transcript: false,
        replays: 0,
        review: 'none',
        durationMs: 0,
      });
    } else {
      setFeedback('Quoted span is not an exact match to the text. Ensure verbatim citation.');
    }
  }

  return (
    <section className="panel evidence-hunt-panel">
      <h2>Seshat Evidence Hunt · صيد الأدلة مع سشات</h2>
      <p>Read the authentic passage and provide direct textual proof for the proposition.</p>

      <article className="passage-card panel">
        <h3>{p.title}</h3>
        {p.paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </article>

      <div className="task-prompt panel">
        <h4>Challenge Prompt:</h4>
        <p>Find and quote the sentence showing how physical activity affects psychological well-being.</p>
        <label>
          Your Quoted Evidence:
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Paste or type exact words from the text..."
          />
        </label>
        <button onClick={checkEvidence}>Verify Evidence</button>
        {feedback && <p role="status">{feedback}</p>}
      </div>

      <button onClick={close} className="btn-exit">
        Back
      </button>
    </section>
  );
}

export function NileQuest({ close }: { close: () => void }) {
  const steps = [
    {
      title: "Malone's Ambition",
      text: "Edward Malone wants to impress Gladys by taking on a dangerous assignment. What motivates his journey?",
      options: [
        { id: 'A', text: 'A desire for genuine courage and adventure to prove himself' },
        { id: 'B', text: 'Financial reward from the newspaper editor' },
        { id: 'C', text: 'He wanted to stay safe in London' },
      ],
      correct: 'A',
      explanation: 'Gladys told Malone she valued a man who could face danger and achieve something brave.',
    },
    {
      title: "Challenger's Study",
      text: "Malone arrives at Professor Challenger's home in Enmore Park pretending to be a biology student. What happens?",
      options: [
        { id: 'A', text: 'The professor welcomes him with tea' },
        { id: 'B', text: 'The professor detects the deception and reacts aggressively' },
        { id: 'C', text: 'The police arrest both men' },
      ],
      correct: 'B',
      explanation: 'Challenger immediately suspected reporters and attacked anyone doubting his South American discoveries.',
    },
  ];

  const [stepIdx, setStepIdx] = useState(0);
  const [choice, setChoice] = useState('');
  const [res, setRes] = useState('');
  const s = steps[stepIdx];

  function handleChoose(id: string) {
    setChoice(id);
    if (id === s.correct) {
      setRes('✓ True to Chapter 1! ' + s.explanation);
    } else {
      setRes('Re-read Chapter 1 source text. ' + s.explanation);
    }
  }

  return (
    <section className="panel nile-quest-panel">
      <h2>Nile Quest · A Dream of Adventure Checkpoint</h2>
      <h3>{s.title}</h3>
      <p>{s.text}</p>
      <div className="choices">
        {s.options.map((o) => (
          <button
            key={o.id}
            disabled={!!choice}
            className={choice === o.id ? 'chosen' : ''}
            onClick={() => handleChoose(o.id)}
          >
            {o.text}
          </button>
        ))}
      </div>
      {res && <p role="status">{res}</p>}
      {choice && stepIdx < steps.length - 1 && (
        <button
          onClick={() => {
            setStepIdx(stepIdx + 1);
            setChoice('');
            setRes('');
          }}
        >
          Next Checkpoint
        </button>
      )}
      <button onClick={close} className="btn-exit">
        Back
      </button>
    </section>
  );
}
