# UX audit item 11 — Homepage introductory video

Implemented in the existing MASTER c10ce5ee-badd-4774-bdd8-6155e1272588 on 2026-10-17.

## Finding and implementation
The previous intro initialized muted=true, displayed Play with sound even during playback, and did not clear its manual-play fallback. The intro now initializes unmuted and attempts video.play() with the original source. It never silently retries muted autoplay. A rejected attempt displays an explicit blocked message and Play with Sound. The gesture calls play() directly; the playing event controls the playback status. Mute/unmute reflects the media element, with pause, keyboard activation, Escape, visible focus and 44px minimum controls. Existing session/first-visit/off, reduced-motion and data-saver opt-outs remain honored.

Only Intro and its responsive CSS changed. No video, audio, banner or educational asset changed. The existing /video/intro.mp4 is H.264 960x720 with AAC audio, 6.291667 seconds, confirmed with ffprobe on the exported original.

## Actual Chrome Preview verification
- Fresh runtime tab: autoplay blocked; element muted=false, paused=true, time=0, readyState=4. UI explicitly reported blocking, not sound playing.
- Play with Sound: muted=false, paused=false, time=0.242204, readyState=4; status Playing · Sound on.
- Replay within MASTER: muted=false, paused=false, advancing playback.
- Mute: muted=true, paused=false, time=1.187178.
- Unmute and pause: muted=false, paused=true, time=3.165404; status Video paused.
- Keyboard Enter on Play with Sound successfully resumed playback.
- Chrome mobile-sized Preview: content 360x667; scrollWidth=360, scrollHeight=667. Controls wrapped and remained visible.
- Chrome tablet-sized Preview: content 753x1024; scrollWidth=753, scrollHeight=1024.

Playback flags and the original audio stream were verified; physical speaker audibility was not independently measured. Responsive emulation is not real-device browser certification.

## Remaining audit / implementation plan
1. Safari macOS and iOS Safari: test fresh-visit autoplay allowed/blocked policy, gesture recovery, mute/unmute, background/resume, portrait/landscape, and keyboard/VoiceOver.
2. Android Chrome: run the same playback and orientation checks on a real device.
3. Test an explicitly autoplay-permitted fresh session; the available fresh Chrome session blocked autoplay, and gesture/replay succeeded.
4. Continue the broader museum/papyrus, Egyptian icons, media cards and control audit separately. Existing n8n audit still distinguishes local functionality from unconfigured remote connections.

Safari, iOS and Android devices are not exposed by the current browser environment. Those checks remain pending; no compatibility claim is made for untested browsers.
