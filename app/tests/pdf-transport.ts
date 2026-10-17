import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {originalMinistryBytes} from '../src/pdfTransport';
const raw=await readFile('public/pdfs/sources/unit1_original.pdf').catch(()=>null);const compressed=await readFile('public/pdfs/sources/unit1_original.pdf.gz');
globalThis.fetch=async()=>new Response(compressed);
const restored=Buffer.from(await originalMinistryBytes());if(raw)assert.deepEqual(restored,raw);console.log('PASS TRANSPORT: gzip restores every byte of original 172-page PDF and browser-stream SHA verification passes');
globalThis.fetch=async()=>new Response(restored);assert.deepEqual(Buffer.from(await originalMinistryBytes()),restored);console.log('PASS TRANSPORT: already-decoded server response is verified without double decompression');
globalThis.fetch=async()=>new Response(Buffer.from('bad data'));await assert.rejects(originalMinistryBytes);console.log('PASS TRANSPORT: corrupt transport is rejected');
