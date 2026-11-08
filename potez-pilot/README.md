# POTEZ — mobilna pilot-platforma građanske pismenosti

**Radni opis:** politika prevedena na tvoj život. Kratki izazovi, provjerljive informacije i konkretni načini sudjelovanja.

POTEZ je statička, mobile-first web-aplikacija na hrvatskom jeziku. Nakon prvog online posjeta service worker sprema osnovne datoteke za offline otvaranje; slanje povratnih informacija zahtijeva vezu s internetom. Kviz, simulacija proračuna, vježba provjere informacija i vodič za konkretan potez rade u pregledniku. Napredak je lokalni `localStorage`; za te funkcije nije potrebna baza, račun ni backend.

Povratne informacije su zasebna, opcionalna funkcija. Za njih je pripremljen Cloudflare Pages Function koji provjerava Cloudflare Turnstile i zapisuje samo nužne podatke u Supabase tablicu s INSERT-only Row Level Security pravilima.

## Tehnologije i arhitektura

- **Frontend:** HTML, CSS i vanilla JavaScript; bez frameworka, build procesa ili npm ovisnosti.
- **Hosting/CDN:** Cloudflare Pages, povezano s GitHub repozitorijem.
- **Backend:** jedan Cloudflare Pages Function (`POST /api/feedback`), poziva se samo pri slanju obrasca.
- **Baza:** Supabase Postgres, samo privatna tablica za anonimne povratne informacije.
- **Bot zaštita:** Cloudflare Turnstile, provjera tokena na serveru.
- **PWA:** manifest, ikone i service worker s osnovnom offline podrškom.

### Zašto bez Rendera?

POTEZ nema stalni backend proces, aplikacijski server ni SSR. Cloudflare Pages služi statičke datoteke preko CDN-a, a funkcija za feedback pokreće se samo na zahtjev. Render bi dodao još jednu uslugu bez stvarne potrebe. Nemoj dodavati bazu za kvizove ili bodove: oni se ne trebaju sinkronizirati između uređaja u prvom pilotu.

## 1. Priprema GitHub repozitorija

1. Otvori GitHub i napravi novi **public** repozitorij, primjerice `potez` (bez README-a, `.gitignore` i licence jer su datoteke već u ovom paketu).
2. Preuzmi ZIP paketa i raspakiraj njegov sadržaj u mapu na računalu. Važno: `index.html`, `README.md`, `_headers` i `functions/` trebaju biti u korijenu repozitorija, ne u dodatnoj podmapi.
3. Otvori terminal u toj mapi i pokreni:

```bash
git init -b main
git add .
git commit -m "Initial POTEZ pilot"
git remote add origin https://github.com/TVRACUN/potez.git
git push -u origin main
```

Zamijeni `TVRACUN` svojim GitHub korisničkim imenom i prilagodi naziv repozitorija. Ako koristiš GitHub Desktop: **File → Add local repository → Publish repository**. Za otvoreni pilot odaberi public repozitorij; prije toga provjeri da u njemu nema ključeva, lozinki ili osobnih podataka.

### Ažuriranje weba poslije

Svaka sljedeća izmjena ide ovako:

```bash
git add .
git commit -m "Describe the change"
git push
```

Cloudflare Pages automatski izgradi i objavi novu verziju nakon pushanja na `main`.

### Isprobaj lokalno prije pushanja

U terminalu iz korijenske mape pokreni `python -m http.server 8000`, a zatim otvori `http://localhost:8000`. Ovo pokreće samo statički dio; Cloudflare funkcija i feedback obrazac rade tek nakon objave na Pagesu i konfiguracije tajni. Statičke provjere možeš pokrenuti naredbom `./scripts/check.sh`.

## 2. Objavljivanje preko Cloudflare Pages

1. Napravi Cloudflare račun na <https://dash.cloudflare.com/>.
2. Otvori **Workers & Pages → Create → Pages → Connect to Git**.
3. Spoji GitHub račun i odaberi `potez` repozitorij.
4. Postavi:
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** ostavi prazno (nema build procesa)
   - **Build output directory:** `.`
   - **Root directory:** prazno / korijen repozitorija
5. Klikni **Save and Deploy**.
6. Cloudflare će dodijeliti adresu oblika `https://NAZIV-PROJEKTA.pages.dev`. Otvori je na iPhoneu i Androidu te provjeri sve sekcije.
7. Na Androidu se web-aplikacija može dodati preko Chrome izbornika **Install app / Add to Home screen**. Na iPhoneu u Safariju odaberi **Share → Add to Home Screen**. Instalacija je opcionalna; web radi i u običnom pregledniku.

`functions/` mapa i `_routes.json` moraju biti u korijenu repozitorija / output direktorija. Cloudflare Pages prepoznaje `/api/feedback` funkciju, a `_routes.json` ograničava njezino pokretanje na `/api/*`. Tako obični prikazi stranica, CSS, JavaScript, ikone i slike ne troše Workers/Functions zahtjeve. Nemoj postaviti `functions/` ili `_routes.json` unutar neke podmape.

### Domena

Za pilot je sasvim dovoljno `*.pages.dev`. Vlastitu domenu dodaj tek kad potvrdiš naziv. U Cloudflare Pages projektu otvori **Custom domains → Set up a custom domain** i slijedi DNS korake. Nakon dodavanja domene, postavi `APP_ORIGIN` na točan origin, npr. `https://potez.hr` (bez završne kose crte), a Turnstile widget dopusti i za tu domenu.

## 3. Baza za povratne informacije (opcionalno, ali korisno za pilot)

Ako želiš primati povratne informacije iz obrasca, koristi Supabase. Ako još ne želiš prikupljati poruke, preskoči ovaj korak — stranica i sve igre rade i bez baze.

1. Napravi projekt na <https://supabase.com/>.
2. Otvori **SQL Editor → New query**.
3. Kopiraj i izvrši sadržaj datoteke `supabase/migrations/202611080001_feedback.sql`.
4. U postavkama projekta pronađi **Project URL** i **Publishable key** (ili legacy `anon` key ako je to ono što ti prikazuje postojeći projekt). Nemoj koristiti `service_role` / secret key.
5. U Cloudflare Pages projektu otvori **Settings → Variables and Secrets** i dodaj sljedeće vrijednosti za **Production** (i Preview samo ako želiš testirati feedback na preview adresi):

| Varijabla | Vrijednost |
|---|---|
| `SUPABASE_URL` | Supabase Project URL |
| `SUPABASE_API_KEY` | Supabase Publishable key ili legacy anon key |
| `TURNSTILE_SECRET_KEY` | Turnstile Secret key |
| `APP_ORIGIN` | Puna adresa produkcijske web-stranice, bez završne `/` |

Pohrani ključeve isključivo u Cloudflare Secrets/Variables. `SUPABASE_API_KEY` ovdje služi kao javni publishable/anon ključ uz stroga RLS pravila; **nikad ne koristi service-role ključ**. Funkcija koristi samo `apikey` header i anonimnu baznu ulogu.

### Što RLS dopušta?

- `anon` smije samo `INSERT` u tablicu `feedback`.
- Nema javnog `SELECT`, `UPDATE` ili `DELETE` pristupa.
- Tablica ne sadrži ime, e-mail, dob, lokaciju ili politički profil.
- Poruke nisu javno prikazane na web-stranici.

Ako želiš pregledati poruke, koristi Supabase Dashboard s administratorskim pristupom. Ne dodaj javni endpoint za čitanje povratnih informacija.

## 4. Zaštita feedback obrasca (Cloudflare Turnstile)

1. Otvori <https://dash.cloudflare.com/?to=/:account/turnstile> ili u Cloudflare nadzornoj ploči potraži **Turnstile**.
2. Dodaj widget za domenu `NAZIV-PROJEKTA.pages.dev`; kasnije dodaj i vlastitu domenu.
3. Za pilot odaberi managed challenge.
4. Kopiraj **Site key** i **Secret key**.
5. Site key je javna vrijednost. Otvori `assets/config.js` i zamijeni prazan string:

```js
window.POTEZ_CONFIG = {
  turnstileSiteKey: "OVDJE_IDE_SITE_KEY",
  privacyNoticeReady: true
};
```

6. `TURNSTILE_SECRET_KEY` postavi kao Cloudflare Secret iz prethodnog koraka. Secret nikad ne stavljaj u GitHub.
7. Prije aktivacije obrasca popuni identitet i e-mail voditelja obrade u `privacy.html`, odredi konkretan rok čuvanja i potvrdi pravnu osnovu. Tek tada postavi `privacyNoticeReady: true` u `assets/config.js`.
8. Commitaj `assets/config.js` i `privacy.html`, pa pushaj na `main`. Stranica će se automatski objaviti, a feedback forma će se aktivirati kad su i Supabase i Turnstile server-side varijable postavljene.

### Dodatna zaštita od spama

U Cloudflare pravilima zaštite postavi rate limit za `POST /api/feedback` (npr. nekoliko zahtjeva u nekoliko minuta po IP adresi) ako je ta mogućnost dostupna na odabranom planu. Turnstile i honeypot već su uključeni, ali ne zamjenjuju nadzor prometa. Funkcija namjerno ne sprema IP adresu.

## 5. Prije javnog pilotiranja — obavezna kontrolna lista

- [ ] Popuniti voditelja obrade i kontakt u `privacy.html`.
- [ ] Odrediti i zapisati konkretan rok čuvanja feedback poruka te način njihova brisanja.
- [ ] Provjeriti pravnu osnovu i obavijest o privatnosti za dobrovoljne povratne informacije, uključujući maloljetne korisnike.
- [ ] Provjeriti sve vanjske poveznice i aktualnost izvora.
- [ ] Ponovno provjeriti metodološku napomenu uz statistiku iz IDIZ-ova izvještaja iz 2026. i zadržati točno ograničenje uzorka u svakom prikazu.
- [ ] Testirati mobile layout na iPhone Safari i Android Chrome; provjeriti kontrast, fokus tipkovnice i čitač zaslona.
- [ ] Testirati slanje feedbacka s valjanom/nevaljanom Turnstile potvrdom i provjeriti da javni anon korisnik ne može čitati bazu.
- [ ] Dodati e-mail ili drugi kanal za kontakt i ispravke sadržaja prije većeg oglašavanja.
- [ ] Odabrati licencu za kod i sadržaj prije poziva drugima da doprinose.

## 6. Performanse i očekivani promet

Svi glavni ekrani su statički i ne šalju zahtjeve prema bazi. Posjetitelj koji igra kviz ili pomiče proračunske klizače ne troši Supabase API pozive. Samo slanje feedbacka ide na `/api/feedback`.

Cloudflareova dokumentacija navodi da su zahtjevi za statičke datoteke Pagesa besplatni i neograničeni. Pages Functions troše Workers zahtjeve; Free plan ima dnevni limit od 100.000 Workers zahtjeva. U ovom paketu `_routes.json` ograničava funkciju na `/api/*`, pa posjeti stranici ne ulaze u tu kvotu. Provjeri aktualna ograničenja prije javne kampanje: [Pages pricing](https://developers.cloudflare.com/pages/functions/pricing/) i [Pages platform limits](https://developers.cloudflare.com/pages/platform/limits/). Zato funkcije ne pozivamo za svaki prikaz stranice.

Supabase Free trenutačno uključuje 500 MB baze i 5 GB egressa; besplatni projekti mogu biti pauzirani nakon tjedan dana male aktivnosti. Provjeri [aktualni cjenik](https://supabase.com/pricing) i [pravila pauziranja](https://supabase.com/docs/guides/platform/going-into-prod#free-plan-pausing) prije uključivanja feedback obrasca. To je u redu za testni pilot, ali nije jamstvo rada bez prekida. Ako platforma postane važna korisnicima ili treba stabilniji rad, prijeđi na plaćeni plan i konfiguriraj backup/retenciju.

**Nemoj unaprijed obećati da sustav podnosi bilo kakav promet.** Prati Cloudflare Analytics, Worker usage i Supabase potrošnju. Ako broj posjeta naglo naraste, statički dio je namjerno odvojen od feedback endpointa kako bi glavni sadržaj ostao dostupan.

## 7. Struktura projekta

```text
potez-pilot/
├── index.html
├── privacy.html
├── manifest.webmanifest
├── sw.js
├── favicon.svg
├── og-image.png
├── robots.txt
├── _headers
├── _routes.json
├── assets/
│   ├── app.js
│   ├── config.js
│   └── styles.css
├── icons/
│   ├── apple-touch-icon.png
│   ├── potez-192.png
│   ├── potez-512.png
│   └── potez-maskable-512.png
├── functions/
│   └── api/feedback.js
└── supabase/
    └── migrations/202611080001_feedback.sql
```

## 8. Izvori i načela sadržaja

Detaljnija urednička pravila nalaze se u `docs/CONTENT_PRINCIPLES.md`.

POTEZ nije fact-checker i ne zamjenjuje novinarstvo, pravni savjet ili rad organizacija koje se bave građanskim pravima. Uz svaku brojku treba navesti izvor, godinu, uzorak, metodologiju i ograničenja. Razlikuj „nije potvrđeno” od „netočno”, navod od optužnice i optužnicu od pravomoćne presude.

Vanjski alati navedeni u pilotu: [Parlametar](https://parlametar.hr/), [ImamoPravoZnati](https://imamopravoznati.org/), [Popravi.to](https://popravi.to/), [e-Savjetovanja](https://savjetovanja.gov.hr/), [Točno tako](https://tocnotako.hr/), [Faktograf](https://faktograf.hr/), [Otvoreni podaci RH](https://data.gov.hr/) i [Mreža mladih Hrvatske](https://www.mmh.hr/).

## 9. Napomene o statusu

Ovo je početni javni pilot, ne konačna produkcijska platforma. Feedback API i baza su pripremljeni, ali se ne aktiviraju dok vlasnik ne unese Turnstile site key, postavi tajne varijable u Cloudflareu, pokrene SQL migraciju i popuni obavijest o privatnosti.
