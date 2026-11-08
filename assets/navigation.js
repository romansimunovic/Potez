(() => {
  'use strict';
  const STORAGE_KEY='potez-demo-v1';
  const views=Array.from(document.querySelectorAll('[data-app-view]'));
  const homeView=document.querySelector('[data-app-view="home"]');
  const routeLinks=Array.from(document.querySelectorAll('[data-app-route]'));
  const mobileMenu=document.getElementById('mobileMenu');
  const mobileMenuSummary=mobileMenu?.querySelector('summary');
  const mobileMenuBackdrop=mobileMenu?.querySelector('.mobile-menu-backdrop');
  const mobileMenuClose=mobileMenu?.querySelector('.mobile-menu-close');
  const mobileMenuPanel=mobileMenu?.querySelector('.mobile-menu-panel');
  if(!views.length||!homeView)return;
  function syncMobileMenu(){
    if(!mobileMenu)return;
    if(mobileMenuSummary)mobileMenuSummary.setAttribute('aria-expanded',String(mobileMenu.open));
    document.body.classList.toggle('menu-open',mobileMenu.open);
  }
  function closeMobileMenu(restoreFocus=false){
    if(!mobileMenu||!mobileMenu.open)return;
    mobileMenu.open=false;
    syncMobileMenu();
    if(restoreFocus)mobileMenuSummary?.focus();
  }
  mobileMenu?.addEventListener('toggle',()=>{
    syncMobileMenu();
    if(mobileMenu.open)mobileMenuPanel?.querySelector('a')?.focus();
  });
  mobileMenuBackdrop?.addEventListener('click',()=>closeMobileMenu(true));
  mobileMenuClose?.addEventListener('click',()=>closeMobileMenu(true));
  document.addEventListener('keydown',event=>{
    if(!mobileMenu?.open)return;
    if(event.key==='Escape'){
      event.preventDefault();
      closeMobileMenu(true);
      return;
    }
    if(event.key==='Tab'&&mobileMenuPanel){
      const focusable=Array.from(mobileMenuPanel.querySelectorAll('a[href],button:not([disabled]),summary,[tabindex]:not([tabindex="-1"])'));
      if(!focusable.length)return;
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  syncMobileMenu();
  function viewForTarget(target){return target?.closest?.('[data-app-view]')||(target?.id==='top'?homeView:null);}
  function updateActiveNavigation(view){
    const activeRoute=view?.dataset.appView||'home';
    routeLinks.forEach(link=>{if(link.dataset.appRoute===activeRoute)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  }
  function showView(view,target,scroll){
    if(!view)view=homeView;
    let ancestor=target;
    while(ancestor){
      if(ancestor.tagName==='DETAILS')ancestor.open=true;
      ancestor=ancestor.parentElement;
    }
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
    if(link.closest('#mobileMenu'))closeMobileMenu();
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
    if(xp>0){title.textContent='Već si istražio/la dio sadržaja.';description.textContent='Skupio/la si '+xp+' XP. Nastavi istraživati teme i izazove koji te zanimaju.';}
    else{title.textContent='Tvoj put počinje jednim pitanjem.';description.textContent='Isprobaj kratki izazov i prati vlastiti napredak. Ne trebaš otvarati račun.';}
  }
  window.addEventListener('potez:progress',updateHomeProgress);
  window.addEventListener('storage',updateHomeProgress);
  routeFromHash(true);
  updateHomeProgress();
})();
