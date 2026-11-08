#!/usr/bin/env bash
set -euo pipefail
node --check assets/feedback.js
node --check assets/app.js
node --check assets/civic.js
node --check sw.js
node --input-type=module --check < functions/api/feedback.js
node --test tests/feedback.test.mjs
python - <<'PY'
import json
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path

class Check(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.fragments = []
    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"])
        href = values.get("href", "")
        if href.startswith("#") and len(href) > 1:
            self.fragments.append(href[1:])

for filename in ("index.html", "privacy.html", "uvjeti.html"):
    parser = Check()
    parser.feed(Path(filename).read_text(encoding="utf-8"))
    parser.close()
    duplicates = [name for name, count in Counter(parser.ids).items() if count > 1]
    missing = sorted(set(parser.fragments) - set(parser.ids))
    if duplicates:
        raise SystemExit(f"{filename}: duplicate IDs: {duplicates}")
    if missing:
        raise SystemExit(f"{filename}: broken in-page links: {missing}")
    print(f"HTML parsed and in-page links checked: {filename}")

json.loads(Path("manifest.webmanifest").read_text(encoding="utf-8"))
pages_routes = json.loads(Path("_routes.json").read_text(encoding="utf-8"))
if pages_routes.get("include") != []:
    raise SystemExit("Pages Functions must remain disabled for the public pilot")
print("Manifest and Pages routes JSON parsed; Pages Functions are disabled")
PY
printf 'POTEZ static and API checks passed.\n'
