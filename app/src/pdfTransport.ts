import transport from './data/ministry-transport.json';
// Transport compression only: decompression must recover every original PDF byte.
export async function originalMinistryBytes():Promise<Uint8Array>{
 const response=await fetch('/pdfs/sources/unit1_original.pdf.gz');
 if(!response.ok||!response.body)throw new Error('Original PDF transport unavailable');
 const payload=new Uint8Array(await response.arrayBuffer());
 let bytes:Uint8Array=payload;
 // Some servers decode Content-Encoding: gzip before exposing the response.
 if(payload[0]===0x1f && payload[1]===0x8b){
  if(typeof DecompressionStream==='undefined')throw new Error('This browser cannot decompress the original PDF');
  bytes=new Uint8Array(await new Response(new Blob([payload.buffer as ArrayBuffer]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
 } else if(new TextDecoder().decode(payload.slice(0,5))!=='%PDF-')throw new Error('Invalid original PDF transport');
 if(bytes.length!==transport.originalBytes)throw new Error('Original PDF length mismatch');
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes.buffer as ArrayBuffer))).map(v=>v.toString(16).padStart(2,'0')).join('');
 if(hash!==transport.sha256)throw new Error('Original PDF integrity mismatch');
 return bytes;
}
