import transport from './data/ministry-transport.json';
// Transport compression only: decompression must recover every original PDF byte.
export async function originalMinistryBytes():Promise<Uint8Array>{
 const response=await fetch('/pdfs/sources/unit1_original.pdf.gz');
 if(!response.ok||!response.body)throw new Error('Original PDF transport unavailable');
 if(typeof DecompressionStream==='undefined')throw new Error('This browser cannot decompress the original PDF');
 const bytes=new Uint8Array(await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
 if(bytes.length!==transport.originalBytes)throw new Error('Original PDF length mismatch');
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(v=>v.toString(16).padStart(2,'0')).join('');
 if(hash!==transport.sha256)throw new Error('Original PDF integrity mismatch');
 return bytes;
}
