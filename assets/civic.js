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

  const shareDuel = $('#shareBudgetChallenge');
  if (shareDuel) {
    shareDuel.addEventListener('click', async () => {
      const message = 'Imam POTEZ izazov: rasporedi 100.000 € za grad i usporedi prioritete sa mnom. Bez kviza o političkim stavovima — samo odluke i argumenti. https://potez.pages.dev/#budzet';
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
  renderDuelStatus();
  window.addEventListener('potez:progress', renderPassport);
  window.addEventListener('storage', (event) => {
    if (!event.key || event.key === STORE || event.key === DUEL_STORE) {
      renderPassport();
      renderDuelStatus();
    }
  });
})();
