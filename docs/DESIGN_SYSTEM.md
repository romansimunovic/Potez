# POTEZ — vizualni sustav

## Smjer

POTEZ koristi urednički, pristupačan i nenametljiv vizualni jezik. Sučelje treba djelovati suvremeno i jasno, ali ne kao komercijalna aplikacija ili administrativna nadzorna ploča. Boja podupire hijerarhiju i značenje; ne zamjenjuje tekstualne oznake ni objašnjenja.

## Tipografija

- **Figtree** je osnovni font za odlomke, oznake, obrasce i dulji tekst.
- **Bricolage Grotesque** koristi se za naslove i logotip.
- Oba fonta poslužuju se lokalno iz `assets/fonts/`; sučelje ne ovisi o vanjskom CDN-u.
- Brojčane vrijednosti i iznosi koriste tablične brojke (`font-variant-numeric: tabular-nums`) radi lakše usporedbe.

## Boje i semantičke uloge

Svijetla tema koristi toplu pozadinu (`--paper`), bijele površine (`--surface`), tamnu boju teksta (`--ink`) te prigušene zelene i plave naglaske. Tamna tema koristi tamnozelenu podlogu i nekoliko jasno odvojenih razina površina (`--surface`, `--surface-raised`, `--surface-inset`), uz svijetli tekst.

Komponente ne bi trebale izravno nasljeđivati boju teksta koja je namijenjena drugoj pozadini. Za svaku komponentu koja ima vlastitu površinu (npr. sažetak proračuna, skočni izbornik) potrebno je definirati uparene tokene za:
- pozadinu i rub;
- primarni i sekundarni tekst;
- naglašenu vrijednost ili poveznicu;
- pozitivno i negativno stanje;
- primarnu radnju i tekst na njoj.

Posebno je važno da se kartica proračuna ne tretira kao trajno tamna kartica: njezina se pozadina i tekst moraju mijenjati zajedno s aktivnom temom.

## Pristupačnost

- Cilj je WCAG 2.2 razina AA: najmanje 4,5:1 za uobičajeni tekst, 3:1 za veliki tekst i 3:1 za vizualne granice važnih kontrola i stanja.
- Fokus tipkovnice mora ostati jasno vidljiv; ne uklanjati `:focus-visible` obrub radi estetike.
- Informacija ne smije biti prenesena samo bojom. Stanja raspodjele imaju i tekstualnu poruku.
- Kontrole trebaju imati dovoljno veliku aktivnu površinu; važni gumbi i kontrole na mobitelu ciljaju najmanje 44 px visine.
- Visoki kontrast, povećanje teksta i smanjeno kretanje moraju ostati dostupni iz postavki pristupačnosti.

## Prijelazi i animacije

- Prijelazi su kratki i funkcionalni: boja, obrub, sjena ili mali pomak pri interakciji.
- Rezultat proračuna može se pojaviti blagim pomakom i prijelazom neprozirnosti; traka raspodjele prelazi na novu vrijednost bez trzaja.
- Nema automatskih beskonačnih animacija ni kretanja koje je nužno za razumijevanje sadržaja.
- `prefers-reduced-motion` i korisnička postavka smanjenih animacija imaju prednost nad svim prijelazima.

## Responzivnost

- Izbjegavati fiksne širine sadržaja i dopustiti prijelaz s višestupčanog rasporeda na jednu kolonu.
- Iznosi, naslovi i dugačke riječi moraju ostati unutar kartica i na najmanjim ciljanim širinama.
- Na užim zaslonima sažetak proračuna postaje dio normalnog toka sadržaja, bez ljepljivog položaja.
- Klizači, gumbi, padajući izbornici i sažeci ostaju upotrebljivi tipkovnicom i dodirom.

## Regresijske provjere

`scripts/check.sh` provjerava kontrast tekstualnih parova u svijetloj i tamnoj temi te kontrast obruba i fokusa važnih kontrola. Nove komponente s vlastitom površinom trebaju dodati svoje kombinacije boja u istu provjeru.
