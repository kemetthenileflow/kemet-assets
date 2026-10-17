import { mkdir, cp } from 'node:fs/promises';
await mkdir('public/vendor/pdfjs', { recursive: true });
for (const [src,dest] of [['build/pdf.worker.min.mjs','pdf.worker.min.mjs'], ['cmaps','cmaps'], ['standard_fonts','standard_fonts']]) await cp(`node_modules/pdfjs-dist/${src}`,`public/vendor/pdfjs/${dest}`,{recursive:true});
// AI Studio snapshots reject individual files over 30 MB. Transport the Ministry
// original losslessly; the reader verifies the decompressed original SHA-256.
const {gzipSync}=await import('node:zlib');
const {readFile,writeFile,access}=await import('node:fs/promises');
try {await access('public/pdfs/sources/unit1_original.pdf.gz');}
catch {try {await writeFile('public/pdfs/sources/unit1_original.pdf.gz',gzipSync(await readFile('public/pdfs/sources/unit1_original.pdf'),{level:9}));}catch {/* Asset restoration may run after dependency installation. */}}
