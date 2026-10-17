"""Verify source hashes, dimensions and rasterize every canonical PDF page; no OCR."""
import fitz, json, hashlib, gzip
from pathlib import Path
rows=[]
for d in json.loads(Path('src/data/catalog.json').read_text())['documents']:
 if not d['path'].startswith('/pdfs/'): continue
 p=Path('public'+d['path']); raw=gzip.decompress(Path(str(p)+'.gz').read_bytes()) if d['id']=='unit1_source' else p.read_bytes(); pdf=fitz.open(stream=raw,filetype='pdf')
 for page in pdf:
  pix=page.get_pixmap(matrix=fitz.Matrix(.18,.18))
  assert pix.width and pix.height
 digest=hashlib.sha256(raw).hexdigest()
 assert digest==d['sha256'] and len(pdf)==d['pageCount'],d['id']
 rows.append({'id':d['id'],'pages':len(pdf),'sha256':digest,'allPagesRasterized':True});pdf.close()
print(json.dumps({'documents':rows,'totalPages':sum(d['pages'] for d in rows)},indent=2))
