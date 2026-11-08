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
- **Uči** — kvizovi, provjera tvrdnji i mapa institucija i nadležnosti.
- **Igraj** — građanska putovnica, XP, značke, dnevne situacijske misije, tjedne misije i simulacija javnog proračuna.
- **Djeluj** — praktični vodič od problema do prvog koraka.
- **Alati** — poveznice na javne resurse, primjeri dobre prakse i informacije o pilotu.

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
| Dizajn | CSS3 | Responzivni prikaz, animacije i pristupačnost |
| Logika | JavaScript (vanilla) | Kvizovi, XP, misije, simulacije i navigacija |
| Zvuk | Web Audio API | Kratki lokalni zvuk nagrade, bez audio datoteka |
| Dijeljenje | Web Share API / Clipboard API | Dijeljenje napretka na izričit zahtjev korisnika |
| Lokalna pohrana | localStorage / Cache Storage | Napredak, postavke zvuka i statičke datoteke na uređaju |
| PWA | Web App Manifest / Service Worker | Instalacija i osnovna podrška izvan mreže |
| Hosting | Cloudflare Pages | Objavljivanje statičke aplikacije |
| Izvorni kod | GitHub | Repozitorij, grane i pull requestovi |
| Automatizirane provjere | GitHub Actions | Statičke i sigurnosne provjere pri promjenama |
| Razvojna podrška | OpenAI ChatGPT | Pomoć pri planiranju, kodu, debugiranju i dokumentaciji |

Projekt koristi HTML, CSS i JavaScript bez velikog frontend frameworka. Osnovne edukativne funkcije ne zahtijevaju bazu podataka ni korisnički račun.

### Opcionalne tehnologije koje trenutačno nisu aktivne

U repozitoriju postoji pripremljena Cloudflare Pages Function za povratne informacije, uz integraciju Cloudflare Turnstile i Supabase Postgresa. **U javnoj pilot-verziji obrazac je uklonjen, a ruta /api/* nije uključena u Cloudflare Pages Functions.** Nema aktivnog slanja ni pohrane poruka korisnika.

Povratne informacije o sadržaju trenutačno se mogu predložiti kroz javni GitHub Issues. Tamo ne treba objavljivati osobne podatke.

## Privatnost i obrada podataka

POTEZ nema registraciju, prijavu, račune, korisničke profile ni političko profiliranje.

Podaci o XP-u, dovršenim izazovima, dnevnoj/tjednoj misiji i budžetskoj usporedbi pohranjuju se lokalno u pregledniku. Postavka zvuka sprema se lokalno. Autor projekta ne prima te vrijednosti niti ih može vidjeti na daljinu.

Aplikacija ne koristi vlastitu analitiku, oglašivačke kolačiće ni piksele za praćenje. Service Worker sprema statičke datoteke radi učitavanja i osnovne podrške izvan mreže.

Stranica se poslužuje putem Cloudflare Pages. Pružatelj hostinga može obrađivati tehničke podatke mrežnih zahtjeva radi isporuke i zaštite usluge, u skladu sa svojim pravilima. Detalji su u [obavijesti o privatnosti](privacy.html).

**Dokumentacija:**
- [Obavijest o privatnosti](/privacy)
- [Uvjeti korištenja](/uvjeti)

## Dijeljenje i gamifikacija

XP i značke nagrađuju dovršetak edukativnih zadataka, a ne političke stavove ili stvarni društveni utjecaj. Nema javnih ljestvica, održavanja nizova ni kazne za propušten dan. Dnevna misija koristi kratke situacijske scenarije o javnim odlukama, integritetu, informacijama i poštenom sudjelovanju. Svaki izbor dobiva posljedicu i objašnjenje; bodovi nagrađuju pokušaj, a ne slaganje s političkim stajalištem.

Kratki zvuk nagrade generira se u pregledniku nakon korisničke radnje. Ne učitava se audio datoteka. Zvuk se može isključiti prekidačem; postavka ostaje lokalna.

Dijeljenje napretka pokreće se samo kada korisnik pritisne gumb. Koristi se izvorni sustav dijeljenja uređaja ili kopiranje teksta; POTEZ ne dobiva podatke o primatelju.

## Lokalni razvoj i provjere

Za brzi lokalni prikaz statičke aplikacije:

~~~bash
python -m http.server 8000
~~~

Zatim otvori http://localhost:8000.

Za provjeru koda i API sigurnosnih regresija:

~~~bash
bash scripts/check.sh
~~~

Provjere obuhvaćaju sintaksu JavaScripta, validaciju HTML-a i internih poveznica, JSON konfiguraciju te testove pripremljenog feedback endpointa.

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
- Ako se feedback endpoint ikad aktivira, prije toga treba ponovno otvoriti /api/* rutu, dovršiti procjenu obrade, jasno navesti kontakt voditelja obrade, svrhu, pravnu osnovu, primatelje i rok čuvanja, ažurirati privatnost i uvjete te provjeriti stvarno ponašanje u produkciji.

## Sadržaj i ograničenja

POTEZ je edukativni alat, ne službeni kanal javne institucije i ne pruža pravni ili drugi stručni savjet. Proračunska igra koristi izmišljene iznose. Podaci i nadležnosti mogu se promijeniti; korisnike se potiče da otvore izvorne dokumente i provjere aktualne informacije.

Vanjske poveznice vode prema organizacijama i servisima koji imaju vlastita pravila privatnosti i uvjete.

## Autorska prava

Koncept, urednička struktura, tekstovi i vizualni identitet projekta pripisuju se Romanu Šimunoviću, osim kada je uz sadržaj naveden drugi autor ili izvor. Repozitorij trenutačno nema zasebnu datoteku otvorene softverske licencije; javna dostupnost koda na GitHubu sama po sebi ne daje opće dopuštenje za daljnju distribuciju ili komercijalnu uporabu.

---

*POTEZ — politika prevedena na tvoj život.*  
*Autor projekta: Roman Šimunović.*
