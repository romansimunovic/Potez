# POTEZ — metodologija simulacije lokalnog proračuna

## Model simulacije lokalnog proračuna

Proračunski izazov nije prikaz službenih proračuna niti prognoza stvarne potrošnje. To je **edukativni model** koji pokazuje kako ograničen javni novac prisiljava donositelje odluka na prioritete i kompromise. Sučelje zato ne opterećuje korisnika pravnim nazivima klasifikacija i statusima rebalansa; kratko objašnjenje svake stavke otvara se klikom na „Što ulazi u ovu stavku?”.

### Demografska osnova

Model obuhvaća 42 grada. Broj stanovnika uzet je iz Popisa 2021. na razini jedinice lokalne samouprave (administrativno područje grada), a ne samo središnjeg naselja. Demografski signal za usluge djece i obrazovanja jest zajednički broj djece predškolske dobi i učenika I.–IV. razreda osnovne škole iz tablice Ministarstva demografije i useljeništva. To **nije** ukupan broj mladih od 15 do 29 godina; koristi se samo kao raspoloživ pokazatelj pritiska na vrtiće, škole i obiteljske usluge.

Za usporediv broj stanovnika i djece po gradovima koristi se Popis 2021. Novije DZS-ove procjene za 2025. u navedenom izvoru objavljene su na razini županija, a ne kao nova jednaka dobna tablica za sve gradove.

Izvori:
- [DZS — Popis stanovništva 2021.](https://podaci.dzs.hr/hr/podaci/stanovnistvo/popis-stanovnistva/)
- [Ministarstvo demografije i useljeništva — stanovništvo i djeca po jedinicama lokalne samouprave, Popis 2021. (PDF)](https://mdu.gov.hr/UserDocsImages//Direktorij%202/Slike%20od%2013.2024/Dokumenti//Popis%20jedinica%20lokalne%20samouprave.pdf)
- [DZS — procjena stanovništva 2025. po županijama](https://podaci.dzs.hr/2026/en/121478)

### Kako se računa simulirani fond

Za svaki grad model koristi istu osnovnu formulu:

**Fond = stanovništvo × 3.400 € × lokalni troškovni faktor + 5.000.000 € + turistički pritisak × 5.000.000 €.**

Rezultat se zaokružuje na najbližih 100.000 €. Lokalni troškovni faktor (otprilike 0,90–1,12) i turistički pritisak ručno su postavljeni kao **simulacijske pretpostavke** koje okvirno predstavljaju složenost infrastrukture, raspršenost naselja i sezonsko opterećenje. Nisu službeni pokazatelji niti ih treba tumačiti kao izmjereni trošak po stanovniku. Fiksni dio predstavlja pojednostavljenu pretpostavku o osnovnim troškovima lokalnih službi.

### Raspodjela po prioritetima

| Područje | Početni udio |
|---|---:|
| Vrtići, škole i mladi | 24 % |
| Stanovanje i razvoj prostora | 14 % |
| Promet i sigurnost | 18 % |
| Komunalna infrastruktura | 14 % |
| Okoliš i energija | 10 % |
| Sport, kultura i zajednica | 11 % |
| Socijalna podrška | 9 % |

Udio za vrtiće, škole i mlade blago se prilagođava udjelu djece predškolske dobi i učenika nižih razreda u stanovništvu grada, unutar raspona od ±2 postotna boda. Razlika se proporcionalno oduzima od stanovanja/razvoja prostora i komunalne infrastrukture. Time gradovi s većim udjelom male djece dobivaju nešto veći početni naglasak na obrazovne i dječje usluge, bez tvrdnje da je to potpuna mjera potreba svih mladih.

### Kako se igra

Svaka kategorija počinje na **100 % početnog iznosa**. Klizač se pomiče od 0 do 200 % u koracima od 5 postotnih bodova. Povećanje jedne stavke povećava ukupnu potrošnju; korisnik zatim mora smanjiti druge stavke ili ostati unutar fonda. Neiskorišteni iznos može ostati kao pričuva za nepredviđene troškove. Zaključivanje raspodjele prikazuje najveća povećanja i smanjenja te pitanje o tome kome odluka daje prednost.

Objašnjenja kategorija navode tipične lokalne usluge i ulaganja. Ne predstavljaju zatvoren popis zakonskih nadležnosti: stvarna podjela odgovornosti između grada, županije, države, komunalnih društava i drugih tijela ovisi o konkretnom projektu.

### Ograničenja i odgovorna uporaba

- Iznosi su simulirani i ne smiju se citirati kao stvarni proračunski iznosi grada.
- Popis 2021. je najnovija zajednička osnova u ovom modelu; demografija se od tada mijenja.
- Broj djece predškolske dobi i učenika I.–IV. razreda nije broj mladih od 15 do 29 godina.
- Troškovni i turistički faktori autorske su pretpostavke za igrivost, a ne statističke procjene.
- Demografski izvori i metodološka ograničenja navedeni su u odjeljku „Demografska osnova”; simulacijske pretpostavke nisu službeni gradski financijski podaci.
