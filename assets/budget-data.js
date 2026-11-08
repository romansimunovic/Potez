/* POTEZ municipal-budget simulation.
   Population inputs are municipality/city-unit census 2021 counts.
   Budget envelopes and category allocations are educational estimates, not adopted plans.
*/
(function () {
  const categories = [
    {
      id: "education",
      name: "Vrtići, škole i mladi",
      icon: "🎓",
      share: 24,
      detail: "Vrtići i škole, produženi boravak, stipendije, učenički i studentski standard, programi za mlade, prostori za mlade i neformalno obrazovanje."
    },
    {
      id: "housing",
      name: "Stanovanje i razvoj prostora",
      icon: "🏘️",
      share: 14,
      detail: "Prostorno planiranje, uređenje naselja, priuštivo stanovanje, gradsko zemljište, obnova javnih prostora i planiranje novih sadržaja."
    },
    {
      id: "mobility",
      name: "Promet i sigurnost",
      icon: "🚌",
      share: 18,
      detail: "Javni prijevoz, autobusna stajališta, nogostupi, biciklističke staze, sigurni prijelazi, prometna rješenja i održavanje lokalnih cesta."
    },
    {
      id: "utilities",
      name: "Komunalna infrastruktura",
      icon: "🛠️",
      share: 14,
      detail: "Javna rasvjeta, odvodnja, održavanje ulica, trgova i igrališta, komunalna oprema i dostupnost osnovnih gradskih usluga."
    },
    {
      id: "environment",
      name: "Okoliš i energija",
      icon: "🌱",
      share: 10,
      detail: "Parkovi i zelenilo, sadnja drveća, odvojeno prikupljanje otpada, energetska obnova javnih zgrada, kvaliteta zraka i prilagodba klimatskim promjenama."
    },
    {
      id: "culture",
      name: "Sport, kultura i zajednica",
      icon: "🎭",
      share: 11,
      detail: "Knjižnice, kulturni centri, sportski objekti, klubovi, rekreacija, događanja, udruge i prostori za druženje."
    },
    {
      id: "social",
      name: "Socijalna podrška",
      icon: "🤝",
      share: 9,
      detail: "Pomoć starijima i kućanstvima u potrebi, dostupnost socijalnih usluga, podrška osobama s invaliditetom, prevencija i lokalni programi solidarnosti."
    }
  ];

  // [key, label, population, preschool+grades-1-to-4, local-cost-factor, visitor-pressure]
  // The first two demographic figures come from the 2021 census table for local government units.
  const profiles = [
    ["zagreb", "Zagreb", 767131, 51459, 1.12, 0.0],
    ["split", "Split", 160577, 9755, 1.05, 1.2],
    ["rijeka", "Rijeka", 107964, 5420, 1.00, 0.2],
    ["osijek", "Osijek", 96313, 5186, 1.00, 0.0],
    ["zadar", "Zadar", 70779, 4482, 1.04, 0.8],
    ["velika-gorica", "Velika Gorica", 61075, 3979, 0.96, 0.0],
    ["pula", "Pula", 52220, 2871, 1.00, 0.8],
    ["slavonski-brod", "Slavonski Brod", 49891, 2645, 0.96, 0.0],
    ["karlovac", "Karlovac", 49377, 2505, 0.96, 0.0],
    ["varazdin", "Varaždin", 43782, 2335, 1.00, 0.0],
    ["sibenik", "Šibenik", 42599, 2396, 1.02, 1.0],
    ["dubrovnik", "Dubrovnik", 41562, 2611, 1.12, 1.5],
    ["sisak", "Sisak", 40121, 2051, 0.94, 0.0],
    ["kastela", "Kaštela", 37794, 2530, 0.99, 0.5],
    ["samobor", "Samobor", 37435, 2371, 0.94, 0.0],
    ["bjelovar", "Bjelovar", 36316, 1977, 0.93, 0.0],
    ["vinkovci", "Vinkovci", 30842, 1889, 0.95, 0.0],
    ["koprivnica", "Koprivnica", 28580, 1687, 0.94, 0.0],
    ["cakovec", "Čakovec", 27122, 1859, 0.97, 0.0],
    ["solin", "Solin", 24862, 1837, 1.00, 0.3],
    ["zapresic", "Zaprešić", 24133, 1586, 0.95, 0.0],
    ["djakovo", "Đakovo", 23577, 1248, 0.93, 0.0],
    ["sinj", "Sinj", 23452, 1375, 0.93, 0.0],
    ["vukovar", "Vukovar", 23175, 1242, 0.97, 0.0],
    ["pozega", "Požega", 22294, 1049, 0.92, 0.0],
    ["petrinja", "Petrinja", 19950, 947, 0.95, 0.0],
    ["kutina", "Kutina", 19601, 1066, 0.94, 0.0],
    ["virovitica", "Virovitica", 19302, 1039, 0.97, 0.0],
    ["krizevci", "Križevci", 18949, 988, 0.94, 0.0],
    ["sveta-nedelja", "Sveta Nedelja", 18221, 1193, 0.96, 0.0],
    ["dugo-selo", "Dugo Selo", 17676, 1173, 0.94, 0.0],
    ["porec", "Poreč", 16607, 1013, 1.04, 1.0],
    ["metkovic", "Metković", 15235, 995, 0.94, 0.0],
    ["nasice", "Našice", 14291, 765, 0.92, 0.0],
    ["omis", "Omiš", 14139, 833, 1.00, 0.8],
    ["makarska", "Makarska", 13301, 757, 1.04, 1.2],
    ["rovinj", "Rovinj", 12968, 755, 1.06, 1.3],
    ["nova-gradiska", "Nova Gradiška", 11690, 545, 0.91, 0.0],
    ["slatina", "Slatina", 11503, 546, 0.90, 0.0],
    ["valpovo", "Valpovo", 9784, 530, 0.90, 0.0],
    ["belisce", "Belišće", 8884, 448, 0.90, 0.0],
    ["beli-manastir", "Beli Manastir", 7973, 399, 0.90, 0.0]
  ];

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const roundTo = (value, step) => Math.round(value / step) * step;

  function buildCity(profile) {
    const [key, label, population, children, localCost, visitorPressure] = profile;

    // A shared illustrative annual fund: residents x €3,400, adjusted by local
    // service-cost pressure, plus a modest fixed operating base and visitor load.
    const total = roundTo(
      population * 3400 * localCost + 5000000 + visitorPressure * 5000000,
      100000
    );

    // More preschool/early-primary children modestly raises the education share.
    // This is a demand proxy, not a count of all residents aged 15–29.
    const childRatio = children / population;
    const educationShift = clamp((childRatio - 0.055) * 45, -2, 2);
    const shares = categories.map((item) => item.share);
    shares[0] += educationShift;
    shares[1] -= educationShift * 0.4;
    shares[3] -= educationShift * 0.6;

    let allocated = 0;
    const items = categories.map((item, index) => {
      const amount = index === categories.length - 1
        ? total - allocated
        : roundTo(total * shares[index] / 100, 1000);
      allocated += amount;
      return {
        id: item.id,
        name: item.name,
        icon: item.icon,
        amount,
        share: shares[index],
        detail: item.detail
      };
    });

    return {
      label,
      year: 2026,
      population,
      children,
      total,
      items
    };
  }

  const cities = Object.fromEntries(profiles.map((profile) => [profile[0], buildCity(profile)]));

  window.POTEZ_BUDGET_DATA = {
    model: "population-based-illustrative",
    year: 2026,
    populationReference: "Popis stanovništva 2021. · jedinice lokalne samouprave",
    youthProxy: "Djeca predškolske dobi i učenici I.–IV. razreda osnovne škole",
    cities
  };
})();
