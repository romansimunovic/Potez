#!/usr/bin/env bash
set -euo pipefail
node --check assets/rewards.js
node --check assets/app.js
node --check assets/budget-data.js
node --check assets/civic.js
node --check assets/learning-data.js
node --check assets/learning.js
node --check assets/accessibility.js
node --check sw.js
node - <<'NODE'
global.window = global;
require('./assets/budget-data.js');
const data = window.POTEZ_BUDGET_DATA;
const cities = data.cities;
if (Object.keys(cities).length !== 42) throw new Error('Expected exactly 42 city simulations');
if (data.model !== 'population-based-illustrative') throw new Error('Unexpected budget model');
for (const [cityKey, city] of Object.entries(cities)) {
  if (!Number.isInteger(city.population) || !Number.isInteger(city.children) || city.children > city.population) {
    throw new Error(cityKey + ': invalid demographic inputs');
  }
  if (!Number.isInteger(city.total) || city.total <= 0 || city.items.length !== 7) {
    throw new Error(cityKey + ': invalid simulation envelope or category count');
  }
  const sum = city.items.reduce((total, item) => total + item.amount, 0);
  if (sum !== city.total) throw new Error(cityKey + ': category sum does not match simulated fund');
  if (city.items.some(item => !item.name || !item.detail || !Number.isInteger(item.amount) || item.amount < 0)) {
    throw new Error(cityKey + ': incomplete or invalid category');
  }
}
for (const required of ['zagreb','split','rijeka','osijek','zadar','pula','slavonski-brod','vinkovci','vukovar','djakovo','pozega','nova-gradiska','nasice','valpovo','belisce']) {
  if (!cities[required]) throw new Error('Missing required city: ' + required);
}
console.log('Verified city simulations, demographic inputs and exact starting allocations.');
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
assert 'Što znači sudjelovati u društvenim i političkim odlukama?' in html
assert 'Provjeri prije dijeljenja' in html
assert 'Tko je nadležan za problem koji želiš riješiti?' in html
assert "dailyRunOrder" in civic and "dailyCompletedIds" in civic
assert 'id="dailyProgress"' in html and 'id="dailyNext"' in html and 'id="dailyShare"' in html
assert not Path("functions").exists()
assert not Path("supabase").exists()
assert "localStorage" in privacy and "Cloudflare Pagesa" in privacy
assert "daily-run-progress" in html or "dailyProgress" in html
assert "budgetCity" in html and "budgetProgramLink" not in html
assert "prefers-reduced-motion:reduce" in Path("assets/styles.css").read_text(encoding="utf-8")
assert not Path("_redirects").exists()
print("POTEZ pilot UX/privacy checks passed")
PY

python - <<'PY'
from pathlib import Path
html = Path("index.html").read_text(encoding="utf-8")
css = Path("assets/styles.css").read_text(encoding="utf-8")
assert 'class="tool-disclosure"' in html and 'class="facilitator-kit"' in html
assert 'id="mobileMenu"' in html and 'mobile-menu-panel' in Path("assets/styles.css").read_text(encoding="utf-8")
assert 'mobile-nav-icon' not in html and '<nav class="mobile-nav"' not in html
assert 'class="issue-guide-card"' in html
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
assert "localStorage" in js and "theme:'light'" in js and "settings.theme==='dark'?'dark':'light'" in js
assert "'/assets/accessibility.js'" in sw and "potez-pilot-v35" in sw and "'/assets/budget-data.js'" in sw

app_reset = Path("assets/app.js").read_text(encoding="utf-8")
assert "localStorage.removeItem('potez-budget-duel-v1')" in app_reset
assert "localStorage.removeItem('potez-budget-duel-v2')" in app_reset
assert not Path(".env").exists() and not Path(".dev.vars").exists()
security = Path("SECURITY.md").read_text(encoding="utf-8")
assert "ne sadrži Pages Functions" in security
assert "Supabase konfiguraciju" in security
for page in ("privacy.html","uvjeti.html"):
    page_html=Path(page).read_text(encoding="utf-8")
    assert 'id="accessibilityMenu"' in page_html and '/assets/accessibility.js' in page_html
assert 'id="teme"' in html and 'id="tema-hz"' in html and 'id="tema-obroci"' in html and 'id="tema-ucenje"' in html
assert 'id="topicSelect"' in html and 'budgetCity' in html
assert 'budgetDistrict' not in html and 'budgetDistrict' not in Path("assets/app.js").read_text(encoding="utf-8")
assert "Odaberi prikaz" not in html
assert 'id="budgetSubmit"' in html and "Prikaži rezultat" in html
assert "Potrebno je potražiti odluku nadležnog tijela" in Path("assets/app.js").read_text(encoding="utf-8")
assert "Kako ovo primijeniti" in Path("assets/learning.js").read_text(encoding="utf-8")
assert "Provjeri statut, kućni red" not in Path("assets/learning-data.js").read_text(encoding="utf-8")
assert "Prilagodi prikaz" not in html
assert "Saznaj tko odlučuje" not in html
assert "Saznaj više ↗" not in html
assert "Završi jedan izazov za novu razinu" not in html
assert "Zaustavi dijeljenje dok ne pronađeš izvor." not in Path("assets/civic.js").read_text(encoding="utf-8")
assert "Kritiziraj pravilo, ne pojedince." not in Path("assets/civic.js").read_text(encoding="utf-8")
assert "Provjeri ugovor, plaćanja i status radova." not in Path("assets/civic.js").read_text(encoding="utf-8")

assert 'href="/assets/polish.css"' in Path("privacy.html").read_text(encoding="utf-8")
assert 'href="/assets/polish.css"' in Path("uvjeti.html").read_text(encoding="utf-8")
assert 'class="budget-method"' in html
assert 'id="budgetPopulationMeta"' in html
assert "budgetPopulationMeta" in Path("assets/app.js").read_text(encoding="utf-8")
assert "Saznaj više ↗" not in html
assert "Ponovi izazov" not in html
assert "Prilagodi prikaz" not in html
assert "Završi izazov" not in Path("assets/app.js").read_text(encoding="utf-8")
assert "Provjeri izvor, kontekst i raspoložive dokaze." not in Path("assets/app.js").read_text(encoding="utf-8")
assert "Provjeri statut, kućni red" not in Path("assets/learning-data.js").read_text(encoding="utf-8")
assert "Potraži odluku nadležnog tijela" not in Path("assets/app.js").read_text(encoding="utf-8")
assert "Saznaj više ↗" not in Path("assets/civic.js").read_text(encoding="utf-8")
assert Path("docs/STYLE_GUIDE.md").is_file()

data = Path("assets/budget-data.js").read_text(encoding="utf-8")
for city in ("zagreb", "split", "rijeka", "osijek", "zadar", "velika-gorica", "pula", "slavonski-brod", "dubrovnik", "vinkovci", "vukovar", "djakovo", "pozega", "virovitica", "nova-gradiska", "slatina", "valpovo", "belisce", "nasice"):
    assert city in data, city
assert "population-based-illustrative" in data and "children" in data
app = Path("assets/app.js").read_text(encoding="utf-8")
assert 'data-budget-slider type="range" min="0" max="200" step="5" value="100"' in app
assert "Math.round(activeBudget.items[index].amount * percentage / 100)" in app
assert "budgetDistrict" not in app and "budgetProgramLink" not in app
assert "budget-category-info" in app and "Što ulazi u ovu stavku?" in app
assert "input.dataset.amount = String(amount)" in app
assert "DUEL_STORE = 'potez-budget-duel-v2'" in Path("assets/civic.js").read_text(encoding="utf-8")
civic = Path("assets/civic.js").read_text(encoding="utf-8")
assert "budgetDistrict" not in civic and "stvarne planirane iznose" not in civic
assert "Number(input.dataset.amount || 0)" in civic
assert "budgetContext = () => $('#budgetCity')?.value || '';" in civic
assert "data-budget-name for=" in app
assert 'class="budget-category-label"' in app
assert ".budget-total .big { white-space: nowrap" in css
assert "@media (max-width:360px)" in css
assert "potez-pilot-v35" in sw

assert "Proračunski izazov koristi službene gradske planove" not in html
assert "Ovo nije službeni gradski proračun." in html
app_quiz = Path("assets/app.js").read_text(encoding="utf-8")
assert 'quizQuestion' not in app_quiz and 'quizChoices' not in app_quiz
assert 'id="participationTitle"' in html
assert 'id="passportCompleted">0/3' in html
assert "potez-pilot-v35" in sw
print("POTEZ educator pathway and route accessibility checks passed.")
PY


python - <<'PY'
from pathlib import Path

html = Path("index.html").read_text(encoding="utf-8")
css = Path("assets/styles.css").read_text(encoding="utf-8")
sw = Path("sw.js").read_text(encoding="utf-8")

assert 'class="hero"' in html and 'class="hero-copy"' in html
assert ".app-home .hero h1" in css
assert "text-wrap:balance" in css
assert "line-height:1.1" in css and "letter-spacing:-.042em" in css
assert ".app-home .hero .actions" in css
assert "grid-template-columns:1fr" in css
assert "potez-pilot-v35" in sw
print("POTEZ homepage typography, CTA spacing and cache checks passed.")
PY


python - <<'PY'
from pathlib import Path

html = Path("index.html").read_text(encoding="utf-8")
css = Path("assets/styles.css").read_text(encoding="utf-8")
sw = Path("sw.js").read_text(encoding="utf-8")
checks = (
    'id="komunalne-odluke"',
    "Što može mjesni odbor?",
    "Zbor građana",
    "10 % ukupnog broja birača",
    "tri mjeseca",
    "program održavanja komunalne infrastrukture",
    "Program građenja komunalne infrastrukture",
)
for token in checks:
    assert token in html, token
for token in ("--font-body", ".neighborhood-step", ".neighborhood-fact", "a.link-card:hover"):
    assert token in css, token
polish = Path("assets/polish.css").read_text(encoding="utf-8")
assert 'href="/assets/polish.css"' in html
assert 'class="accessibility-icon"' in html and "◐" not in html
assert '.nav a[aria-current="page"]' not in css
assert polish.count('.nav a[aria-current="page"]') == 1
for font in (
    "figtree-latin-wght-normal.woff2",
    "figtree-latin-ext-wght-normal.woff2",
    "bricolage-grotesque-latin-wght-normal.woff2",
    "bricolage-grotesque-latin-ext-wght-normal.woff2",
):
    assert Path("assets/fonts", font).is_file(), font
assert "potez-pilot-v35" in sw
assert "font-family: Inter," not in css
assert 'href="https://narodne-novine.nn.hr/clanci/sluzbeni/full/2020_12_144_2762.html"' in html
assert 'href="https://narodne-novine.nn.hr/clanci/sluzbeni/2018_07_68_1393.html"' in html
print("POTEZ neighborhood decision guide and card contrast checks passed.")
PY


python - <<'PY'
from pathlib import Path

html = Path("index.html").read_text(encoding="utf-8")
learning = Path("assets/learning.js").read_text(encoding="utf-8")
polish = Path("assets/polish.css").read_text(encoding="utf-8")
sw = Path("sw.js").read_text(encoding="utf-8")

for token in (
    'id="learningSearch"',
    'id="learningResultCount"',
    'id="learningReset"',
    'aria-label="Filtriranje tema prema području"',
    'class="view-intro learning-view-intro"',
):
    assert token in html, token

assert html.index('class="section learning-explorer"') < html.index('class="section learning-daily-section"')
for token in (
    "normalizeSearch",
    "INITIAL_VISIBLE_TOPICS = 6",
    "learning-filter-count",
    "Pročitaj objašnjenje",
    "Zanimljivost dana",
):
    assert token in learning, token

for token in (
    ".learning-search-field",
    ".learning-explorer-tools",
    ".learning-results-row",
    ".learning-topic-label",
    "html[data-theme=\"dark\"] .learning-search-field input",
):
    assert token in polish, token

assert "potez-pilot-v35" in sw
print("POTEZ learning discovery, search, result states and responsive styles passed.")
PY


python - <<'PY'
from pathlib import Path

html = Path("index.html").read_text(encoding="utf-8")
polish = Path("assets/polish.css").read_text(encoding="utf-8")
navigation = Path("assets/navigation.js").read_text(encoding="utf-8")
service_worker = Path("sw.js").read_text(encoding="utf-8")
terms = Path("uvjeti.html").read_text(encoding="utf-8")

for token in (
    'class="facilitator-resources"',
    'id="facilitatorResourcesTitle"',
    "ALGOWATCH",
    "AI Answers. You Decide.",
    "Google NotebookLM",
    "https://chatgpt.com/",
    'class="facilitator-partnership"',
    "Pročitaj okvir suradnje",
):
    assert token in html, token

for token in (
    "potez-pilot-v35",
):
    assert token in service_worker, token
assert "potez-pilot-v32" not in service_worker
assert ".mobile-menu{display:block;order:0;margin-left:0}" in polish
assert "body.menu-open .topline{z-index:1003}" in polish
assert "mobile-menuPanel" not in navigation
assert "mobileMenuPanel?.querySelector('.mobile-menu-close')?.focus()" in navigation
assert "window.innerWidth>1100" in navigation
assert "mogu besplatno koristiti javno dostupnu platformu POTEZ" in terms
assert "Ne daje automatsko pravo na kopiranje" in terms
print("POTEZ educator resource library, partnership permission and mobile drawer checks passed.")
PY


python - <<'PY'
from pathlib import Path
css = Path("assets/polish.css").read_text(encoding="utf-8")
html = Path("index.html").read_text(encoding="utf-8")
sw = Path("sw.js").read_text(encoding="utf-8")
assert "potez-pilot-v35" in sw and "potez-pilot-v33" not in sw
assert "grid-template-columns:minmax(0,1fr) auto auto" in css
assert ".mobile-menu{grid-column:3;grid-row:1" in css
assert ".brand{grid-column:1;grid-row:1" in css
assert "h1 .highlight::after{display:none!important}" in css
assert "text-decoration-color:var(--accent-mark)" in css
assert "html[data-theme=\"dark\"] .step span{color:#c4d0c7!important}" in css
assert 'class="mobile-menu"' in html and 'class="brand"' in html

def luminance(hex_color):
    values = [int(hex_color[i:i+2], 16) / 255 for i in (1, 3, 5)]
    linear = [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in values]
    return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2]

def contrast(foreground, background):
    light, dark = sorted((luminance(foreground), luminance(background)), reverse=True)
    return (light + .05) / (dark + .05)

for foreground, background in (
    ("#18231d", "#ffffff"), ("#526158", "#f7f6f1"),
    ("#f3f6f1", "#101613"), ("#c4d0c7", "#18221d"),
    ("#315f78", "#e5eef3"), ("#b8dce8", "#253b44"),
    ("#b8dce8", "#222e27"), ("#c4d0c7", "#222e27"),
    ("#14200f", "#d7f49d"), ("#101713", "#f3f6f1"),
):
    assert contrast(foreground, background) >= 4.5, (foreground, background, contrast(foreground, background))

print("POTEZ header placement, icon-only controls, theme tokens and WCAG AA contrast checks passed.")

PY


python - <<'PY'
from pathlib import Path

css = Path("assets/polish.css").read_text(encoding="utf-8")
sw = Path("sw.js").read_text(encoding="utf-8")
assert "potez-pilot-v35" in sw
assert "POTEZ design-system completion: semantic scorecard colors" in css
for token in (
    "--budget-surface:", "--budget-text:", "--budget-muted:",
    "--budget-positive-bg:", "--budget-negative-bg:",
    "--accessibility-panel-surface:", "--accessibility-panel-selected:", "--control-border:", "--accessibility-panel-border:",
    "Bricolage Grotesque", ".budget-total .btn-green",
    ".budget-total .reset", ".budget-result", "potez-result-in",
    "html[data-motion=\"reduce\"] .budget-result",
    "prefers-reduced-motion:reduce",
):
    assert token in css, token

def luminance(hex_color):
    values = [int(hex_color[i:i+2], 16) / 255 for i in (1, 3, 5)]
    linear = [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in values]
    return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2]

def contrast(foreground, background):
    light, dark = sorted((luminance(foreground), luminance(background)), reverse=True)
    return (light + .05) / (dark + .05)

# WCAG AA text pairs used by the permanent allocation summary and its result states.
text_pairs = (
    ("#18231d", "#edf4e8"), ("#46584a", "#edf4e8"),
    ("#365a1e", "#edf4e8"), ("#ffffff", "#315b3b"),
    ("#29372f", "#f7f9f4"), ("#274b29", "#deecd8"),
    ("#8b3128", "#f9e8e4"),
    ("#f3f6f1", "#1b2921"), ("#c4d0c7", "#1b2921"),
    ("#c0df98", "#1b2921"), ("#e2eae3", "#24332a"),
    ("#c0df98", "#263b2b"), ("#ffb6a8", "#402521"),
    ("#14200f", "#d7f49d"),
    ("#18231d", "#ffffff"), ("#526158", "#ffffff"),
    ("#18231d", "#f0f2ed"), ("#172c3a", "#e5eef3"),
    ("#f3f6f1", "#18221d"), ("#c4d0c7", "#18221d"),
    ("#f3f6f1", "#222e27"), ("#e2eae3", "#253b44"),
)
for foreground, background in text_pairs:
    ratio = contrast(foreground, background)
    assert ratio >= 4.5, f"Text contrast {ratio:.2f}:1 for {foreground} on {background}"

# Controls and boundaries that communicate component/state must remain distinguishable.
ui_pairs = (
    ("#768b78", "#edf4e8"), ("#768b78", "#f7f6f1"),
    ("#65766a", "#1b2921"), ("#65766a", "#101613"),
    ("#768b78", "#ffffff"), ("#768b78", "#f0f2ed"),
    ("#768b78", "#18221d"), ("#768b78", "#222e27"),
    ("#1558a6", "#edf4e8"), ("#a9d6ff", "#1b2921"),
)
for foreground, background in ui_pairs:
    ratio = contrast(foreground, background)
    assert ratio >= 3.0, f"UI/focus contrast {ratio:.2f}:1 for {foreground} on {background}"

print("POTEZ budget summary, result states, theme popover and WCAG AA contrast regression checks passed.")
PY


python - <<'PY'
from pathlib import Path
css = Path("assets/polish.css").read_text(encoding="utf-8")
for selector in (
    'html[data-theme="dark"] .budget-total{',
    'html[data-theme="dark"] .budget-total .budget-status{',
    'html[data-theme="dark"] .budget-total .btn-green{',
    'html[data-theme="dark"] .budget-result p{',
    'html[data-theme="dark"] .accessibility-panel{',
    'html[data-theme="dark"] .accessibility-panel *{',
):
    assert selector in css, selector
assert 'Bricolage Grotesque' in css and 'var(--font-display)' in css
assert 'html[data-motion="reduce"]{scroll-behavior:auto!important}' in css
assert '@media(prefers-reduced-motion:reduce)' in css
print("POTEZ explicit dark-theme cascade and reduced-motion safeguards passed.")
PY


python - <<'PY'
from pathlib import Path
css = Path("assets/polish.css").read_text(encoding="utf-8")
assert "--control-border:#768b78" in css
assert "--accessibility-panel-border:#768b78" in css
assert ':where(select,textarea,input:not([type="range"]):not([type="checkbox"]))' in css
assert ".btn-light{border-color:var(--control-border)!important}" in css
assert ".accessibility-panel .accessibility-actions button" in css
print("POTEZ control-boundary contrast tokens and selectors passed.")
PY


python - <<'PY'
from pathlib import Path
css = Path("assets/polish.css").read_text(encoding="utf-8")
assert 'html[data-contrast="high"]{' in css
assert 'html[data-theme="dark"][data-contrast="high"]{' in css
for token in (
    "--budget-surface:#ffffff", "--budget-text:#000000",
    "--budget-button:#000000", "--accessibility-panel-surface:#ffffff",
    "--control-border:#000000", "--budget-surface:#080808",
    "--budget-text:#ffffff", "--budget-button:#ffed00",
    "--accessibility-panel-surface:#080808", "--control-border:#ffffff",
):
    assert token in css, token

def luminance(hex_color):
    values = [int(hex_color[i:i+2], 16) / 255 for i in (1, 3, 5)]
    linear = [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in values]
    return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2]
def contrast(a, b):
    light, dark = sorted((luminance(a), luminance(b)), reverse=True)
    return (light + .05) / (dark + .05)

for pair in (
    ("#000000", "#ffffff"), ("#171717", "#ffffff"),
    ("#ffffff", "#000000"), ("#000000", "#ffed00"),
    ("#ffffff", "#080808"), ("#ffed00", "#080808"),
):
    assert contrast(*pair) >= 7, (pair, contrast(*pair))
print("POTEZ high-contrast budget and accessibility surfaces passed.")
PY
