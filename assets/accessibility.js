(() => {
  'use strict';
  const KEY='potez-accessibility-v1';
  const root=document.documentElement;
  const defaults={theme:'system',font:100,contrast:false,motion:false};
  let settings={...defaults};
  try{settings={...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{}
  const fontSteps=[100,110,120,130,140,150,160,170,180,190,200];
  const mediaDark=window.matchMedia?.('(prefers-color-scheme: dark)');
  const mediaMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const menu=document.getElementById('accessibilityMenu');
  const themeMeta=document.querySelector('meta[name="theme-color"]');
  function actualTheme(){return settings.theme==='system'?(mediaDark?.matches?'dark':'light'):settings.theme}
  function apply(){
    const theme=actualTheme();
    root.dataset.theme=theme;
    root.dataset.contrast=settings.contrast?'high':'normal';
    root.dataset.motion=(settings.motion||(mediaMotion?.matches??false))?'reduce':'full';
    root.style.setProperty('--font-scale',String(settings.font/100));
    if(themeMeta)themeMeta.content=theme==='dark'?'#101613':'#f7f4ec';
    document.querySelectorAll('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===settings.theme)));
    const fontLabel=document.getElementById('fontScaleValue');
    if(fontLabel)fontLabel.textContent=settings.font+' %';
    document.querySelectorAll('[data-font-step]').forEach(b=>{b.disabled=(b.dataset.fontStep==='1'&&settings.font===200)||(b.dataset.fontStep==='-1'&&settings.font===100)});
    document.querySelectorAll('[data-setting]').forEach(b=>{const active=Boolean(settings[b.dataset.setting]);b.setAttribute('aria-pressed',String(active));b.textContent=active?'Uključeno':'Isključeno'});
  }
  function save(){try{localStorage.setItem(KEY,JSON.stringify(settings))}catch{}apply()}
  document.querySelectorAll('[data-theme-choice]').forEach(b=>b.addEventListener('click',()=>{settings.theme=b.dataset.themeChoice;save()}));
  document.querySelectorAll('[data-font-step]').forEach(b=>b.addEventListener('click',()=>{const current=fontSteps.indexOf(settings.font);settings.font=fontSteps[Math.max(0,Math.min(fontSteps.length-1,current+Number(b.dataset.fontStep)))];save()}));
  document.querySelectorAll('[data-setting]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.setting;settings[key]=!settings[key];save()}));
  document.getElementById('resetAccessibility')?.addEventListener('click',()=>{settings={...defaults};save()});
  mediaDark?.addEventListener?.('change',()=>{if(settings.theme==='system')apply()});
  menu?.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.open=false;menu.querySelector('summary')?.focus()}});
  document.addEventListener('click',event=>{if(menu?.open&&!menu.contains(event.target))menu.open=false});
  apply();
})();