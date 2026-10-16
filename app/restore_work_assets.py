"""Restore the exact owner packet from this review repository, after build-assets.py.

Run from app/: python restore_work_assets.py
Then install pinned dependencies and copy their matching PDF worker to public/.
This script does not publish, upload, or modify source PDFs.
"""
from pathlib import Path
from io import BytesIO
import hashlib
import json
import shutil
import zipfile

app = Path(__file__).resolve().parent
repo = app.parent
manifest_path = repo / 'work-input/2026-10-16/manifest.json'
manifest = json.loads(manifest_path.read_text())
chunks = []
for entry in manifest['parts']:
    chunk = (repo / entry['path']).read_bytes()
    assert len(chunk) == entry['bytes']
    assert hashlib.sha256(chunk).hexdigest() == entry['sha256']
    chunks.append(chunk)
packet = b''.join(chunks)
assert len(packet) == manifest['bytes']
assert hashlib.sha256(packet).hexdigest() == manifest['sha256']
with zipfile.ZipFile(BytesIO(packet)) as outer:
    vocab_zip = outer.read('03_Unit1_Vocabulary_Visuals_Import_Ready.zip')
    repair_zip = outer.read('04_Thoth_028_Repair.zip')
with zipfile.ZipFile(BytesIO(vocab_zip)) as archive:
    for member in archive.infolist():
        if member.is_dir():
            continue
        relative = Path(member.filename)
        assert not relative.is_absolute() and '..' not in relative.parts
        if member.filename in ('import_manifest.json', 'README_IMPORT_FIRST.txt'):
            relative = Path('public/vocab') / member.filename
        assert relative.parts[:2] == ('public', 'vocab')
        target = app / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(archive.read(member))
with zipfile.ZipFile(BytesIO(repair_zip)) as archive:
    repair = archive.read('cards/thoth/028.webp')
assert hashlib.sha256(repair).hexdigest() == 'a60f23bfaa68c5ced2dbccbf737d791811a8f877a832de9c051658c838a23b88'
target = app / 'public/cards/thoth/028.webp'
target.parent.mkdir(parents=True, exist_ok=True)
target.write_bytes(repair)
images = json.loads((app / 'public/vocab/import_manifest.json').read_text())
for image in images['entries']:
    data = (app / image['path'].lstrip('/')).read_bytes()
    assert len(data) == image['bytes']
    assert hashlib.sha256(data).hexdigest() == image['sha256']
worker = app / 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs'
if worker.exists():
    shutil.copy2(worker, app / 'public/pdf.worker.min.mjs')
    shutil.copy2(worker, app / 'public/pdf.worker.min.js')
else:
    print('Install pinned pdfjs-dist 4.10.38, then rerun to copy the matching worker.')
print('Verified and restored 73 vocabulary images and Thoth 028. No publication performed.')
