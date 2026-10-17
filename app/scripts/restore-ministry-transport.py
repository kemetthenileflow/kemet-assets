#!/usr/bin/env python3
"""Restore the exact approved Ministry Part 1 PDF transport; no publishing or credentials.
Use --source for an existing original, otherwise read only the pinned public asset packet.
"""
from pathlib import Path
import argparse, concurrent.futures, gzip, hashlib, json, tempfile, urllib.request, zipfile
REF='9d9067a89f21cf5dbac50fe8d9dbc337a6eeb97b'
BASE=f'https://raw.githubusercontent.com/kemetthenileflow/kemet-assets/{REF}/'
EXPECTED='7168dc0ef9e324b2f429116f0010a2208fb8b393654a83df4c1b9ddeded5ffa9'
PACKET='3ded94e0fdd90b1a84d4cf58e13ff753825fd8e357dfbe34e123c005c0a5fa5c'
SIZE=35522435

def sha(data):return hashlib.sha256(data).hexdigest()
def fetch(path):
    with urllib.request.urlopen(BASE+path,timeout=90) as r:return r.read()
def validate(raw):
    if len(raw)!=SIZE or sha(raw)!=EXPECTED:raise ValueError('Original Ministry PDF integrity mismatch')
    return raw

def restore(source=None, destination=None):
    if source:raw=validate(Path(source).read_bytes())
    else:
        manifest=json.loads(fetch('packages-manifest.json'))
        packet=next(p for p in manifest['packages'] if p['name']=='03_PDF_Documents.zip')
        if packet['sha256']!=PACKET:raise ValueError('Approved packet fingerprint mismatch')
        with tempfile.TemporaryDirectory(prefix='kemet-ministry-') as directory:
            root=Path(directory)
            def part(item):
                path=item['path']
                if not path.startswith('packages/03_PDF_Documents.zip.part') or '..' in Path(path).parts:raise ValueError('Unexpected part path')
                data=fetch(path)
                if len(data)!=item['bytes'] or sha(data)!=item['sha256']:raise ValueError('Asset part integrity mismatch: '+path)
                local=root/Path(path).name;local.write_bytes(data);return local
            with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:parts=list(pool.map(part,packet['parts']))
            archive=root/'approved.zip'
            with archive.open('wb') as out:
                for p in parts:out.write(p.read_bytes())
            if archive.stat().st_size!=packet['bytes'] or sha(archive.read_bytes())!=PACKET:raise ValueError('Reassembled PDF packet mismatch')
            with zipfile.ZipFile(archive) as z:
                if z.testzip():raise ValueError('Approved packet CRC failure')
                raw=None
                for entry in z.infolist():
                    if entry.filename.lower().endswith('.pdf') and entry.file_size==SIZE:
                        candidate=z.read(entry)
                        if sha(candidate)==EXPECTED:raw=validate(candidate);break
                if raw is None:raise ValueError('Exact Ministry original not found in approved packet')
    target=Path(destination) if destination else Path(__file__).resolve().parents[1]/'public/pdfs/sources/unit1_original.pdf.gz'
    compressed=gzip.compress(raw,compresslevel=9,mtime=0)
    if gzip.decompress(compressed)!=raw:raise ValueError('Lossless transport verification failed')
    if len(compressed)>=30*1024*1024:raise ValueError('Transport exceeds Studio single-file limit')
    target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(compressed)
    print(json.dumps({'originalBytes':len(raw),'sha256':EXPECTED,'transportBytes':len(compressed),'path':str(target),'lossless':True}))

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--source');parser.add_argument('--destination');args=parser.parse_args();restore(args.source,args.destination)
