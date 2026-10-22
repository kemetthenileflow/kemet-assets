#!/usr/bin/env python3
"""Extract original KEMET teaching-card images from an owner-supplied Word document.
Does NOT publish or update WeWeb data. Requires Pillow: pip install Pillow.
Use exact word metadata in app/public/vocab/import_manifest.json; never assign assets
from WeWeb's VOC-### row numbers because the two vocab inventories are different.
"""
import argparse
import hashlib
import json
import re
import zipfile
from pathlib import Path
from io import BytesIO
from xml.etree import ElementTree as ET
from PIL import Image

NS = {
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/package/2006/relationships",
}
REL_ID = "{%s}embed" % NS["r"]

def embedded_images_in_document_order(docx):
    """Return (media_name, bytes) from actual DOCX blip order, not ZIP sort order."""
    with zipfile.ZipFile(docx) as archive:
        doc = ET.fromstring(archive.read("word/document.xml"))
        rels = ET.fromstring(archive.read("word/_rels/document.xml.rels"))
        paths = {
            r.attrib["Id"]: r.attrib.get("Target", "")
            for r in rels if r.attrib.get("Id")
        }
        ordered, seen = [], set()
        for elem in doc.findall(".//a:blip", NS):
            rid = elem.attrib.get(REL_ID)
            if not rid or rid in seen or rid not in paths:
                continue
            target = paths[rid].replace("\\", "/")
            target = target.lstrip("/")
            if target.startswith("word/"):
                actual = target
            else:
                actual = "word/" + target
            if ".." in Path(actual).parts or not actual.startswith("word/media/"):
                raise ValueError("Unexpected image path: " + actual)
            if actual not in archive.namelist():
                raise ValueError("Missing embedded image: " + actual)
            ordered.append((actual, archive.read(actual)))
            seen.add(rid)
        return ordered

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-docx", required=True, type=Path)
    parser.add_argument("--source-manifest", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--quality", type=int, default=86)
    args = parser.parse_args()
    manifest = json.loads(args.source_manifest.read_text(encoding="utf-8"))
    entries = sorted(manifest["entries"], key=lambda entry: entry["sourceIndex"])
    photos = embedded_images_in_document_order(args.source_docx)
    if len(entries) != 73 or len(photos) != 73:
        raise RuntimeError("Expected precisely 73 original images and manifest entries; got %s and %s" % (len(photos), len(entries)))
    if [e["sourceIndex"] for e in entries] != list(range(1, 74)):
        raise RuntimeError("Source indices are missing, duplicated, or out of sequence")
    output = []
    for (media_name, data), entry in zip(photos, entries):
        path = entry["path"]
        if not path.startswith("/public/vocab/") or not path.endswith(".webp"):
            raise ValueError("Unexpected manifest output path: " + path)
        relative = Path(path[len("/public/"):])
        if ".." in relative.parts:
            raise ValueError("Unsafe output path: " + path)
        target = args.out / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(BytesIO(data)) as src:
            img = src.convert("RGB")
            if img.width != img.height:
                raise RuntimeError("Card is not square; manual visual review required: " + media_name)
            img.save(target, format="WEBP", quality=args.quality, method=5)
        output.append({
            "sourceIndex": entry["sourceIndex"], "word": entry.get("word"),
            "sourceId": entry.get("id"), "role": entry["role"],
            "file": str(relative).replace("\\", "/"),
            "bytes": target.stat().st_size,
            "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
            "origin": media_name, "revealsAnswer": entry.get("revealsAnswer", False)
        })
    report = {"publicationStatus":"NOT_RELEASED_REQUIRES_OWNER_REVIEW",
              "source": str(args.source_docx), "count": len(output), "entries": output}
    (args.out / "vocab-export-audit.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Prepared 73 non-cropped teaching images. Review labels and word mapping before hosting or WeWeb import.")

if __name__ == "__main__":
    main()
