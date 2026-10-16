import catalog from './data/catalog.json';
import available from './data/available-assets.json';
import manifest from '../public/vocab/import_manifest.json';

export type AssetEntry = {
  id: string;
  path: string;
  name: string;
  kind: string;
  available: boolean;
};

export const assetRegistry = new Map<string, AssetEntry>();

function add(id: string, path: string, name: string, kind: string) {
  assetRegistry.set(id, {
    id,
    path,
    name,
    kind,
    available: !!(available as Record<string, { available?: boolean }>)[path]?.available,
  });
}

// 1. All 18 canonical / study PDFs (1,233 pages total)
catalog.documents
  .filter((d) => d.path.startsWith('/pdfs/'))
  .forEach((d) => add(d.id, d.path, d.originalFilename, 'pdf'));

// 2. Curated audio media items
catalog.media.forEach((m) => add(m.id, m.path, m.originalFilename, 'audio'));

// 3. Story vocabulary audio and 184 learning cards
catalog.vocabularyAssets.forEach((v) => {
  if (v.pronunciationPath) {
    add(v.vocabularyId, v.pronunciationPath, v.word, 'audio');
  }
  v.learningCards.forEach((c, i) => {
    add(`${v.vocabularyId}-card-${i}`, c.path, v.word, 'image');
  });
});

// 4. Unit 1 imported 73 owner vocabulary visuals (cover + 66 cards + 6 alternatives)
manifest.entries.forEach((e) => {
  const normalizedPath = e.path.replace(/^\/public/, '');
  if (e.id && e.role === 'study_with_answer') {
    add(`unit1-${e.id}`, normalizedPath, e.word || e.id, 'image');
  }
});
add('vocab-cover', '/vocab/cover.webp', 'Unit 1 Vocabulary Cover', 'image');

// 5. Brand logo and intro video
add('logo', '/brand/logo_authoritative.png', 'Original Kemet logo', 'image');
add('intro', '/video/intro.mp4', 'Brand introduction', 'video');

export function asset(id: string): AssetEntry | undefined {
  return assetRegistry.get(id);
}

export function byPath(path: string): { path: string; available: boolean } {
  return { path, available: !!(available as Record<string, { available?: boolean }>)[path]?.available };
}

export function wordAsset(word: string): AssetEntry | undefined {
  const clean = word.toLowerCase().trim();
  const v = catalog.vocabularyAssets.find((v) => v.word.toLowerCase().trim() === clean);
  return v ? asset(v.vocabularyId) : undefined;
}

export function unit1CardAsset(vocId: string): { id: string; word: string; path: string; available: boolean } | undefined {
  const entry = manifest.entries.find((e) => e.id === vocId && e.role === 'study_with_answer');
  if (!entry) return undefined;
  const normalizedPath = entry.path.replace(/^\/public/, '');
  return {
    id: entry.id || '',
    word: entry.word || '',
    path: normalizedPath,
    available: !!(available as Record<string, { available?: boolean }>)[normalizedPath]?.available,
  };
}

export function unit1AlternativeAssets(vocId: string): Array<{ path: string; available: boolean }> {
  return manifest.entries
    .filter((e) => e.id === vocId && e.role === 'alternative_study_with_answer')
    .map((e) => {
      const p = e.path.replace(/^\/public/, '');
      return { path: p, available: !!(available as Record<string, { available?: boolean }>)[p]?.available };
    });
}
