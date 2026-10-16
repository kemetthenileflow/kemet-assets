import { mkdir, cp } from 'node:fs/promises';
await mkdir('public/vendor/pdfjs', { recursive: true });
for (const [src,dest] of [['build/pdf.worker.min.mjs','pdf.worker.min.mjs'], ['cmaps','cmaps'], ['standard_fonts','standard_fonts']]) await cp(`node_modules/pdfjs-dist/${src}`,`public/vendor/pdfjs/${dest}`,{recursive:true});
