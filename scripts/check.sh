#!/usr/bin/env bash
set -euo pipefail
node --check assets/rewards.js
node --check assets/app.js
node --check assets/budget-data.js
node --check assets/civic.js
node --check assets/accessibility.js
node --check sw.js
node - <<'NODE'
global.window = global;
require('./assets/budget-data.js');
const cities = window.POTEZ_BUDGET_DATA.cities;
for (const [cityKey, city] of Object.entries(cities)) {
  for (const [districtKey, district] of Object.entries(city.districts)) {
    const sum = district.items.reduce((total, item) => total + item.amount, 0);
    if (cityKey === "valpovo" && districtKey === "funkcijska-klasifikacija" && Math.abs(district.total - 14375354.05) > 0.001) {
      throw new Error("Valpovo selected functions subtotal changed unexpectedly");
    }
    if (sum !== district.total) {
      throw new Error(cityKey + '/' + districtKey + ': category total ' + sum + ' does not match programme total ' + district.total);
    }
  }
}
console.log('Verified all local category sums match the adopted programme totals.');
NODE
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
assert "budgetProgramLink" in html and "Program-Prioriteta" in Path("assets/budget-data.js").read_text(encoding="utf-8")
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

python - <<'PY'
from pathlib import Path
html=Path("index.html").read_text(encoding="utf-8")
css=Path("assets/styles.css").read_text(encoding="utf-8")
js=Path("assets/accessibility.js").read_text(encoding="utf-8")
sw=Path("sw.js").read_text(encoding="utf-8")
for token in ('id="accessibilityMenu"','data-theme-choice="dark"','data-font-step="1"','data-setting="contrast"','data-setting="motion"'):
    assert token in html, token
for token in ('data-theme="dark"','data-contrast="high"','data-motion="reduce"','border-radius:0!important'):
    assert token in css, token
assert "localStorage" in js and "prefers-color-scheme: dark" in js
assert "'/assets/accessibility.js'" in sw and "potez-pilot-v13" in sw and "'/assets/budget-data.js'" in sw
for page in ("privacy.html","uvjeti.html"):
    page_html=Path(page).read_text(encoding="utf-8")
    assert 'id="accessibilityMenu"' in page_html and '/assets/accessibility.js' in page_html
assert 'id="teme"' in html and 'id="tema-hz"' in html and 'id="tema-obroci"' in html and 'id="tema-ucenje"' in html
assert 'Odaberi stvarni problem' in html and 'budgetCity' in html and 'budgetDistrict' in html
data = Path("assets/budget-data.js").read_text(encoding="utf-8")
for city in ("osijek", "slavonski-brod", "slatina", "vukovar", "virovitica", "valpovo", "nova-gradiska", "zagreb"):
    assert city in data, city
assert "budgetDistrictLabel" in html and "budgetEnvelopeLabel" in html
assert 'value="virovitica"' in html and 'value="virovitica" disabled' not in html
assert 'value="valpovo"' in html and 'value="valpovo" disabled' not in html
assert "id: 'virovitica'" not in data
assert "budgetCityImage" not in html and "budgetImageCredit" not in html
assert "budgetCityImage" not in Path("assets/app.js").read_text(encoding="utf-8")
assert "Nema niza ni kazne ako preskočiš dan" not in html
assert "Misija se mijenja jednom tjedno" not in html
assert "nema javne ljestvice ni korisničkog profila" not in html
assert "Tvoj POTEZ · spremljen samo ovdje" not in html
assert "Povratne informacije · bez računa" not in html
assert 'HAKOM' in html and 'članak 33.' in html
assert "Stvarni problemi, konkretni putevi" in html
assert "🏠" in html and "🧠" in html and "🎮" in html and "✊" in html and "🧰" in html
assert "mobile-nav-icon{display:inline" in css
assert "home-progress-score span" in css and "minmax(0,1.12fr)" in css
data = Path("assets/budget-data.js").read_text(encoding="utf-8")
for token in ("tvrda", "novi-grad", "gornji-grad", "donji-grad", "93729", "99492"):
    assert token in data, token
assert "100.000 €" not in html and "data-budget-slider" in Path("assets/app.js").read_text(encoding="utf-8")
assert all(token in html for token in ("Slavonski Brod", "Slatina", "Vukovar", "Virovitica", "Valpovo", "Zagreb", "Nova Gradiška"))
assert "Proračunska igra prikazuje odabrane iznose iz službenih planova" in Path("uvjeti.html").read_text(encoding="utf-8")
assert "Zanimljiv pokušaj — evo što se događa." not in Path("assets/civic.js").read_text(encoding="utf-8")
assert "razlika manja od 5% ili 5.000 €" in Path("assets/civic.js").read_text(encoding="utf-8")
print("POTEZ final desktop, local budget, dark-mode and navigation checks passed")
PY
