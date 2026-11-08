(() => {
  'use strict';
  const STORAGE_KEY='potez-demo-v1';
  const views=Array.from(document.querySelectorAll('[data-app-view]'));
  const homeView=document.querySelector('[data-app-view="home"]');
  const routeLinks=Array.from(document.querySelectorAll('[data-app-route]'));
  if(!views.length||!homeView)return;
  function viewForTarget(target){return target?.closest?.('[data-app-view]')||(target?.id==='top'?homeView:null);}
  function updateActiveNavigation(view){
    const activeRoute=view?.dataset.appView||'home';
    routeLinks.forEach(link=>{if(link.dataset.appRoute===activeRoute)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  }
  function showView(view,target,scroll){
    if(!view)view=homeView;
    views.forEach(item=>{item.hidden=item!==view;});
    updateActiveNavigation(view);
    if(scroll){
      const destination=target&&target!==view?target:view;
      if(destination===homeView||destination.id==='top')window.scrollTo({top:0,behavior:'auto'});
      else destination.scrollIntoView({behavior:'auto',block:'start'});
    }
  }
  function routeFromHash(scroll){
    const id=decodeURIComponent(window.location.hash.slice(1));
    const target=id?document.getElementById(id):null;
    showView(viewForTarget(target)||homeView,target||homeView,Boolean(scroll));
  }
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');
    if(!link)return;
    const id=decodeURIComponent(link.getAttribute('href').slice(1));
    const target=id?document.getElementById(id):null;
    const view=viewForTarget(target)||(id==='top'?homeView:null);
    if(!view||!target)return;
    event.preventDefault();
    const nextHash='#'+encodeURIComponent(id);
    if(window.location.hash!==nextHash)window.history.pushState(null,'',nextHash);
    showView(view,target,true);
  });
  window.addEventListener('popstate',()=>routeFromHash(true));
  window.addEventListener('hashchange',()=>routeFromHash(true));
  function updateHomeProgress(){
    const score=document.getElementById('homeXp');
    const title=document.getElementById('homeProgressTitle');
    const description=document.getElementById('homeProgressDescription');
    if(!score||!title||!description)return;
    let saved={};
    try{saved=JSON.parse(window.localStorage.getItem(STORAGE_KEY)||'{}')||{};}catch{}
    const xp=Math.max(0,Number(saved.xp)||0);
    score.textContent=xp+' XP';
    if(xp>0){title.textContent='Već si napravio/la prvi korak.';description.textContent='Skupio/la si '+xp+' XP. Odaberi sljedeći stvarni problem ili nastavi modul koji još nisi prošao/la.';}
    else{title.textContent='Tvoj put počinje jednim pitanjem.';description.textContent='Isprobaj prvi izazov i prati vještine koje gradiš. Ne trebaš otvarati račun.';}
  }
  window.addEventListener('potez:progress',updateHomeProgress);
  window.addEventListener('storage',updateHomeProgress);
  routeFromHash(true);
  updateHomeProgress();
})();
