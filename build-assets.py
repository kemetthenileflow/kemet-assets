#!/usr/bin/env python3
"""Reassemble approved transfer parts, verify originals, prepare app and static assets.
Does not publish, invoke a model, send mail or modify external services.
"""
from pathlib import Path, PurePosixPath
import hashlib,json,shutil,zipfile,argparse
ROOT=Path(__file__).resolve().parent

def digest(path):
 h=hashlib.sha256()
 with path.open('rb') as stream:
  for block in iter(lambda:stream.read(1024*1024),b''):h.update(block)
 return h.hexdigest()

def prepare(destination):
 manifest=json.loads((ROOT/'packages-manifest.json').read_text())
 cache=ROOT/'.reassembled';cache.mkdir(exist_ok=True)
 target=Path(destination).resolve();target.mkdir(parents=True,exist_ok=True)
 for package in manifest['packages']:
  archive=cache/package['name']
  with archive.open('wb') as output:
   for part in package['parts']:
    f=ROOT/part['path']
    if f.stat().st_size!=part['bytes'] or digest(f)!=part['sha256']:raise ValueError('Part verification failed: '+part['path'])
    with f.open('rb') as source:shutil.copyfileobj(source,output)
  if archive.stat().st_size!=package['bytes'] or digest(archive)!=package['sha256']:raise ValueError('Package verification failed: '+package['name'])
  with zipfile.ZipFile(archive) as z:
   if z.testzip():raise ValueError('ZIP CRC check failed')
   for info in z.infolist():
    name=PurePosixPath(info.filename)
    if name.is_absolute() or '..' in name.parts:raise ValueError('Unsafe ZIP path')
    if len(name.parts)<3 or name.parts[0]!='KEMET_Update':continue
    relative=Path(*name.parts[2:])
    if name.parts[1]=='public': destinations=[target/relative,ROOT/'app/public'/relative]
    else:continue
    for f in destinations:
     f.parent.mkdir(parents=True,exist_ok=True)
     if not info.is_dir():
      with z.open(info) as source,f.open('wb') as output:shutil.copyfileobj(source,output)
 for f in (ROOT/'asset-overrides').rglob('*'):
  if not f.is_file():continue
  rel=f.relative_to(ROOT/'asset-overrides')
  for dest in [target/rel,ROOT/'app/public'/rel]:dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(f,dest)
 video=ROOT/'app/public/video/intro.mp4';video.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/'app/public/brand/intro.mp4',video)
 (target/'video').mkdir(exist_ok=True);shutil.copyfile(video,target/'video/intro.mp4')
 # PDF integrity remains unchanged after image repair overlays.
 docs=json.loads((ROOT/'app/src/data/catalog.json').read_text())['documents']
 verified=0
 for doc in docs:
  if not doc['path'].startswith('/pdfs/'):continue
  if digest(target/doc['path'].lstrip('/'))!=doc['sha256']:raise ValueError('PDF mismatch: '+doc['id'])
  verified+=1
 print(json.dumps({'packages_verified':len(manifest['packages']),'pdfs_verified':verified,'target':str(target),'app_prepared':True}))

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--target',default=str(ROOT/'_site'));args=parser.parse_args();prepare(args.target)
