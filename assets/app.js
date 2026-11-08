(function(){
  const $ = (s,root=document)=>root.querySelector(s);
  const $$ = (s,root=document)=>Array.from(root.querySelectorAll(s));
  const STORE='potez-demo-v1';
  let saved={xp:0,quizDone:false,factDone:false,budgetDone:false,actionDone:false};
  try{saved={...saved,...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch(e){}
  function persist(){try{localStorage.setItem(STORE,JSON.stringify(saved))}catch(e){} updateActionXp();window.dispatchEvent(new CustomEvent('potez:progress'))}
  function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),2400)}
  function award(flag,points,label){if(!saved[flag]){saved[flag]=true;saved.xp=(saved.xp||0)+points;persist();window.POTEZ_FEEDBACK?.success();toast('+'+points+' POTEZ bodova · '+label)}else{toast('Ovaj izazov već je uračunat u tvoj napredak.')}}
  function updateActionXp(){$('#actionXp').textContent='Tvoj napredak: '+(saved.xp||0)+' bodova'}
  const weeklyMissions=[
    {title:'Pogledaj kako zastupnici stvarno glasaju.',desc:'Na Parlametru usporedi kako su zastupnici glasali o temi koja te zanima.',url:'https://parlametar.hr/',label:'Istraži glasanja',icon:'🏛️'},
    {title:'Pronađi jednu otvorenu javnu raspravu.',desc:'Pročitaj prijedlog na e-Savjetovanjima i zapiši jedno pitanje.',url:'https://savjetovanja.gov.hr/',label:'Pregledaj savjetovanja',icon:'🗣️'},
    {title:'Prijavi jednu stvar koju svi zaobilaze.',desc:'Zabilježi problem u kvartu i provjeri kome ga prijaviti.',url:'https://popravi.to/',label:'Pogledaj Popravi.to',icon:'🛠️'},
    {title:'Provjeri tvrdnju koju si vidio/la na feedu.',desc:'Pronađi izvor objave i usporedi ga s neovisnom provjerom.',url:'https://tocnotako.hr/',label:'Otvori Točno tako',icon:'🧭'},
    {title:'Pronađi jedan javni podatak o svojoj zajednici.',desc:'Pronađi podatak o prometu, okolišu ili javnim uslugama.',url:'https://data.gov.hr/',label:'Istraži otvorene podatke',icon:'📊'},
    {title:'Pretvori prigovor u dobro pitanje.',desc:'Pošalji instituciji jasno pitanje: tko je odgovoran i koji je rok?',url:'https://www.imamopravoznati.org/',label:'Saznaj kako tražiti informaciju',icon:'🔎'}
  ];
  function getWeekStamp(){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+4-(d.getDay()||7));const y=d.getFullYear();const start=new Date(y,0,1);const w=Math.ceil((((d-start)/86400000)+1)/7);return y+'-'+String(w).padStart(2,'0')}
  function renderWeekly(){const stamp=getWeekStamp();const index=(Number(stamp.slice(-2))-1)%weeklyMissions.length;const m=weeklyMissions[index];$('#weeklyTitle').textContent=m.icon+' '+m.title;$('#weeklyDescription').textContent=m.desc;$('#weeklyLink').href=m.url;$('#weeklyLink').textContent=m.label+' ↗';const done=saved.weeklyDoneKey===stamp;$('#weeklyDone').textContent=done?'Misija odrađena ✓':'Napravio/la sam to +8';$('#weeklyDone').disabled=done;$('#weeklyDone').style.opacity=done?'.65':'1';$('#weeklyDone').addEventListener('click',()=>{if(saved.weeklyDoneKey===stamp)return;saved.weeklyDoneKey=stamp;saved.xp=(saved.xp||0)+8;persist();window.POTEZ_FEEDBACK?.success();renderWeekly();toast('+8 POTEZ bodova · tjedna misija')},{once:true})}

  // Research quiz: precise population and source scope are repeated in the feedback.
  const qs=[
    {q:'Koliki je udio učenika završnih razreda srednjih škola u Hrvatskoj koji su volontirali?',a:['18,4 %','44,7 %','71,2 %'],correct:1,why:'44,7 % ispitanih učenika izjavilo je da je volontiralo. To je neformalni oblik društvenog angažmana — ne znači da su svi politički aktivisti, ali je važan dio slike o sudjelovanju mladih.'},
    {q:'Koliki je udio učenika donirao financijsku ili materijalnu pomoć?',a:['13,1 %','36,8 %','63,1 %'],correct:2,why:'63,1 % učenika doniralo je financijsku ili materijalnu pomoć. Solidarnost nije automatski politička participacija, ali pokazuje da angažman ne počinje i ne završava u stranačkoj politici.'},
    {q:'Koliki je udio učenika potpisao peticiju?',a:['28,1 %','48,8 %','52,6 %'],correct:0,why:'Peticiju je potpisalo 28,1 % učenika. Dodatnih 50,2 % nije to učinilo, ali može zamisliti da bi sudjelovalo — razlika između sadašnjeg ponašanja i potencijalne spremnosti važna je za razumijevanje participacije.'},
    {q:'Koliki je udio učenika sudjelovao u prosvjedu?',a:['11,1 %','31,1 %','48,8 %'],correct:0,why:'11,1 % sudjelovalo je u prosvjedu. Zato nije dobro izjednačiti volontiranje, doniranje, peticije i prosvjede: radi se o različitim praksama, s različitim pragovima uključivanja i mogućnostima.'}
  ];
  let qi=0,score=0,answered=false;
  function renderQuiz(){
    const q=qs[qi];$('#quizQuestion').textContent=q.q;$('#quizProgressLabel').textContent='Pitanje '+(qi+1)+' / '+qs.length;$('#quizProgress').style.width=((qi+1)/qs.length*100)+'%';$('#quizScore').textContent=score+' / '+qs.length+' točno';$('#quizFeedback').className='feedback';$('#quizFeedback').textContent='';$('#quizNext').style.display='none';$('#quizRestart').style.display='none';
    const box=$('#quizChoices');box.innerHTML='';q.a.forEach((a,i)=>{const b=document.createElement('button');b.className='choice';b.type='button';b.innerHTML='<span>'+a+'</span><span class="key">'+String.fromCharCode(65+i)+'</span>';b.addEventListener('click',()=>answerQuiz(i));box.appendChild(b)});answered=false;
  }
  function answerQuiz(i){if(answered)return;answered=true;const q=qs[qi];const buttons=$$('#quizChoices .choice');buttons.forEach((b,j)=>{b.disabled=true;if(j===q.correct)b.classList.add('correct');if(j===i&&j!==q.correct)b.classList.add('wrong')});if(i===q.correct)score++;$('#quizScore').textContent=score+' / '+qs.length+' točno';const f=$('#quizFeedback');f.innerHTML='<strong>'+(i===q.correct?'Točno. Dobar ulov.':'Nije točan odgovor — ali sad znaš zašto.')+'</strong>'+q.why;f.classList.add('show');if(qi<qs.length-1){$('#quizNext').style.display='inline-flex';$('#quizNext').textContent='Sljedeće pitanje →'}else{$('#quizNext').style.display='inline-flex';$('#quizNext').textContent='Završi izazov';}}
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
      : 'Smanji neke stavke kako bi ostao/la unutar proračuna.';
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

    sliderHost.innerHTML = city.items.map((item, index) => {
      const id = 'budget-' + item.id;
      const number = index + 1;
      return '<article class="budget-line">' +
        '<div class="budget-line-head">' +
          '<label for="' + id + '">' +
            '<span class="budget-category-icon" aria-hidden="true">' + item.icon + '</span>' +
            '<span>' + item.name + '</span>' +
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
  const factButtons=$$('#factChoices .choice');factButtons.forEach(b=>b.addEventListener('click',()=>{if(factButtons.some(x=>x.disabled))return;const chosen=b.dataset.answer;factButtons.forEach(x=>{x.disabled=true;if(x.dataset.answer==='check')x.classList.add('correct');if(x===b&&chosen!=='check')x.classList.add('wrong')});const f=$('#factFeedback');f.innerHTML='<strong>'+(chosen==='check'?'Da — zasad je to nepotvrđena tvrdnja.':'Ne još. Pazi na razliku.')+'</strong>Objava iznosi provjerljivu tvrdnju, ali ne navodi izvor, datum ni odluku. Zato je ne možemo tretirati kao činjenicu, ali nemamo dovoljno dokaza ni da je proglasimo lažnom. Potraži odluku nadležnog tijela, datum stupanja na snagu i pouzdan neovisni izvor. <a href="https://tocnotako.hr/" target="_blank" rel="noopener">Provjeri Točno tako</a> ili <a href="https://faktograf.hr/" target="_blank" rel="noopener">Faktograf</a>.';f.classList.add('show');award('factDone',10,'detektor tvrdnji')}));

  // Topic-to-action navigator. Advice stays practical and flags jurisdiction uncertainty.
  const actionData={
    public:{title:'Javni prostor, promet i kvart',text:'Rupa na pločniku, neispravna rasvjeta ili autobusna stanica bez klupe? Kreni od tijela koje održava prostor — često je to grad ili općina, ali prvo provjeri vlasništvo i nadležnost ceste.',steps:['Zabilježi lokaciju, datum i što točno ne radi. Ne objavljuj tuđe osobne podatke.','Provjeri je li problem već prijavljen ili postoji gradski kontakt / mjesni odbor.','Prijavi problem kroz Popravi.to ili pošalji upit nadležnom gradu/općini.'],links:[['Popravi.to','https://popravi.to/'],['Imamo pravo znati','https://www.imamopravoznati.org/']]},
    school:{title:'Škola, faks i obrazovanje',text:'Promjena školskog pravila, rasporeda, uvjeta ili studentskog standarda? Prvo razdvoji što može riješiti sama ustanova, a što traži promjenu pravila na nacionalnoj razini.',steps:['Zapiši konkretan problem i kako utječe na učenike/studente — što se događa, kome i koliko često.','Kreni preko vijeća učenika, studentskog zbora ili predstavničkog tijela ustanove; pitaj tko ima ovlast odlučivanja.','Ako se mijenja nacionalni propis ili kurikul, prati javna savjetovanja i podnesi argumentiran komentar.'],links:[['e-Savjetovanja','https://savjetovanja.gov.hr/'],['Mreža mladih Hrvatske','https://www.mmh.hr/']]},
    housing:{title:'Stanovanje i troškovi života',text:'Stanovanje je istodobno osobno iskustvo i javna politika. Gradovi mogu imati ulogu kroz prostorno planiranje, zemljište i lokalne programe, dok se porezna i stambena pravila uređuju i na državnoj razini.',steps:['Odredi razinu problema: cijena najma, studentski smještaj, priuštivo stanovanje, bespravna gradnja ili kvaliteta zgrade.','Provjeri lokalnu stambenu strategiju, programe i zapisnike gradskog vijeća.','Zatraži postojeće podatke/dokumente ili komentiraj relevantan prijedlog propisa.'],links:[['Imamo pravo znati','https://www.imamopravoznati.org/'],['e-Savjetovanja','https://savjetovanja.gov.hr/'],['Otvoreni podaci RH','https://data.gov.hr/']]},
    environment:{title:'Otpad i okoliš',text:'Za komunalni otpad i čistoću često su bitni grad/općina i komunalno društvo; za šire okolišne propise i dozvole mogu biti nadležna državna ili regionalna tijela. Ne pretpostavljaj — provjeri tko je izdao odluku.',steps:['Zabilježi lokaciju, učestalost i vrstu problema. Razlikuj komunalni nered od moguće povrede okolišnih propisa.','Prijavi komunalni problem nadležnoj službi ili preko Popravi.to.','Za planove, dozvole ili podatke provjeri javne dokumente i otvorene podatke; u javnom savjetovanju pošalji komentar.'],links:[['Popravi.to','https://popravi.to/'],['e-Savjetovanja','https://savjetovanja.gov.hr/'],['Otvoreni podaci RH','https://data.gov.hr/']]},
    money:{title:'Javni novac i odluke vlasti',text:'Javni novac možeš pratiti kroz proračune, javne nabave, zapisnike i glasanja. Važno je usporediti planirano, ugovoreno i stvarno izvršeno — to nisu iste stvari.',steps:['Pronađi odluku, proračun ili ugovor koji te zanima. Zapiši instituciju, godinu i naziv dokumenta.','Ako dokument nije javno objavljen, zatraži postojeću informaciju putem ImamoPravoZnati.','Za nacionalne odluke prati Parlametar; za lokalne odluke traži sjednice i proračunske dokumente grada/općine.'],links:[['Parlametar','https://parlametar.hr/'],['Imamo pravo znati','https://www.imamopravoznati.org/'],['Otvoreni podaci RH','https://data.gov.hr/']]},
    media:{title:'Dezinformacije i mediji',text:'Sumnjiva objava nije dokaz da je nešto lažno. Cilj provjere je ustanoviti što znamo, što ne znamo i koji je najjači dostupan dokaz.',steps:['Sačuvaj izvorni link, datum i puni kontekst; screenshot sam po sebi nije dovoljan.','Traži izvorni dokument, snimku ili izjavu. Pretraži ključne riječi i provjeri ima li starije verzije sadržaja.','Usporedi provjeru neovisnih fact-checkera; kad dokaza nema, reci „nepotvrđeno”, ne „lažno”.'],links:[['Točno tako','https://tocnotako.hr/'],['Faktograf','https://faktograf.hr/']]},
    youth:{title:'Prostor, kultura i sadržaji za mlade',text:'Nedostaje prostor za probe, sport, druženje ili kulturni program? Takve ideje mogu postati prijedlog lokalnoj zajednici — pogotovo ako pokažeš da iza njih stoji više mladih.',steps:['Razgovaraj s još nekoliko mladih i prikupi kratke, konkretne prijedloge. Ne skupljaj osjetljive podatke.','Provjeri postoji li savjet mladih, lokalni program za mlade, javni poziv ili participativni proračun.','Predaj prijedlog s lokacijom, okvirnim troškom, korisnicima i načinom održavanja. Traži pisani odgovor.'],links:[['Mreža mladih Hrvatske','https://www.mmh.hr/'],['TikTalking Youth Policy','https://www.mmh.hr/projekti/tiktalking-youth-policy'],['Grad Rijeka · primjer participacije','https://www.rijeka.hr/en/themes-for-citizens/active-citizenship/participatory-budgeting/educational-budget-game-proracunajme/']]}
  };
  function renderAction(){const key=$('#topicSelect').value;const d=actionData[key];const out=$('#actionOutput');out.innerHTML='<div class="mini-tag">Tvoj prvi potez</div><h3>'+d.title+'</h3><p>'+d.text+'</p><ol>'+d.steps.map(s=>'<li>'+s+'</li>').join('')+'</ol><div class="resource-links">'+d.links.map(l=>'<a href="'+l[1]+'" target="_blank" rel="noopener">'+l[0]+' ↗</a>').join('')+'</div><button class="btn btn-dark action-complete" id="actionComplete" type="button" '+(saved.actionDone?'disabled':'')+'>'+(saved.actionDone?'Prvi korak zabilježen ✓':'Odredio/la sam svoj prvi korak +5')+'</button>';const complete=$('#actionComplete');if(complete&&!saved.actionDone){complete.addEventListener('click',()=>{award('actionDone',5,'prvi korak');renderAction()},{once:true})}}
  $('#topicSelect').addEventListener('change',renderAction);$('#effortSelect').addEventListener('change',()=>{const t=$('#effortSelect').value;const msg=t==='quick'?'Prvi mali korak je dovoljan: prikupi činjenicu i pronađi nadležno tijelo.':t==='medium'?'Odvoji vrijeme za provjeru dokumenta, razgovor s još jednom osobom i slanje konkretnog upita.':'Okupi malu grupu, podijelite zadatke i dogovorite tko će pratiti odgovor institucije.';const p=$('#actionOutput').querySelector('p');if(p)p.textContent=actionData[$('#topicSelect').value].text+' '+msg});
  // Clear progress is intentionally local-only.
  $('#clearProgress').addEventListener('click',()=>{if(confirm('Obrisati sav spremljeni napredak na ovom uređaju?')){saved={xp:0,quizDone:false,factDone:false,budgetDone:false,actionDone:false};try{localStorage.removeItem('potez-budget-duel-v1')}catch(e){}persist();toast('Lokalni napredak je obrisan.')}});
  renderWeekly();
  updateActionXp();
})();


// Offline support: cache only static same-origin assets; never cache submissions.
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, { once: true });
}
