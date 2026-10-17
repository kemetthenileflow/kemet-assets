# MASTER UX/UI inventory and audit — 17 October 2026

App: c10ce5ee-badd-4774-bdd8-6155e1272588. Baseline: 92ebc499e3a7732d09e1f6371505a527d615a6c0. New branch: ux/master-structure-2026-10-17. Protected main and review/kemet-audit-2026-10-16 were read only.

## Evidence boundaries
Source inventory covers all route render branches, exported UI/activity components, navigation, asset registry and catalogs. `source-text-register.json` contains verbatim pre-change source lines, including English/Arabic conditional labels and interpolated expressions; it is a source register, not a rendered-state transcript. `content-inventory.json` contains individual original-document/media records and dynamic heritage text. The unchanged core.json, blueprint.json, symbolCards.ts and vocabulary manifests remain the authoritative individual question/card/lesson catalogs. `browser-before.json` records exact rendered text for the sampled screens below. No external service is certified by a button or source declaration.

Browser: authenticated Chrome MASTER Preview, initially tablet-sized. Screen opening is not evidence of scoring correctness, every media file's decoding, download delivery, microphone recording or persistence across devices. Earlier evidence records all31 original symbol image decodes and intro sound controls. Safari and physical devices are unavailable.

## Complete route and component inventory
| Route / component | Current entry and purpose | Exact principal EN / AR labels | Evidence / limitation |
|---|---|---|---|
| home | Banner/Home; study entry, gateways, pyramid, daily heritage, resource shortcuts | Your Unit 1 learning journey / ابدأ رحلتك مع الوحدة الأولى; Continue learning / واصل التعلم | Browser opened; overlapping primary paths and repeated library/symbol promotion |
| journey | Bottom navigation; currently bank selector duplicated with challenge | Learning Journey; Journey / رحلتي | Browser opened; name promises progression but opens bank form |
| challenge | Home gateway, pyramid; source bank/support/round/timed setup | Challenge Arena; Start selected bank; Optional timed recall | Source + shared Journey UI; no fresh scored submission |
| bank | Selected bank, reading/listening links; choice/exact-match/human-review tasks | No eligible source items; source-specific prompts | Source inspected; 330 questions / 11 banks; filtering may legitimately yield empty pool |
| vocabulary | Home/pyramid/Story; two word sets, five modes | Vocabulary Vault; Nile Memory — Multi-Facet Study & Reveal; Rosetta Match — Match Meanings; Lost Inscription — Spell from a Clue; Listen and Spell; My Spaced Review | Browser opened; 66 Unit1 +59 story words |
| word | Vocabulary mode; clues, independent reveals, card, recall, device pronunciation and Voice Mirror | Reveal English Meaning; Reveal Arabic Meaning (عربي); Hide and recall | Learn mode opened; other four modes source-inspected, not freshly exercised end-to-end |
| story | Home/pyramid/library; narrative study and derived tasks | Story Quest; Read Your Story with Seshat; Read and Think with Thoth; Review with Cleopatra; Character gallery | Browser opened; duplicate YouTube presentation differs from Media Library |
| sequence | Story or grammar; original PDF teaching steps + separate reflection | Source step; Reflect and practise | Story first step opened; PDF initially rendering; all lesson steps not visually reviewed |
| writing | Story/library/pyramid; draft, model, rubric, revisions | Writer’s Papyrus / Socratic Council; Submit for review; Save and return | Browser opened; local-only pending review, no teacher transmission; wording could imply actual submission |
| osiris | Story/pyramid; eight derived story tasks | Osiris · 1/8; Return | Browser opened; source approval pending; scoring not exercised |
| voice | Home/pyramid/word/writing | Voice Mirror; Record my voice; Stop recording; Replay recording; Delete recording | Browser opened without recording; MediaRecorder local temporary blob; no pronunciation model |
| rosetta_decoder | Journey/pyramid; vocabulary matching | Rosetta Decoder · فك شفرة رشيد; Decoder level | Browser opened; 4/6/8 pair difficulty and all66-word sets; no new score generated |
| grammar_pyramid | Journey/pyramid; builder or detective | Grammar Pyramid · Sentence Builder; Grammar Pyramid · Error Detective | Both modes opened; three authored examples, not complete curriculum coverage |
| evidence_hunt | Journey/pyramid; verbatim source evidence | Seshat Evidence Hunt · صيد الأدلة مع سشات | Browser opened; exact-span check is not automatic quality grading; pending human review |
| nile_quest | Story/pyramid; narrative checkpoints | Nile Quest · A Dream of Adventure Checkpoint | Browser opened; two authored checkpoints, not a full branching game |
| documents | Home/library/pyramid | Original curriculum & KEMET PDFs / ملفات المنهج وكيمت الأصلية; Read original PDF | Browser shows all18 PDF entries; file names are technically accurate but poor learner-facing titles |
| pdf_study / Pdf | Document/lesson buttons | Original PDF reader; Unit 1 starts at page 12 / بداية الوحدة الأولى; Next →; Fit width | Actual page1/172 rendered; page12 selection changed state; all1,233 pages not tested. Canvas lacks accessible text layer |
| library | Bottom navigation; six curriculum categories | Alexandrian Library; Vocabulary; Reading; Grammar; Listening; Writing; Story | Vocabulary category opened; others source-inspected; repeated PDF catalog drawer |
| media / MediaLibrary / Media | Home/library/story; five hubs, audio, video registrations | English with Music / راجع إنجليزيتك بالأغاني; Unit 1 Curriculum Listening / الاستماع المنهجي; Story Audio / صوتيات القصة; Enjoy Kemet / الهوية المصرية والتحفيز; Instructor Archive / أرشيف المعلم | Opened;14 curated media +125 vocabulary records; runtime audio decoding not certified; registration is local only |
| symbol_discover | Discovery bar/home; original31 cards, gallery and navigation | Discover Your Egyptian Symbol (31 Cards) / اكتشف رمزك المصري (٣١ بطاقة) | Prior31/31 decoding proof;31 catalog slots use30 distinct originals because Pyramids repeats;2 unmatched originals preserved |
| discover | Discovery bar; original logo interpretation, explore/guess/assemble, replay intro | Discover the KEMET Logo / اكتشف شعار كيمت; Replay introduction | Previous browser verification; editorial review pending |
| results / CumulativeProgressChart | Bottom navigation; local progress, filters, demo, SVG/JSON/CSV | Your Results & Learning Progress / نتائجي ومخطط التقدم التعليمي; Preview Demo Trail (60 Attempts) | Browser opened with0 attempts; hardcoded bank summary lists incorrect IDs despite correct selector; demo is explicit |
| audit | Instructor tools | Instructor Import Audit & Compliance Report; Import audit | Source inspected; public informational screen, not authenticated teacher console; Full Implementation Report button actually downloads short summary; ZIP target not freshly verified |
| Intro | First visit/session, logo replay | Play with Sound / تشغيل بالصوت; Mute / Turn Sound Off / كتم الصوت | Preserve92ebc499 behavior; prior actual Chrome playback/blocked recovery evidence; Safari pending |
| DailySymbol | Home | Your Egyptian Symbol Today / رمزك المصري اليوم; Discover the story / اكتشف الحكاية; My Trace / أثري | Cairo-date rotation of editorial heritage entries, independent of31 original-card catalog; local reflection; review pending |
| Thoth | Floating Ask Thoth | Ask Thoth; Search English / العربية; Search sources | Actual search decade returned VOC-001; source lookup only, no connected AI model |
| AnkhHelp | Floating translation/help | Ankh Translate / مفتاح الحياة; Exit help / إنهاء المساعدة | Source inspected; intercepts clicks while help active, explicit exit; fixed label translations, not full-page translation; device speech not tested |
| LearnerCartouche | Header | Learner; Saved on this device — not synced | Local identity/display only; not authenticated login |
| Banner / KemetIcon | Header and controls | KEMET: The Nile Flow — AI Language Assistant; icon-adjacent labels | Original banner retained; SVG icons decorative/semantic by associated labels, not raster-generated replacements |
| navigation / Back / footer | Every route | Home / الرئيسية; Journey / رحلتي; Library / المكتبة; Results / نتائجي; Back / رجوع | In-app state history; routes generally not URLs, refresh returns Home; learner work uses local storage |

## Content inventory and preservation
18 canonical PDFs totaling1,233 cataloged pages; catalog includes5 additional noncanonical document records. 14 curated media entries,125 vocabulary records,66 Unit1 words,59 story words,330 source questions,11 banks,7 reading passages,12 grammar references,2 curriculum audio items. Individual titles/paths and bilingual heritage records are retained in content-inventory.json. Original PNG mapping and checksums remain in the prior asset-integrity evidence. No source asset needs regeneration or re-upload.

## Findings ranked by learner impact
1. Home competes with itself: hero, Start here, three gateways, large pyramid, DailySymbol, another symbol promotion, six library chips and extra resources. Consolidate into orientation, study choices, resource access, optional inspiration.
2. Journey and Challenge share a screen. Give Journey the existing five-step pyramid; keep bank selection under Challenge.
3. Arabic mode is partial. Home/navigation/pyramid and some heritage labels translate; most activities remain English. This can support English learning but must not be described as complete bilingual coverage.
4. Results bank summary is hardcoded incorrectly. Derive IDs from source metadata.
5. Local features must remain truthful: Thoth is source search, Voice Mirror has no automatic score, writing is not sent, media registration is not shared, no login/cloud/n8n integration is configured.
6. PDF canvas text accessibility, modal focus containment, physical microphone paths, actual audio decodes, download targets and all browser/device combinations still need focused verification.
7. DailySymbol is a separate editorial dataset; do not silently replace it with31-card personality inference. User's latest prompt truncates during Phase2, so detailed daily-inspiration rules are not yet supplied.
8. Some source labels and editorial metadata dominate student screens. Preserve provenance while reducing redundant entry panels; do not remove educational material or falsely approve content.

## Proposed implementation within supplied scope
Preserve the exact banner, intro, all content and routes. Introduce a concise bilingual Home component with one resume action, three study gateways, compact six-skill resource navigation, original-material links and optional heritage disclosure. Place the existing pyramid on Journey, with direct Challenge access. Keep the original daily content inside a compact disclosure with31-card and logo links. Maintain the bottom navigation and all activities. Fix the chart bank summary and honest audit-download label. Scope responsive styling to the new home; honor reduced-motion. Test visible Home/Journey navigation, Arabic layout and phone/tablet widths. Further daily-inspiration behavior awaits the missing prompt text.


## Implemented result and regression evidence
- Home now uses a single orientation block, three study gateways, compact library skills and optional heritage section. Original DailySymbol content,31-card catalog and logo exploration are reachable; no new daily-personality logic was invented.
- Journey now presents the existing five-step learning pyramid. Challenge retains bank filters, support options and timed recall. The former Unit overview self-link now opens the existing Unit1 Standard study guide; actual page1/108 rendered in Chrome.
- Home Grammar opened the correct Grammar library category. Challenge and heritage disclosure opened; original Tutankhamun PNG decoded at1024x1536.
- Results bank IDs now derive from source metadata; actual DOM showed V1,V2,R1,R2,P1,C1,C2,S1,L1,D1,N1. The report download is honestly labelled review summary.
- Tablet Home EN/AR: width745, scrollWidth745. Phone Home EN/AR: width352, scrollWidth352. These are content widths inside Chrome device-sized frames, not real-device certifications.
- Fresh desktop runtime still displayed truthful blocked intro autoplay fallback. Intro/ui.tsx code remains byte-identical to92ebc499.
- Source diff includes only Home, App, homepage CSS, chart label and one PyramidNavigator destination plus evidence. All educational source data, activities, assets, card bytes, banner and intro media remain unchanged. Existing route targets were compared; none were lost.
- Actual live Preview recompilation/rendering verified. No claim of a new local npm/TypeScript test run: this checkout had no installed project dependencies. No quiz scores, student responses or microphone recordings were fabricated for testing.

## Remaining work, not certified complete
The requested inventory is recorded; exhaustive behavioral/educational approval is not complete. Test all quiz modes/feedback, PDFs/downloads, each audio/video decode, microphone lifecycle, keyboard/screen-reader modal behavior, all responsive route states and real Safari/iOS/Android. Restore proper PDF text accessibility in a separately verified change. The user message ends mid-sentence in Phase2; subsequent educational and daily-inspiration requirements must be supplied before implementing their specific rules. n8n workflow execution still requires an available authenticated service connection.
