# KEMET review recovery

Use `kemetthenileflow/kemet-assets`, branch `review/kemet-audit-2026-10-16`. Application code is under `app/`. Original main and the original AI Studio app remain unchanged.

From `app/`, with Node and Python 3 available:

```bash
npm ci --ignore-scripts
python3 scripts/restore-ministry-transport.py --all-pdfs
python3 scripts/restore-runtime-assets.py --repair
npm run lint
node --import tsx tests/review.tsx
node --import tsx tests/games.tsx
node --import tsx tests/help.tsx
node --import tsx tests/activity-replay.tsx
node --import tsx tests/mic-policy.tsx
node --import tsx tests/navigation.tsx
node --import tsx tests/pdf-transport.ts
npm run build
npm run dev
```

The restoration helpers use only pinned public GitHub asset packets, validate SHA-256/CRC, restore original owner media and do not publish or require credentials. The Ministry Part 1 textbook is stored as gzip because AI Studio rejects individual files above 30 MB. The reader and download action reconstruct and hash-check the exact original PDF bytes. The raw 35.5MB original must remain outside a Studio snapshot. Other 17 original PDFs remain unchanged.

AI Studio editor ZIP imports proved unreliable: history/editor contents could disagree with runtime files. Exact-commit retrieval from the runtime terminal successfully restored source and PDFs. Verify actual Preview after restoration; a saved checkpoint or build alone is insufficient.

Use `public/review-report.md` and `review-evidence/` for before/after status and test limits. Microphone tests mock hardware; the owner must test her own device. The embedded Studio frame was observed without microphone delegation, so Voice Mirror offers standalone practice when policy blocks recording. No pronunciation score is fabricated.

No deployment, main merge, billing or secret changes are part of this review. Existing logo and approved imagery are preserved; full Arabic localization, historical logo-detail editorial approval and teacher authentication remain separate unfinished items.
