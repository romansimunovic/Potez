# POTEZ

**Politika prevedena na tvoj život.**

POTEZ je besplatna, mobilna pilot-platforma građanske pismenosti. Pomaže mladima razumjeti tko donosi javne odluke, kako provjeravati informacije i što mogu napraviti kada žele promijeniti nešto u svojoj školi, kvartu ili zajednici.

Projekt je zamišljen kao jednostavna ulazna točka u građansko sudjelovanje — bez registracije, prijave, političkog profiliranja, javnih ljestvica i nepotrebnog prikupljanja podataka.

**Autor, urednik i voditelj projekta:** Roman Šimunović  
**Javna pilot-verzija:** https://potez.pages.dev/  
**Repozitorij:** https://github.com/romansimunovic/Potez

---

## Što POTEZ omogućuje?

Aplikacija je organizirana u pet odredišta:

- **Početna** — kratko objašnjenje projekta i put prema prvom izazovu.
- **Uči** — tematske kartice prema interesu, zanimljivost dana s izvorom, kvizovi, provjera tvrdnji i mapa institucija i nadležnosti.
- **Igraj** — lokalna građanska putovnica, XP razine, značke, dnevne i tjedne misije te simulacija javnog proračuna.
- **Djeluj** — praktični vodič od problema do prvog koraka.
- **Alati** — poveznice na javne resurse, primjeri dobre prakse, gotov okvir radionice za škole i udruge te informacije o pilotu.

Sadržaj je namijenjen prvenstveno mladima, ali ga mogu koristiti svi koji žele razumljivije pratiti javne odluke i građansko sudjelovanje.

## Autorstvo i transparentnost uporabe AI-ja

Koncept, urednički smjer, odabir tema, odluke o funkcionalnostima i konačna objava projekta pripadaju **Romanu Šimunoviću**.

**OpenAI ChatGPT korišten je kao pomoćni alat** tijekom strukturiranja projekta i dokumentacije, razrade korisničkog iskustva, organiziranja sadržaja, pisanja i dorade dijelova koda, prijedloga pristupačnosti i responzivnosti, savjetovanja o tehničkoj arhitekturi, debugiranja te pripreme i provjere testova.

ChatGPT nije autor koji samostalno upravlja projektom niti se koristi kao dio aplikacije u radu s posjetiteljima. Konačne odluke, provjera sadržaja, testiranje, uređivanje i odgovornost za objavljenu verziju ostaju na autoru projekta. U aplikaciji se ne poziva OpenAI API, nema AI chatbota i ne šalju se korisnički podaci modelu.

Uporaba AI-ja navodi se radi transparentnosti o načinu nastanka projekta, a ne kao zamjena za autorstvo i odgovornost.

## Tehnologije i platforme

| Područje | Tehnologija / platforma | Uloga |
|---|---|---|
| Struktura | HTML5 | Semantička struktura stranica |
| Dizajn | CSS3 | Responzivni prikaz, animacije, tamni način rada, visoki kontrast i skaliranje teksta |
| Logika | JavaScript (vanilla) | Kvizovi, XP, misije, simulacije, navigacija i lokalne postavke pristupačnosti |
| Zvuk | Web Audio API | Kratki lokalni zvuk nagrade, bez audio datoteka |
| Dijeljenje | Web Share API / Clipboard API | Dijeljenje napretka na izričit zahtjev korisnika |
| Lokalna pohrana | localStorage / Cache Storage | Napredak, postavke zvuka i statičke datoteke na uređaju |
| PWA | Web App Manifest / Service Worker | Instalacija i osnovna podrška izvan mreže |
| Hosting | Cloudflare Pages | Objavljivanje statičke aplikacije |
| Izvorni kod | GitHub | Repozitorij, grane i pull requestovi |
| Automatizirane provjere | GitHub Actions | Statičke i sigurnosne provjere pri promjenama |
| Razvojna podrška | OpenAI ChatGPT | Pomoć pri planiranju, kodu, debugiranju i dokumentaciji |

Projekt koristi HTML, CSS i JavaScript bez velikog frontend frameworka. Osnovne edukativne funkcije ne zahtijevaju bazu podataka ni korisnički račun.

### Namjerno bez backenda

U javnoj beta-verziji ne postoje Cloudflare Pages Functions, API endpointi, Supabase baza ni obrazac za slanje poruka. Iz repozitorija su uklonjeni i pripremljeni server-side kod i migracija baze kako ne bi ostao neaktivan put za prikupljanje podataka.

Za opće prijedloge i prijavu tehničkih grešaka postoji javni GitHub Issues. To je vanjska platforma; ondje ne treba objavljivati osobne ni povjerljive podatke.

## Privatnost i obrada podataka

POTEZ nema registraciju, prijavu, račune, korisničke profile ni političko profiliranje.

Podaci o XP-u, dovršenim izazovima, dnevnoj/tjednoj misiji i budžetskoj usporedbi pohranjuju se lokalno u pregledniku. Postavka zvuka sprema se lokalno. Autor projekta ne prima te vrijednosti niti ih može vidjeti na daljinu.

Aplikacija ne koristi vlastitu analitiku, oglašivačke kolačiće ni piksele za praćenje. Service Worker sprema statičke datoteke radi učitavanja i osnovne podrške izvan mreže.

Stranica se poslužuje putem Cloudflare Pages. Pružatelj hostinga može obrađivati tehničke podatke mrežnih zahtjeva radi isporuke i zaštite usluge, u skladu sa svojim pravilima. Detalji su u [obavijesti o privatnosti](privacy.html).

**Dokumentacija:**
- [Obavijest o privatnosti](/privacy.html)
- [Uvjeti korištenja](/uvjeti.html)

## Dijeljenje i gamifikacija

XP i značke nagrađuju dovršetak edukativnih zadataka, a ne političke stavove ili stvarni društveni utjecaj. Dnevna misija koristi kratke situacijske scenarije o javnim odlukama, integritetu, informacijama i poštenom sudjelovanju. Proračunski izazov je simulacija lokalnog odlučivanja: korisnik preuzima ulogu gradonačelnika/ce, odabire grad, mijenja prioritete i mora ostati unutar ograničenog fonda. Svaka kategorija ima kratko objašnjenje koje se otvara na zahtjev. Iznosi su modelirani za igru, a ne preuzeti kao službeni gradski proračuni.

Kratki zvuk nagrade generira se u pregledniku nakon korisničke radnje. Ne učitava se audio datoteka. Zvuk se može isključiti prekidačem; postavka ostaje lokalna.

Dijeljenje napretka pokreće se samo kada korisnik pritisne gumb. Koristi se izvorni sustav dijeljenja uređaja ili kopiranje teksta; POTEZ ne dobiva podatke o primatelju.

## Simulacija lokalnog proračuna

Proračunski izazov je edukativna simulacija, ne službeni gradski proračun niti prognoza potrošnje. Model obuhvaća 42 grada, koristi Popis 2021. i jasno označava vlastite troškovne pretpostavke. Potpuna demografska osnova, formula, raspodjela, izvori i ograničenja nalaze se u [metodologiji simulacije lokalnog proračuna](docs/BUDGET_MODEL_2026.md).

## Uređivačka i partnerska dokumentacija\n\n- [Izvori za tematske kartice i dnevne zanimljivosti](docs/LEARNING_SOURCES_2026.md)\n- [Potencijalni partneri i prijedlog pilotiranja](docs/POTENTIAL_PARTNERS_AND_PILOT.md)\n- [Urednička načela POTEZA](docs/CONTENT_PRINCIPLES.md)\n\n## Lokalni razvoj i provjere

Za brzi lokalni prikaz statičke aplikacije:

~~~bash
python -m http.server 8000
~~~

Zatim otvori http://localhost:8000.

Za provjeru koda i granica privatnosti:

~~~bash
bash scripts/check.sh
~~~

Provjere obuhvaćaju sintaksu JavaScripta, validaciju HTML-a i internih poveznica, manifest te potvrdu da javni pilot nema server-side funkcije, bazu ni obrazac za prikupljanje poruka.

## Objavljivanje na Cloudflare Pages

Postavke projekta:

- Produkcijska grana: main
- Framework preset: None
- Build command: prazan
- Build output directory: . (repository root)
- Root directory: repository root

Cloudflare Pages objavljuje statičke datoteke iz repozitorija. GitHub Actions pokreće provjere pri pull requestovima i promjenama na main.

## Sigurnosna i privatnosna načela

- Ne dodavati registraciju ili prijavu bez jasne potrebe.
- Ne dodavati političke profile, lokacijsko praćenje, javne ljestvice ni identifikatore korisnika.
- Ne prikazivati izmišljene rezultate kao stvarne podatke o mladima ili posjetiteljima.
- Ne dodavati analitiku ili kolačiće za praćenje bez procjene svrhe, pravne osnove, minimizacije i odgovarajuće obavijesti.
- Nikada ne stavljati tajne ključeve u javni frontend ili GitHub repozitorij.
- Ako se u budućnosti uvede bilo kakvo slanje podataka ili backend, to je nova funkcionalnost koja zahtijeva zasebnu procjenu svrhe, pravne osnove, minimizacije, sigurnosti, primatelja i rokova čuvanja te ažuriranje obavijesti o privatnosti prije aktivacije.

## Sadržaj i ograničenja

POTEZ je edukativni alat, ne službeni kanal javne institucije i ne pruža pravni ili drugi stručni savjet. Proračunski izazov koristi simulirane iznose radi učenja o javnim prioritetima; nije službeni proračun, prognoza rashoda ni preporuka kako bi grad trebao trošiti novac. Demografska i metodološka osnova opisana je u odjeljku „Model simulacije lokalnog proračuna”.

Vanjske poveznice vode prema organizacijama i servisima koji imaju vlastita pravila privatnosti i uvjete.

## Autorska prava

Koncept, urednička struktura, tekstovi i vizualni identitet projekta pripisuju se Romanu Šimunoviću, osim kada je uz sadržaj naveden drugi autor ili izvor. Repozitorij trenutačno nema zasebnu datoteku otvorene softverske licencije; javna dostupnost koda na GitHubu sama po sebi ne daje opće dopuštenje za daljnju distribuciju ili komercijalnu uporabu.

---

*POTEZ — politika prevedena na tvoj život.*  
*Autor projekta: Roman Šimunović.*
