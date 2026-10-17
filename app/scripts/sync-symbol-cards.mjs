import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const digest = data => crypto.createHash('sha256').update(data).digest('hex');
export async function syncSymbolCards() {
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'scripts/symbol-assets.json'), 'utf8'));
  let restored = 0;
  for (let start = 0; start < manifest.cards.length; start += 4) {
    await Promise.all(manifest.cards.slice(start, start + 4).map(async card => {
      const target = path.join(root, card.path);
      try { if (digest(await fs.readFile(target)) === card.sha256) return; } catch {}
      const url = `https://raw.githubusercontent.com/kemetthenileflow/kemet-assets/${manifest.commit}/app/${card.path}`;
      const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
      if (!response.ok) throw new Error(`Original ${card.cardNumber}: HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (digest(bytes) !== card.sha256) throw new Error(`Original ${card.cardNumber}: checksum mismatch`);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, bytes);
      restored++;
    }));
  }
  console.log(`KEMET: verified ${manifest.cards.length} original symbol PNGs; restored ${restored}.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await syncSymbolCards();
}
