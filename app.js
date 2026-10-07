const langButton=document.getElementById('language');
const menu=document.getElementById('menu');
const nav=document.getElementById('navigation');
const menuQuery=window.matchMedia('(max-width: 900px)');
function setMenu(opened,restoreFocus=false){
 nav.classList.toggle('open',opened);
 menu.setAttribute('aria-expanded',String(opened));
 menu.setAttribute('aria-label',document.documentElement.lang==='ar'?(opened?'إغلاق قائمة التنقّل':'فتح قائمة التنقّل'):(opened?'Close navigation':'Open navigation'));
 menu.textContent=opened?'×':'☰';
 if(restoreFocus)menu.focus();
}
menu.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
nav.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!e.target.closest('header'))setMenu(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open'))setMenu(false,true)});
document.addEventListener('focusin',e=>{if(nav.classList.contains('open')&&!e.target.closest('header'))setMenu(false)});
menuQuery.addEventListener('change',()=>setMenu(false));
document.querySelectorAll('[data-config]').forEach(a=>{const value=window.NOOR_CONFIG?.[a.dataset.config];if(value&&/^(https:\/\/|mailto:)/.test(value)){a.href=value;const small=a.querySelector('small');if(small){small.dataset.en='AVAILABLE ON';small.dataset.ar='متوفر على';small.textContent=document.documentElement.lang==='ar'?'متوفر على':'AVAILABLE ON';}}else a.addEventListener('click',()=>{document.getElementById('launch-info').classList.add('highlight')})});

// Progressive enhancement: content remains visible when JavaScript is unavailable.
const motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!motionQuery.matches && 'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:0.08});
 document.querySelectorAll('.home-experience,.quran-section,.prayer-section,.adhkar-section,.about').forEach(el=>{el.classList.add('reveal-ready');observer.observe(el)});
 motionQuery.addEventListener('change',()=>{if(motionQuery.matches){document.querySelectorAll('.reveal-ready').forEach(el=>el.classList.add('is-visible'));observer.disconnect()}});
}

document.querySelector('[data-open-khatmah]')?.addEventListener('click',()=>{document.getElementById('quran-preview').open=true});

// Navigation follows the section in view; hover remains a separate cue.
const sectionLinks=[...nav.querySelectorAll('a[href]')].map(link=>{
 const id=new URL(link.href,location.href).hash.slice(1);
 return {link,section:document.getElementById(id)};
}).filter(item=>item.section);
function markCurrent(link){
 sectionLinks.forEach(item=>{
  const current=item.link===link;
  item.link.classList.toggle('is-current',current);
  if(current)item.link.setAttribute('aria-current','location');
  else item.link.removeAttribute('aria-current');
 });
}
let navigationLock=0,scrollFrame=0;
function updateCurrentSection(){
 scrollFrame=0;
 if(navigationLock)return;
 const readingLine=document.querySelector('header').getBoundingClientRect().bottom+Math.min(160,innerHeight*.22);
 const current=sectionLinks.find(({section})=>{
  const bounds=section.getBoundingClientRect();
  return bounds.top<=readingLine&&bounds.bottom>readingLine;
 });
 markCurrent(current?.link);
}
sectionLinks.forEach(({link})=>link.addEventListener('click',()=>{
 markCurrent(link);
 clearTimeout(navigationLock);
 navigationLock=setTimeout(()=>{navigationLock=0;updateCurrentSection()},1000);
}));
window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateCurrentSection)},{passive:true});
window.addEventListener('resize',updateCurrentSection);
window.addEventListener('pageshow',updateCurrentSection);
updateCurrentSection();
