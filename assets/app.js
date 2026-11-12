(function(){
  const $ = (s,root=document)=>root.querySelector(s);
  const $$ = (s,root=document)=>Array.from(root.querySelectorAll(s));
  const STORE='potez-demo-v1';
  let saved={xp:0,quizDone:false,factDone:false,budgetDone:false,actionDone:false};
  try{saved={...saved,...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch(e){}
  function persist(){try{localStorage.setItem(STORE,JSON.stringify(saved))}catch(e){} updateActionXp();window.dispatchEvent(new CustomEvent('potez:progress'))}
  function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),2400)}
  function award(flag,points,label){if(saved[flag]){toast('Ovaj izazov već je uračunat u tvoj napredak.');return false;}saved[flag]=true;saved.xp=(saved.xp||0)+points;persist();window.POTEZ_FEEDBACK?.success();toast('+'+points+' POTEZ bodova · '+label);return true;}
  // Expose only narrow, validated progress actions to the learning interface.
  window.POTEZ_PROGRESS = Object.freeze({
    awardLesson(flag,label) {
      if(typeof flag!=='string'||!/^lesson-[a-z0-9-]+$/.test(flag))return false;
      return award(flag,4,label||'naučena tema');
    },
    claimDailyFact(stamp) {
      if(typeof stamp!=='string'||stamp.length!==10||stamp[4]!=='-'||stamp[7]!=='-'||!Number.isFinite(Date.parse(stamp))||saved.dailyFactStamp===stamp)return false;
      saved.dailyFactStamp=stamp;
      saved.xp=(saved.xp||0)+2;
      persist();
      window.POTEZ_FEEDBACK?.success();
      toast('+2 POTEZ boda · zanimljivost dana');
      return true;
    }
  });
  function updateActionXp(){$('#actionXp').textContent='Tvoj napredak: '+(saved.xp||0)+' XP'}
  const weeklyMissions=[
    {title:'Kako zastupnici glasaju?',desc:'Usporedba glasanja o odabranoj temi na Parlametru.',url:'https://parlametar.hr/',label:'Pregledaj glasanja'},
    {title:'Što je trenutačno na javnom savjetovanju?',desc:'Pregled prijedloga i predloženih promjena.',url:'https://savjetovanja.gov.hr/',label:'Javna savjetovanja'},
    {title:'Kako se prijavljuje komunalni problem?',desc:'Pregled podataka potrebnih za prijavu i nadležnog primatelja.',url:'https://popravi.to/',label:'Opis postupka'},
    {title:'Kako provjeriti tvrdnju s društvenih mreža?',desc:'Usporedba objave s izvornim izvorom i neovisnom provjerom.',url:'https://tocnotako.hr/',label:'Pregled provjera'},
    {title:'Koji podaci opisuju tvoj grad?',desc:'Javni podaci o prometu, okolišu i uslugama.',url:'https://data.gov.hr/',label:'Pregled podataka'},
    {title:'Koje dokumente možeš zatražiti?',desc:'Postupak traženja postojećih informacija od javnih tijela.',url:'https://www.imamopravoznati.org/',label:'Informacije'}
  ];
  function getWeekStamp(){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+4-(d.getDay()||7));const y=d.getFullYear();const start=new Date(y,0,1);const w=Math.ceil((((d-start)/86400000)+1)/7);return y+'-'+String(w).padStart(2,'0')}
  function renderWeekly(){const stamp=getWeekStamp();const index=(Number(stamp.slice(-2))-1)%weeklyMissions.length;const m=weeklyMissions[index];$('#weeklyTitle').textContent=m.title;$('#weeklyDescription').textContent=m.desc;$('#weeklyLink').href=m.url;$('#weeklyLink').textContent=m.label+' ↗';const done=saved.weeklyDoneKey===stamp;$('#weeklyDone').textContent=done?'Pročitano ✓':'Pročitao/la sam +8 XP';$('#weeklyDone').disabled=done;$('#weeklyDone').style.opacity=done?'.65':'1';$('#weeklyDone').addEventListener('click',()=>{if(saved.weeklyDoneKey===stamp)return;saved.weeklyDoneKey=stamp;saved.xp=(saved.xp||0)+8;persist();window.POTEZ_FEEDBACK?.success();renderWeekly();toast('+8 XP · tjedni pregled')},{once:true})}

  // Research quiz: precise population and source scope are repeated in the feedback.
  const qs=[
    {q:'Koliki je udio učenika završnih razreda srednjih škola u Hrvatskoj koji su volontirali?',a:['18,4 %','44,7 %','71,2 %'],correct:1,why:'44,7 % učenika završnih razreda navelo je volontiranje. To je jedan oblik angažmana, ali ne opisuje sve mlade.'},
    {q:'Koliki je udio učenika donirao financijsku ili materijalnu pomoć?',a:['13,1 %','36,8 %','63,1 %'],correct:2,why:'63,1 % navelo je doniranje pomoći. Doniranje je oblik solidarnosti, ali nije isto što i političko sudjelovanje.'},
    {q:'Koliki je udio učenika potpisao peticiju?',a:['28,1 %','48,8 %','52,6 %'],correct:0,why:'Peticiju je potpisalo 28,1 % učenika. Još 50,2 % reklo je da bi to moglo učiniti; namjera i ponašanje nisu isto.'},
    {q:'Koliki je udio učenika sudjelovao u prosvjedu?',a:['11,1 %','31,1 %','48,8 %'],correct:0,why:'11,1 % učenika sudjelovalo je u prosvjedu. Prosvjed je samo jedan od različitih oblika sudjelovanja.'}
  ];
  let qi=0,score=0,answered=false,quizOptions=[];
  function renderQuiz(){
    const q=qs[qi];
    quizOptions=q.a.map((text,index)=>({text,correct:index===q.correct}));
    for(let i=quizOptions.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[quizOptions[i],quizOptions[j]]=[quizOptions[j],quizOptions[i]];}
    $('#quizQuestion').textContent=q.q;$('#quizProgressLabel').textContent='Pitanje '+(qi+1)+' / '+qs.length;$('#quizProgress').style.width=((qi+1)/qs.length*100)+'%';$('#quizScore').textContent=score+' / '+qs.length+' točno';$('#quizFeedback').className='feedback';$('#quizFeedback').textContent='';$('#quizNext').style.display='none';$('#quizRestart').style.display='none';
    const box=$('#quizChoices');box.replaceChildren();quizOptions.forEach((option,i)=>{const b=document.createElement('button');b.className='choice';b.type='button';const label=document.createElement('span');label.textContent=option.text;const key=document.createElement('span');key.className='key';key.textContent=String.fromCharCode(65+i);b.append(label,key);b.addEventListener('click',()=>answerQuiz(i));box.appendChild(b)});answered=false;
  }
  function answerQuiz(i){if(answered)return;answered=true;const q=qs[qi];const correct=Boolean(quizOptions[i]?.correct);const buttons=$('#quizChoices .choice');buttons.forEach((b,j)=>{b.disabled=true;if(quizOptions[j]?.correct)b.classList.add('correct');if(j===i&&!quizOptions[j]?.correct)b.classList.add('wrong')});if(correct)score++;$('#quizScore').textContent=score+' / '+qs.length+' točno';const f=$('#quizFeedback');f.innerHTML='<strong>'+(correct?'Točno.':'Nije točno. Objašnjenje je u nastavku.')+'</strong>'+q.why;f.classList.add('show');if(qi<qs.length-1){$('#quizNext').style.display='inline-flex';$('#quizNext').textContent='Sljedeće pitanje →'}else{$('#quizNext').style.display='inline-flex';$('#quizNext').textContent='Dovršetak izazova';}}
  $('#quizNext').addEventListener('click',()=>{if(qi<qs.length-1){qi++;renderQuiz()}else{award('quizDone',15,'istraživački izazov');$('#quizNext').style.display='none';$('#quizRestart').style.display='inline-flex';$('#quizFeedback').innerHTML+='<br><strong>Rezultat: '+score+'/4.</strong> Najvažniji dio nije rezultat nego kontekst: ovo je uzorak učenika završnih razreda, a ne svih mladih.';}});
  $('#quizRestart').addEventListener('click',()=>{qi=0;score=0;renderQuiz()});renderQuiz();

  // Budget challenge: an educational city-budget simulation, scaled to local population.
  const budgetData = window.POTEZ_BUDGET_DATA;
  const budgetCity = $('#budgetCity');
  const sliderHost = $('#budgetSliders');
  let activeBudget = null;
  const euro = n => new Intl.NumberFormat('hr-HR', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0
  }).format(Math.round(n));

  function budgetUpdate() {
    if (!activeBudget) return [];
    const inputs = $$('[data-budget-slider]');
    const values = inputs.map((input, index) => {
      const percentage = Number(input.value);
      const amount = Math.round(activeBudget.items[index].amount * percentage / 100);
      input.dataset.amount = String(amount);
      const output = $('#v' + (index + 1));
      const share = $('#s' + (index + 1));
      if (output) output.textContent = euro(amount);
      if (share) share.textContent = percentage + '% od početnog iznosa';
      input.setAttribute('aria-valuetext', percentage + '% početne raspodjele, ' + euro(amount));
      return amount;
    });
    const spent = values.reduce((sum, value) => sum + value, 0);
    const remaining = activeBudget.total - spent;
    const withinBudget = remaining >= 0;

    $('#budgetSpent').textContent = euro(spent);
    $('#budgetRemaining').textContent = withinBudget
      ? 'Preostalo: ' + euro(remaining)
      : 'Prekoračenje: ' + euro(Math.abs(remaining));

    const percent = Math.max(0, Math.min(100, spent / activeBudget.total * 100));
    $('#budgetBar').style.width = percent + '%';
    const progress = $('#budgetBar').parentElement;
    progress.setAttribute('aria-valuenow', String(Math.round(percent)));

    const status = $('#budgetStatus');
    const submit = $('#budgetSubmit');
    submit.disabled = !withinBudget;
    status.textContent = withinBudget
      ? (remaining === 0 ? 'Cijeli fond je raspoređen.' : 'Možeš ostaviti dio za nepredviđene troškove.')
      : 'Za ostanak unutar proračuna potrebno je smanjiti pojedine stavke.';
    status.classList.toggle('is-over-budget', !withinBudget);
    return values;
  }

  function renderBudgetScenario() {
    if (!budgetData || !budgetCity || !sliderHost) return;
    const city = budgetData.cities[budgetCity.value];
    if (!city) return;
    activeBudget = city;

    $('#budgetContextTitle').textContent = city.label.toLocaleUpperCase('hr-HR') + ' · ' + city.year;
    $('#budgetEnvelope').textContent = euro(city.total);
    const number = value => new Intl.NumberFormat('hr-HR').format(value);
    $('#budgetPopulationMeta').textContent = number(city.population) + ' stanovnika prema Popisu 2021. · ' +
      number(city.children) + ' djece predškolske dobi i učenika I.–IV. razreda. To nije ukupan broj mladih od 15 do 29 godina.';

    sliderHost.innerHTML = city.items.map((item, index) => {
      const id = 'budget-' + item.id;
      const number = index + 1;
      return '<article class="budget-line">' +
        '<div class="budget-line-head">' +
          '<label data-budget-name for="' + id + '">' +
            '<span class="budget-category-icon" aria-hidden="true">' + item.icon + '</span>' +
            '<span class="budget-category-label">' + item.name + '</span>' +
          '</label>' +
          '<output class="amount" id="v' + number + '" for="' + id + '">' + euro(item.amount) + '</output>' +
        '</div>' +
        '<div class="budget-line-control">' +
          '<input id="' + id + '" data-budget-slider type="range" min="0" max="200" step="5" value="100" aria-label="' + item.name + '; 100 posto početne raspodjele">' +
          '<span class="budget-share" id="s' + number + '">100% od početnog iznosa</span>' +
        '</div>' +
        '<details class="budget-category-info">' +
          '<summary>Što ulazi u ovu stavku?</summary>' +
          '<p>' + item.detail + '</p>' +
        '</details>' +
      '</article>';
    }).join('');

    $$('[data-budget-slider]').forEach(input => input.addEventListener('input', () => {
      $('#budgetResult').hidden = true;
      budgetUpdate();
    }));
    $('#budgetResult').hidden = true;
    $('#budgetResult').replaceChildren();
    budgetUpdate();
    window.dispatchEvent(new CustomEvent('potez:budget-context'));
  }

  if (budgetCity && budgetData && sliderHost) {
    budgetCity.addEventListener('change', renderBudgetScenario);
    renderBudgetScenario();
  }

  $('#budgetSubmit').addEventListener('click', () => {
    const values = budgetUpdate();
    if (!activeBudget || values.reduce((sum, value) => sum + value, 0) > activeBudget.total) return;

    const changes = activeBudget.items.map((item, index) => ({
      name: item.name,
      delta: values[index] - item.amount
    }));
    const increases = changes.filter(item => item.delta > 0).sort((a, b) => b.delta - a.delta);
    const decreases = changes.filter(item => item.delta < 0).sort((a, b) => a.delta - b.delta);
    const remaining = activeBudget.total - values.reduce((sum, value) => sum + value, 0);

    const result = $('#budgetResult');
    result.replaceChildren();

    const heading = document.createElement('strong');
    heading.textContent = 'Tvoj prijedlog proračuna';
    result.appendChild(heading);

    if (increases.length) {
      const paragraph = document.createElement('p');
      paragraph.textContent = 'Najviše si povećao/la: ' + increases[0].name + ' (+' + euro(increases[0].delta) + ').';
      result.appendChild(paragraph);
    }
    if (decreases.length) {
      const paragraph = document.createElement('p');
      paragraph.textContent = 'Najviše si smanjio/la: ' + decreases[0].name + ' (' + euro(decreases[0].delta) + ').';
      result.appendChild(paragraph);
    }
    const reserve = document.createElement('p');
    reserve.textContent = remaining > 0
      ? 'Za nepredviđene troškove ostavio/la si ' + euro(remaining) + '.'
      : 'Rasporedio/la si cijeli fond.';
    result.appendChild(reserve);

    const reflection = document.createElement('p');
    reflection.textContent = 'Kako bi građanima objasnio/la kome tvoj izbor daje prednost?';
    result.appendChild(reflection);

    result.hidden = false;
    award('budgetDone', 15, 'proračunski izazov');
  });

  $('#budgetReset').addEventListener('click', () => {
    if (!activeBudget) return;
    $$('[data-budget-slider]').forEach(input => { input.value = '100'; });
    budgetUpdate();
    $('#budgetResult').hidden = true;
    $('#budgetResult').replaceChildren();
  });

  // Verification exercise. "Unverified" is intentionally not treated as "false".
  const factButtons=$$('#factChoices .choice');factButtons.forEach(b=>b.addEventListener('click',()=>{if(factButtons.some(x=>x.disabled))return;const chosen=b.dataset.answer;factButtons.forEach(x=>{x.disabled=true;if(x.dataset.answer==='check')x.classList.add('correct');if(x===b&&chosen!=='check')x.classList.add('wrong')});const f=$('#factFeedback');f.innerHTML='<strong>'+(chosen==='check'?'Da — zasad je to nepotvrđena tvrdnja.':'Ne još. Pazi na razliku.')+'</strong>Objava iznosi provjerljivu tvrdnju, ali ne navodi izvor, datum ni odluku. Zato je ne možemo tretirati kao činjenicu, ali nemamo dovoljno dokaza ni da je proglasimo lažnom. Potrebno je potražiti odluku nadležnog tijela, datum stupanja na snagu i pouzdan neovisni izvor. <a href="https://tocnotako.hr/" target="_blank" rel="noopener" >Točno tako</a> ili <a href="https://faktograf.hr/" target="_blank" rel="noopener" >Faktograf</a>.';f.classList.add('show');award('factDone',10,'detektor tvrdnji')}));

  // Topic-to-action navigator. Advice stays practical and flags jurisdiction uncertainty.
  const actionData={
    public:{title:'Javni prostor, promet i kvart',text:'Grad ili općina često održava javni prostor. Nadležnost ipak ovisi o vlasništvu i vrsti ceste.',steps:['Potrebno je zabilježiti lokaciju i opisati problem bez navođenja tuđih osobnih podataka.','Potrebno je provjeriti gradski kontakt, mjesni odbor ili postojeću prijavu.','Dostupni su službeni kanali prijave i platforma Popravi.to.'],links:[['Popravi.to','https://popravi.to/'],['Imamo pravo znati','https://www.imamopravoznati.org/']]},
    school:{title:'Škola, faks i obrazovanje',text:'Neke odluke donosi sama ustanova, a neke proizlaze iz nacionalnih pravila.',steps:['Opiši što se događa, koga pogađa i koliko često.','Ulogu vijeća učenika, studentskog zbora ili uprave ustanove potrebno je utvrditi.','Za nacionalna pravila pregledaj javna savjetovanja i važeće propise.'],links:[['e-Savjetovanja','https://savjetovanja.gov.hr/'],['Mreža mladih Hrvatske','https://www.mmh.hr/']]},
    housing:{title:'Stanovanje i troškovi života',text:'Stanovanje uključuje lokalne programe, prostorno planiranje i državna pravila.',steps:['Važno je razlikovati najam, studentski smještaj, priuštivo stanovanje i kvalitetu zgrada.','Lokalni programi i odluke gradskog vijeća relevantni su izvori.','Dostupni su javni podaci i mogućnost komentiranja prijedloga propisa.'],links:[['Imamo pravo znati','https://www.imamopravoznati.org/'],['e-Savjetovanja','https://savjetovanja.gov.hr/'],['Otvoreni podaci RH','https://data.gov.hr/']]},
    environment:{title:'Otpad i okoliš',text:'Za komunalni otpad često su nadležni grad i komunalno društvo. Šire okolišne propise uređuju i druga tijela.',steps:['Potrebno je zabilježiti lokaciju i vrstu problema te razlikovati komunalni nered od okolišnog pitanja.','Potrebno je utvrditi koja služba zaprima komunalne prijave.','Za planove i dozvole relevantni su javni dokumenti i otvoreni podaci.'],links:[['Popravi.to','https://popravi.to/'],['e-Savjetovanja','https://savjetovanja.gov.hr/'],['Otvoreni podaci RH','https://data.gov.hr/']]},
    money:{title:'Javni novac i odluke vlasti',text:'Javni novac prati se kroz proračune, nabavu, zapisnike i glasanja. Planirano, ugovoreno i potrošeno nisu isto.',steps:['Potrebno je utvrditi naziv dokumenta, instituciju i godinu.','Ako dokument nije objavljen, potrebno je provjeriti postupak pristupa informacijama.','Za nacionalne odluke relevantan je Parlametar, a lokalni dokumenti dostupni su na stranicama gradova i općina.'],links:[['Parlametar','https://parlametar.hr/'],['Imamo pravo znati','https://www.imamopravoznati.org/'],['Otvoreni podaci RH','https://data.gov.hr/']]},
    media:{title:'Dezinformacije i mediji',text:'Sumnjiva objava nije automatski lažna. Provjeri izvor, kontekst i raspoložive dokaze.',steps:['Preporučuje se sačuvati poveznicu, datum i puni kontekst objave.','Potrebno je utvrditi izvorni dokument, snimku ili izjavu.','Neovisne provjere potrebno je usporediti. Bez dovoljno dokaza primjereno je koristiti oznaku „nepotvrđeno”.'],links:[['Točno tako','https://tocnotako.hr/'],['Faktograf','https://faktograf.hr/']]},
    youth:{title:'Prostor, kultura i sadržaji za mlade',text:'Prostor za sport, druženje i kulturu često ovisi o lokalnim programima i javnim prostorima.',steps:['Usporedba potreba i prijedloga mladih ne zahtijeva prikupljanje osjetljivih podataka.','Relevantni su savjet mladih, lokalni program i javni poziv.','Prijedlog je potrebno potkrijepiti lokacijom, okvirnim troškom, korisnicima i planom održavanja.'],links:[['Mreža mladih Hrvatske','https://www.mmh.hr/'],['TikTalking Youth Policy','https://www.mmh.hr/projekti/tiktalking-youth-policy'],['Grad Rijeka · primjer participacije','https://www.rijeka.hr/en/themes-for-citizens/active-citizenship/participatory-budgeting/educational-budget-game-proracunajme/']]}
  };
  function renderAction(){
    const key=$('#topicSelect').value;
    const data=actionData[key];
    const output=$('#actionOutput');
    output.replaceChildren();

    const heading=document.createElement('h3');
    heading.textContent=data.title;
    const summary=document.createElement('p');
    summary.textContent=data.text;

    const details=document.createElement('details');
    details.className='action-extra-details';
    const detailsSummary=document.createElement('summary');
    detailsSummary.textContent='Institucije, informacije i što provjeriti';
    details.appendChild(detailsSummary);

    const list=document.createElement('ol');
    data.steps.forEach(step=>{
      const item=document.createElement('li');
      item.textContent=step;
      list.appendChild(item);
    });
    details.appendChild(list);

    const links=document.createElement('div');
    links.className='resource-links';
    data.links.forEach(([name,href])=>{
      try{
        const url=new URL(href);
        if(url.protocol!=='https:')return;
        const link=document.createElement('a');
        link.href=url.href;
        link.target='_blank';
        link.rel='noopener noreferrer';
        link.textContent=name+' ↗';
        links.appendChild(link);
      }catch{}
    });
    details.appendChild(links);

    const depth=document.createElement('p');
    depth.className='action-depth-note';
    depth.textContent='Poveznice vode na vanjske izvore; datum i aktualnost informacija potrebno je provjeriti.';
    details.appendChild(depth);

    const complete=document.createElement('button');
    complete.className='btn btn-dark action-complete';
    complete.id='actionComplete';
    complete.type='button';
    complete.disabled=Boolean(saved.actionDone);
    complete.textContent=saved.actionDone?'Tema pregledana ✓':'Označavanje kao pregledano · +5 XP';
    complete.addEventListener('click',()=>{
      if(saved.actionDone)return;
      award('actionDone',5,'pregledana tema');
      renderAction();
    });

    output.append(heading,summary,details,complete);
  }
  $('#topicSelect').addEventListener('change',renderAction);$('#effortSelect').addEventListener('change',()=>{const t=$('#effortSelect').value;const msg=t==='quick'?'Sažetak: utvrđivanje službenog izvora i nadležnog tijela.':t==='medium'?'Detaljnije: usporedba dokumenata, pravila i dostupnih podataka.':'Za grupni razgovor: usporedba različitih izvora i perspektiva.';const p=$('#actionOutput').querySelector('.action-depth-note');if(p)p.textContent=msg+' Poveznice vode na vanjske izvore.'});
  // Clear progress is intentionally local-only.
  $('#clearProgress').addEventListener('click',()=>{if(confirm('Obrisati sav spremljeni napredak na ovom uređaju?')){saved={xp:0,quizDone:false,factDone:false,budgetDone:false,actionDone:false};try{localStorage.removeItem('potez-budget-duel-v1');localStorage.removeItem('potez-budget-duel-v2')}catch(e){}persist();window.dispatchEvent(new CustomEvent('potez:reset'));toast('Lokalni napredak je obrisan.')}});
  renderWeekly();
  updateActionXp();
})();


// Offline support: cache only static same-origin assets; never cache submissions.
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, { once: true });
}
