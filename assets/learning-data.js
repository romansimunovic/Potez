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
      intro: 'Školski jelovnik nije samo pitanje ukusa: iza njega su normativi, organizacija škole, osnivač i financiranje.',
      question: 'Kome se obratiti ako obrok nije dostupan ili ne odgovara propisanim standardima?',
      insight: 'U osnovnoj školi prehranu organizira škola prema propisanim normativima. Vlada može za pojedinu školsku godinu donijeti odluku o financiranju ili sufinanciranju. Zato treba razlikovati tko organizira obrok, tko osigurava novac i tko propisuje prehrambene standarde.',
      action: 'Pogledaj jelovnik i školske informacije, zatim pitaj školu kako se primjenjuju važeći normativi. Za sustavno pitanje provjeri ulogu osnivača i aktualnu odluku o financiranju.',
      target: '#tema-obroci',
      sourceTitle: 'gov.hr — Prehrana i prijevoz učenika',
      sourceUrl: 'https://gov.hr/hr/prehrana-i-prijevoz-ucenika/1008',
      sourceNote: 'Službeni pregled obveza osnovnih škola i mogućeg državnog sufinanciranja.'
    },
    {
      id: 'transport',
      category: 'svakodnevica',
      label: 'Prijevoz',
      title: 'Kasni vlak — tko je odgovoran?',
      intro: 'Jedan kvar, kašnjenje i ukinuta linija nisu nužno isti problem. Za svaki postoje različiti podaci i mogući odgovorni akteri.',
      question: 'Što treba zabilježiti prije nego što pošalješ prigovor?',
      insight: 'Datum, relacija, broj vlaka, planirano i stvarno vrijeme te prethodna komunikacija pomažu razlikovati pojedinačni incident od ponavljajućeg problema. Za prava putnika postoje službeni postupci prijevoznika i regulatora.',
      action: 'Zabilježi konkretan događaj i prvo se obrati prijevozniku. Ako odgovor nije dovoljan, provjeri daljnji postupak i rokove kod HAKOM-a.',
      target: '#tema-hz',
      sourceTitle: 'HŽ Putnički prijevoz i HAKOM — prava putnika',
      sourceUrl: 'https://www.hakom.hr/hr/zeljeznicki-putnicki-prijevoz/38',
      sourceNote: 'Vodič u aplikaciji povezuje postupak prigovora s primarnim kanalima.'
    },
    {
      id: 'school-voice',
      category: 'svakodnevica',
      label: 'Škola',
      title: 'Može li učenik predložiti promjenu školskog pravila?',
      intro: 'Učenici nisu samo korisnici škole. Imaju predstavnička tijela i kanale kroz koje mogu iznijeti prijedloge.',
      question: 'Kako pritužbu pretvoriti u prijedlog koji se može razmotriti?',
      insight: 'Vijeće učenika može zastupati interese učenika i predlagati poboljšanja, ali formalna odluka o pravilima pripada tijelima škole. Zato je važno razlikovati pravo glasa, savjetovanje i ovlast donošenja odluke.',
      action: 'Opiši pravilo, navedi konkretne situacije i predloži izvedivu promjenu. Provjeri statut škole, kućni red i način rada vijeća učenika.',
      target: '#tema-pravila',
      sourceTitle: 'Zakon o odgoju i obrazovanju u osnovnoj i srednjoj školi',
      sourceUrl: 'https://narodne-novine.nn.hr/clanci/sluzbeni/2008_07_87_2789.html',
      sourceNote: 'Prije postupanja provjeri važeći tekst zakona i statut svoje škole.'
    },
    {
      id: 'sport-space',
      category: 'svakodnevica',
      label: 'Sport i prostor',
      title: 'Tko odlučuje ima li kvart siguran prostor za kretanje?',
      intro: 'Sport nije samo članstvo u klubu. Parkovi, nogostupi, biciklističke staze i javni tereni oblikuju mogućnosti svakodnevnog kretanja.',
      question: 'Je li manjak aktivnosti uvijek samo osobni izbor?',
      insight: 'HZJZ-ov prikaz Eurobarometra 2026. bilježi rast udjela građana koji gotovo svakodnevno provode tjelesnu aktivnost izvan sporta: s 11 % u 2022. na 24 % u 2026. Istraživanje u Hrvatskoj obuhvatilo je 1.007 ispitanika; to nisu podaci samo o mladima.',
      action: 'Odaberi jednu prepreku u svom kvartu — rasvjetu, nogostup, park ili pristup terenu. Provjeri vlasnika prostora, nadležnu službu i lokalne planove ulaganja.',
      sourceTitle: 'HZJZ — Posebni Eurobarometar 574: Sport i tjelesna aktivnost (2026.)',
      sourceUrl: 'https://www.hzjz.hr/aktualnosti/posebni-eurobarometar-574-2026-godine-sport-i-tjelesna-aktivnost/',
      sourceNote: 'Uzorak u Hrvatskoj N=1.007; istraživanje provedeno 10.–29. travnja 2026.'
    },
    {
      id: 'youth-council',
      category: 'sudjelovanje',
      label: 'Glas mladih',
      title: 'Što zapravo radi savjet mladih?',
      intro: 'To nije minijaturno gradsko vijeće. To je savjetodavno tijelo koje otvara kanal između mladih i donositelja odluka.',
      question: 'Može li savjet mladih sam donijeti odluku o gradskom proračunu?',
      insight: 'Ne. Savjeti mladih promiču i zagovaraju potrebe mladih te omogućuju njihovo sudjelovanje u procesima službenog odlučivanja. Postoje na općinskoj/gradskoj, županijskoj i nacionalnoj razini, ali nisu zamjena za izabrana tijela.',
      action: 'Pronađi savjet mladih svoje općine, grada ili županije. Pogledaj program rada, zapisnike i način na koji građani mogu predložiti temu.',
      sourceTitle: 'Ministarstvo demografije i useljeništva — Savjeti mladih',
      sourceUrl: 'https://mdu.gov.hr/istaknute-teme/mladi-4064/savjeti-mladih-4069/4069',
      sourceNote: 'Službeni opis uloge i razina savjeta mladih.'
    },
    {
      id: 'participation-data',
      category: 'sudjelovanje',
      label: 'Istraživanja',
      title: 'Jesu li mladi stvarno nezainteresirani?',
      intro: 'Prije nego što nekoga nazovemo apatičnim, vrijedi pogledati različite oblike sudjelovanja i način na koji su mjereni.',
      question: 'Zašto volontiranje, peticija i prosvjed nisu ista stvar?',
      insight: 'IDIZ-ovo nacionalno reprezentativno istraživanje iz 2026. obuhvatilo je 1.285 učenika završnih razreda srednjih škola. U toj skupini 44,7 % navelo je volontiranje, 63,1 % doniranje pomoći, a 11,1 % sudjelovanje u prosvjedu. To se ne smije generalizirati na sve mlade u Hrvatskoj.',
      action: 'Kad vidiš brojku o mladima, prvo pitaj: koga je istraživanje obuhvatilo, kada je provedeno, što je točno mjereno i što se ne može zaključiti?',
      sourceTitle: 'IDIZ — Politička kompetencija mladih na pragu odraslosti (PKM), 2026.',
      sourceUrl: 'https://www.idi.hr/hr/obavijesti/lista-obavijesti/predstavljeni-rezultati-istrazivanja-provedenog-u-sklopu-projekta-politicka-kompetencija-mladih-na-pragu-odraslosti-pkm',
      sourceNote: 'N=1.285 učenika završnih razreda SŠ; istraživanje provedeno u ožujku i travnju 2026.'
    },
    {
      id: 'misinformation',
      category: 'digitalno',
      label: 'Medijska pismenost',
      title: 'Misinformacija ili dezinformacija?',
      intro: 'Netočna objava nije automatski namjerna manipulacija. Razlika je važna jer namjera nije uvijek vidljiva iz samog sadržaja.',
      question: 'Možeš li iz jedne pogrešne objave sigurno zaključiti da je autor namjerno lagao?',
      insight: 'UNESCO razlikuje misinformacije, koje se šire bez namjere obmanjivanja, i dezinformacije, kod kojih postoji namjera da se nekoga zavede. U praksi je namjeru često teško dokazati, pa je sigurnije opisati što je potvrđeno, a što nije.',
      action: 'Pronađi izvorni dokument ili izjavu, provjeri datum i kontekst te usporedi neovisne provjere. Ako nema dovoljno dokaza, označi tvrdnju kao nepotvrđenu, ne kao namjernu laž.',
      sourceTitle: 'UNESCO — Disinformation: definition and context',
      sourceUrl: 'https://www.unesco.org/en/query-list/d/disinformation',
      sourceNote: 'UNESCO napominje da se terminologija u literaturi može razlikovati; razlika prema namjeri najčešća je u UN-ovu kontekstu.'
    },
    {
      id: 'recommendations',
      category: 'digitalno',
      label: 'Društvene mreže',
      title: 'Zašto ti se baš taj sadržaj pojavljuje na feedu?',
      intro: 'Redoslijed objava nije neutralan popis svega što postoji. Sustavi preporuka rangiraju i prikazuju sadržaj prema različitim signalima.',
      question: 'Ako nešto često vidiš na feedu, znači li to da je najvažnije ili najtočnije?',
      insight: 'Europska komisija opisuje kako sustavi preporuka utječu na to koji sadržaj maloljetnici susreću i koliko često. Smjernice uz Akt o digitalnim uslugama preporučuju veću sigurnost, transparentnost i kontrolu korisnika; smjernice nisu zamjena za pojedinačnu procjenu svakog servisa.',
      action: 'Usporedi kako se mijenja feed kad pratiš nove teme ili koristiš ponuđene postavke preporuka. Zapitaj se čiji interes ima korist od tvoje pažnje.',
      sourceTitle: 'Europska komisija — Smjernice o zaštiti maloljetnika prema Aktu o digitalnim uslugama (2025.)',
      sourceUrl: 'https://digital-strategy.ec.europa.eu/en/policies/dsa-guidelines',
      sourceNote: 'Smjernice Komisije predstavljaju preporuke za provedbu, a ne samostalni tekst zakona.'
    },
    {
      id: 'influencers',
      category: 'digitalno',
      label: 'Influenceri i oglasi',
      title: 'Preporuka ili reklama?',
      intro: 'Sadržaj influencera može uključivati plaćenu suradnju, poklonjeni proizvod, sponzorstvo ili partnersku poveznicu.',
      question: 'Zašto je važno znati tko je platio ili podržao objavu?',
      insight: 'Europska komisija u smjernicama o zaštiti maloljetnika posebno navodi influencer marketing, sponzorstva, product placement i druge komercijalne prakse kao oblike na koje djeca i tinejdžeri mogu biti osjetljivi. To ne znači da je svaka preporuka reklama — znači da komercijalni odnos treba moći prepoznati.',
      action: 'Potraži oznake suradnje ili sponzorstva, provjeri tko stoji iza proizvoda i razlikuj osobno iskustvo od provjerljive tvrdnje o proizvodu.',
      sourceTitle: 'Europska komisija — Smjernice o zaštiti maloljetnika prema Aktu o digitalnim uslugama (2025.)',
      sourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52025XC05519',
      sourceNote: 'Odjeljak smjernica o komercijalnim praksama i zaštiti maloljetnika.'
    },
    {
      id: 'public-information',
      category: 'odgovornost',
      label: 'Javne informacije',
      title: 'Možeš li tražiti gradski dokument bez objašnjavanja zašto?',
      intro: 'Pravo na pristup informacijama nije samo alat novinara. Može ga koristiti i građanin koji želi provjeriti javnu odluku.',
      question: 'Moraš li objasniti instituciji zašto tražiš postojeći dokument?',
      insight: 'OECD-ov pregled Hrvatske iz 2026. navodi da hrvatski Zakon o pravu na pristup informacijama daje pravo pristupa informacijama fizičkim i pravnim osobama te da podnositelj zahtjeva ne mora navesti razlog. Za reprodukciju informacija mogu postojati troškovi.',
      action: 'Pronađi objavljeni proračun, zapisnik ili ugovor. Ako informacija nije dostupna, provjeri upute Povjerenika za informiranje i pošalji precizan zahtjev za postojeći dokument.',
      sourceTitle: 'OECD — Anti-Corruption and Integrity Outlook 2026: Croatia',
      sourceUrl: 'https://www.oecd.org/en/publications/anti-corruption-and-integrity-outlook-2026_0c8910f8-en/croatia_07db3c8f-en.html',
      sourceNote: 'Pregled pravnog okvira i njegove provedbe; nije zamjena za važeći zakon i upute Povjerenika.'
    },
    {
      id: 'integrity',
      category: 'odgovornost',
      label: 'Javni novac',
      title: 'Korupcija nije samo kuverta s novcem',
      intro: 'Sukob interesa, pogodovanje i netransparentna javna nabava mogu narušiti povjerenje čak i bez filmske scene primanja mita.',
      question: 'Zašto su javni kriteriji i trag odluke važni?',
      insight: 'Hrvatska Strategija sprječavanja korupcije 2021.–2030. uključuje transparentnost javne vlasti, upravljanje sukobom interesa, javnu nabavu i podizanje svijesti građana. Akcijski plan 2025.–2027. donesen je 27. svibnja 2025.',
      action: 'Kad čuješ za javni natječaj ili odluku, potraži kriterije, zapisnik, obrazloženje i način prijave nepravilnosti. Razlikuj sumnju, prijavu, istragu i pravomoćnu presudu.',
      sourceTitle: 'Narodne novine — Strategija sprječavanja korupcije 2021.–2030. i Akcijski plan 2025.–2027.',
      sourceUrl: 'https://narodne-novine.nn.hr/clanci/sluzbeni/2025_05_84_1115.html',
      sourceNote: 'Službeni akcijski plan Vlade RH; strateške mjere nisu tvrdnja da je pojedini slučaj korupcija.'
    }
  ];

  const facts = [
    { title: 'Mladi nisu jedna homogena skupina', text: 'IDIZ-ovo istraživanje političke kompetencije iz 2026. obuhvatilo je 1.285 učenika završnih razreda srednjih škola — ne sve mlade u Hrvatskoj.', note: 'Uvijek provjeri tko je bio u uzorku prije nego što brojku proširiš na cijelu generaciju.', source: 'IDIZ · PKM 2026.', url: 'https://www.idi.hr/hr/obavijesti/lista-obavijesti/predstavljeni-rezultati-istrazivanja-provedenog-u-sklopu-projekta-politicka-kompetencija-mladih-na-pragu-odraslosti-pkm' },
    { title: 'Volontiranje je jedan od oblika sudjelovanja', text: '44,7 % ispitanih učenika završnih razreda srednjih škola u istraživanju IDIZ-a iz 2026. navelo je da je volontiralo.', note: 'Podatak se odnosi na učenike u tom istraživanju, ne na sve mlade.', source: 'IDIZ · PKM 2026.', url: 'https://www.idi.hr/hr/obavijesti/lista-obavijesti/predstavljeni-rezultati-istrazivanja-provedenog-u-sklopu-projekta-politicka-kompetencija-mladih-na-pragu-odraslosti-pkm' },
    { title: 'Solidarnost ima više oblika', text: 'U istom istraživanju 63,1 % učenika završnih razreda navelo je da je doniralo financijsku ili materijalnu pomoć.', note: 'Doniranje nije automatski politička participacija, ali jest oblik društvenog angažmana.', source: 'IDIZ · PKM 2026.', url: 'https://www.idi.hr/hr/obavijesti/lista-obavijesti/predstavljeni-rezultati-istrazivanja-provedenog-u-sklopu-projekta-politicka-kompetencija-mladih-na-pragu-odraslosti-pkm' },
    { title: 'Prosvjed je samo jedan način sudjelovanja', text: '11,1 % učenika u istraživanju IDIZ-a iz 2026. izjavilo je da je sudjelovalo u prosvjedu.', note: 'Nizak udio u jednoj vrsti aktivnosti ne govori sam po sebi da su mladi općenito apatični.', source: 'IDIZ · PKM 2026.', url: 'https://www.idi.hr/hr/obavijesti/lista-obavijesti/predstavljeni-rezultati-istrazivanja-provedenog-u-sklopu-projekta-politicka-kompetencija-mladih-na-pragu-odraslosti-pkm' },
    { title: 'Savjet mladih je savjetodavno tijelo', text: 'U Hrvatskoj postoje općinski i gradski, županijski i nacionalni savjeti mladih.', note: 'Oni omogućuju mladima sudjelovanje u procesu odlučivanja, ali sami nisu zamjena za izabrana tijela.', source: 'Ministarstvo demografije i useljeništva', url: 'https://mdu.gov.hr/istaknute-teme/mladi-4064/savjeti-mladih-4069/4069' },
    { title: 'Školski obrok ima više odgovornih aktera', text: 'Osnovne škole organiziraju prehranu učenika prema propisanim normativima; Vlada može donositi godišnje odluke o financiranju ili sufinanciranju.', note: 'Razlikuj organizaciju prehrane, propisivanje standarda i financiranje.', source: 'gov.hr · Prehrana i prijevoz učenika', url: 'https://gov.hr/hr/prehrana-i-prijevoz-ucenika/1008' },
    { title: 'Kretanje nije samo organizirani sport', text: 'HZJZ navodi da se udio građana koji gotovo svakodnevno provode tjelesnu aktivnost izvan sporta povećao s 11 % (2022.) na 24 % (2026.).', note: 'Hrvatski uzorak imao je 1.007 ispitanika; pokazatelj se odnosi na građane, ne samo mlade.', source: 'HZJZ · Eurobarometar 574 (2026.)', url: 'https://www.hzjz.hr/aktualnosti/posebni-eurobarometar-574-2026-godine-sport-i-tjelesna-aktivnost/' },
    { title: 'Prostor u kvartu utječe na svakodnevno kretanje', text: 'U HZJZ-ovu prikazu Eurobarometra udio građana koji navode tjelesnu aktivnost na putu do škole, posla ili trgovine porastao je s 23 % na 37 % između 2022. i 2026.', note: 'To je pokazatelj kretanja u svakodnevici, a ne mjera školskog sporta.', source: 'HZJZ · Eurobarometar 574 (2026.)', url: 'https://www.hzjz.hr/aktualnosti/posebni-eurobarometar-574-2026-godine-sport-i-tjelesna-aktivnost/' },
    { title: 'Namjera je važna za razlikovanje dezinformacije', text: 'UNESCO uobičajeno razlikuje misinformaciju od dezinformacije prema tome postoji li namjera obmanjivanja.', note: 'Namjeru često nije moguće zaključiti samo iz objave; prvo provjeri samu tvrdnju.', source: 'UNESCO · Disinformation', url: 'https://www.unesco.org/en/query-list/d/disinformation' },
    { title: 'Algoritmi oblikuju redoslijed sadržaja', text: 'Europska komisija navodi da sustavi preporuka utječu na to kako se sadržaj rangira i prikazuje maloljetnicima.', note: 'Smjernice za zaštitu maloljetnika prema Aktu o digitalnim uslugama objavljene su 14. srpnja 2025.', source: 'Europska komisija · DSA smjernice', url: 'https://digital-strategy.ec.europa.eu/en/policies/dsa-guidelines' },
    { title: 'Influencer marketing je i komercijalna praksa', text: 'Smjernice Europske komisije za zaštitu maloljetnika izričito razmatraju influencer marketing, sponzorstva i plasman proizvoda.', note: 'Preporuka influencera nije automatski reklama; važno je prepoznati i provjeriti komercijalni odnos.', source: 'EUR-Lex · Smjernice 2025/C 5519', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52025XC05519' },
    { title: 'Građanin može tražiti javnu informaciju', text: 'OECD-ov pregled Hrvatske iz 2026. navodi da podnositelj zahtjeva za pristup informacijama ne mora objašnjavati zašto traži informaciju.', note: 'Zahtjev se odnosi na postojeće informacije; za detalje provjeri važeći zakon i upute Povjerenika za informiranje.', source: 'OECD · Anti-Corruption and Integrity Outlook 2026', url: 'https://www.oecd.org/en/publications/anti-corruption-and-integrity-outlook-2026_0c8910f8-en/croatia_07db3c8f-en.html' },
    { title: 'Antikorupcijska politika uključuje prevenciju', text: 'Hrvatska Strategija sprječavanja korupcije 2021.–2030. obuhvaća transparentnost, sukob interesa, javnu nabavu i podizanje svijesti građana.', note: 'Akcijski plan 2025.–2027. donesen je u svibnju 2025.; mjere treba razlikovati od dokaza o pojedinačnim slučajevima.', source: 'Narodne novine · Akcijski plan 2025.–2027.', url: 'https://narodne-novine.nn.hr/clanci/sluzbeni/2025_05_84_1115.html' }
  ];

  window.POTEZ_LEARNING_CONTENT = Object.freeze({ topics, facts });
})();