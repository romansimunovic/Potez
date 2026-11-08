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
assert 'class="tool-disclosure"' in html and 'tool-workshop-list' in html
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
assert "localStorage" in js and "prefers-color-scheme: dark" in js
assert "'/assets/accessibility.js'" in sw and "potez-pilot-v23" in sw and "'/assets/budget-data.js'" in sw

app_reset = Path("assets/app.js").read_text(encoding="utf-8")
assert "localStorage.removeItem('potez-budget-duel-v1')" in app_reset
assert "localStorage.removeItem('potez-budget-duel-v2')" in app_reset
assert not Path(".env.example").exists()
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
assert 'class="budget-method"' in html
assert 'id="budgetPopulationMeta"' in html
assert "budgetPopulationMeta" in Path("assets/app.js").read_text(encoding="utf-8")
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
assert "potez-pilot-v23" in sw

assert "Proračunski izazov koristi službene gradske planove" not in html
assert "Ovo nije službeni gradski proračun." in html
app_quiz = Path("assets/app.js").read_text(encoding="utf-8")
assert "quizOptions=q.a.map((text,index)=>({text,correct:index===q.correct}))" in app_quiz
assert "Math.random()" in app_quiz
assert "quizOptions[j]?.correct" in app_quiz
assert 'id="dailyTitle"' in html
assert "Devet situacija iz svakodnevnog života" in html
assert "oko 1 minute" not in html

headers = Path("_headers").read_text(encoding="utf-8")
assert "https://challenges.cloudflare.com" not in headers
assert "script-src 'self';" in headers and "frame-src 'none';" in headers
assert "budgetCityImage" not in html and "budgetImageCredit" not in html
assert "budgetCityImage" not in app
assert "Zanimljiv pokušaj — evo što se događa." not in Path("assets/civic.js").read_text(encoding="utf-8")
assert "razlika manja od 5% ili 5.000 €" in Path("assets/civic.js").read_text(encoding="utf-8")
print("POTEZ final desktop, local budget, dark-mode and navigation checks passed")
PY

node - <<'NODE'
global.window = global;
require('./assets/learning-data.js');
const content = window.POTEZ_LEARNING_CONTENT;
if (!content || !Array.isArray(content.topics) || !Array.isArray(content.facts)) {
  throw new Error('Learning content registry is missing');
}
if (content.topics.length !== 12) throw new Error('Expected 12 curated learning topics');
if (content.facts.length !== 14) throw new Error('Expected 14 sourced daily facts');
const ids = content.topics.map(item => item.id);
if (new Set(ids).size !== ids.length) throw new Error('Learning topic IDs must be unique');
const categories = new Set(['svakodnevica', 'digitalno', 'sudjelovanje', 'odgovornost']);
for (const topic of content.topics) {
  if (!categories.has(topic.category)) throw new Error(topic.id + ': invalid learning category');
  for (const key of ['title','intro','question','insight','action','sourceTitle','sourceUrl','sourceNote']) {
    if (!topic[key]) throw new Error(topic.id + ': missing ' + key);
  }
  if (!topic.sourceUrl.startsWith('https://')) throw new Error(topic.id + ': source must use HTTPS');
}
for (const [index, fact] of content.facts.entries()) {
  if (!fact.title || !fact.text || !fact.note || !fact.source || !fact.url) {
    throw new Error('Daily fact ' + index + ': incomplete source or claim');
  }
  if (!fact.url.startsWith('https://')) throw new Error('Daily fact ' + index + ': source must use HTTPS');
}
console.log('Verified 12 learning topics, 14 daily facts, unique IDs and HTTPS sources.');
NODE

python - <<'PY'
from pathlib import Path
from xml.etree import ElementTree as ET

html = Path("index.html").read_text(encoding="utf-8")
css = Path("assets/styles.css").read_text(encoding="utf-8")
learning = Path("assets/learning.js").read_text(encoding="utf-8")
data = Path("assets/learning-data.js").read_text(encoding="utf-8")
app = Path("assets/app.js").read_text(encoding="utf-8")
civic = Path("assets/civic.js").read_text(encoding="utf-8")
navigation = Path("assets/navigation.js").read_text(encoding="utf-8")
sw = Path("sw.js").read_text(encoding="utf-8")
privacy = Path("privacy.html").read_text(encoding="utf-8")
robots = Path("robots.txt").read_text(encoding="utf-8")
readme = Path("README.md").read_text(encoding="utf-8")

for token in ('id="dailyFact"', 'id="learningFilters"', 'id="learningTopics"',
              'id="learningShowMore"', 'id="passportTopics"',
              '<details class="learning-guides" id="teme">',
              '<details class="learning-stat-details">'):
    assert token in html, token

for token in ('name="description"', 'name="keywords"', 'name="author"',
              'rel="canonical"', 'property="og:url"',
              'https://potez.pages.dev/og-image.png'):
    assert token in html, token
assert 'content="12' not in html or '12 tema' in html
assert 'potez-pilot-v23' in sw
assert "'/assets/learning-data.js'" in sw and "'/assets/learning.js'" in sw
assert "awardLesson" in app and "claimDailyFact" in app
assert "saved.dailyFactStamp===stamp" in app
assert "potez:reset" in app and "potez:reset" in civic
assert "lesson-" in civic and "passportTopics" in civic
assert "ancestor.tagName==='DETAILS'" in navigation
assert ".innerHTML" not in learning
assert "syncTopicProgress" in learning and "syncDailyFactProgress" in learning
assert "renderTopics();\n    renderDailyFact();" not in learning
assert "fetch(" not in learning and "fetch(" not in data
assert "localStorage" in learning and "POTEZ_PROGRESS" in learning
assert "kategorije u izborniku tema" in privacy
assert "zanimljivost dana" in privacy.lower()
assert "Sitemap: https://potez.pages.dev/sitemap.xml" in robots
for path in ('docs/AI_TRANSPARENCY.md', 'docs/CONTENT_PRINCIPLES.md', 'docs/LEARNING_SOURCES_2026.md', 'docs/BUDGET_MODEL_2026.md'):
    assert path in readme, path
    assert Path(path).is_file(), path
for private_path in ('docs/POTENTIAL_PARTNERS_AND_PILOT.md', 'docs/BUDGET_SOURCES_2026.md'):
    assert not Path(private_path).exists(), private_path

ET.parse("sitemap.xml")
mobile = Path("assets/navigation.js").read_text(encoding="utf-8")
for token in ('id="mobileMenu"', 'id="mobileMenuPanel"', 'mobileMenuClose', "event.key==='Escape'", "event.key==='Tab'"):
    if token not in html and token not in mobile:
        raise AssertionError(token)
assert 'role="dialog"' in html and 'aria-modal="true"' in html
assert "mobile-menu-close" in html and "mobile-menu-backdrop" in html
assert "mobile-menu-panel" in css and "mobile-menu-links" in css
assert "tool-disclosure" in css and "issue-guide-card" in css
assert 'U PRAKSI · INSTITUCIJE · INFORMACIJE' not in html
assert 'RESURSI · IZVORI · MATERIJALI' not in html
assert 'Kratko predstavljanje POTEZA' not in html
assert 'Bez registracije' not in html and 'registracija ni posebna oprema' not in html
assert 'class="section-kicker"' not in html and 'class="mini-tag"' not in html
assert 'class="view-meta"' not in html
assert 'tool-disclosure-meta' not in html and 'tool-disclosure-hint' not in html
assert 'learning-footnote' not in html and 'learningCount' not in html
assert 'dailyDate' not in html and 'dailyCaseLabel' not in html
assert 'PREGLED TEME' not in Path("assets/app.js").read_text(encoding="utf-8")
assert "<small" not in html
assert 'id="fontScaleValue"' in html and '<span id="fontScaleValue">100 %</span>' in html
assert 'aria-label="Glavni izbornik"' in html and 'mobileMenuTitle' not in html
for route in ('home', 'learn', 'play', 'act', 'tools'):
    assert html.count(f'data-app-route="{route}"') == 2, route
assert 'passport-badge-panel' not in html
for page in ("index.html", "privacy.html", "uvjeti.html"):
    page_html = Path(page).read_text(encoding="utf-8")
    assert "<small" not in page_html, page
    assert 'class="section-kicker"' not in page_html, page
    assert 'brand-sub' not in page_html, page
    assert "otvoreni pilot" not in page_html.lower(), page
assert "Bez računa" not in Path("privacy.html").read_text(encoding="utf-8")
assert "registracija" not in Path("uvjeti.html").read_text(encoding="utf-8").lower()
assert "body{padding-bottom:0!important}" in css
print("Verified learning UI, local-only progress, compact passport, SEO metadata, sitemap and source documentation.")
PY

printf 'POTEZ learning, privacy, SEO and documentation checks passed.\\n'
