'use strict';
// v58 · Más sencilla tras la primera reunión real:
//  1. Una sola vista: se quita «Dirigir». Se ven todas las secciones y se va abriendo la que toca.
//  2. «Bloquear preparación»: oculta y desactiva todo lo de editar para que no haya sorpresas.
//  3. Cronómetro con dos botones claros: «Inicio» y «Fin». Al terminar, se abre la siguiente parte.
(()=>{
  const weekday=typeof state!=='undefined'&&typeof ProgramStore!=='undefined';
  const weekendPage=typeof weekendValidate==='function';
  if(!weekday&&!weekendPage)return;
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n};
  const safe=(name,fn)=>{try{fn()}catch(e){console.error('v58 '+name,e)}};
  const KEY='presidencia-bloqueo';

  /* ---------- 1. Una sola vista ---------- */
  safe('vista',()=>{
    document.body.classList.remove('directing-view');
    try{localStorage.setItem('presidencia-view','prepare')}catch(e){}
  });

  /* ---------- 2. Bloquear preparación ---------- */
  const lockBtn=el('button','lock-toggle');lockBtn.type='button';
  function locked(){return document.body.classList.contains('prep-locked')}
  function paintLock(){
    const on=locked();
    lockBtn.textContent=on?'🔒 Bloqueada':'🔓 Bloquear';
    lockBtn.setAttribute('aria-pressed',String(on));
    lockBtn.setAttribute('aria-label',on?'Preparación bloqueada. Toca para desbloquear':'Bloquear la preparación para que no se pueda editar');
  }
  function setLock(on){
    if(on){
      // Guarda y cierra lo que esté abierto antes de bloquear.
      if(weekendPage){
        for(const id of ['talk','watchtower']){
          const editor=document.getElementById(id+'Edit');
          if(editor?.open){document.getElementById(id+'Form').requestSubmit();if(editor.open)return}
        }
      }
      if(weekday&&typeof closePreparationForms==='function')closePreparationForms();
      document.activeElement?.blur?.();
    }
    document.body.classList.toggle('prep-locked',on);
    try{localStorage.setItem(KEY,on?'1':'0')}catch(e){}
    paintLock();
  }
  window.setPreparationLock=setLock;
  safe('candado',()=>{
    let on=false;try{on=localStorage.getItem(KEY)==='1'}catch(e){}
    document.body.classList.toggle('prep-locked',on);
    lockBtn.onclick=()=>setLock(!locked());
    paintLock();
    const menu=document.querySelector('.presidencia-bar .mode-menu');
    if(menu)menu.after(lockBtn);else document.querySelector('.presidencia-bar')?.append(lockBtn);
    // Los antiguos botones Preparar / Dirigir quedan ocultos y equivalen a desbloquear / bloquear.
    const [prep,direct]=document.querySelectorAll('.mode-switch button');
    if(prep)prep.onclick=()=>setLock(false);
    if(direct)direct.onclick=()=>setLock(true);
    // Con la preparación bloqueada, nada abre un editor.
    document.addEventListener('click',e=>{
      if(!locked())return;
      const t=e.target.closest?.('.touch-edit,.intro-use,.empty-toggle,.notify-toggle,.inline-part-editor>summary,.lesson-inline-editor>summary,.weekend-edit>summary,.assignment-notes>summary');
      if(t){e.preventDefault();e.stopPropagation()}
    },true);
    // Marca los textos de «＋ Añadir…» para ocultarlos al bloquear.
    function placeholders(){
      document.querySelectorAll('.touch-edit').forEach(b=>b.classList.toggle('is-placeholder',/^\s*[＋+]/.test(b.textContent||'')));
    }
    placeholders();heartbeat(placeholders,700);
  });

  /* ---------- 3. Inicio y Fin en cada cronómetro ---------- */
  if(weekday)safe('inicio-fin',()=>{
    function counselRunning(p){return p.done&&p.after?.started!==null&&isStudentPart(p)&&p.adviceMin>0}
    function build(r,i){
      const controls=r.timing?.querySelector('.assignment-controls');if(!controls)return null;
      let start=controls.querySelector('.v58-start'),end=controls.querySelector('.v58-end');
      if(start&&end)return {start,end};
      start=el('button','v58-start','Inicio');start.type='button';start.dataset.icon='play';
      end=el('button','v58-end','Fin');end.type='button';end.dataset.icon='stop';
      start.onclick=()=>guarded(()=>{
        const p=state.parts[i];if(!p)return;
        if(state.parts.some((x,j)=>j!==i&&x.started!==null)&&!confirm('¿Terminar la asignación en curso e iniciar esta?'))return;
        startPart(i);
      });
      end.onclick=()=>guarded(()=>{
        const p=state.parts[i];if(!p)return;
        if(p.started!==null){
          finishPart(i);
          // Si no lleva consejo, se abre ya la siguiente parte para tener su «Inicio» a mano.
          if(!(isStudentPart(p)&&p.adviceMin>0))previewNextPart();
        }else if(counselRunning(p)){
          finishCounsel(i);
          previewNextPart();
        }
      });
      controls.prepend(start,end);
      return {start,end};
    }
    function paint(){
      sectionRows.forEach((r,i)=>{
        const p=state.parts[i];if(!p)return;
        const b=build(r,i);if(!b)return;
        r.main?.classList.add('v58-hidden');
        const running=p.started!==null,counsel=counselRunning(p),elapsed=value(p);
        b.start.textContent=!running&&!p.done&&elapsed>0?'Continuar':'Inicio';
        b.start.disabled=running||counsel||p.done;
        b.end.textContent=counsel?'Fin del consejo':'Fin';
        b.end.disabled=!(running||counsel);
        b.start.classList.toggle('is-next',!b.start.disabled);
        b.end.classList.toggle('is-live',!b.end.disabled);
      });
    }
    paint();heartbeat(paint,250);
  });
})();
