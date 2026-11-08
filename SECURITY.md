# Sigurnosna politika

## Prijava sigurnosnog problema

Nemoj javno objavljivati sumnjive ranjivosti, pristupne podatke, osobne podatke ili podatke koji mogu identificirati maloljetnu osobu.

Ako je u repozitoriju uključena GitHubova mogućnost privatne prijave ranjivosti, upotrijebi je na kartici **Security**. U prijavi navedi zahvaćenu stranicu ili datoteku, mogući utjecaj, korake za ponavljanje i, ako je moguće, prijedlog ublažavanja problema.

Ako privatna prijava nije dostupna, prije javne objave obrati se vlasniku repozitorija privatnim kanalom preko [GitHub profila](https://github.com/romansimunovic). Omogući razumno vrijeme za provjeru i ispravak prije javnog otkrivanja tehničkih detalja.

## Opseg trenutačnog pilota

Produkcijski POTEZ u grani `main` statična je web-aplikacija koju poslužuje Cloudflare Pages. Repozitorij trenutačno **ne sadrži Pages Functions, aplikacijski API, Supabase konfiguraciju, bazu podataka ni migracije baze**.

Napredak, postavke prikaza i usporedba proračunskih izbora spremaju se lokalno u pregledniku korisnika. POTEZ nema korisničke račune, vlastitu analitiku ni profiliranje političkih stavova.

Obrasci za prijavu pogrešaka i prijedloge vode na GitHub Issues. Objave ondje mogu biti javne i podliježu pravilima GitHuba; nemoj slati osobne, povjerljive ili osjetljive podatke.

Cloudflare kao pružatelj hostinga može obrađivati tehničke podatke mrežnih zahtjeva radi isporuke i zaštite usluge. Više informacija nalazi se u [obavijesti o privatnosti](privacy.html).

## Buduće promjene

Ako se uvedu backend, API, baza podataka, analitika, obrazac koji šalje podatke ili druga nova obrada, prije objave potrebno je ponovno procijeniti sigurnosni model, svrhu i pravnu osnovu obrade, minimizaciju, primatelje, rokove čuvanja i obavijest o privatnosti. Tajne ključeve nikada ne stavljati u javni frontend ni u repozitorij.
