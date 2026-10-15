import catalog from './data/catalog.json';
import available from './data/available-assets.json';
export const assetRegistry=new Map<string,{id:string;path:string;name:string;kind:string;available:boolean}>();
function add(id:string,path:string,name:string,kind:string){assetRegistry.set(id,{id,path,name,kind,available:!!(available as any)[path]?.available})}
catalog.documents.filter(d=>d.path.startsWith('/pdfs/')).forEach(d=>add(d.id,d.path,d.originalFilename,'pdf'));
catalog.media.forEach(m=>add(m.id,m.path,m.originalFilename,'audio'));
catalog.vocabularyAssets.forEach(v=>{if(v.pronunciationPath)add(v.vocabularyId,v.pronunciationPath,v.word,'audio');v.learningCards.forEach((c,i)=>add(v.vocabularyId+'-card-'+i,c.path,v.word,'image'))});
add('logo','/brand/logo_authoritative.png','Original Kemet logo','image');add('intro','/video/intro.mp4','Brand introduction','video');
export function asset(id:string){return assetRegistry.get(id)}
export function byPath(path:string){return {path,available:!!(available as any)[path]?.available}}
export function wordAsset(word:string){const v=catalog.vocabularyAssets.find(v=>v.word.toLowerCase()===word.toLowerCase());return v?asset(v.vocabularyId):undefined}
