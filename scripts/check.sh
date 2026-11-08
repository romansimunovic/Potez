#!/usr/bin/env bash
set -euo pipefail
node --check assets/rewards.js
node --check assets/app.js
node --check assets/civic.js
node --check sw.js
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
if Path("functions").exists():
    raise SystemExit("The public pilot must remain static; remove Pages Functions")
if Path("supabase").exists():
    raise SystemExit("The public pilot must not include an active database schema")
print("Manifest parsed; no server-side functions or database migrations are present")
PY
printf 'POTEZ static and privacy checks passed.\n'

python - <<'PY'
from pathlib import Path
import json
html = Path("index.html").read_text(encoding="utf-8")
privacy = Path("privacy.html").read_text(encoding="utf-8")
civic = Path("assets/civic.js").read_text(encoding="utf-8")
assert 'id="feedbackForm"' not in html
assert 'id="dailyScenarioTitle"' in html and 'id="dailyScenarioText"' in html
assert "dailyRunOrder" in civic and "dailyCompletedIds" in civic
assert 'id="dailyProgress"' in html and 'id="dailyNext"' in html and 'id="dailyShare"' in html
assert not Path("functions").exists()
assert not Path("supabase").exists()
assert "localStorage" in privacy and "Cloudflare Pagesa" in privacy
assert "daily-run-progress" in html or "dailyProgress" in html
assert "data.gov.hr/ckan/dataset/972-proracun-6" in html
assert "prefers-reduced-motion:reduce" in Path("assets/styles.css").read_text(encoding="utf-8")
assert not Path("_redirects").exists()
print("POTEZ pilot UX/privacy checks passed")
PY

python - <<'PY'
from pathlib import Path
html = Path("index.html").read_text(encoding="utf-8")
css = Path("assets/styles.css").read_text(encoding="utf-8")
assert 'id="za-voditelje"' in html
assert "Otvori gotov raspored radionice" in html
assert "mobile-nav-icon" in html
assert ".facilitator-kit" in css and "prefers-reduced-motion:reduce" in css
print("POTEZ facilitator and mobile navigation checks passed")
PY
