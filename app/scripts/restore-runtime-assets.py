#!/usr/bin/env python3
"""Audit or repair missing/empty approved runtime assets from pinned public packets.
No source regeneration, PDF rewriting, publication, credential access or uploads.
"""
from pathlib import Path, PurePosixPath
from io import BytesIO
import argparse, concurrent.futures, hashlib, json, tempfile, urllib.request, zipfile
REF='9d9067a89f21cf5dbac50fe8d9dbc337a6eeb97b'
BASE=f'https://raw.githubusercontent.com/kemetthenileflow/kemet-assets/{REF}/'
APP=Path(__file__).resolve().parents[1]
OVERRIDE_REF='5ea9b71287a46b19531df3c189b0d01d6b95e980'
OVERRIDES={'/heritage/scarab.svg': '42beb478aa5b0921f5e9ea2256f390c00b374f6ff54b8e8cd5efd6f0b1a7226b', '/heritage/rosetta.svg': '5548a38fb85e35c22e0b00c7bfd3eb6110e4ddeadc49d523c9c170e0c76221f1', '/heritage/wedjat.svg': '46685813f07b63b5df9301e9149e68715bc1251536decfd0bf3657e733c55c0e', '/heritage/cleopatra.svg': '1ee03cdd0a9ca6672c61a31a8c2691d95cf63dbbbeda8df10069cb9941f26c36', '/heritage/mahfouz.svg': '84d5720798e94e773fd1b7b178120ed5deedb52e9275deaee614999cac17770b', '/heritage/ankh.svg': '331d738aceaf2a68fa41eab72d51ca2e5dc758d16d3504538402de83e2a580c2', '/heritage/ramses.svg': '768aad1c60a9073f01f3283467f8298b2c396d6b4f00fcd99f10c78ae12bb4f0', '/heritage/lotus.svg': '674d8637f56154a95640fc77bec2856e24d4f80ebf38ea9ec49e3351c711cb86', '/heritage/papyrus.svg': 'cdb60895247e84302e2b24b48b63bc57c94d78590714822d7e0c2653614d1d56', '/heritage/zewail.svg': '7bf3d29148a56fc1afad9312b8328661918085ece0c2941d17cf080957dd84a6', '/cards/living_lexicon/213.webp': 'a5ff21dabd3e14babdc2d69e29576e7d0ed7de096f4b35b1f8743839577ec4a4', '/cards/thoth/028.webp': 'a60f23bfaa68c5ced2dbccbf737d791811a8f877a832de9c051658c838a23b88'}
def sha(data):return hashlib.sha256(data).hexdigest()
def fetch(path):
 with urllib.request.urlopen(BASE+path,timeout=90) as r:return r.read()
def needed():
 registry=json.loads((APP/'src/data/available-assets.json').read_text())
 return [p for p,m in registry.items() if m.get('available') and (not (APP/'public'/p.lstrip('/')).is_file() or not (APP/'public'/p.lstrip('/')).stat().st_size)]
def packet_bytes(package):
 def part(item):
  path=PurePosixPath(item['path'])
  if path.is_absolute() or '..' in path.parts:raise ValueError('Unsafe asset part')
  data=fetch(str(path))
  if len(data)!=item['bytes'] or sha(data)!=item['sha256']:raise ValueError('Asset part integrity mismatch')
  return data
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:parts=list(pool.map(part,package['parts']))
 data=b''.join(parts)
 if len(data)!=package['bytes'] or sha(data)!=package['sha256']:raise ValueError('Approved packet integrity mismatch')
 return data

def restore(repair=False):
 before=needed();print(json.dumps({'missingOrEmptyBefore':before}),flush=True)
 if not repair or not before:return
 for path,digest in OVERRIDES.items():
  if path not in needed():continue
  url=f'https://raw.githubusercontent.com/kemetthenileflow/kemet-assets/{OVERRIDE_REF}/asset-overrides{path}'
  with urllib.request.urlopen(url,timeout=90) as response:data=response.read()
  if sha(data)!=digest:raise ValueError('Exact repair asset integrity mismatch')
  target=APP/'public'/path.lstrip('/');target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)

 manifest=json.loads(fetch('packages-manifest.json'))
 groups=[('02_Control_Visuals.zip',lambda p:p.startswith(('/brand/','/art/','/cards/','/heritage/')) and p!='/brand/intro.mp4'),('04_Audio_Video.zip',lambda p:p.startswith(('/audio/','/video/')) or p=='/brand/intro.mp4')]
 for name,matches in groups:
  want=set(p for p in needed() if matches(p))
  if not want:continue
  packet=next(p for p in manifest['packages'] if p['name']==name)
  approved={'02_Control_Visuals.zip':'8e669eaa57393a4a25a1b452337ed3e0eceeceda675cd57d1a76e7df509c1168','04_Audio_Video.zip':'45ff881d8388759916d1136e540f74d5303ae5bd53c3240c6a32204b93404b7c'}
  if packet['sha256']!=approved[name]:raise ValueError('Unexpected packet')
  with zipfile.ZipFile(BytesIO(packet_bytes(packet))) as archive:
   if archive.testzip():raise ValueError('Packet CRC failure')
   for entry in archive.infolist():
    parts=PurePosixPath(entry.filename).parts
    if entry.is_dir() or len(parts)<3 or parts[:2]!=('KEMET_Update','public') or '..' in parts:continue
    relative=Path(*parts[2:]);path='/'+relative.as_posix()
    if path not in want:continue
    data=archive.read(entry)
    if not data:continue
    dest=APP/'public'/relative;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)
 if any(p.startswith('/vocab/') or p=='/cards/thoth/028.webp' for p in needed()):
  work=json.loads(fetch('work-input/2026-10-16/manifest.json'))
  with zipfile.ZipFile(BytesIO(packet_bytes(work))) as outer:
   with zipfile.ZipFile(BytesIO(outer.read('03_Unit1_Vocabulary_Visuals_Import_Ready.zip'))) as archive:
    for entry in archive.infolist():
     if entry.is_dir():continue
     relative=PurePosixPath(entry.filename)
     if str(relative) in ('import_manifest.json','README_IMPORT_FIRST.txt'):relative=PurePosixPath('public/vocab')/relative
     if relative.is_absolute() or '..' in relative.parts or relative.parts[:2]!=('public','vocab'):raise ValueError('Unsafe vocabulary path')
     target=APP/str(relative);target.parent.mkdir(parents=True,exist_ok=True)
     if not target.exists() or not target.stat().st_size:target.write_bytes(archive.read(entry))
   with zipfile.ZipFile(BytesIO(outer.read('04_Thoth_028_Repair.zip'))) as archive:data=archive.read('cards/thoth/028.webp')
   if sha(data)!='a60f23bfaa68c5ced2dbccbf737d791811a8f877a832de9c051658c838a23b88':raise ValueError('Thoth repair integrity failure')
   target=APP/'public/cards/thoth/028.webp'
   if not target.exists() or not target.stat().st_size:target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
 source=APP/'public/brand/intro.mp4';alias=APP/'public/video/intro.mp4'
 if '/video/intro.mp4' in needed() and source.is_file() and source.stat().st_size:
  alias.parent.mkdir(parents=True,exist_ok=True);alias.write_bytes(source.read_bytes())
 remaining=needed();print(json.dumps({'remainingMissingOrEmpty':remaining}),flush=True)
 if remaining:raise ValueError('Assets still missing; report these paths without fabricating files')
if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--repair',action='store_true');args=parser.parse_args();restore(args.repair)
