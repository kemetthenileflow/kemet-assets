# KEMET — owner controls and continuation

These changes extend the existing React app. No original artwork was regenerated, no main branch was changed, and no app was published.

| Control | Current implementation / safe replacement |
|---|---|
| Wallpaper | Existing `public/art/nile_sandstone.png`; CSS can use a per-route image. Recommended owner file: 2560×1440 WebP/PNG, central clear area. |
| Logo | Existing `public/brand/logo_authoritative.png`, preserved. Transparent PNG preferred, at least 1200px wide; no generic replacement. Latest separately supplied emblem still needs exact visual comparison. |
| Temple borders | Existing CSS side walls; custom transparent PNG/SVG can replace decorative layers without changing buttons. |
| Pyramid | Five actual selectable stages, base first in keyboard order and apex first visually. Selected stage reveals its routes; all routes also accessible through All learning paths. Recommendations never lock a skill. Two columns collapse below 700px. |
| Button appearance | Gold sandstone step surfaces, turquoise selection, visible keyboard focus; semantic React buttons retain text and hit targets. Owner icon artwork can be added without baking labels into images. |
| Typography / identity | Original palette retained; header left aligned, canonical Secondary 2 descriptor. English curriculum text stays English. Existing language toggle remains partial: full localization is not certified. |
| Ankh help | Separate control; capture mode pauses ordinary button/link navigation and shows mapped label meaning in Arabic plus an English explanation and optional en-US browser speech. Escape/Close restores ordinary navigation. Unmapped controls explicitly say help unavailable. |
| Help privacy | Only fixed known label counts in `kemet_help_counts`, local device. No names, answers, recordings or external analytics. Counts are not classroom or cross-device statistics. |
| Intro | First-load muted playback respects browser restrictions; explicit Play with sound unmutes; replay attempts sound after the user gesture; Mute/Unmute and Skip remain available. Audible playback requires browser/device verification. |
| PDFs | Original binaries, PDF.js worker/cmaps/fonts. Canonical 18-document verification is in the earlier evidence files. Interactive activities remain separate. |
| Cards / media | Existing owner files and registry preserved. Import success must be verified in the running preview, not inferred from a catalog. |
| Instructor tools | Collapsed learner clutter; this is not authentication. Do not store private class data in these client-only tools. |

## Student route
Start here → original curriculum or KEMET documents → optional pyramid stage → activity → results. Direct route access is always available. Rosetta provides 4/6/8-pair levels and all 66 words; story vocabulary remains a separate 59-word dataset. Speaking recordings are device-local; open-ended source answers remain pending human review.

## Teacher checks
Run `node --import tsx tests/review.tsx`, `node --import tsx tests/games.tsx`, `node --import tsx tests/help.tsx`, `npm run lint`, and `npm run build`. Review tests use mocked microphone APIs and jsdom. They do not validate the owner's hardware or prove auditory/visual fidelity in AI Studio.

## Orientation storyboard
1. Enter KEMET, hear the optional introduction and find Skip/Mute.
2. Use Start here to distinguish Ministry original from KEMET editions.
3. Select a pyramid step; show that all routes stay open.
4. Demonstrate word meaning/reveal and independent recall, then a game level.
5. Open an original PDF and navigate to its actual last page.
6. Activate Ankh help, select a control, listen optionally and exit help; finish with Voice Mirror recording/replay/delete and local progress.

## Still unresolved
Complete bilingual UI, complete historical logo-detail coverage and approved symbol art, exhaustive browser button/route checks, final AI Studio asset persistence and PDF/media playback, personal-device microphone test, teacher authentication and external persistence. Do not present this checkpoint as a finished production release.
