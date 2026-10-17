# KEMET continuation — 17 October 2026

## Verified checkpoint
Previous reviewed source is saved in kemet-assets, review/kemet-audit-2026-10-16, commit adfac9d24399e4848212ef2c296f55a3eb7db2a4. Original app and main were not changed.

The isolated verification workspace 0cf8a4ba-db07-451f-b51d-931a52a0e261 opens the reviewed React application in Preview. Code import of 40 files was saved. This supersedes the earlier report saying no improved Preview was running. Runtime media import is incomplete: the first audio ZIP is stored as a raw file and AI Studio reported terminal and filesystem RPC timeouts when extraction was attempted. PDF/media functionality in that workspace must not be claimed complete. The full recoverable 892-file ZIP remains intact; CRC rechecked successfully on recovery.

## New correction
Rosetta Decoder kept meanings from the first round and limited rotation to 15 sets of four (60/66 words). It now regenerates meanings for each set, handles the partial final set and wraps over all 66 words. All three selectable levels are open: Foundation (4 bilingual pairs), Apply (6 English pairs), Challenge (8 English pairs). Changing levels resets selections, matches and score. Duplicate matches are guarded.

## Actual validation
Clean npm ci --ignore-scripts, TypeScript, Vite production build, existing 43 acceptance/review checks passed. New interaction tests completed all 66 pairs across every set at each of the three levels, including final partial sets and replay to set 1: 198 correct pair interactions. These are jsdom interaction tests, not visual browser tests or a personal microphone test. Build still warns about a large JavaScript chunk.

## Remaining work
Transfer and verify all runtime assets in AI Studio; re-export source and compare hashes; full browser route/button/media/PDF checks; personal-device microphone check; Ankh translation, complete localization, compact pyramid, approved logo-detail artwork and documentation expansion. No deployment, main merge, billing or secret changes.

## Additional local implementation
Added a separate tested Ankh help control, compact five-stage responsive pyramid and direct all-path access. Header aligns to the start and uses the canonical Secondary 2 descriptor. Intro has explicit mute control and attempts sound on replay after the gesture. Existing 43 review checks, help interaction checks, TypeScript and production build passed after these edits. Full bilingual translation and live audio verification are not claimed.

## Export audit
An exported verification-workspace ZIP contained 727 entries; CRC passed. All intended public files were present and matched the local originals except an unrelated temporary hidden PDF copy. The revised activities source matched exactly. Export proves editor contents, not durable server save: the large PDF batch returned to Unsaved changes twice. The original full-asset review copy c10ce5ee-badd-4774-bdd8-6155e1272588 subsequently loaded and received a 30-file source update; its runtime validation is in progress.

## Confirmed live checks and transport fix
The full original review copy opened successfully and saved the updated source. In its Preview, PDF.js rendered Standard page 108/108 (canvas accessible name and visible original page checked). Ankh help on First page displayed Arabic help while keeping the PDF on page 108; Close exited help. Ask Thoth remained present.

AI Studio explicitly rejected the 35,522,435-byte Ministry PDF: `33.9 MB exceeds the 30 MB limit`. A gzip transport is 27,181,046 bytes. Node's browser-compatible DecompressionStream test reconstructed every original PDF byte and passed SHA-256 `7168dc0ef9e324b2f429116f0010a2208fb8b393654a83df4c1b9ddeded5ffa9`; corrupt data was rejected. The reader and untouched-original download both reconstruct and verify the original, never OCR/retype it. The gzip asset/code import was submitted to the full-asset review copy; final live Ministry rendering still needs confirmation. Native Compression Streams reference: https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API .

Use the full-asset review copy c10ce5ee-badd-4774-bdd8-6155e1272588 for continuation. Workspace 0cf8a4ba-db07-451f-b51d-931a52a0e261 is diagnostic and has a rejected oversized-file batch; do not mistake that workspace for the final preview.

## Further verified corrections
- Added Restart Grammar and Replay Story Quest; interaction tests pass through all three detective repairs and wrong/correct story choices before replay.
- Seshat no longer treats any verbatim substring as a correct answer: source-span matching is distinct from relevance, result/review stay pending, and derived tasks are not counted as source330.
- Observed the actual AI Studio Preview iframe allow attribute: microphone delegation is absent. VoiceMirror already detects policy denial; added a standalone voice-practice link and a whitelisted `?practice=voice` entry. Automated policy test confirms no hardware request occurs when policy blocks it. Hardware remains untested.
- Inspected Ministry cover, contents page 10 and final page 172 directly. It is English, Egyptian Baccalaureate, Second Year, Part 1, not just Unit 1. Contents place Unit 1 at page 12, Unit 2 at 39 and Unit 3 at 74. UI labeling corrected to Part 1; viewer adds a page-12 shortcut. Original filename and PDF bytes remain unchanged.
- Owner's separately uploaded emblem was found and viewed: 1672x941 RGBA, SHA256 689ae143c30ebb2b7abe31919ae01ba4ddd41b55ba072111ccf5ead9a6b6ee45. It differs from the existing app logo (1774x887, SHA256 07baf31c5e7c1b166c6101a2677c84d88acc75e6ac08857790922b7a073ada9b). No logo replacement was applied pending the explicit approval rule in the handoff.

## Current Studio blocker
After restart, AI Studio's agent reported the gzip/source additions absent from runtime disk. A separate attempt to extract KEMET_MINISTRY_TRANSPORT.zip reported the ZIP absent too. Editor/history success is therefore insufficient evidence of live synchronization. The public GitHub repository was verified accessible without credentials; next approach is exact-commit runtime retrieval, preserving existing original assets and avoiding editor ZIP transport. Do not report Ministry PDF playback as verified yet.
