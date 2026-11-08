/* POTEZ civic journey — local-only progress and peer comparison.
   No accounts, network calls, analytics, or political-preference profiling. */
(() => {
  'use strict';

  const STORE = 'potez-demo-v1';
  const DUEL_STORE = 'potez-budget-duel-v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const xpRanks = [
    { min: 0, title: 'Radoznalac', description: 'Kreni od jednog pitanja. Svaki izazov otvara novu vještinu.' },
    { min: 10, title: 'Istraživač', description: 'Već si počeo/la povezivati informacije i širu sliku.' },
    { min: 20, title: 'Provjeravatelj', description: 'Sve češće pitaš: tko to tvrdi i koji je dokaz?' },
    { min: 35, title: 'Promišljeni sudionik', description: 'Razumiješ da odluke traže prioritete, argumente i odgovornost.' },
    { min: 50, title: 'Pokretač promjene', description: 'Znanje pretvaraš u konkretan korak i uključuješ druge.' }
  ];

  const mainMissions = [
    { key: 'quizDone', title: 'Razumi kontekst', desc: 'Odvoji mitove o mladima od onoga što podaci stvarno pokazuju.', href: '#izazov', badge: 'Čitač podataka', points: 15 },
    { key: 'factDone', title: 'Provjeri prije dijeljenja', desc: 'Razlikuj činjenicu, mišljenje i tvrdnju koju tek treba potvrditi.', href: '#provjera', badge: 'Tragač za dokazima', points: 10 },
    { key: 'budgetDone', title: 'Vagaj javne prioritete', desc: 'Rasporedi ograničen novac i promisli tko dobiva, a tko čeka.', href: '#budzet', badge: 'Čuvar javnog novca', points: 15 },
    { key: 'actionDone', title: 'Pronađi put do odluke', desc: 'Pretvori problem u konkretan upit, prijedlog ili inicijativu.', href: '#akcija', badge: 'Prvi potez', points: 5 }
  ];

  const weeklyTasks = [
    { title: 'Prati jednu javnu odluku', href: '#resursi' },
    { title: 'Provjeri izvor jedne tvrdnje', href: '#provjera' },
    { title: 'Pronađi tko je nadležan za problem', href: '#razine' },
    { title: 'Usporedi dva javna prioriteta', href: '#budzet' }
  ];

  function readSaved() {
    const defaults = { xp: 0, quizDone: false, factDone: false, budgetDone: false, actionDone: false };
    try {
      const value = JSON.parse(localStorage.getItem(STORE) || '{}');
      return value && typeof value === 'object' ? { ...defaults, ...value } : defaults;
    } catch {
      return defaults;
    }
  }

  function weekStamp() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const year = date.getFullYear();
    const start = new Date(year, 0, 1);
    const week = Math.ceil((((date - start) / 86400000) + 1) / 7);
    return year + '-' + String(week).padStart(2, '0');
  }

  function notify(message) {
    const element = $('#toast');
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => element.classList.remove('show'), 2600);
  }

  function renderPassport() {
    const saved = readSaved();
    const xp = Math.max(0, Number(saved.xp) || 0);
    let rankIndex = 0;
    for (let i = 0; i < xpRanks.length; i += 1) {
      if (xp >= xpRanks[i].min) rankIndex = i;
    }
    const rank = xpRanks[rankIndex];
    const nextRank = xpRanks[rankIndex + 1];
    const points = $('#passportPoints');
    const title = $('#passportRank');
    const description = $('#passportDescription');
    const fill = $('#passportFill');
    const track = $('#passportTrack');
    const next = $('#passportNext');
    if (!points || !title || !description || !fill || !track || !next) return;

    points.textContent = xp + ' XP';
    title.textContent = rank.title;
    description.textContent = rank.description;

    if (nextRank) {
      const progress = Math.max(0, Math.min(100, ((xp - rank.min) / (nextRank.min - rank.min)) * 100));
      fill.style.width = progress + '%';
      track.setAttribute('aria-valuenow', String(Math.round(progress)));
      next.textContent = 'Još ' + (nextRank.min - xp) + ' XP do razine: ' + nextRank.title + '.';
    } else {
      fill.style.width = '100%';
      track.setAttribute('aria-valuenow', '100');
      next.textContent = 'Dosegnuta najviša razina. Nastavi istraživati i dijeliti znanje.';
    }

    const completed = mainMissions.filter((mission) => Boolean(saved[mission.key])).length;
    const completedElement = $('#passportCompleted');
    const badgeCount = $('#passportBadgesCount');
    const badges = $('#passportBadges');
    const path = $('#passportPath');
    if (completedElement) completedElement.textContent = completed + '/4';
    const weekDone = saved.weeklyDoneKey === weekStamp();
    const earnedBadges = mainMissions.filter((mission) => Boolean(saved[mission.key])).length + (weekDone ? 1 : 0);
    if (badgeCount) badgeCount.textContent = String(earnedBadges);

    if (badges) {
      badges.replaceChildren();
      mainMissions.forEach((mission) => {
        const item = document.createElement('span');
        item.className = 'skill-badge' + (saved[mission.key] ? '' : ' locked');
        item.textContent = (saved[mission.key] ? '✓ ' : '○ ') + mission.badge;
        badges.appendChild(item);
      });
      const weeklyBadge = document.createElement('span');
      weeklyBadge.className = 'skill-badge' + (weekDone ? '' : ' locked');
      weeklyBadge.textContent = (weekDone ? '✓ ' : '○ ') + 'Tjedni ritam';
      badges.appendChild(weeklyBadge);
    }

    if (path) {
      path.replaceChildren();
      mainMissions.forEach((mission, index) => {
        const done = Boolean(saved[mission.key]);
        const card = document.createElement('a');
        card.className = 'path-card' + (done ? ' done' : '');
        card.href = mission.href;
        const step = document.createElement('span');
        step.textContent = 'KORAK ' + String(index + 1).padStart(2, '0') + ' · ' + mission.points + ' XP';
        const heading = document.createElement('strong');
        heading.textContent = mission.title;
        const detail = document.createElement('span');
        detail.textContent = mission.desc;
        const state = document.createElement('span');
        state.className = 'path-state';
        state.textContent = done ? 'Završeno ✓' : 'Otvori misiju →';
        card.append(step, heading, detail, state);
        path.appendChild(card);
      });

      const weekly = document.createElement('a');
      weekly.className = 'path-card' + (weekDone ? ' done' : '');
      weekly.href = '#weeklyTitle';
      const weeklyStep = document.createElement('span');
      weeklyStep.textContent = 'PONAVLJA SE SVAKI TJEDAN · 8 XP';
      const weeklyHeading = document.createElement('strong');
      weeklyHeading.textContent = 'Izađi iz aplikacije';
      const weeklyDetail = document.createElement('span');
      weeklyDetail.textContent = 'Napravi jedan mali korak u stvarnom svijetu — pregledaj odluku, pitaj instituciju ili provjeri izvor.';
      const weeklyState = document.createElement('span');
      weeklyState.className = 'path-state';
      weeklyState.textContent = weekDone ? 'Tjedna misija završena ✓' : 'Otvori tjednu misiju →';
      weekly.append(weeklyStep, weeklyHeading, weeklyDetail, weeklyState);
      path.appendChild(weekly);
    }
  }

  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) throw new Error('Kopiranje nije podržano u ovom pregledniku.');
  }

  const shareProgress = $('#shareProgress');
  if (shareProgress) {
    shareProgress.addEventListener('click', async () => {
      const saved = readSaved();
      const xp = Math.max(0, Number(saved.xp) || 0);
      const rank = xpRanks.reduce((current, item) => xp >= item.min ? item : current, xpRanks[0]);
      const completed = mainMissions.filter((mission) => Boolean(saved[mission.key])).length;
      const message = 'Moj POTEZ napredak: ' + rank.title + ', ' + xp + ' XP i ' + completed + '/4 glavna izazova. Isprobaj i ti — politika se tiče svakodnevnih odluka: https://potez.pages.dev/';
      try {
        if (navigator.share) {
          await navigator.share({ title: 'Moj POTEZ napredak', text: message, url: 'https://potez.pages.dev/' });
        } else {
          await copyText(message);
          notify('Poziv je kopiran. Pošalji ga nekome.');
        }
      } catch (error) {
        if (error && error.name !== 'AbortError') notify('Dijeljenje nije uspjelo. Pokušaj ponovno.');
      }
    });
  }


  const dailyQuestions = [
    {
      question: 'U grupnom chatu kruži tvrdnja da se od sutra ukida učenički prijevoz. Nema poveznice ni datuma. Što je najbolji prvi korak?',
      options: ['Podijeliti upozorenje da svi budu spremni', 'Pronaći izvornu odluku i provjeriti datum i tijelo koje ju je donijelo', 'Zaključiti da je tvrdnja lažna jer nema izvora'],
      correct: 1,
      explanation: 'Najprije traži izvornu odluku, datum i tijelo koje ju je donijelo. Bez toga je tvrdnja nepotvrđena — ne automatski istinita ili lažna.'
    },
    {
      question: 'Tko u pravilu donosi i usvaja gradski proračun u Hrvatskoj?',
      options: ['Gradsko vijeće, na prijedlog gradonačelnika', 'Isključivo ministarstvo financija', 'Mjesni odbor'],
      correct: 0,
      explanation: 'Predstavničko tijelo donosi proračun, a gradonačelnik predlaže i izvršava proračun. Zato je važno pratiti i prijedlog i glasanje.'
    },
    {
      question: 'U kvartu je oštećena autobusna nadstrešnica. Što prvo treba utvrditi?',
      options: ['Koja je stranka osvojila najviše glasova', 'Tko je vlasnik ili upravitelj nadstrešnice i tko je nadležan za održavanje', 'Je li problem postao viralan'],
      correct: 1,
      explanation: 'Nadležnost može ovisiti o vlasništvu, ugovoru i vrsti prometnice. Prvi korak je pronaći odgovorno tijelo ili operatora, a ne nagađati.'
    },
    {
      question: 'Što znači sudjelovati u javnom savjetovanju o prijedlogu propisa?',
      options: ['Komentar automatski postaje zakon', 'Možeš poslati argumentiran komentar koji nadležno tijelo razmatra i na njega se očituje', 'Glasaš o tome tko će biti ministar'],
      correct: 1,
      explanation: 'Savjetovanje omogućuje građanima i organizacijama komentiranje prijedloga. Tijelo razmatra komentare i objavljuje očitovanje, ali ih ne mora sve prihvatiti.'
    },
    {
      question: 'U školi želiš promijeniti pravilo koje utječe na učenike. Gdje je smisleno početi?',
      options: ['Od vijeća učenika i tijela škole, uz provjeru zakonskih pravila', 'Od Europske središnje banke', 'Od nasumične objave na društvenoj mreži'],
      correct: 0,
      explanation: 'Dio pravila može se rješavati unutar škole, dok su druga određena nacionalnim propisima. Prvo utvrdi tko ima ovlast odlučivanja.'
    },
    {
      question: 'Županija, grad i država mogu biti uključeni u istu javnu uslugu. Što je najbolje pitati?',
      options: ['Koja je razina najvažnija općenito', 'Tko donosi pravilo, tko osigurava sredstva i tko provodi uslugu', 'Tko ima najviše pratitelja'],
      correct: 1,
      explanation: 'Javne ovlasti često su podijeljene. Razdvajanje pravila, financiranja i provedbe pomaže pronaći pravu instituciju i smislen način utjecaja.'
    },
    {
      question: 'Grupa mladih želi predložiti novi prostor za sport i druženje. Koji prijedlog ima čvršće temelje?',
      options: ['„Napravite nam nešto lijepo”', 'Prijedlog s lokacijom, korisnicima, okvirnim troškom, održavanjem i podrškom zajednice', 'Samo broj lajkova na objavi'],
      correct: 1,
      explanation: 'Dobar prijedlog pokazuje kome koristi, gdje se može provesti, koliko okvirno košta i tko će ga održavati. To olakšava instituciji da ga procijeni.'
    }
  ];

  function todayStamp() {
    const date = new Date();
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }

  function renderDailyQuestion() {
    const questionNode = $('#dailyQuestion');
    const choicesNode = $('#dailyChoices');
    const dateNode = $('#dailyDate');
    const feedbackNode = $('#dailyFeedback');
    if (!questionNode || !choicesNode || !dateNode || !feedbackNode) return;

    const today = todayStamp();
    const start = new Date(new Date().getFullYear(), 0, 1);
    const elapsed = Math.floor((new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) - start) / 86400000);
    const item = dailyQuestions[elapsed % dailyQuestions.length];
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch {}
    const alreadyDone = saved.dailyDoneStamp === today;

    dateNode.textContent = new Intl.DateTimeFormat('hr-HR', { dateStyle: 'full' }).format(new Date());
    questionNode.textContent = item.question;
    choicesNode.replaceChildren();
    feedbackNode.textContent = alreadyDone
      ? 'Današnja misija već je uračunata u tvoj napredak. Možeš ponovno pročitati objašnjenje, ali bodove ne skupljaš ponavljanjem.'
      : '';

    item.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'daily-choice';
      button.textContent = option;
      button.addEventListener('click', () => {
        if (choicesNode.dataset.answered === today) return;
        choicesNode.dataset.answered = today;
        const correct = index === item.correct;
        Array.from(choicesNode.querySelectorAll('button')).forEach((choice, choiceIndex) => {
          choice.disabled = true;
          if (choiceIndex === item.correct) choice.classList.add('correct');
          if (choiceIndex === index && !correct) choice.classList.add('wrong');
        });

        let current = {};
        try { current = JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch {}
        const earnedToday = current.dailyDoneStamp === today;
        if (!earnedToday) {
          current.dailyDoneStamp = today;
          current.xp = Math.max(0, Number(current.xp) || 0) + 3;
          try {
            localStorage.setItem(STORE, JSON.stringify(current));
            window.dispatchEvent(new CustomEvent('potez:progress'));
          } catch {}
          window.POTEZ_FEEDBACK?.success();
        }

        feedbackNode.textContent = (correct ? 'Točno. +3 XP. ' : 'Dobar pokušaj — pogledaj zašto. +3 XP. ') +
          item.explanation + (earnedToday ? ' Današnji bodovi već su bili uračunati.' : '');
        notify(earnedToday ? 'Odgovor zabilježen.' : '+3 XP · dnevno pitanje');
      });
      choicesNode.appendChild(button);
    });

    if (alreadyDone) {
      choicesNode.dataset.answered = today;
      Array.from(choicesNode.querySelectorAll('button')).forEach((button) => { button.disabled = true; });
      const previous = item.explanation;
      feedbackNode.textContent += ' Objašnjenje: ' + previous;
    } else {
      delete choicesNode.dataset.answered;
    }
  }

  const categoryNames = [
    'Sigurnije rute',
    'Prostor za mlade',
    'Autobusne veze',
    'Kultura i sport',
    'Podrška mentalnom zdravlju'
  ];
  const budgetIds = ['b1', 'b2', 'b3', 'b4', 'b5'];
  const formatEuro = (amount) => new Intl.NumberFormat('hr-HR', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0
  }).format(amount);

  function readDuel() {
    try {
      const value = JSON.parse(localStorage.getItem(DUEL_STORE) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {};
    }
  }

  function currentBudget() {
    return budgetIds.map((id) => {
      const input = $('#' + id);
      return input ? Number(input.value) : 0;
    });
  }

  function renderDuelStatus() {
    const saved = readDuel();
    const status = $('#budgetDuelStatus');
    if (!status) return;
    const hasA = Array.isArray(saved.a) && saved.a.length === 5;
    const hasB = Array.isArray(saved.b) && saved.b.length === 5;
    status.textContent = hasA && hasB
      ? 'Oba izbora su spremljena. Usporedite razlike — ne tražite pobjednika.'
      : hasA
        ? 'Izbor A je spremljen. Sada neka igrač B promijeni raspodjelu i spremi svoj izbor.'
        : hasB
          ? 'Izbor B je spremljen. Spremite još raspodjelu igrača A.'
          : 'Još nema spremljenih izbora. Prvo spremite raspodjelu igrača A.';
    const shareResult = $('#shareBudgetResult');
    if (shareResult) shareResult.disabled = !(hasA && hasB);
  }

  function saveBudget(slot) {
    const values = currentBudget();
    const saved = readDuel();
    saved[slot] = values;
    try {
      localStorage.setItem(DUEL_STORE, JSON.stringify(saved));
      const label = slot.toUpperCase();
      notify('Izbor ' + label + ' spremljen na ovom uređaju.');
      renderDuelStatus();
    } catch {
      notify('Preglednik ne dopušta spremanje. Provjerite postavke pohrane.');
    }
  }

  const saveA = $('#saveBudgetA');
  const saveB = $('#saveBudgetB');
  const compare = $('#compareBudgets');
  const resetDuel = $('#resetBudgetDuel');
  const duelResult = $('#budgetDuelResult');

  if (saveA) saveA.addEventListener('click', () => saveBudget('a'));
  if (saveB) saveB.addEventListener('click', () => saveBudget('b'));

  if (compare && duelResult) {
    compare.addEventListener('click', () => {
      const saved = readDuel();
      if (!Array.isArray(saved.a) || saved.a.length !== 5 || !Array.isArray(saved.b) || saved.b.length !== 5) {
        notify('Najprije spremite oba izbora.');
        return;
      }
      const sameCount = saved.a.reduce((count, amount, index) => count + (Math.abs(amount - saved.b[index]) < 5000 ? 1 : 0), 0);
      const largest = categoryNames.map((name, index) => ({
        name,
        difference: Math.abs(saved.a[index] - saved.b[index]),
        a: saved.a[index],
        b: saved.b[index]
      })).sort((left, right) => right.difference - left.difference);

      const lines = [
        'Slični prioriteti u ' + sameCount + '/5 područja (razlika manja od 5.000 €).',
        '',
        ...largest.map((item) => item.name + ': A ' + formatEuro(item.a) + ' · B ' + formatEuro(item.b) + ' · razlika ' + formatEuro(item.difference)),
        '',
        'Za razgovor: za koga je ova razlika važna? Koji bi podatak ili iskustvo promijenili vaš izbor?'
      ];
      duelResult.textContent = lines.join('\n');
      renderDuelStatus();
    });
  }

  if (resetDuel) {
    resetDuel.addEventListener('click', () => {
      try {
        localStorage.removeItem(DUEL_STORE);
        if (duelResult) duelResult.textContent = '';
        renderDuelStatus();
        notify('Usporedba je obrisana.');
      } catch {
        notify('Usporedbu nije moguće obrisati u ovom pregledniku.');
      }
    });
  }

  const shareBudgetResult = $('#shareBudgetResult');
  if (shareBudgetResult) {
    shareBudgetResult.addEventListener('click', async () => {
      const saved = readDuel();
      if (!Array.isArray(saved.a) || !Array.isArray(saved.b)) {
        notify('Najprije spremite oba izbora.');
        return;
      }
      const summary = categoryNames.map((name, index) =>
        name + ': A ' + formatEuro(saved.a[index]) + ' / B ' + formatEuro(saved.b[index])
      );
      const message = 'Naša POTEZ usporedba prioriteta za 100.000 €:\n' + summary.join('\n') +
        '\n\nNije natjecanje — razgovarali smo o tome kome odluke koriste. https://potez.pages.dev/#budzet';
      try {
        if (navigator.share) {
          await navigator.share({ title: 'POTEZ — usporedba prioriteta', text: message, url: 'https://potez.pages.dev/#budzet' });
        } else {
          await copyText(message);
          notify('Usporedba je kopirana. Podijeli je s ekipom.');
        }
      } catch (error) {
        if (error && error.name !== 'AbortError') notify('Usporedbu nije moguće podijeliti.');
      }
    });
  }

  const shareDuel = $('#shareBudgetChallenge');
  if (shareDuel) {
    shareDuel.addEventListener('click', async () => {
      const message = 'Isprobaj POTEZ simulaciju: rasporedi 100.000 € za grad, pa mi pošalji svoj izbor. Usporedit ćemo prioritete i argumente. https://potez.pages.dev/#budzet';
      try {
        if (navigator.share) {
          await navigator.share({ title: 'POTEZ — izazov javnog budžeta', text: message, url: 'https://potez.pages.dev/#budzet' });
        } else {
          await copyText(message);
          notify('Poziv na izazov je kopiran.');
        }
      } catch (error) {
        if (error && error.name !== 'AbortError') notify('Poziv nije moguće podijeliti u ovom pregledniku.');
      }
    });
  }

  renderPassport();
  renderDailyQuestion();
  renderDuelStatus();
  window.addEventListener('potez:progress', renderPassport);
  window.addEventListener('storage', (event) => {
    if (!event.key || event.key === STORE || event.key === DUEL_STORE) {
      renderPassport();
      renderDuelStatus();
    }
  });
})();
