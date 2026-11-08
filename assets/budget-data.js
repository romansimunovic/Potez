/* Curated 2026 budget datasets for the POTEZ five-minute city challenge.
   Each scenario declares its scope: neighbourhood priorities, functional classes,
   or selected published investment programmes. Amounts are official plan values. */
window.POTEZ_BUDGET_DATA = {
  cities: {
    osijek: {
      label: 'Osijek',
      selectionLabel: 'Odaberi gradsku četvrt',
      districts: {
        tvrda: {
          label: 'Gradska četvrt Tvrđa',
          year: 2026,
          total: 93729,
          envelopeLabel: 'Ukupno po programu',
          scopeNote: 'Program prioriteta · Tvrđa · 2026.',
          intro: 'Promijeni iznose i usporedi svoj izbor s usvojenim planom četvrti.',
          source: 'https://www.osijek.hr/wp-content/uploads/2026/04/Program-Prioriteta-za-odrzavanje-i-poboljsanje-komunalne-infrastrukture-GC-Tvrda-za-2026.pdf',
          sourceLabel: 'Usvojeni program prioriteta GČ Tvrđa ↗',
          items: [
            { name: 'Nogostupi', amount: 4000, detail: 'Ulica kneza Trpimira 1a — staza od sitnog kamena' },
            { name: 'Parkirališta', amount: 31000, detail: 'Vijenac Ivana Meštrovića 26f' },
            { name: 'Ceste i prilazi', amount: 29275, detail: 'Vijenac Ivana Meštrovića 28–38' },
            { name: 'Javna rasvjeta', amount: 2000, detail: 'Nadopuna rasvjetnih tijela' },
            { name: 'Dječja igrališta', amount: 15454, detail: 'Nadopuna igrala' },
            { name: 'Urbana oprema', amount: 6000, detail: 'Klupe, koševi i držači za bicikle' },
            { name: 'Zelene površine', amount: 6000, detail: 'Održavanje i sadnja' }
          ]
        },
        'novi-grad': {
          label: 'Gradska četvrt Novi grad',
          year: 2026,
          total: 93729,
          envelopeLabel: 'Ukupno po programu',
          scopeNote: 'Program prioriteta · Novi grad · 2026.',
          intro: 'Promijeni iznose i usporedi svoj izbor s usvojenim planom četvrti.',
          source: 'https://www.osijek.hr/wp-content/uploads/2026/04/Program-Prioriteta-za-odrzavanje-i-poboljsanje-komunalne-infrastrukture-GC-Novi-grad-za-2026.pdf',
          sourceLabel: 'Usvojeni program prioriteta GČ Novi grad ↗',
          items: [
            { name: 'Nogostupi', amount: 41000, detail: 'Sjenjak i okolne ulice' },
            { name: 'Parkirališta', amount: 4100, detail: 'Vatrogasna ulica, boćalište i Sjenjak' },
            { name: 'Ceste i prilazi', amount: 15000, detail: 'Vatrogasna ulica' },
            { name: 'Dječja igrališta', amount: 19654, detail: 'Banjalučka ulica i Vijenac Ivana Česmičkog' },
            { name: 'Urbana oprema', amount: 8975, detail: 'Ograde, klupe, koševi i signalizacija' },
            { name: 'Zelene površine', amount: 5000, detail: 'Održavanje i sadnja' }
          ]
        },
        'gornji-grad': {
          label: 'Gradska četvrt Gornji grad',
          year: 2026,
          total: 99492,
          envelopeLabel: 'Ukupno po programu',
          scopeNote: 'Program prioriteta · Gornji grad · 2026.',
          intro: 'Promijeni iznose i usporedi svoj izbor s usvojenim planom četvrti.',
          source: 'https://www.osijek.hr/wp-content/uploads/2026/04/Program-Prioriteta-za-odrzavanje-i-poboljsanje-komunalne-infrastrukture-GC-Gornji-grad-za-2026.pdf',
          sourceLabel: 'Usvojeni program prioriteta GČ Gornji grad ↗',
          items: [
            { name: 'Nogostupi', amount: 17492, detail: 'Ilirska, Stepinčeva, Vijenac A. Cesarca i Našičko naselje' },
            { name: 'Parkirališta', amount: 30000, detail: 'Kod dječjeg vrtića Latica' },
            { name: 'Dječja igrališta', amount: 33000, detail: 'Obnova igrališta i street workout oprema' },
            { name: 'Urbana oprema', amount: 18000, detail: 'Oprema prema iskazanoj potrebi' },
            { name: 'Zelene površine', amount: 1000, detail: 'Održavanje i sadnja' }
          ]
        },
        'donji-grad': {
          label: 'Gradska četvrt Donji grad',
          year: 2026,
          total: 99492,
          envelopeLabel: 'Ukupno po programu',
          scopeNote: 'Program prioriteta · Donji grad · 2026.',
          intro: 'Promijeni iznose i usporedi svoj izbor s usvojenim planom četvrti.',
          source: 'https://www.osijek.hr/wp-content/uploads/2026/04/Program-Prioriteta-za-odrzavanje-i-poboljsanje-komunalne-infrastrukture-GC-Donji-grad-za-2026.pdf',
          sourceLabel: 'Usvojeni program prioriteta GČ Donji grad ↗',
          items: [
            { name: 'Nogostupi', amount: 59492, detail: 'Mostarska, Vodenička, Krstova i Vukovarska' },
            { name: 'Parkirališta', amount: 20000, detail: 'Sarajevska ulica' },
            { name: 'Ceste i prilazi', amount: 4000, detail: 'Vinogradska ulica 25–29' },
            { name: 'Urbana oprema', amount: 15000, detail: 'Klupe, koševi, ogledalo i pozivni semafor' },
            { name: 'Zelene površine', amount: 1000, detail: 'Održavanje i sadnja' }
          ]
        }
      }
    },
    'slavonski-brod': {
      label: 'Slavonski Brod',
      selectionLabel: 'Odaberi prikaz',
      districts: {
        'odabrani-programi': {
          label: 'Gradski programi i ulaganja',
          year: 2026,
          total: 44897378,
          envelopeLabel: 'Zbroj prikazanih programa',
          scopeNote: 'Odabrani programi i ulaganja · 2026.',
          intro: 'Odabrani su programi koji izravno oblikuju školu, kvart, stanovanje, sport i okoliš.',
          source: 'https://www.slavonski-brod.hr/gradska-uprava/proracun/16363-proracun-grada-za-2026-godinu',
          sourceLabel: 'Proračun Grada Slavonskog Broda za 2026. ↗',
          items: [
            { name: 'ITU projekti', amount: 9945775, detail: 'Biciklističke staze, botanički vrt, akcelerator i kamp na Poloju' },
            { name: 'Škole', amount: 5371508, detail: 'Dogradnje, igrališta, blagovaonice i oprema' },
            { name: 'Okoliš i obnovljivi izvori', amount: 3612723, detail: 'Kvaliteta zraka, geotermalna energija i park Klasije' },
            { name: 'Stanovanje za mlade obitelji', amount: 870000, detail: 'Stanovi i poticaji za gradnju kuća' },
            { name: 'Dom za starije', amount: 5660000, detail: 'Nastavak izgradnje i opremanje doma' },
            { name: 'Sportski objekti', amount: 7053000, detail: 'Stadion kraj Save, Klasije i Vijuš' },
            { name: 'Dječji vrtići', amount: 3709809, detail: 'Dogradnja i opremanje vrtića Pčelica i Kosjenka' },
            { name: 'Objekti kulture', amount: 1114120, detail: 'Knjižnica, Hrvatski dom i tvrđava' },
            { name: 'Objekti u vlasništvu Grada', amount: 1750000, detail: 'Energetska obnova i uređenje gradskih objekata' },
            { name: 'Ceste i pješačke staze', amount: 4680000, detail: 'Izgradnja i modernizacija prometnica i staza' },
            { name: 'Javna rasvjeta', amount: 265443, detail: 'Energetski učinkovita rasvjeta' },
            { name: 'Javni prijevoz', amount: 865000, detail: 'Gradski prijevoz bez naplate' }
          ]
        }
      }
    },
    slatina: {
      label: 'Slatina',
      selectionLabel: 'Odaberi prikaz',
      districts: {
        'funkcijska-klasifikacija': {
          label: 'Gradski proračun · odabrane funkcije',
          year: 2026,
          total: 27887173.17,
          envelopeLabel: 'Zbroj prikazanih funkcija',
          scopeNote: 'Funkcijska klasifikacija · plan 2026.',
          intro: 'Odabrane su funkcije koje najviše utječu na javne usluge i svakodnevni život.',
          source: 'https://www.slatina.hr/portal/wp-content/uploads/2025/12/Proracun-Grada-Slatine-za-2026.-i-projekcije-proracuna-za-2027.-i-2028.-godine.pdf',
          sourceLabel: 'Proračun Grada Slatine za 2026. ↗',
          items: [
            { name: 'Promet i gospodarstvo', amount: 4003009, detail: 'Funkcija 04 · uključuje promet, energiju i gospodarstvo' },
            { name: 'Zaštita okoliša', amount: 3397560, detail: 'Funkcija 05 · otpad, otpadne vode i okoliš' },
            { name: 'Stanovanje i zajednica', amount: 1119827, detail: 'Funkcija 06 · stanovanje, zajednica i ulična rasvjeta' },
            { name: 'Sport, kultura i zajednica', amount: 7917003.28, detail: 'Funkcija 08 · sport, kultura i druge službe zajednice' },
            { name: 'Obrazovanje', amount: 10061515, detail: 'Funkcija 09 · predškolsko i školsko obrazovanje' },
            { name: 'Socijalna zaštita', amount: 1388258.89, detail: 'Funkcija 10 · obitelj, stanovanje i socijalne usluge' }
          ]
        }
      }
    },
    vukovar: {
      label: 'Vukovar',
      selectionLabel: 'Odaberi prikaz',
      districts: {
        'funkcijska-klasifikacija': {
          label: 'Gradski proračun · odabrane funkcije',
          year: 2026,
          total: 67390496,
          envelopeLabel: 'Zbroj prikazanih funkcija',
          scopeNote: 'Funkcijska klasifikacija · plan 2026.',
          intro: 'Izdvojene su stavke za promet, okoliš, zajednicu, obrazovanje i socijalne usluge.',
          source: 'https://www.vukovar.hr/images/stories/files/uof/2026/Proracun/Proracun-2026-2028.pdf',
          sourceLabel: 'Proračun Grada Vukovara za 2026.–2028. ↗',
          items: [
            { name: 'Promet', amount: 8710000, detail: 'Funkcija 045 · gradski promet' },
            { name: 'Ostali gospodarski poslovi i energija', amount: 2956313, detail: 'Funkcije 041–043 i 047' },
            { name: 'Zaštita okoliša', amount: 1070000, detail: 'Funkcije 051–053 · otpad, vode i smanjenje zagađenja' },
            { name: 'Stanovanje, zajednica i rasvjeta', amount: 2598200, detail: 'Funkcije 061, 062 i 064' },
            { name: 'Sport, kultura i zajednica', amount: 9301278, detail: 'Funkcije 081, 082 i 084, uključujući proračunske korisnike' },
            { name: 'Obrazovanje', amount: 40738455, detail: 'Predškolsko, osnovno, srednjoškolsko i visoko obrazovanje' },
            { name: 'Socijalna zaštita', amount: 2016250, detail: 'Bolest, starost, obitelj, stanovanje i socijalna pomoć' }
          ]
        }
      }
    },
    valpovo: {
      label: 'Valpovo',
      selectionLabel: 'Odaberi prikaz',
      districts: {
        'funkcijska-klasifikacija': {
          label: 'Gradski proračun · odabrane funkcije',
          year: 2026,
          total: 14375354.05,
          envelopeLabel: 'Zbroj odabranih funkcija',
          scopeNote: 'Odabrane funkcije · plan 2026.',
          intro: 'Prikazan je plan prije predloženog III. rebalansa. Njegove nove vrijednosti nisu uključene.',
          source: 'https://valpovo.hr/proracun/',
          sourceLabel: 'Službeni proračunski dokumenti Valpova',
          items: [
            { name: 'Promet i gospodarstvo', amount: 4961600, detail: 'Funkcija 04 · ekonomski poslovi' },
            { name: 'Zaštita okoliša', amount: 1013000, detail: 'Funkcija 05 · zaštita okoliša' },
            { name: 'Stanovanje i zajednica', amount: 2989100, detail: 'Funkcija 06 · stanovanje i zajednica' },
            { name: 'Sport i kultura', amount: 2119404.05, detail: 'Funkcija 08 · rekreacija, kultura i religija' },
            { name: 'Obrazovanje', amount: 2628150, detail: 'Funkcija 09 · obrazovanje' },
            { name: 'Socijalna zaštita', amount: 664100, detail: 'Funkcija 10 · socijalna zaštita' }
          ]
        }
      }
    },
    zagreb: {
      label: 'Zagreb',
      selectionLabel: 'Odaberi prikaz',
      districts: {
        'pocetni-plan': {
          label: 'Početni usvojeni plan · prije izmjena',
          year: 2026,
          total: 2484265290,
          envelopeLabel: 'Zbroj odabranih funkcija',
          scopeNote: 'Funkcijska klasifikacija · početni plan 2026.',
          intro: 'Ovaj scenarij koristi početni usvojeni plan. Rujanske izmjene za 2026. nisu uključene jer najnovija funkcijska tablica nije obrađena.',
          source: 'https://www.zagreb.hr/proracun/113894',
          sourceLabel: 'Službeni proračunski dokumenti Grada Zagreba',
          items: [
            { name: 'Promet i gospodarstvo', amount: 354781100, detail: 'Funkcija 04 · ekonomski poslovi' },
            { name: 'Zaštita okoliša', amount: 126392900, detail: 'Funkcija 05 · zaštita okoliša' },
            { name: 'Stanovanje i zajednica', amount: 434261300, detail: 'Funkcija 06 · stanovanje i unapređenje zajednice' },
            { name: 'Sport i kultura', amount: 363445100, detail: 'Funkcija 08 · rekreacija, kultura i religija' },
            { name: 'Obrazovanje', amount: 1023466120, detail: 'Funkcija 09 · obrazovanje' },
            { name: 'Socijalna zaštita', amount: 181918770, detail: 'Funkcija 10 · socijalna zaštita' }
          ]
        }
      }
    },
    vinkovci: {
      label: 'Vinkovci',
      selectionLabel: 'Odaberi prikaz',
      districts: {
        'pocetni-plan': {
          label: 'Početni usvojeni plan · prije I. izmjena',
          year: 2026,
          total: 94845254.82,
          envelopeLabel: 'Zbroj odabranih funkcija',
          scopeNote: 'Funkcijska klasifikacija · početni plan 2026.',
          intro: 'Prikazan je početni usvojeni plan. I. izmjene od 27. 5. 2026. nisu uključene jer njihove detaljne tablice još nisu usklađene.',
          source: 'https://vinkovci.hr/preuzmi/dokumenti/proracun/Proracun%20u%20malom%202026.pdf',
          sourceLabel: 'Proračun u malom 2026. · početni plan',
          items: [
            { name: 'Promet i gospodarstvo', amount: 18581614.85, detail: 'Funkcija 04 · ekonomski poslovi' },
            { name: 'Zaštita okoliša', amount: 1686046.14, detail: 'Funkcija 05 · zaštita okoliša' },
            { name: 'Stanovanje i zajednica', amount: 20552696.90, detail: 'Funkcija 06 · stanovanje i unapređenje zajednice' },
            { name: 'Sport i kultura', amount: 6800879.85, detail: 'Funkcija 08 · rekreacija, kultura i religija' },
            { name: 'Obrazovanje', amount: 44987797.59, detail: 'Funkcija 09 · obrazovanje' },
            { name: 'Socijalna zaštita', amount: 2236219.49, detail: 'Funkcija 10 · socijalna zaštita' }
          ]
        }
      }
    },
    belisce: {
      label: 'Belišće',
      selectionLabel: 'Odaberi prikaz',
      districts: {
        'pocetni-plan': {
          label: 'Početni usvojeni plan · prije II. izmjena',
          year: 2026,
          total: 31641383.40,
          envelopeLabel: 'Ukupno po odjelima',
          scopeNote: 'Organizacijska klasifikacija · početni plan 2026.',
          intro: 'Ovo je početni plan po upravnim odjelima. II. izmjene objavljene kasnije tijekom 2026. nisu uključene.',
          source: 'https://belisce.hr/wp-content/uploads/2026/01/Vodic-za-gradane-Proracun-u-malom-Grada-Belisca-za-2026.-godinu.pdf',
          sourceLabel: 'Proračun u malom Belišća · 2026.',
          items: [
            { name: 'Ured gradonačelnika', amount: 1647912, detail: 'Ured gradonačelnika i tajništvo grada' },
            { name: 'Financije i otplata zajmova', amount: 17150400, detail: 'Uključuje 16.775.000 € planiranih povrata zajmova' },
            { name: 'Komunalne djelatnosti', amount: 1897600, detail: 'Komunalna infrastruktura, imovina i uređenje naselja' },
            { name: 'Društvene djelatnosti', amount: 4864330.40, detail: 'Vrtić, školstvo, socijalna skrb, sport, kultura i civilno društvo' },
            { name: 'Prostorno planiranje i gospodarstvo', amount: 6081141, detail: 'Prostorno planiranje, gospodarstvo, okoliš i EU projekti' }
          ]
        }
      }
    },
    djakovo: {
      label: 'Đakovo',
      selectionLabel: 'Odaberi prikaz',
      districts: {
        'funkcijska-klasifikacija': {
          label: 'Gradski proračun · odabrane funkcije',
          year: 2026,
          total: 47574000,
          envelopeLabel: 'Zbroj odabranih funkcija',
          scopeNote: 'Funkcijska klasifikacija · II. rebalans 2026.',
          intro: 'Prikazan je II. rebalans. Šest odabranih funkcija čini 47.574.000 € od ukupno 51.549.000 € funkcijskih rashoda.',
          source: 'https://www.djakovo.hr/index.php/component/phocadownload/category/49-proracun.html?download=3573:2-rebalans-proracuna-grada-dakova-za-2026-godinu',
          sourceLabel: 'II. rebalans proračuna 2026. · službeni PDF',
          items: [
            { name: 'Promet i gospodarstvo', amount: 9384000, detail: 'Funkcija 04 · ekonomski poslovi' },
            { name: 'Zaštita okoliša', amount: 1863000, detail: 'Funkcija 05 · zaštita okoliša' },
            { name: 'Stanovanje i zajednica', amount: 23826000, detail: 'Funkcija 06 · stanovanje i unapređenje zajednice' },
            { name: 'Sport i kultura', amount: 6258000, detail: 'Funkcija 08 · rekreacija, kultura i religija' },
            { name: 'Obrazovanje', amount: 4780000, detail: 'Funkcija 09 · obrazovanje' },
            { name: 'Socijalna zaštita', amount: 1463000, detail: 'Funkcija 10 · socijalna zaštita' }
          ]
        }
      }
    },
    virovitica: {
      label: 'Virovitica',
      selectionLabel: 'Odaberi prikaz',
      districts: {
        'funkcijska-klasifikacija': {
          label: 'Gradski proračun · odabrane funkcije',
          year: 2026,
          total: 73329364,
          envelopeLabel: 'Zbroj odabranih funkcija',
          scopeNote: 'Odabrane funkcije · II. rebalans 2026.',
          intro: 'Rasporedi sredstva među gradskim uslugama i usporedi svoj izbor s planom.',
          source: 'https://www.virovitica.hr/wp-content/uploads/2026/06/II.-Izmjene-i-dopune-Proracuna-Grada-Virovitice-za-2026.-godinu.pdf',
          sourceLabel: 'II. izmjene i dopune · 25. 6. 2026.',
          items: [
            { name: 'Promet i gospodarstvo', amount: 287037, detail: 'Funkcija 04 · ekonomski poslovi' },
            { name: 'Zaštita okoliša', amount: 1256680, detail: 'Funkcija 05 · zaštita okoliša' },
            { name: 'Stanovanje i zajednica', amount: 24709265, detail: 'Funkcija 06 · stanovanje i komunalne usluge' },
            { name: 'Sport i kultura', amount: 4487170, detail: 'Funkcija 08 · rekreacija i kultura' },
            { name: 'Obrazovanje', amount: 42206512, detail: 'Funkcija 09 · obrazovanje' },
            { name: 'Socijalna zaštita', amount: 382700, detail: 'Funkcija 10 · socijalna zaštita' }
          ]
        }
      }
    },
  },
  upcoming: [
    { id: 'nova-gradiska', label: 'Nova Gradiška', note: '10. sjednica zakazana za 11. 11. 2026.; točka 2 je polugodišnje izvršenje, ne rebalans; početne tablice treba izvući', source: 'https://novagradiska.hr/wp-file-download-search/' },
    { id: 'požega', label: 'Požega', note: 'I. izmjene od 26. 6.; 12. sjednica 15. 9. usvojila izvršenje; najavljen rebalans krajem listopada, treba potvrditi usvajanje', source: 'https://pozega.hr/proracun/proracun-grada-pozege-za-razdoblje-2026-2028-godine' },
  ]};