/* Curated POTEZ learning cards and daily facts.
   Every claim is editorially reviewed and sourced in docs/LEARNING_SOURCES_2026.md.
   No API calls, user profiling, or remote content loading. */
(() => {
  'use strict';

  const topics = [
    {
      id: 'school-meals',
      category: 'svakodnevica',
      label: 'Škola',
      title: 'Tko odlučuje što se jede u školi?',
      intro: 'Školski obrok ovisi o pravilima, organizaciji škole, osnivaču i financiranju.',
      question: 'Tko organizira obrok, a tko osigurava sredstva?',
      insight: 'U osnovnim školama prehranu organizira škola prema propisanim normativima. Država može donijeti godišnju odluku o financiranju. To su odvojene odgovornosti.',
      action: 'Potrebno je provjeriti jelovnik i školske upute, a za šire pitanje i ulogu osnivača te važeću odluku o financiranju.',
      target: '#tema-obroci',
      sourceTitle: 'gov.hr — Prehrana i prijevoz učenika',
      sourceUrl: 'https://gov.hr/hr/prehrana-i-prijevoz-ucenika/1008',
      sourceNote: 'Službeni pregled; pojedinosti ovise o školskoj godini.'
    },
    {
      id: 'transport',
      category: 'svakodnevica',
      label: 'Prijevoz',
      title: 'Kasni vlak — tko je odgovoran?',
      intro: 'Kašnjenje, otkazivanje i problem infrastrukture mogu imati različite uzroke i nadležne.',
      question: 'Koji podaci pomažu provjeriti kašnjenje?',
      insight: 'Za provjeru su važni datum, relacija, broj vlaka i stvarno vrijeme. Prigovor se prvo upućuje prijevozniku; HAKOM opisuje daljnja prava putnika.',
      action: 'Preporučuje se sačuvati podatke o putovanju i odgovor prijevoznika. Za neriješen problem potrebno je provjeriti daljnji postupak kod HAKOM-a.',
      target: '#tema-hz',
      sourceTitle: 'HŽ Putnički prijevoz i HAKOM — prava putnika',
      sourceUrl: 'https://www.hakom.hr/hr/zeljeznicki-putnicki-prijevoz/38',
      sourceNote: 'Službeni kanali prijevoznika i regulatora.'
    },
    {
      id: 'school-voice',
      category: 'svakodnevica',
      label: 'Škola',
      title: 'Može li učenik predložiti promjenu školskog pravila?',
      intro: 'Učenici mogu iznijeti prijedloge kroz vijeće učenika i druga tijela škole.',
      question: 'Koju ulogu ima vijeće učenika?',
      insight: 'Vijeće učenika može zastupati interese učenika i predlagati poboljšanja. Formalne odluke o pravilima donose nadležna tijela škole.',
      action: 'Potrebno je proučiti statut, kućni red i ulogu vijeća učenika. Prijedlog je važno potkrijepiti konkretnim primjerima.',
      target: '#tema-pravila',
      sourceTitle: 'Zakon o odgoju i obrazovanju u osnovnoj i srednjoj školi',
      sourceUrl: 'https://narodne-novine.nn.hr/clanci/sluzbeni/2008_07_87_2789.html',
      sourceNote: 'Mjerodavni su važeći zakon i statut konkretne škole.'
    },
    {
      id: 'sport-space',
      category: 'svakodnevica',
      label: 'Sport i prostor',
      title: 'Tko odlučuje ima li kvart siguran prostor za kretanje?',
      intro: 'Parkovi, nogostupi, biciklističke staze i tereni utječu na mogućnosti svakodnevnog kretanja.',
      question: 'Koliko na kretanje utječe prostor u kojem živimo?',
      insight: 'HZJZ bilježi rast udjela građana koji gotovo svakodnevno vježbaju izvan organiziranog sporta: s 11 % (2022.) na 24 % (2026.). Hrvatski uzorak imao je 1.007 ispitanika; podaci nisu samo o mladima.',
      action: 'Korisno je izdvojiti jednu prepreku u kvartu te utvrditi tko održava prostor i koji su lokalni planovi.',
      sourceTitle: 'HZJZ — Posebni Eurobarometar 574: Sport i tjelesna aktivnost (2026.)',
      sourceUrl: 'https://www.hzjz.hr/aktualnosti/posebni-eurobarometar-574-2026-godine-sport-i-tjelesna-aktivnost/',
      sourceNote: 'Hrvatski uzorak N=1.007; travanj 2026.'
    },
    {
      id: 'youth-council',
      category: 'sudjelovanje',
      label: 'Glas mladih',
      title: 'Što zapravo radi savjet mladih?',
      intro: 'Savjet mladih je savjetodavno tijelo koje povezuje mlade i donositelje odluka.',
      question: 'Može li savjet mladih samostalno donijeti gradsku odluku?',
      insight: 'Ne. Savjeti mladih daju mišljenja i prijedloge na lokalnoj, regionalnoj i nacionalnoj razini. Ne zamjenjuju izabrana tijela koja donose formalne odluke.',
      action: 'Program rada i zapisnici lokalnog savjeta mladih pokazuju koje se teme razmatraju.',
      sourceTitle: 'Ministarstvo demografije i useljeništva — Savjeti mladih',
      sourceUrl: 'https://mdu.gov.hr/istaknute-teme/mladi-4064/savjeti-mladih-4069/4069',
      sourceNote: 'Službeni opis uloge i razina savjeta mladih.'
    },
    {
      id: 'national-youth-programme',
      category: 'sudjelovanje',
      label: 'Politike za mlade',
      title: 'Što je Nacionalni program za mlade?',
      intro: 'Nacionalni program određuje ciljeve, mjere i odgovornosti politike za mlade u zadanom razdoblju.',
      question: 'Je li program iz razdoblja 2023.–2025. i dalje aktualan?',
      insight: 'Vlada RH donijela je Nacionalni program za mlade 2023.–2025. To razdoblje je završilo, pa ga u 2026. treba čitati kao prethodni program, ne kao automatski važeći dokument.',
      action: 'U dokumentu su važni ciljevi, nositelji i rokovi. Za aktualno stanje potrebno je provjeriti postoje li noviji službeni dokumenti.',
      sourceTitle: 'Narodne novine — Odluka o donošenju Nacionalnog programa za mlade 2023.–2025.',
      sourceUrl: 'https://narodne-novine.nn.hr/clanci/sluzbeni/2023_06_61_1018.html',
      sourceNote: 'Dokument pokriva 2023.–2025.; aktualne mjere potrebno je provjeriti u novijim aktima.'
    },
    {
      id: 'participation-data',
      category: 'sudjelovanje',
      label: 'Istraživanja',
      title: 'Jesu li mladi stvarno nezainteresirani?',
      intro: 'Prije zaključaka o mladima važno je utvrditi koje oblike sudjelovanja istraživanje mjeri.',
      question: 'Zašto različite vrste sudjelovanja ne treba poistovjećivati?',
      insight: 'IDIZ je 2026. anketirao 1.285 učenika završnih razreda srednjih škola. Volontiranje je navelo 44,7 %, doniranje 63,1 %, a sudjelovanje u prosvjedu 11,1 %. Nalaz ne predstavlja sve mlade.',
      action: 'Za svaku brojku važni su uzorak, godina, formulacija pitanja i ograničenja zaključka.',
      sourceTitle: 'IDIZ — Politička kompetencija mladih na pragu odraslosti (PKM), 2026.',
      sourceUrl: 'https://www.idi.hr/hr/obavijesti/lista-obavijesti/predstavljeni-rezultati-istrazivanja-provedenog-u-sklopu-projekta-politicka-kompetencija-mladih-na-pragu-odraslosti-pkm',
      sourceNote: 'N=1.285 učenika završnih razreda SŠ; proljeće 2026.'
    },
    {
      id: 'misinformation',
      category: 'digitalno',
      label: 'Medijska pismenost',
      title: 'Misinformacija ili dezinformacija?',
      intro: 'Netočna objava nije automatski namjerna manipulacija. Namjeru je često teško dokazati.',
      question: 'Možeš li iz jedne pogrešne objave dokazati namjeru autora?',
      insight: 'UNESCO razlikuje netočan sadržaj koji se širi bez namjere obmane (misinformacija) od namjernog zavaravanja (dezinformacija). Sam sadržaj često nije dovoljan dokaz namjere.',
      action: 'Važno je utvrditi izvor, datum i kontekst. Bez dokaza o namjeri tvrdnju je primjereno označiti kao nepotvrđenu, a ne kao namjernu laž.',
      sourceTitle: 'UNESCO — Disinformation: definition and context',
      sourceUrl: 'https://www.unesco.org/en/query-list/d/disinformation',
      sourceNote: 'Terminologija se razlikuje među autorima; UNESCO razlikuje sadržaj prema namjeri.'
    },
    {
      id: 'recommendations',
      category: 'digitalno',
      label: 'Društvene mreže',
      title: 'Zašto ti se baš taj sadržaj pojavljuje na feedu?',
      intro: 'Feed nije neutralan popis. Sustavi preporuka rangiraju sadržaj prema različitim signalima.',
      question: 'Znači li česta objava da je sadržaj važniji ili točniji?',
      insight: 'Europska komisija navodi da sustavi preporuka utječu na sadržaj koji vide maloljetnici. Smjernice prema Aktu o digitalnim uslugama naglašavaju sigurnost i veću kontrolu korisnika.',
      action: 'Postavke preporuka i signali rangiranja pomažu objasniti redoslijed objava.',
      sourceTitle: 'Europska komisija — Smjernice o zaštiti maloljetnika prema Aktu o digitalnim uslugama (2025.)',
      sourceUrl: 'https://digital-strategy.ec.europa.eu/en/policies/dsa-guidelines',
      sourceNote: 'Smjernice nisu zamjena za tekst Uredbe o digitalnim uslugama.'
    },
    {
      id: 'influencers',
      category: 'digitalno',
      label: 'Influenceri i oglasi',
      title: 'Preporuka ili reklama?',
      intro: 'Preporuka influencera može biti osobno mišljenje, reklama, sponzorstvo ili partnerska objava.',
      question: 'Zašto je važno prepoznati komercijalni odnos?',
      insight: 'Smjernice Komisije upozoravaju na influencer marketing, sponzorstva i plasman proizvoda. To ne znači da je svaka preporuka reklama, ali komercijalni odnos treba biti prepoznatljiv.',
      action: 'Oznaka suradnje upućuje na komercijalni odnos; osobno iskustvo pritom je važno razlikovati od provjerljivih tvrdnji.',
      sourceTitle: 'Europska komisija — Smjernice o zaštiti maloljetnika prema Aktu o digitalnim uslugama (2025.)',
      sourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52025XC05519',
      sourceNote: 'Smjernice Komisije o komercijalnim praksama i zaštiti maloljetnika.'
    },
    {
      id: 'public-information',
      category: 'odgovornost',
      label: 'Javne informacije',
      title: 'Možeš li tražiti gradski dokument bez objašnjavanja zašto?',
      intro: 'Pristup informacijama omogućuje građanima provjeru javnih odluka i dokumenata.',
      question: 'Moraš li navesti razlog za zahtjev za pristup informacijama?',
      insight: 'OECD-ov pregled iz 2026. navodi da fizičke i pravne osobe mogu tražiti informacije bez navođenja razloga. Kopiranje ili reprodukcija može se naplatiti.',
      action: 'Relevantni su proračun i zapisnici. Ako dokument nije objavljen, potrebno je proučiti upute Povjerenika i zatražiti postojeću informaciju.',
      sourceTitle: 'OECD — Anti-Corruption and Integrity Outlook 2026: Croatia',
      sourceUrl: 'https://www.oecd.org/en/publications/anti-corruption-and-integrity-outlook-2026_0c8910f8-en/croatia_07db3c8f-en.html',
      sourceNote: 'Pregled OECD-a; postupak uređuju važeći zakon i upute Povjerenika.'
    },
    {
      id: 'integrity',
      category: 'odgovornost',
      label: 'Javni novac',
      title: 'Korupcija nije samo kuverta s novcem',
      intro: 'Korupcija uključuje i rizike poput sukoba interesa, pogodovanja i netransparentne nabave.',
      question: 'Zašto su javni kriteriji i obrazloženja važni?',
      insight: 'Strategija RH 2021.–2030. obuhvaća transparentnost, sukob interesa i javnu nabavu. Akcijski plan 2025.–2027. donesen je u svibnju 2025.',
      action: 'Potrebno je provjeriti kriterije, zapisnik i obrazloženje te razlikovati sumnju, prijavu, istragu i presudu.',
      sourceTitle: 'Narodne novine — Strategija sprječavanja korupcije 2021.–2030. i Akcijski plan 2025.–2027.',
      sourceUrl: 'https://narodne-novine.nn.hr/clanci/sluzbeni/2025_05_84_1115.html',
      sourceNote: 'Službeni akcijski plan; strateške mjere nisu dokaz pojedinačnog slučaja.'
    }
  ];

  const facts = [
    { title: 'Mladi nisu jedna homogena skupina', text: 'IDIZ-ovo istraživanje političke kompetencije iz 2026. obuhvatilo je 1.285 učenika završnih razreda srednjih škola — ne sve mlade u Hrvatskoj.', note: 'Prije generalizacije važno je utvrditi tko je bio obuhvaćen uzorkom.', source: 'IDIZ · PKM 2026.', url: 'https://www.idi.hr/hr/obavijesti/lista-obavijesti/predstavljeni-rezultati-istrazivanja-provedenog-u-sklopu-projekta-politicka-kompetencija-mladih-na-pragu-odraslosti-pkm' },
    { title: 'Volontiranje je jedan od oblika sudjelovanja', text: '44,7 % ispitanih učenika završnih razreda srednjih škola u istraživanju IDIZ-a iz 2026. navelo je da je volontiralo.', note: 'Podatak se odnosi na učenike u tom istraživanju, ne na sve mlade.', source: 'IDIZ · PKM 2026.', url: 'https://www.idi.hr/hr/obavijesti/lista-obavijesti/predstavljeni-rezultati-istrazivanja-provedenog-u-sklopu-projekta-politicka-kompetencija-mladih-na-pragu-odraslosti-pkm' },
    { title: 'Solidarnost ima više oblika', text: 'U istom istraživanju 63,1 % učenika završnih razreda navelo je da je doniralo financijsku ili materijalnu pomoć.', note: 'Doniranje nije automatski politička participacija, ali jest oblik društvenog angažmana.', source: 'IDIZ · PKM 2026.', url: 'https://www.idi.hr/hr/obavijesti/lista-obavijesti/predstavljeni-rezultati-istrazivanja-provedenog-u-sklopu-projekta-politicka-kompetencija-mladih-na-pragu-odraslosti-pkm' },
    { title: 'Prosvjed je samo jedan način sudjelovanja', text: '11,1 % učenika u istraživanju IDIZ-a iz 2026. izjavilo je da je sudjelovalo u prosvjedu.', note: 'Nizak udio u jednoj vrsti aktivnosti ne govori sam po sebi da su mladi općenito apatični.', source: 'IDIZ · PKM 2026.', url: 'https://www.idi.hr/hr/obavijesti/lista-obavijesti/predstavljeni-rezultati-istrazivanja-provedenog-u-sklopu-projekta-politicka-kompetencija-mladih-na-pragu-odraslosti-pkm' },
    { title: 'Program za mlade ima rok i nositelje', text: 'Vlada RH donijela je Nacionalni program za mlade za razdoblje 2023.–2025. u lipnju 2023.', note: 'U studenome 2026. taj je vremenski okvir završio: dokument je povijesna referenca, a aktualne mjere treba provjeriti u novijim službenim dokumentima.', source: 'Narodne novine · Nacionalni program za mlade 2023.–2025.', url: 'https://narodne-novine.nn.hr/clanci/sluzbeni/2023_06_61_1018.html' },
    { title: 'Savjet mladih je savjetodavno tijelo', text: 'U Hrvatskoj postoje općinski i gradski, županijski i nacionalni savjeti mladih.', note: 'Oni omogućuju mladima sudjelovanje u procesu odlučivanja, ali sami nisu zamjena za izabrana tijela.', source: 'Ministarstvo demografije i useljeništva', url: 'https://mdu.gov.hr/istaknute-teme/mladi-4064/savjeti-mladih-4069/4069' },
    { title: 'Školski obrok ima više odgovornih aktera', text: 'Osnovne škole organiziraju prehranu učenika prema propisanim normativima; Vlada može donositi godišnje odluke o financiranju ili sufinanciranju.', note: 'Važno je razlikovati organizaciju prehrane, propisivanje standarda i financiranje.', source: 'gov.hr · Prehrana i prijevoz učenika', url: 'https://gov.hr/hr/prehrana-i-prijevoz-ucenika/1008' },
    { title: 'Kretanje nije samo organizirani sport', text: 'HZJZ navodi da se udio građana koji gotovo svakodnevno provode tjelesnu aktivnost izvan sporta povećao s 11 % (2022.) na 24 % (2026.).', note: 'Hrvatski uzorak imao je 1.007 ispitanika; pokazatelj se odnosi na građane, ne samo mlade.', source: 'HZJZ · Eurobarometar 574 (2026.)', url: 'https://www.hzjz.hr/aktualnosti/posebni-eurobarometar-574-2026-godine-sport-i-tjelesna-aktivnost/' },
    { title: 'Prostor u kvartu utječe na svakodnevno kretanje', text: 'U HZJZ-ovu prikazu Eurobarometra udio građana koji navode tjelesnu aktivnost na putu do škole, posla ili trgovine porastao je s 23 % na 37 % između 2022. i 2026.', note: 'To je pokazatelj kretanja u svakodnevici, a ne mjera školskog sporta.', source: 'HZJZ · Eurobarometar 574 (2026.)', url: 'https://www.hzjz.hr/aktualnosti/posebni-eurobarometar-574-2026-godine-sport-i-tjelesna-aktivnost/' },
    { title: 'Namjera je važna za razlikovanje dezinformacije', text: 'UNESCO uobičajeno razlikuje misinformaciju od dezinformacije prema tome postoji li namjera obmanjivanja.', note: 'Namjeru često nije moguće zaključiti samo iz objave; najprije je potrebno provjeriti samu tvrdnju.', source: 'UNESCO · Disinformation', url: 'https://www.unesco.org/en/query-list/d/disinformation' },
    { title: 'Algoritmi oblikuju redoslijed sadržaja', text: 'Europska komisija navodi da sustavi preporuka utječu na to kako se sadržaj rangira i prikazuje maloljetnicima.', note: 'Smjernice za zaštitu maloljetnika prema Aktu o digitalnim uslugama objavljene su 14. srpnja 2025.', source: 'Europska komisija · DSA smjernice', url: 'https://digital-strategy.ec.europa.eu/en/policies/dsa-guidelines' },
    { title: 'Influencer marketing je i komercijalna praksa', text: 'Smjernice Europske komisije za zaštitu maloljetnika izričito razmatraju influencer marketing, sponzorstva i plasman proizvoda.', note: 'Preporuka influencera nije automatski reklama; važno je prepoznati i provjeriti komercijalni odnos.', source: 'EUR-Lex · Smjernice 2025/C 5519', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52025XC05519' },
    { title: 'Građanin može tražiti javnu informaciju', text: 'OECD-ov pregled Hrvatske iz 2026. navodi da podnositelj zahtjeva za pristup informacijama ne mora objašnjavati zašto traži informaciju.', note: 'Zahtjev se odnosi na postojeće informacije; pojedinosti uređuju važeći zakon i upute Povjerenika za informiranje.', source: 'OECD · Anti-Corruption and Integrity Outlook 2026', url: 'https://www.oecd.org/en/publications/anti-corruption-and-integrity-outlook-2026_0c8910f8-en/croatia_07db3c8f-en.html' },
    { title: 'Antikorupcijska politika uključuje prevenciju', text: 'Hrvatska Strategija sprječavanja korupcije 2021.–2030. obuhvaća transparentnost, sukob interesa, javnu nabavu i podizanje svijesti građana.', note: 'Akcijski plan 2025.–2027. donesen je u svibnju 2025.; mjere treba razlikovati od dokaza o pojedinačnim slučajevima.', source: 'Narodne novine · Akcijski plan 2025.–2027.', url: 'https://narodne-novine.nn.hr/clanci/sluzbeni/2025_05_84_1115.html' }
  ];

  window.POTEZ_LEARNING_CONTENT = Object.freeze({ topics, facts });
})();