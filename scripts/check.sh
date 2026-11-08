#!/usr/bin/env bash
set -euo pipefail
node --check assets/app.js
node --input-type=module --check < functions/api/feedback.js
node --test tests/feedback.test.mjs
python - <<'PY'
import json
from html.parser import HTMLParser
from pathlib import Path

class Check(HTMLParser):
    pass

for filename in ("index.html", "privacy.html"):
    parser = Check()
    parser.feed(Path(filename).read_text(encoding="utf-8"))
    parser.close()
    print(f"HTML parsed: {filename}")

json.loads(Path("manifest.webmanifest").read_text(encoding="utf-8"))
json.loads(Path("_routes.json").read_text(encoding="utf-8"))
print("Manifest and Pages routes JSON parsed")
PY
printf 'POTEZ static and API checks passed.\\n'
