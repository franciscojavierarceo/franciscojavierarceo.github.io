#!/usr/bin/env python3
"""Download the authors' three PDFs and verify the exact recording corpus hashes."""
import hashlib
import json
from pathlib import Path
import urllib.request

if __name__ == '__main__':
    root = Path(__file__).resolve().parent
    destination = root / 'corpus'
    destination.mkdir(exist_ok=True)
    sources = json.loads((root / 'full_trace/corpus-sources.json').read_text())
    for source in sources:
        path = destination / source['filename']
        if path.exists():
            data = path.read_bytes()
        else:
            req = urllib.request.Request(source['url'], headers={'User-Agent': 'AIE-workshop-reproduction/1.0'})
            with urllib.request.urlopen(req, timeout=120) as response:
                data = response.read()
        if not data.startswith(b'%PDF') or hashlib.sha256(data).hexdigest() != source['sha256']:
            raise RuntimeError(f"Corpus changed or not a PDF: {source['filename']}; review the source before changing its expected hash")
        path.write_bytes(data)
        print('PASS:', source['filename'], len(data), 'bytes; SHA-256 matches recording')
