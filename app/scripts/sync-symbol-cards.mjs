import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT_DIR = process.cwd();
const TARGET_DIR = path.join(ROOT_DIR, 'public', 'brand', 'symbol-cards');

// Mapping patterns for all 31 Egyptian Symbol Cards
const CARD_PATTERNS = [
  { num: 1, id: 'card-01', keywords: ['tutankhamun', 'golden mask', 'mask', 'tut'] },
  { num: 2, id: 'card-02', keywords: ['scribe', 'egyptian scribe', 'كاتب'] },
  { num: 3, id: 'card-03', keywords: ['pyramids', 'pyramid', 'أهرامات'] },
  { num: 4, id: 'card-04', keywords: ['cartouche', 'royal cartouche', 'خرطوش'] },
  { num: 5, id: 'card-05', keywords: ['ramesses ii_ monuments', 'ramesses ii', 'ramesses', 'رمسيس'] },
  { num: 6, id: 'card-06', keywords: ['abu simbel', 'ramesses ii — abu simbel', 'أبو سمبل'] },
  { num: 7, id: 'card-07', keywords: ['old cairo', 'sacred heritage', 'قاهرة'] },
  { num: 8, id: 'card-08', keywords: ['isis', 'إيزيس'] },
  { num: 9, id: 'card-09', keywords: ['sadat', 'anwar sadat', 'سادات'] },
  { num: 10, id: 'card-10', keywords: ['cleopatra', 'queen of languages', 'كليوباترا'] },
  { num: 11, id: 'card-11', keywords: ['justice', 'egyptian justice', 'maat', 'ماعت', 'عدالة'] },
  { num: 12, id: 'card-12', keywords: ['police', 'egyptian police', 'شرطة'] },
  { num: 13, id: 'card-13', keywords: ['radio', 'egyptian radio', 'إذاعة'] },
  { num: 14, id: 'card-14', keywords: ['hatshepsut', 'حتشبسوت'] },
  { num: 15, id: 'card-15', keywords: ['catherine', 'saint catherine', 'كاترين'] },
  { num: 16, id: 'card-16', keywords: ['next chapter', 'your next chapter', 'فصلك'] },
  { num: 17, id: 'card-17', keywords: ['bulaq', 'bulaq press', 'بولاق'] },
  { num: 18, id: 'card-18', keywords: ['hieroglyph', 'hieroglyphs', 'هيروغليفية'] },
  { num: 19, id: 'card-19', keywords: ['suez', 'suez canal', 'قناة السويس'] },
  { num: 20, id: 'card-20', keywords: ['yacoub', 'magdi yacoub', 'يعقوب'] },
  { num: 21, id: 'card-21', keywords: ['mahfouz', 'naguib mahfouz', 'محفوظ'] },
  { num: 22, id: 'card-22', keywords: ['zewail', 'ahmed zewail', 'زويل'] },
  { num: 23, id: 'card-23', keywords: ['narmer', 'نعرمر'] },
  { num: 24, id: 'card-24', keywords: ['djoser', 'زوسر'] },
  { num: 25, id: 'card-25', keywords: ['papyrus', 'بردي'] },
  { num: 26, id: 'card-26', keywords: ['rosetta', 'rosetta stone', 'رشيد'] },
  { num: 27, id: 'card-27', keywords: ['scarab', 'جعران'] },
  { num: 28, id: 'card-28', keywords: ['giza', 'giza pyramids', 'أهرامات الجيزة'] },
  { num: 29, id: 'card-29', keywords: ['ankh', 'key of life', 'عنخ'] },
  { num: 30, id: 'card-30', keywords: ['lotus', 'egyptian lotus', 'لوتس'] },
  { num: 31, id: 'card-31', keywords: ['horus', 'eye of horus', 'wedjat', 'حورس'] },
];

export function syncSymbolCards() {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  // Search candidate directories: root, public, public/brand
  const searchDirs = [ROOT_DIR, path.join(ROOT_DIR, 'public'), path.join(ROOT_DIR, 'public', 'brand')];
  const matched = [];
  const scannedFiles = [];

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    const entries = fs.readdirSync(dir);
    for (const file of entries) {
      if (file.toLowerCase().endsWith('.png')) {
        // Exclude logo and banner
        if (file.includes('logo') || file.includes('Kemet_ Nile Gold')) continue;
        scannedFiles.push({ dir, file, fullPath: path.join(dir, file) });
      }
    }
  }

  for (const item of scannedFiles) {
    const fname = item.file.toLowerCase();
    for (const pattern of CARD_PATTERNS) {
      const isMatch = pattern.keywords.some(k => fname.includes(k.toLowerCase())) ||
                      fname.includes(`card-${pattern.num.toString().padStart(2, '0')}`) ||
                      fname.includes(`card_${pattern.num.toString().padStart(2, '0')}`) ||
                      fname.includes(`card${pattern.num}`);

      if (isMatch) {
        const destFile = `${pattern.id}.png`;
        const destPath = path.join(TARGET_DIR, destFile);

        const srcData = fs.readFileSync(item.fullPath);
        const hash = crypto.createHash('sha256').update(srcData).digest('hex');

        fs.writeFileSync(destPath, srcData);
        matched.push({
          cardNum: pattern.num,
          source: item.fullPath,
          dest: destPath,
          size: srcData.length,
          sha256: hash,
        });
        break;
      }
    }
  }

  return { matched, totalScanned: scannedFiles.length };
}

// Run directly if CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const res = syncSymbolCards();
  console.log(`Synced ${res.matched.length} card images out of ${res.totalScanned} candidates found.`);
  for (const m of res.matched) {
    console.log(` -> Card #${m.cardNum}: ${m.source} => ${m.dest} (${m.size} bytes)`);
  }
}
