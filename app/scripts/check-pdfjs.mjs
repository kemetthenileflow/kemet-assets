import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import fs from 'node:fs/promises';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';
const catalog=JSON.parse(await fs.readFile('src/data/catalog.json','utf8'));
const checks=[];
for(const doc of catalog.documents.filter(d=>d.path.startsWith('/pdfs/'))){
 const raw=await fs.readFile('public'+doc.path+(doc.id==='unit1_source'?'.gz':''));
 const data=new Uint8Array(doc.id==='unit1_source'?gunzipSync(raw):raw);
 if(createHash('sha256').update(data).digest('hex')!==doc.sha256)throw Error(doc.id+' original hash mismatch');
 const task=getDocument({data,standardFontDataUrl:new URL('../node_modules/pdfjs-dist/standard_fonts/',import.meta.url).pathname,cMapUrl:new URL('../node_modules/pdfjs-dist/cmaps/',import.meta.url).pathname,cMapPacked:true});
 const pdf=await task.promise;
 if(pdf.numPages!==doc.pageCount)throw Error(doc.id+' count mismatch');
 for(const n of [1,pdf.numPages]) {const p=await pdf.getPage(n); await p.getOperatorList();}
 checks.push({id:doc.id,pages:pdf.numPages,firstAndLastParsed:true});await task.destroy();
}
console.log(JSON.stringify({engine:'PDF.js 4.10.38 Node legacy parser (not browser canvas)',checks},null,2));
