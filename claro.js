'use strict';
// v60 · Más claro: tarjetas con solo «Inicio» y «Fin» a la vista (el resto en «⋯»),
// la reunión se bloquea sola al empezar y «A continuación» trae la frase para presentar.
(()=>{
  const weekday=typeof state!=='undefined'&&typeof ProgramStore!=='undefined';
  const weekendPage=typeof weekendValidate==='function';
  if(!weekday&&!weekendPage)return;
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n};
  const safe=(name,fn)=>{try{fn()}catch(e){console.error('v60 '+name,e)}};

  /* 1. Botón «⋯» con Pausa, Deshacer, Reiniciar y Reloj grande */
  function moreMenu(controls,secondary){
    let more=controls.querySelector(':scope > .v60-more');
    if(!more){
      more=el('details','v60-more');
      const sum=el('summary','','⋯');sum.setAttribute('aria-label','Más opciones del cronómetro');
      const box=el('div','v60-more-box');
      more.append(sum,box);controls.append(more);
      more.addEventListener('click',e=>{if(e.target.closest('.v60-more-box button'))setTimeout(()=>{more.open=false},0)});
    }
    const box=more.querySelector('.v60-more-box');
    for(const b of secondary)if(b&&b.parentElement!==box)box.append(b);
    // Pausa visible fuera solo mientras el cronómetro corre
    return more;
  }
  document.addEventListener('click',e=>{document.querySelectorAll('.v60-more[open]').forEach(d=>{if(!d.contains(e.target))d.open=false})},true);
  safe('mas',()=>{
    function paint(){
      if(weekday){
        sectionRows.forEach(r=>{
          const c=r.timing?.querySelector('.assignment-controls');if(!c)return;
          moreMenu(c,[r.pause,r.undo,c.querySelector('.reset-inline'),c.querySelector('.bigclock-open-btn')]);
        });
      }else{
        for(const id of ['talk','watchtower']){
          const c=document.querySelector('#'+id+'Card .weekend-actions');if(!c)continue;
          moreMenu(c,[document.getElementById(id+'Pause'),document.getElementById(id+'Reset'),c.querySelector('.bigclock-open-btn')]);
        }
      }
    }
    paint();heartbeat(paint,600);
  });

  /* 2. Empezar la reunión bloquea la preparación (una vez; puedes desbloquear si lo necesitas) */
  safe('autobloqueo',()=>{
    const total=()=>weekday?state.total:weekend.total;
    const fresh=()=>{const t=total();return t.started===null&&!(t.elapsed>0)};
    let wasFresh=fresh();
    function check(){
      const now=fresh();
      if(wasFresh&&!now&&total().started!==null&&typeof window.setPreparationLock==='function'&&!document.body.classList.contains('prep-locked')){
        window.setPreparationLock(true);
      }
      wasFresh=now;
    }
    heartbeat(check,300);
  });

  /* 3. «A continuación» dentro de la tarjeta, con la frase para presentar la siguiente parte */
  if(weekday)safe('continuacion',()=>{
    function paint(){
      sectionRows.forEach((r,i)=>{
        if(!r.next||r.next.hidden)return;
        const idx=state.focusIndex===i?upcomingIndex():i+1,p=state.parts[idx];
        let line=r.next.querySelector('.v60-next-intro');
        const text=p?((p.presentation||'').trim()||window.transitionFor?.(idx)||''):'';
        if(!text){line?.remove();return}
        if(!line){line=el('p','v60-next-intro');r.nextPerson.after(line)}
        if(line.textContent!==text)line.textContent=text;
      });
    }
    paint();heartbeat(paint,700);
  });
})();
