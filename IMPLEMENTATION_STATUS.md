# KEMET recovery and new-project checkpoint — 16 October 2026

## Authority and baseline
Read the four named Library archives and the newer 01_KEMET_FINAL_PROMPT.txt (version 2, modified 15 October 2026 20:42 UTC), plus all three required UTF-8 JSON/TXT inputs in full. The newer NEW PROJECT direction supersedes the older repair brief. The new app in app/ was written as a fresh implementation; the old app code was not imported. original_app_snapshot.zip is unchanged history only. No live Google AI Studio project URL or ID was found; this checkpoint is source in GitHub, not a claimed live AI Studio edit.

The repository initially contained only README.md and .github/workflows/publish-assets.yml; no learning assets or app source. Existing workflow retained; no dispatch/publish invoked.

Baseline and final source: 66 Unit 1 words; 59 separate story words; 330 unique source questions; 11 banks of 30; 169 deterministic choice / 9 exact match / 152 teacher review; six curriculum passages plus one story synopsis; 12 grammar references; 8 additional Osiris tasks. No fabricated approvals or learner history. New storage uses separate kemet_new_* namespaces; any earlier application state remains untouched.

## Changed
- 508 verified small binary parts preserve four archives, including the owner reference archive. The large combined ZIP was checked against its nested component hashes instead of uploading duplicate copies.
- build-assets.py reassembles parts with SHA-256 and ZIP CRC checks, copies canonical student assets, applies source-page preview repairs and verifies all 18 unchanged PDFs. Owner archive and reference documents do not enter the student asset directory.
- 14 zero-byte WebP learning cards recovered from their exact original PDF pages. Originals and the old snapshot remain unmodified. See asset-repairs.json.
- New React/TypeScript app: distinct dashboards, shared seeded queue/cursor/cycle service, selected group/bank/level/passage routing, all bank IDs reachable, local UID-scoped history, immutable first responses, assisted retry separation, safe exports and explicit volatile-storage state.
- Word learning, matching, spelling, dictation and review; source grammar and story page sequences; source-bank objective/open renderers; actual passage evidence selection; eight Osiris tasks; autosaved writing and local revision history; optional microphone replay/delete; optional timed source rounds.
- Central asset registry; original logo; real media controls, one active source and per-learner positions; canonical study PDFs; intro skip/session preferences; distinct daily heritage and logo discovery; local English/Arabic keyword source search. Assembly is explicitly unavailable because clean separate parts were not supplied.
- Recovered source material remains instructor preview / awaiting review. No trusted teacher role, cloud sync, email scheduler or bot integration is fabricated.

## Executed verification
- npm run lint: passed (TypeScript).
- npm run build: passed. Production JavaScript approximately 964 KB before gzip / 200 KB gzip; a bundle-size advisory remains.
- node --import tsx tests/acceptance.tsx: 24 passed in jsdom. Includes complete source cardinalities, full-bank reachability, no repetition before pool exhaustion, cursor persistence, learner queue/attempt isolation, small pools, stable option IDs, immutable first answer, assisted retry, group 8, selected passage, writing save/submit, Cairo rotation, bilingual lexical lookup, no-match behavior, asset availability and storage-denial fallback. See app/acceptance-results.txt.
- All 18 PDF SHA-256 values match the authoritative catalog. Three separately saved main ZIPs match the corresponding nested entries of KEMET_Final_Update_Package.zip. See package-provenance.json.
- ffmpeg decoded all 74 supplied audio/video files without errors (14 MP3 + 59 WAV + 1 MP4). This is codec verification, not human listening approval or browser playback approval. See media-validation.json.
- build-assets.py exercised locally using the reconstructed packages. See verification output in the final checkpoint.

## Remaining / not claimed
- No live Google AI Studio project was created or changed, and no student URL was published. A real project link/import is required to apply this source in AI Studio. No credentials are needed in chat.
- Real-browser playback, mobile visual checks at 360/390/430px, keyboard/modal focus and microphone permission/codec behavior remain unverified: Chromium download failed in this environment. DOM tests are not browser visual validation.
- Human educational/source/OCR/historical review and listening approval remain pending. Full Arabic translation of every instruction/feedback screen and complete differentiated alternative explanations/transfer flows still need completion; only navigation, available Arabic source support and heritage/discovery bilingual content are present.
- Secure teacher correction/release workflow, class accounts, rules, shared review/feedback, cloud database, unattended email, Telegram/n8n and actual provider delivery are not configured. They remain off. Do not treat local preview as secure school assessment.
- Review scheduling uses explicit incorrect/assisted practice history; automatic spaced intervals and teacher-adjustable adaptation still need implementation. Do not call the entire governing contract complete.
- No publishing, billing activation, mail or Telegram send, or WeWeb mutation was performed.

## Resume
Use the newest control/01_KEMET_FINAL_PROMPT.txt and this status file. Preserve the current code and tested IDs; complete remaining local flows and browser verification before a classroom release. To prepare locally: python3 build-assets.py; cd app; npm ci; npm run lint; node --import tsx tests/acceptance.tsx; npm run build. These commands prepare/build only; they do not deploy.
