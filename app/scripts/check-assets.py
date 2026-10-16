from pathlib import Path
import json
from PIL import Image
available=json.loads(Path('src/data/available-assets.json').read_text())
missing=[];bad=[]
for path,meta in available.items():
 if not meta.get('available'):continue
 p=Path('public'+path)
 if not p.exists() or not p.stat().st_size:missing.append(path)
 elif p.suffix.lower() in ['.webp','.png','.jpg','.jpeg']:
  try:
   with Image.open(p) as im:im.verify()
  except Exception as e:bad.append({'path':path,'error':str(e)})
print(json.dumps({'declaredAvailable':sum(bool(v.get('available')) for v in available.values()),'missing':missing,'corruptImages':bad},indent=2))
assert not missing and not bad
