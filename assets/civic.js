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
      label: 'Javni natječaj · poštena pravila',
      title: 'Tko dobiva ugovor za novi skate-park?',
      story: 'Tvoja ekipa godinama traži siguran prostor za skejtanje. Grad napokon objavljuje natječaj za uređenje skate-parka. U dokumentima primijetiš da je osoba povezana s jednim ponuditeljem sudjelovala u povjerenstvu. Ne znaš je li to prijavljeno ni kako je ponuda ocijenjena.',
      question: 'Koji je tvoj najbolji prvi potez?',
      options: [
        { text: 'Nazvati poznanika u gradskoj upravi da „pogura” našu ponudu.', best: false, feedback: 'Veza nije kriterij. Neformalni pritisak narušava jednaku priliku i može ugroziti cijeli postupak. I tvoj projekt zaslužuje dobiti prostor zbog kvalitete, ne zbog poznanstva.' },
        { text: 'Zatražiti kriterije, zapisnik bodovanja i obrazloženu odluku.', best: true, feedback: 'To je najjači prvi korak. Traži dokumente koji pokazuju jesu li kriteriji bili poznati unaprijed, kako su ponude ocijenjene i je li mogući sukob interesa prijavljen i riješen.' },
        { text: 'Objaviti ime osobe i odmah je proglasiti lopovom.', best: false, feedback: 'Sumnja zaslužuje provjeru, ali sama povezanost nije dokaz korupcije. Drži se dokumentiranih činjenica i nemoj objavljivati osobne optužbe bez dokaza.' }
      ],
      outcome: 'Kad su kriteriji jasni, bodovanje obrazloženo, a mogući sukob interesa uredno provjeren, grad može izabrati izvođača bez pogodovanja. Skate-park dobiva sigurnosne standarde, rokove i javno objašnjenje odluke.',
      takeaway: 'Transparentnost nije kočnica projektu — ona pomaže da dobar projekt bude izveden pošteno.'
    },
    {
      label: 'Javni poziv · ista pravila za sve',
      title: 'Zašto je drugi projekt dobio više bodova?',
      story: 'Prijavili ste ideju za mali glazbeni festival na gradski natječaj za mlade. Rezultati su objavljeni, ali ne razumiješ zašto je drugi projekt dobio više bodova. U objavi nema detaljnog obrazloženja.',
      question: 'Kako možeš provjeriti je li odluka bila poštena?',
      options: [
        { text: 'Tražiti objavljene kriterije, svoje bodovanje i obrazloženje odluke.', best: true, feedback: 'Odlično. Usporedi kriterije objavljene prije prijave s obrazloženjem i bodovanjem. Ako nešto nije jasno, pošalji konkretan, pristojan upit organizatoru.' },
        { text: 'Ponuditi članu komisije uslugu ili poklon da idući put dobijete više bodova.', best: false, feedback: 'To je upravo pogodovanje koje narušava povjerenje i može biti protuzakonito. Ne pokušavaj utjecati na ocjenjivače privatnim koristima.' },
        { text: 'Zaključiti da je natječaj namješten i odustati od svega.', best: false, feedback: 'Možda postoji problem, a možda je drugi projekt bolje odgovorio na kriterije. Prvo prikupi dokumente; zaključak donesi na temelju provjerljivih razloga.' }
      ],
      outcome: 'Organizator objavljuje jasnije obrazloženje i omogućuje jednak uvid u kriterije. Vaša ekipa zna što idući put treba ojačati, a svi prijavitelji imaju isti okvir.',
      takeaway: 'Ne moraš „poznavati nekoga” da bi razumio/la odluku. Traži ista pravila i obrazloženje.'
    },
    {
      label: 'Grupni chat · provjeri prije dijeljenja',
      title: 'Ukida li se od ponedjeljka učenički prijevoz?',
      story: 'U razrednoj grupi netko pošalje screenshot s dramatičnom porukom: „Od ponedjeljka nema više besplatnog prijevoza!” Nema datuma, poveznice ni naziva institucije. Svi počinju paničariti.',
      question: 'Koji potez najviše pomaže ekipi?',
      options: [
        { text: 'Proslijediti screenshot svim razredima da budu spremni.', best: false, feedback: 'Tako se neprovjerena tvrdnja samo širi. Screenshot može biti star, izrezan ili izmišljen. Zaustavi lanac dok ne pronađeš izvor.' },
        { text: 'Pronaći izvornu odluku i provjeriti datum i nadležno tijelo.', best: true, feedback: 'Da. Traži službenu objavu, odluku ili obavijest prijevoznika i provjeri na koga se odnosi. Ako izvora nema, ispravan status je „nepotvrđeno”, ne „sigurno istinito” ili „lažno”.' },
        { text: 'Napisati da je vijest lažna jer nema poveznice.', best: false, feedback: 'Nedostatak poveznice nije dokaz da je tvrdnja lažna. Prvo provjeri izvor i datum; tek onda možeš odgovorno prenijeti zaključak.' }
      ],
      outcome: 'Učenici pronađu službenu obavijest: promjena se odnosi samo na jednu liniju i počinje kasnije. Razred podijeli provjerenu informaciju umjesto panike.',
      takeaway: 'Dobar digitalni potez nije najbrži share. To je pronalazak izvora i konteksta.'
    },
    {
      label: 'Škola · prijedlog koji se može provesti',
      title: 'Kako promijeniti pravilo koje svima smeta?',
      story: 'U školi se promijenio raspored korištenja zajedničkog prostora. Učenici se žale da nemaju gdje boraviti tijekom odmora. Objave na društvenim mrežama skupile su reakcije, ali pravilo ostaje isto.',
      question: 'Kako od pritužbe napraviti prijedlog na koji škola može odgovoriti?',
      options: [
        { text: 'Okupiti učenike, prikupiti konkretne primjere i predložiti rješenje vijeću učenika.', best: true, feedback: 'To je dobar početak. Prikupi iskustva bez nepotrebnih osobnih podataka, predloži izvedivu promjenu i zatraži da se prijedlog uputi nadležnom tijelu škole.' },
        { text: 'Objaviti imena nastavnika i prozivati ih u komentarima.', best: false, feedback: 'To može povrijediti osobe, zaoštriti odnos i ne rješava problem. Kritiziraj pravilo i postupak, ne izlaži pojedince pritisku.' },
        { text: 'Čekati da netko drugi pokrene stvar.', best: false, feedback: 'Možeš početi malim korakom. Nekoliko konkretnih primjera i prijedlog s jasnim razlogom često su korisniji od čekanja ili samo pritužbe.' }
      ],
      outcome: 'Vijeće učenika iznosi prijedlog na sastanku s upravom škole. Dogovara se probno rješenje i rok nakon kojeg će učenici i škola provjeriti funkcionira li.',
      takeaway: 'Sudjelovanje počinje kad problem pretvoriš u jasan prijedlog, a ne kad samo postane viralan.'
    },
    {
      label: 'Javni novac · izbor prioriteta',
      title: 'Grad ima 10.000 € viška u malom fondu za mlade.',
      story: 'Grad poziva mlade da predlože kako rasporediti 10.000 eura: oprema za sportski teren, prostor za probe ili bolja rasvjeta na putu do škole. Novca nema za sve.',
      question: 'Što čini prijedlog odgovornim i uvjerljivim?',
      options: [
        { text: 'Odabrati ono što je najpopularnije na društvenim mrežama.', best: false, feedback: 'Popularnost je signal interesa, ali ne govori tko još koristi prostor, koliko projekt košta ni tko će ga održavati.' },
        { text: 'Usporediti potrebe, broj korisnika, trošak, pristupačnost i održavanje.', best: true, feedback: 'Upravo to. Dobar prijedlog pokazuje kome koristi, koliko košta, tko bi mogao ostati izostavljen i može li se projekt održavati nakon početnog ulaganja.' },
        { text: 'Tražiti da se novac podijeli između prijateljskih ekipa.', best: false, feedback: 'Javni novac nije nagrada za bliskost. Potrebe zajednice i unaprijed poznati kriteriji moraju biti važniji od poznanstava.' }
      ],
      outcome: 'Mladi objave prijedloge s troškovima i koristima, a grad obrazloži odluku. Dio novca ide rasvjeti, dio opremi; za prostor za probe traži se dodatni izvor financiranja.',
      takeaway: 'Pravedna odluka ne znači da svi dobiju sve. Znači da su kriteriji jasni i odluka objašnjena.'
    },
    {
      label: 'Javno savjetovanje · tvoj komentar',
      title: 'Nova autobusna linija ne odgovara učenicima.',
      story: 'Grad objavi prijedlog izmjene voznog reda i otvori javno savjetovanje. Nova linija prolazi blizu škole, ali polazi deset minuta prije završetka nastave. Imaš nekoliko dana za komentar.',
      question: 'Koji komentar ima najveću šansu da bude koristan?',
      options: [
        { text: '„Ovo je glupost, napravite nešto normalno.”', best: false, feedback: 'Razumljivo je da si frustriran/a, ali ovakav komentar ne daje tijelu podatak na temelju kojeg može promijeniti prijedlog.' },
        { text: 'Navesti vrijeme završetka nastave, postojeći vozni red i predložiti polazak 15 minuta kasnije.', best: true, feedback: 'To je konkretno i provjerljivo. Opiši problem, pokaži na koga utječe i predloži izvedivu izmjenu uz podatke ili primjere.' },
        { text: 'Poslati isti komentar više puta s različitih profila.', best: false, feedback: 'Umjetno umnažanje komentara ne čini argument jačim. Jedan dobro obrazložen komentar vrijedi više od lažnog dojma masovne podrške.' }
      ],
      outcome: 'U očitovanju se navodi da je vrijeme polaska prilagođeno završetku nastave i da će se nakon mjesec dana pratiti broj putnika.',
      takeaway: 'Javno savjetovanje nije anketa popularnosti. Najkorisniji su jasni argumenti i prijedlozi.'
    },
    {
      label: 'Javna informacija · pronađi dokument',
      title: 'Obećali su obnovu igrališta. Gdje je zapelo?',
      story: 'Prije pola godine objavljeno je da će igralište biti obnovljeno. Radovi nisu počeli, a na mrežama se šire nagađanja. Ne znaš je li problem u novcu, natječaju ili dozvoli.',
      question: 'Koji je prvi korak prije zaključka?',
      options: [
        { text: 'Zatražiti postojeće dokumente: odluku, ugovor, rokove i status radova.', best: true, feedback: 'Dobar potez. Traži konkretne postojeće informacije i pitaj koja je institucija zadužena za provedbu. Tako možeš razlikovati kašnjenje, promjenu plana i moguću nepravilnost.' },
        { text: 'Objaviti da je novac ukraden jer radovi kasne.', best: false, feedback: 'Kašnjenje samo po sebi nije dokaz krađe. Prvo provjeri odluke, ugovor, plaćanja i status projekta; optužbe moraju počivati na dokazima.' },
        { text: 'Nazvati izvođača i ponuditi novac da radove završi ranije.', best: false, feedback: 'Ne pokušavaj zaobilaziti ugovor ili pravila privatnim dogovorima. Odgovornost se provjerava kroz službeni ugovor i tijelo koje nadzire radove.' }
      ],
      outcome: 'Dokumenti pokažu da kasni isporuka opreme, a ne da je projekt nestao. Grad objavi novi rok i nadležno tijelo prati izvršenje ugovora.',
      takeaway: 'Kad nešto kasni, prvo prati dokumente, rokove i odgovornost. Ne preskači dokaz.'
    }
  ];

  function todayStamp() {
    const date = new Date();
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }

  function renderDailyQuestion() {
    const $id = id => document.getElementById(id);
    const q=$id('dailyQuestion'), choices=$id('dailyChoices'), date=$id('dailyDate'), feedback=$id('dailyFeedback');
    const label=$id('dailyCaseLabel'), title=$id('dailyScenarioTitle'), story=$id('dailyScenarioText');
    const bar=$id('dailyProgress'), progressLabel=$id('dailyProgressLabel'), next=$id('dailyNext'), share=$id('dailyShare');
    if(![q,choices,date,feedback,label,title,story,bar,progressLabel,next,share].every(Boolean)) return;
    const today=todayStamp(), seed=Number(today.replace(/-/g,'')); let saved={};
    try{saved=JSON.parse(localStorage.getItem(STORE)||'{}')||{};}catch{}
    const shuffle=(arr,initial)=>{const out=arr.slice();let s=initial>>>0;for(let i=out.length-1;i>0;i--){s=(Math.imul(s,1664525)+1013904223)>>>0;const j=s%(i+1);[out[i],out[j]]=[out[j],out[i]];}return out;};
    const hash=str=>{let h=2166136261;for(let i=0;i<str.length;i++)h=Math.imul(h^str.charCodeAt(i),16777619);return h>>>0;};
    if(saved.dailyRunStamp!==today||!Array.isArray(saved.dailyRunOrder)||saved.dailyRunOrder.length!==dailyQuestions.length){saved.dailyRunStamp=today;saved.dailyRunOrder=shuffle(dailyQuestions.map((_,i)=>i),seed);saved.dailyRunIndex=0;saved.dailyCompletedIds=[];saved.dailyChoiceById={};try{localStorage.setItem(STORE,JSON.stringify(saved));}catch{}}
    const order=saved.dailyRunOrder, completed=Array.isArray(saved.dailyCompletedIds)?saved.dailyCompletedIds:[];
    let index=Math.max(0,Math.min(Number(saved.dailyRunIndex)||0,order.length)),item=null,options=[],answered=false;
    date.textContent=new Intl.DateTimeFormat('hr-HR',{dateStyle:'full'}).format(new Date());
    function persist(){try{localStorage.setItem(STORE,JSON.stringify(saved));}catch{}window.dispatchEvent(new CustomEvent('potez:progress'));}
    function progress(){bar.style.width=(completed.length/dailyQuestions.length*100)+'%';progressLabel.textContent=completed.length+' / '+dailyQuestions.length+' izazova';}
    function shareText(message){if(navigator.share){navigator.share({title:'POTEZ — izazov',text:message}).catch(e=>{if(e&&e.name!=='AbortError')notify('Dijeljenje nije dostupno.');});return;}const t=document.createElement('textarea');t.value=message;document.body.appendChild(t);t.select();try{document.execCommand('copy');notify('Tekst je kopiran. Podijeli ga s ekipom.');}catch{notify('Kopiranje nije dostupno.');}t.remove();}
    function complete(){label.textContent='RUTA ZAVRŠENA';title.textContent='Sedam situacija. Sedam novih vještina.';story.textContent='Prošao/la si cijelu današnju rutu. Znaš kako provjeravati tvrdnje, tražiti dokumente, predlagati rješenja i pratiti javne odluke.';q.textContent='Tvoj sljedeći potez?';choices.replaceChildren();const p=document.createElement('p');p.textContent='Ponovi izazove bez dodatnih bodova ili podijeli rutu s ekipom.';feedback.replaceChildren(p);next.textContent='Odigraj ponovno ↻';next.hidden=false;next.onclick=()=>{saved.dailyRunOrder=shuffle(dailyQuestions.map((_,i)=>i),seed^(Date.now()%65535));saved.dailyRunIndex=0;saved.dailyCompletedIds=[];saved.dailyChoiceById={};persist();render();};share.hidden=false;share.onclick=()=>shareText('Odigrao/la sam POTEZ — 7 kratkih situacija o javnim odlukama i građanskom sudjelovanju. Probaj i ti: https://potez.pages.dev/#igraj');progress();}
    function feedbackFor(option,earned){const h=document.createElement('strong');h.className='daily-feedback-title';h.textContent=option.best?'Dobar potez.':'Zanimljiv pokušaj — evo što se događa.';const ex=document.createElement('p');ex.textContent=option.feedback;const l=document.createElement('span');l.className='daily-outcome-label';l.textContent='Što se događa dalje';const out=document.createElement('p');out.textContent=item.outcome;const take=document.createElement('p');take.className='daily-takeaway';take.textContent='Za ponijeti: '+item.takeaway;const xp=document.createElement('small');xp.textContent=earned?'+3 XP · izazov riješen':'Već riješeno · ponavljanje ne donosi dodatne bodove';feedback.replaceChildren(h,ex,l,out,take,xp);next.textContent=index+1===order.length?'Završi rutu →':'Sljedeći izazov →';next.hidden=false;next.onclick=()=>{saved.dailyRunIndex=index+1;persist();render();};share.hidden=false;share.onclick=()=>shareText('POTEZ izazov: '+item.title+'\n'+item.takeaway+'\nOdigraj i ti: https://potez.pages.dev/#igraj');}
    function render(){index=Math.max(0,Math.min(Number(saved.dailyRunIndex)||0,order.length));progress();if(index>=order.length){complete();return;}item=dailyQuestions[order[index]];options=shuffle(item.options,hash(today+':'+order[index]));answered=false;choices.replaceChildren();feedback.replaceChildren();next.hidden=true;share.hidden=true;label.textContent=item.label;title.textContent=item.title;story.textContent=item.story;q.textContent=item.question;options.forEach((option,i)=>{const btn=document.createElement('button');btn.type='button';btn.className='daily-choice';btn.dataset.letter=String.fromCharCode(65+i);btn.textContent=option.text;btn.addEventListener('click',()=>{if(answered)return;answered=true;const earned=!completed.includes(item.title);choices.querySelectorAll('button').forEach((el,j)=>{el.disabled=true;if(options[j].best)el.classList.add('correct');if(i===j){el.classList.add('chosen');if(!option.best)el.classList.add('wrong');}});if(earned){completed.push(item.title);saved.dailyCompletedIds=completed;saved.dailyChoiceById=saved.dailyChoiceById||{};saved.dailyChoiceById[item.title]=option.text;saved.xp=Math.max(0,Number(saved.xp)||0)+3;persist();window.POTEZ_FEEDBACK?.success();}progress();feedbackFor(option,earned);notify(earned?'+3 XP · izazov riješen':'Potez zabilježen.');});choices.appendChild(btn);});const previous=(saved.dailyChoiceById||{})[item.title];if(previous){const chosen=options.findIndex(o=>o.text===previous);if(chosen>=0){answered=true;choices.querySelectorAll('button').forEach((el,j)=>{el.disabled=true;if(options[j].best)el.classList.add('correct');if(j===chosen){el.classList.add('chosen');if(!options[j].best)el.classList.add('wrong');}});feedbackFor(options[chosen],false);}}}
    render();
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
