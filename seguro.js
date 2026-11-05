'use strict';
// v54 · Que no te pierdas durante la reunión:
//  1. Deslizar entre asignaciones queda desactivado salvo que lo actives en Opciones.
//  2. Con una reunión en marcha, el gesto «atrás» de Safari no te saca de la reunión.
//  3. Botón fijo «Volver a la asignación en curso» cuando consultas otra tarjeta.
//  4. «‹ Inicio» pide confirmación si la reunión está en marcha.
(()=>{
  const weekday=typeof state!=='undefined'&&typeof ProgramStore!=='undefined';
  const weekendPage=typeof weekendValidate==='function';
  if(!weekday&&!weekendPage)return;
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n};
  const running=()=>{try{return typeof window.meetingRunning==='function'&&window.meetingRunning()}catch(e){return false}};
  const safe=(name,fn)=>{try{fn()}catch(e){console.error('v54 '+name,e)}};

  // Aviso breve en pantalla
  const toast=el('div','v54-toast');toast.setAttribute('role','status');toast.hidden=true;document.body.append(toast);
  let toastTimer=null;
  function say(text){toast.textContent=text;toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast.hidden=true},3500)}

  /* 1. Deslizar: opción en el menú, desactivada por defecto */
  safe('deslizar',()=>{
    if(!weekday)return;
    const KEY='presidencia-deslizar';
    let on=false;try{on=localStorage.getItem(KEY)==='1'}catch(e){}
    document.body.classList.toggle('swipe-on',on);
    const b=el('button','swipe-toggle');b.type='button';
    const label=()=>{b.textContent=on?'Deslizar entre asignaciones: sí':'Deslizar entre asignaciones: no';b.setAttribute('aria-pressed',String(on))};
    b.onclick=()=>{on=!on;try{localStorage.setItem(KEY,on?'1':'0')}catch(e){}document.body.classList.toggle('swipe-on',on);label()};
    label();
    const menu=document.getElementById('toolsMenu');
    const group=menu&&[...menu.querySelectorAll('.menu-group')].find(g=>g.querySelector('.menu-group-title')?.textContent==='Durante la reunión');
    (group||menu)?.append(b);
  });

  /* 2. Gesto «atrás» de Safari bloqueado mientras la reunión está en marcha */
  safe('atras',()=>{
    let guarded=false;
    function arm(){
      if(running()&&!guarded){history.pushState({presidenciaGuard:true},'',location.href);guarded=true}
    }
    window.addEventListener('popstate',()=>{
      if(running()){
        history.pushState({presidenciaGuard:true},'',location.href);
        say('Sigues en la reunión. Para salir, usa «‹ Inicio».');
      }else guarded=false;
    });
    arm();heartbeat(arm,1000);
  });

  /* 3. Volver a la asignación en curso */
  safe('volver',()=>{
    if(!weekday)return;
    const back=el('button','back-to-current');back.type='button';back.hidden=true;
    document.body.append(back);
    function target(){
      const i=state.parts.findIndex(p=>p.started!==null);
      if(i>=0)return i;
      const c=state.parts.findIndex(p=>p.done&&p.after?.started!==null&&isStudentPart(p)&&p.adviceMin>0);
      if(c>=0)return c;
      if(state.total.started===null)return -1;
      try{const m=window.MeetingAction?.model();if(Number.isInteger(m?.index))return m.index}catch(e){}
      return Number.isInteger(state.focusIndex)?state.focusIndex:-1;
    }
    function paint(){
      const t=target(),viewed=state.parts.findIndex(p=>p.id===sectionViewedId);
      const show=t>=0&&viewed>=0&&viewed!==t&&!document.body.classList.contains('bigclock-open')&&!document.body.classList.contains('program-overview');
      back.hidden=!show;
      document.body.classList.toggle('has-back-to-current',show);
      if(!show)return;
      const p=state.parts[t],live=p.started!==null||p.after?.started!==null;
      back.textContent='↩ Volver a '+numberedPartTitle(state.parts,t);
      back.setAttribute('aria-label','Volver a '+(live?'la asignación en curso':'la siguiente asignación')+': '+numberedPartTitle(state.parts,t));
      back.dataset.index=t;
    }
    back.onclick=()=>{
      const t=Number(back.dataset.index);if(!sectionRows[t])return;
      openSectionRow(t);updateSections();
      scrollCardTop(sectionRows[t].card);
      paint();
    };
    paint();heartbeat(paint,400);
  });

  /* 3b. Iniciar una parte fuera de orden pide confirmación */
  safe('fuera-de-orden',()=>{
    if(!weekday)return;
    const view=document.getElementById('sectionView');if(!view)return;
    view.addEventListener('click',e=>{
      const btn=e.target.closest?.('.assignment-controls>.v58-start,.assignment-controls>button:first-child');
      if(!btn||state.total.started===null)return;
      if(!/^(Inicio|Iniciar|Continuar)/.test(btn.textContent.trim()))return;
      const card=btn.closest('.assignment-card'),i=sectionRows.findIndex(r=>r.card===card);
      if(i<0)return;
      let expected=null;try{expected=window.MeetingAction?.model()?.index}catch(err){}
      if(!Number.isInteger(expected)||expected===i)return;
      if(state.parts.some(p=>p.started!==null))return; // la app ya pregunta en este caso
      if(!confirm('¿Iniciar «'+numberedPartTitle(state.parts,i)+'» fuera de orden? Lo siguiente en el programa es «'+numberedPartTitle(state.parts,expected)+'».')){e.preventDefault();e.stopPropagation()}
    },true);
  });

  /* 4. «‹ Inicio» con confirmación si hay reunión en marcha */
  safe('inicio',()=>{
    const link=document.querySelector('.meeting-back a');if(!link)return;
    link.addEventListener('click',e=>{
      if(running()&&!confirm('La reunión sigue en marcha y los relojes no se detienen. ¿Ir a la pantalla de inicio?'))e.preventDefault();
    });
  });
})();
