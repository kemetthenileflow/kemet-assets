# KEMET review code

This revision continues the actual AI Studio export. It is not a rebuild.

Complete runnable archive: npm ci, npm run dev. Build: npm run build. No API key required for local source-grounded Thoth.

Repository checkout: first run build-assets.py at repository root, then app/restore_work_assets.py for the existing approved owner packet. The complete runnable archive also preserves the exported temple wallpaper, which is not tracked in this source branch. Keep public/art/nile_sandstone.png from the existing AI Studio export; absence leaves the CSS sandstone color fallback. Run app/scripts/restore-review-assets.py for the missing Lexicon page preview. Then npm ci in app and npm run dev. Do not trigger publishing workflows.

Validation: npm test; node --import tsx tests/review.tsx; npm run lint; npm run build. Source PDF audit: python scripts/pdf-integrity.py (PyMuPDF needed); python scripts/check-assets.py (Pillow needed); node scripts/check-pdfjs.mjs.

Detailed report: public/review-report.md. Runtime PDF/Media assets stay original. No production changes. AI Studio review copy is currently blocked at Loading code; ZIP import rejected for token size. The runnable archive is complete. The remote review branch was created at the old base commit, but uploading modifications was rejected by automatic approval review and requires explicit owner permission. No modified code is live in AI Studio or GitHub.
