# KEMET Gold application — implementation checkpoint, 21 October 2026 Cairo

## Target and source of truth
Existing app: f8ef15b1-df58-46e1-aaa4-3ce0ff8cf33b.
Published target: https://kemet-master-ancient-egyptian-scribe-gold-design.ai.studio/
Google Share permissions visibly identified Kemet The Nile Flow / kemetthenileflow@gmail.com as Owner. The owner was previously uncertain about accounts; this is the observed application permission, not an assumption from GitHub identity.
Existing source ZIP was exported BEFORE changes. Backup commit: a8ddd93bccbeb68eb2d4d622eb62ac62ee818a3a.
ZIP: source-backups/gold-app-f8ef15b1-before-2026-10-21.zip, SHA256 a39f3e5015f40cd4c6a6bbdf153589c59bf4206b6bb721d61e1924ded492e081. 159031 bytes; 32 archive entries / 26 files. ZIP integrity passed. No public assets directory was present. .env.example has placeholders only.
Source integration: AI Studio GitHub settings showed Create new repository, not an existing synchronized source repository. No repository was created through AI Studio.
Working branch: work/gold-platform-2026-10-21. No main, original MASTER, historical review/recovery refs, deployment or billing changes.

## CRITICAL: AI Studio versus this candidate
A narrowly scoped BATCH 1 implementation request was sent in the actual Gold app after the backup was committed. Its running state and Calculate SHA256 hashes action were observed.
The browser then stopped responding. A source snapshot, documentation call and reset each timed out. The final outcome of that remote task is UNKNOWN. Do not claim this candidate is already in the live editor or Preview. Do not resend the full broad request or blindly overwrite remote changes.
This gold-app/ directory is a separate, compilable implementation candidate derived from the exact export. It preserves the existing visual foundation; it is not another AI Studio application. When browser access returns, compare the actual saved remote diff with this candidate and merge only the missing parts. Do not import the old repository app/ tree over the Gold design.

## Actual candidate file changes
Modified src/App.tsx: keeps original design components and layout classes, correct title/hieroglyphs, English default and RTL effect, three main destinations, progressive curriculum workspace, real guest-event persistence, cultural tools under Media Library, Thoth local search.
Modified src/components/Header.tsx: exactly Curriculum / Media Library / My Progress desktop/mobile navigation; home brand and Start Learning; localized utilities and 44px utility controls; preserved design classes.
Modified src/components/Footer.tsx: corresponding navigation and corrected ownership credits.
Added src/components/LearningWorkspace.tsx: separate Unit/Story environments, original vocabulary/reading/grammar/questions, gated meanings and Arabic reveals, browser TTS, spelling practice, answer feedback and source IDs, local results and grounded source search.
Added src/data/curriculum.json: unchanged authoritative core data fetched from GitHub and matched to recovered export. Git blob 39a1541f84b8505e776d9ae53d802bdf90a11024, pinned repository source a51b2a9f1f89f3ec5689a568a3a565e70ac74aca/app/src/data/core.json. 66 Unit entries, 59 Story entries, 330 questions, 11 banks, 7 reading records, 12 grammar references. No substitute educational text or questions generated.
Added src/utils/learningProgress.ts and tests/learning.test.mjs: validated event persistence and summaries. Opens do not award completion/mastery. Guided spelling is always assisted. Reattempted questions whose answers were previously revealed are assisted, including after reloading stored history. Teacher-review and unsupported guided-exact grading stay pending; no automatic marks awarded to these items.
Modified package.json: test script; updated esbuild to compatible 0.28 range because the original declared 0.25 conflicted with installed Vite 8.3.4 peer range. Added npm package-lock.json. Original bun.lock retained as historical export; npm lock is this candidate's validated install route. No API calls or backend service activated.

## Original design preserved byte-for-byte
- src/index.css SHA256 39f8f0bf595559421f2026362df05790c9fda6fa3e9e6e0b2850ec8c971f568c
- src/components/ui/KemetButton.tsx SHA256 09f58761f286ac0e04f20a479455231335b7d2d997a9dc023b7404dfc9876e68
- src/components/ui/EgyptianIcons.tsx SHA256 193c496edcd833ae38e323027b52e74e8946824f51d4d158a4135a2deda930bc
Existing cultural components, data and audio utility are unchanged. Original Header/App/Footer remain recoverable in the backup ZIP.

## Verification performed locally
- npm install initially exposed the original esbuild/Vite peer conflict; fixed with a compatible esbuild range.
- npm run lint (TypeScript noEmit): PASS.
- npm run build: PASS.
- node --test tests/learning.test.mjs: 9/9 PASS.
Tests cover empty real progress, opens not completion, assisted evidence, pending/manual review, corrupt/versioned storage, invalid records, unique resources, stable source ID counts, all 11 banks/30 items and valid MCQ keys.
- Original CSS/Button/Icons compared directly with before ZIP: identical bytes.
These are compilation/data/model tests. No post-change browser/mobile/keyboard/screen-reader, PDF or audio playback test was possible. RTL is implemented but visually unverified. Build warned about >500KB bundle and an existing __dirname usage in Vite config; neither failed the build.

## Remaining work and limitations
- No claim of actual Preview integration. Remote AI Studio task outcome must be inspected first.
- PDF, video, original audio, word images and symbol-card binaries have NOT been imported into this candidate. Their sections clearly state awaiting import; no fake playable controls or unrelated banner art. Original approved banner/logo gate remains unresolved; no replacement applied.
- Your Egyptian Symbol Today is reserved on home but original-card experience is incomplete. An existing Eye icon is a feature marker, not claimed as an original card.
- Text content is imported; quiz feedback runs client-side for practice. Secure server grading, isolated accounts, persistent authorized backend, administrator workflow and retention/mastery calculations are NOT implemented. Guest activity is device-local, with explicit notice and storage-failure handling. No learner data is sent anywhere.
- Pronunciation uses clearly labelled browser US-English TTS only. Microphone capture, STT, verified pronunciation assessment and phoneme feedback are NOT implemented.
- Ask Thoth searches supplied source text and navigates to the relevant vocabulary/grammar/reading category; document search and granular scrolling remain pending. No generated tutor response or paid AI service.
- Vocabulary images all contain printed answer labels per recovered manifest; use only after reveal. Clean pre-answer imagery must be separately verified; do not misrepresent existing labelled cards as independent guessing prompts.
- No question queues/spaced review scheduling yet. All banks/items are selectable in original order; evidence of long-term mastery is not fabricated.
- Core words/headings remain English intentionally in Arabic UI. Existing cultural child components require full bilingual regression.

## Exact next actions
1. Restore browser access, open ONLY the target f8ef15b1 project, inspect BATCH 1 completion/code/Preview; export that updated source and diff against original backup AND this candidate.
2. Merge/test missing navigation changes in the same draft, preserving three design-file hashes. Do not publish or sync main.
3. Import verified assets from existing recovery source; map originals by stable IDs and compare file hashes. Keep Unit/Story separated and media provenance/category flags. Verify banner pixels with owner-approved newer file before integrating; no deletion.
4. Finish real PDF multipage viewer, original audio/media, vocab study cards, original symbol catalog, contextual translation, learner feedback and appropriate storage/authentication.
5. Run actual desktop/mobile English/Arabic interactions, all media/PDF pages, keyboard/focus, contrast, reload persistence and source-grounded search. Save clean proof screenshots and next checkpoint.

Creative concept, educational content development, instructional design, visual identity and creative direction: Dr. Mai Abulfotouh.
Review and proofreading: Riham Salah Khafagy. Supplementary source material: Osama Azzam.
