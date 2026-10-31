'use strict';
// v46 · Reloj grande: tiempo restante a pantalla completa para leerlo desde el atril.
(()=>{
  const weekday=typeof state!=='undefined'&&typeof ProgramStore!=='undefined';
  const weekendPage=typeof weekendValidate==='function';
  if(!weekday&&!weekendPage)return;
  const mmss=ms=>{const s=Math.floor(Math.max(0,ms)/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
  function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n}

  const box=el('div','bigclock');
  box.hidden=true;
  box.setAttribute('role','dialog');
  box.setAttribute('aria-modal','true');
  box.setAttribute('aria-label','Reloj grande');
  const top=el('div','bigclock-top'),phase=el('small','bigclock-phase'),close=el('button','bigclock-close','✕ Cerrar');
  close.type='button';
  top.append(phase,close);
  const title=el('h2','bigclock-title'),who=el('p','bigclock-who');
  const time=el('div','bigclock-time'),detail=el('p','bigclock-detail');
  const bar=el('div','bigclock-bar'),fill=el('span');
  bar.append(fill);
  const actions=el('div','bigclock-actions'),primary=el('button','bigclock-primary'),pause=el('button','bigclock-pause','Ⅱ Pausa');
  primary.type=pause.type='button';
  actions.append(primary,pause);
  const next=el('p','bigclock-next');
  box.append(top,title,who,time,detail,bar,actions,next);
  document.body.append(box);

  let weekendId=null,lastTap=0;
  function tapGuard(fn){const now=Date.now();if(now-lastTap<900)return;lastTap=now;fn();paint()}

  function open(id){
    if(weekendPage)weekendId=id||['talk','watchtower'].find(k=>weekend[k].started!==null)||'talk';
    box.hidden=false;
    document.body.classList.add('bigclock-open');
    paint();
    close.focus?.();
  }
  function shut(){
    box.hidden=true;
    document.body.classList.remove('bigclock-open');
  }
  close.onclick=shut;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!box.hidden)shut()});
  window.openBigClock=open;

  // Datos de lo que se muestra, según la página.
  function model(){
    const now=Date.now();
    if(weekday){
      const i=Number.isInteger(state.focusIndex)&&state.parts[state.focusIndex]?state.focusIndex:null;
      const nextI=upcomingIndex();
      if(i===null){
        const n=state.parts[nextI??0];
        return {phase:'PREPARADA',title:n?numberedPartTitle(state.parts,nextI??0):'Reunión',who:n?.participant||'',limit:(n?.min||0)*60000,elapsed:0,running:false,
          primary:n?'▶ Iniciar':'',act:()=>startPart(nextI??0),canPause:false,next:''};
      }
      const p=state.parts[i],elapsed=value(p,now),counselOn=p.done&&p.after?.started!==null,
            counsel=p.done&&isStudentPart(p)&&p.adviceMin>0;
      const n=nextI===null?null:state.parts[nextI];
      const nextText=n?'Después: '+numberedPartTitle(state.parts,nextI)+(n.participant?' · '+n.participant:''):'Después: canción final y oración';
      if(p.done){
        const t=value(p.after,now);
        if(counsel&&counselOn)return {phase:'CONSEJO',title:numberedPartTitle(state.parts,i),who:p.participant||'',limit:p.adviceMin*60000,elapsed:t,running:true,
          warnAt:15000,primary:'■ Finalizar consejo',act:()=>finishCounsel(i),canPause:false,next:nextText,sub:'Asignación: '+mmss(elapsed)};
        if(n)return {phase:'SIGUIENTE',title:numberedPartTitle(state.parts,nextI),who:n.participant||'',limit:n.min*60000,elapsed:0,running:false,
          primary:'▶ Iniciar'+(n.participant?' a '+n.participant:''),act:()=>startPart(nextI),canPause:false,next:'Anterior: '+p.title+' · '+mmss(elapsed)};
        return {phase:'FIN DEL PROGRAMA',title:'Canción final y oración',who:'',limit:0,elapsed:value(state.total,now),running:state.total.started!==null,
          primary:state.total.started!==null?'■ Finalizar reunión':'',act:()=>{shut();$('stopTotal').onclick()},canPause:false,next:''};
      }
      return {phase:p.started!==null?'EN CURSO':elapsed>0?'EN PAUSA':'PREPARADA',title:numberedPartTitle(state.parts,i),who:p.participant||'',limit:p.min*60000,elapsed,running:p.started!==null,
        primary:p.started!==null?'■ Finalizar asignación':elapsed>0?'▶ Continuar':'▶ Iniciar',act:()=>p.started!==null?finishPart(i):startPart(i),
        canPause:p.started!==null,doPause:()=>pausePart(i),next:nextText};
    }
    const id=weekendId||'talk',part=weekend[id],elapsed=weekendValue(part,now);
    const name=id==='talk'?'Discurso público':'Estudio de La Atalaya';
    const info=id==='talk'?(part.theme||part.title||''):(part.theme||part.title||'');
    const speaker=part.speaker||part.conductor||part.participant||'';
    return {phase:part.started!==null?'EN CURSO':part.done?'FINALIZADA':elapsed>0?'EN PAUSA':'PREPARADA',title:name,who:[typeof info==='string'?info:'',typeof speaker==='string'?speaker:''].filter(Boolean).join(' · '),
      limit:(part.min||0)*60000,elapsed,running:part.started!==null,
      primary:part.started!==null?'■ Finalizar':part.done?'▶ Reanudar':elapsed>0?'▶ Continuar':'▶ Iniciar',
      act:()=>document.getElementById(id+(part.started!==null?'Finish':'Start')).click(),
      canPause:part.started!==null,doPause:()=>document.getElementById(id+'Pause').click(),
      next:id==='talk'?'Después: Estudio de La Atalaya':'',
      sub:'Total de la reunión: '+mmss(weekendValue(weekend.total,now))};
  }

  let current=null;
  function paint(){
    if(box.hidden)return;
    const m=current=model();
    const remaining=m.limit-m.elapsed,hasLimit=m.limit>0;
    const over=hasLimit&&remaining<0,warning=hasLimit&&!over&&m.running&&remaining<=(m.warnAt||Math.min(60000,m.limit/4));
    phase.textContent=m.phase;
    title.textContent=m.title;
    who.textContent=m.who;
    who.hidden=!m.who;
    time.textContent=hasLimit?(over?'+':'')+mmss(Math.abs(remaining)):mmss(m.elapsed);
    detail.textContent=(hasLimit?(over?'Tiempo superado · ':'')+'Llevamos '+mmss(m.elapsed)+' de '+Math.round(m.limit/60000*10)/10+' min':'Sin límite · transcurrido')+(m.sub?' · '+m.sub:'');
    fill.style.width=(hasLimit?Math.max(0,Math.min(1,m.elapsed/m.limit))*100:0)+'%';
    box.dataset.level=over?'over':warning?'warning':m.running?'running':'idle';
    primary.textContent=m.primary;
    primary.hidden=!m.primary;
    pause.hidden=!m.canPause;
    next.textContent=m.next||'';
    next.hidden=!m.next;
  }
  primary.onclick=()=>tapGuard(()=>{current?.act();if(weekday)tick()});
  pause.onclick=()=>tapGuard(()=>{current?.doPause?.();if(weekday)tick()});
  heartbeat(paint,250);

  // Botón «⛶ Reloj grande» junto a cada cronómetro.
  function addButtons(){
    const hosts=weekday?document.querySelectorAll('.assignment-controls'):document.querySelectorAll('.weekend-actions');
    hosts.forEach(h=>{
      if(h.querySelector('.bigclock-open-btn'))return;
      const b=el('button','bigclock-open-btn','⛶ Reloj grande');
      b.type='button';
      b.setAttribute('aria-label','Abrir el reloj grande');
      b.onclick=()=>{
        if(weekendPage){const card=h.closest('details');open(card?.id==='watchtowerCard'?'watchtower':'talk')}
        else{
          const card=h.closest('.assignment-card'),idx=sectionRows.findIndex(r=>r.card===card);
          if(idx>=0&&state.focusIndex!==idx&&!state.parts.some(p=>p.started!==null)&&!state.parts.some(p=>p.after?.started!==null)){state.focusIndex=idx;save();tick()}
          open();
        }
      };
      h.append(b);
    });
  }
  addButtons();
  heartbeat(addButtons,1000);
})();
