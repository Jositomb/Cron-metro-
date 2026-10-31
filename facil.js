'use strict';
// v48 · Más fácil de usar: barra de acción fija, menú agrupado, preparación guiada,
// deslizar entre asignaciones, datos vacíos agrupados y anillo con el color de la sección.
// Cada mejora va aislada: si una fallara, las demás y el cronómetro siguen funcionando.
(()=>{
  const weekday=typeof state!=='undefined'&&typeof ProgramStore!=='undefined';
  const weekendPage=typeof weekendValidate==='function';
  if(!weekday&&!weekendPage)return;
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n};
  const mmss=ms=>{const s=Math.floor(Math.max(0,ms)/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
  const safe=(name,fn)=>{try{fn()}catch(e){console.error('v48 '+name,e)}};
  const directing=()=>document.body.classList.contains('directing-view');
  const viewedIndex=()=>weekday?state.parts.findIndex(p=>p.id===sectionViewedId):-1;

  /* ---------- 1. Barra de acción fija (abajo, al alcance del pulgar) ---------- */
  safe('barra',()=>{
    if(!window.MeetingAction)return;
    const bar=el('div','action-bar');
    bar.setAttribute('role','region');
    bar.setAttribute('aria-label','Acción de la reunión');
    const info=el('button','action-info');
    info.type='button';
    info.setAttribute('aria-label','Ver esta asignación');
    const phase=el('small','action-phase'),title=el('strong','action-title');
    info.append(phase,title);
    const time=el('span','action-time');
    const pause=el('button','action-pause','Pausa');
    pause.type='button';pause.dataset.icon='pause';
    const big=el('button','action-big');
    big.type='button';big.dataset.icon='expand';
    big.setAttribute('aria-label','Abrir el reloj grande');
    const primary=el('button','action-primary');
    primary.type='button';
    bar.append(info,time,pause,big,primary);
    document.body.append(bar);

    function weekendTarget(){
      const running=['talk','watchtower'].find(k=>weekend[k].started!==null);
      if(running)return running;
      if(!weekend.talk.done)return 'talk';
      return 'watchtower';
    }
    let current=null;
    function paint(){
      const visible=(directing()||(window.meetingRunning&&window.meetingRunning()))&&!document.body.classList.contains('bigclock-open');
      bar.hidden=!visible;
      document.body.classList.toggle('has-action-bar',visible);
      if(!visible){document.querySelectorAll('.bar-target').forEach(n=>n.classList.remove('bar-target'));return}
      let m;
      if(weekday)m=MeetingAction.model();
      else{
        const id=weekendTarget();
        m=MeetingAction.model({weekendId:id});
        if(weekend.talk.done&&weekend.watchtower.done&&weekend.total.started!==null&&!weekend.ended){
          m={...m,phase:'FIN',primary:'Finalizar reunión',intent:'finish',act:()=>document.getElementById('finishWeekend').click(),canPause:false};
        }
        if(weekend.ended)m={...m,phase:'REUNIÓN FINALIZADA',primary:'',canPause:false,running:false};
        m.weekendId=id;
      }
      current=m;
      if(weekday)sectionRows.forEach((r,i)=>r.card.classList.toggle('bar-target',i===m.index));
      else for(const k of ['talk','watchtower'])document.getElementById(k+'Card')?.classList.toggle('bar-target',k===m.weekendId);
      const remaining=m.limit-m.elapsed,hasLimit=m.limit>0,over=hasLimit&&remaining<0;
      const warning=hasLimit&&!over&&m.running&&remaining<=(m.warnAt||Math.min(60000,m.limit/4));
      phase.textContent=m.phase+(m.who?' · '+m.who:'');
      title.textContent=m.title;
      time.textContent=hasLimit?(over?'+':'')+mmss(Math.abs(remaining)):mmss(m.elapsed);
      bar.dataset.level=over?'over':warning?'warning':m.running?'running':'idle';
      primary.textContent=m.primary||'';
      primary.hidden=!m.primary;
      primary.dataset.intent=m.intent||'start';
      primary.dataset.icon=m.intent==='finish'?'stop':'play';
      pause.hidden=!m.canPause;
    }
    primary.onclick=()=>MeetingAction.guard(()=>{current?.act?.();if(weekday)tick();paint()});
    pause.onclick=()=>MeetingAction.guard(()=>{current?.doPause?.();if(weekday)tick();paint()});
    big.onclick=()=>openBigClock(current?.weekendId);
    info.onclick=()=>{
      if(weekday){
        const i=Number.isInteger(current?.index)?current.index:state.focusIndex;
        if(Number.isInteger(i)&&sectionRows[i]){openSectionRow(i);updateSections();sectionRows[i].card.scrollIntoView?.({block:'start',behavior:'auto'})}
      }else{
        const card=document.getElementById((current?.weekendId||'talk')+'Card');
        if(card){card.open=true;card.scrollIntoView?.({block:'start',behavior:'auto'})}
      }
    };
    paint();
    heartbeat(paint,250);
  });

  /* ---------- 2. Menú de opciones agrupado ---------- */
  safe('menu',()=>{
    const menu=weekday?document.getElementById('toolsMenu'):document.querySelector('.weekend-footer');
    if(!menu)return;
    const q=sel=>menu.querySelector(sel);
    const groups=weekday?[
      ['Durante la reunión','',['#startTotal','#stopTotal','#summaryOpen','#undoMenu','#prepareMenu','#timeDetails']],
      ['Preparar','',['.clarity-tool','#guideOpen','#edit','#weeksOpen','#rehearsalToggle','.outline-size-label']],
      ['Copias y datos','',['.transfer-button','#backupOpen','.local-save','.storage-info']],
      ['Empezar de nuevo','danger',['#resetSelected','#resetTotal','#newMeeting']],
    ]:[
      ['Durante la reunión','',['#finishWeekend','.clarity-tool']],
      ['Copias y datos','',['.transfer-button','#exportWeekend','label:has(#importWeekend)','.local-save','.storage-info']],
      ['Letra','',['.reading-size']],
      ['Empezar de nuevo','danger',['#resetWeekend','#newWeekend']],
    ];
    const used=new Set();
    const leftovers=el('div','menu-hidden');
    leftovers.hidden=true;
    for(const [label,tone,selectors] of groups){
      const box=el('div','menu-group'+(tone?' menu-group-'+tone:''));
      box.append(el('p','menu-group-title',label));
      let any=false;
      for(const s of selectors){
        let node=null;
        try{node=q(s)}catch(e){node=null}
        if(!node&&s.startsWith('label:has(')){const inner=q(s.slice(10,-1));node=inner?.closest('label')||null}
        if(node&&!used.has(node)){used.add(node);box.append(node);any=true}
      }
      if(any)menu.append(box);
    }
    // Lo que queda (vistas antiguas ocultas, estado sin conexión…) se conserva pero no estorba.
    for(const child of [...menu.children]){
      if(child.classList.contains('menu-group')||child.classList.contains('tools-menu-heading'))continue;
      const visible=getComputedStyle(child).display!=='none'&&!child.hidden;
      if(visible&&child.id==='offlineStatus')continue;
      if(!visible)leftovers.append(child);
    }
    menu.append(leftovers);
    const offline=document.getElementById('offlineStatus');
    const data=menu.querySelector('.menu-group .storage-info')?.parentElement;
    if(offline&&data){data.append(offline);offline.classList.add('menu-status')}
  });

  /* ---------- 3. Preparación guiada, campo a campo ---------- */
  safe('guiada',()=>{
    if(!weekday)return;
    const review=document.querySelector('#toolsMenu .clarity-tool');
    if(!review)return;
    const labels={participant:'Participante',companion:'Acompañante',openingSong:'Canción inicial',middleSong:'Canción intermedia',closingSong:'Canción final'};
    function missing(){
      const list=[];
      state.parts.forEach((p,i)=>{
        const kind=partKind(p);
        if(!['opening','conclusion'].includes(kind)&&!p.participant?.trim()){
          const f=inlineFields(p).find(x=>x&&x[0]==='participant');
          list.push({where:numberedPartTitle(state.parts,i),label:f?f[1]:'Participante',id:p.id,key:'participant',max:120});
        }
        if(kind==='student'&&!p.companion?.trim())list.push({where:numberedPartTitle(state.parts,i),label:'Acompañante',id:p.id,key:'companion',max:120});
      });
      for(const [key,kind] of [['openingSong','opening'],['middleSong','song'],['closingSong','conclusion']]){
        if(!state.meeting?.[key]?.trim())list.push({where:'Canciones',label:labels[key],key,meeting:true,part:state.parts.find(p=>partKind(p)===kind)?.id,max:150});
      }
      return list;
    }
    function store(item,value){
      if(item.meeting){
        if(!validFields({[item.key]:value},MEETING_FIELDS))throw Error('Revisa el texto: es demasiado largo.');
        if(item.key==='middleSong'||!item.part){state.meeting=meetingOf({...state.meeting,[item.key]:value});persistInlineChanges()}
        else saveInlinePart(item.part,{},undefined,{[item.key]:value});
      }else saveInlinePart(item.id,{[item.key]:value});
    }
    review.onclick=event=>{
      event?.stopPropagation?.();
      document.getElementById('toolsDisclosure').open=false;
      const queue=missing(),total=queue.length;
      let done=0;
      const d=el('dialog','guided-prep');
      d.setAttribute('aria-label','Preparación guiada');
      const progress=el('p','guided-progress'),where=el('p','guided-where'),label=el('label','guided-label'),input=el('input'),error=el('p','guided-error');
      input.type='text';input.autocomplete='off';
      label.append(el('span','',''),input);
      error.setAttribute('role','alert');
      const actions=el('div','guided-actions'),saveBtn=el('button','guided-save','Guardar y seguir'),skip=el('button','guided-skip','Saltar'),close=el('button','guided-close','Terminar');
      saveBtn.type=skip.type=close.type='button';
      actions.append(saveBtn,skip);
      d.append(el('h2','','Preparación guiada'),progress,where,label,error,actions,close);
      document.body.append(d);
      let item=null;
      function show(){
        error.textContent='';
        item=queue.shift();
        if(!item){
          progress.textContent=total?'Listo: '+done+' de '+total+' completados.':'No falta nada: participantes, acompañantes y canciones están completos.';
          where.textContent='Puedes empezar la reunión aunque quede algún dato vacío.';
          label.hidden=true;actions.hidden=true;close.textContent='Cerrar';
          return;
        }
        progress.textContent='Paso '+(total-queue.length)+' de '+total;
        where.textContent=item.where;
        label.firstChild.textContent=item.label;
        input.value='';input.maxLength=item.max;
        setTimeout(()=>input.focus?.(),50);
      }
      saveBtn.onclick=()=>{
        const v=input.value.trim();
        if(!v){error.textContent='Escribe el dato o pulsa Saltar.';return}
        try{store(item,v);done++;show()}catch(e){error.textContent=e.message}
      };
      input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();saveBtn.onclick()}});
      skip.onclick=show;
      close.onclick=()=>{d.close();d.remove()};
      d.addEventListener('cancel',()=>setTimeout(()=>d.remove(),0));
      show();
      d.showModal();
    };
  });

  /* ---------- 4. Deslizar entre asignaciones en Dirigir ---------- */
  safe('deslizar',()=>{
    if(!weekday)return;
    const view=document.getElementById('sectionView');
    if(!view)return;
    let start=null;
    const blocked=t=>t.closest?.('canvas,textarea,input,select,.ink-pad,[contenteditable],.lesson-inline-text,dialog');
    view.addEventListener('touchstart',e=>{
      if(!directing()||e.touches.length!==1||blocked(e.target)){start=null;return}
      const t=e.touches[0];start={x:t.clientX,y:t.clientY,at:Date.now()};
    },{passive:true});
    view.addEventListener('touchend',e=>{
      if(!start)return;
      const t=e.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y,quick=Date.now()-start.at<700;
      start=null;
      if(!quick||Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.8)return;
      const i=viewedIndex();
      if(i<0)return;
      const to=dx<0?i+1:i-1;
      if(!state.parts[to]||!sectionRows[to])return;
      openSectionRow(to);
      updateSections();
      sectionRows[to].card.scrollIntoView?.({block:'start',behavior:'auto'});
      const card=sectionRows[to].card;
      card.classList.remove('swipe-in-left','swipe-in-right');
      void card.offsetWidth;
      card.classList.add(dx<0?'swipe-in-left':'swipe-in-right');
    },{passive:true});
    const hint=el('p','swipe-hint','Desliza a los lados para pasar de asignación');
    view.before(hint);
  });

  /* ---------- 5. Datos vacíos agrupados en Preparar ---------- */
  safe('vacios',()=>{
    if(!weekday)return;
    function group(){
      for(const r of sectionRows){
        const blocks=[...r.brief.querySelectorAll(':scope > section.outline-block')];
        const empty=blocks.filter(b=>/^[＋+]/.test((b.querySelector('.outline-value')?.textContent||'').trim()));
        blocks.forEach(b=>b.classList.toggle('is-empty',empty.includes(b)));
        let toggle=r.brief.querySelector(':scope > .empty-toggle');
        if(empty.length<2){toggle?.remove();r.brief.classList.remove('empties-collapsed');continue}
        if(!toggle){
          toggle=el('button','empty-toggle');
          toggle.type='button';
          toggle.onclick=()=>{r.brief.classList.toggle('empties-open')};
          empty[0].before(toggle);
          r.brief.classList.add('empties-collapsed');
        }
        const names=empty.map(b=>(b.querySelector('h3')?.textContent||'').trim().toLowerCase()).filter(Boolean);
        toggle.textContent=r.brief.classList.contains('empties-open')?'Ocultar datos vacíos':'＋ Completar '+empty.length+' datos: '+names.join(', ');
      }
    }
    group();
    heartbeat(group,700);
  });

  /* ---------- 6. Anillo de cada reloj con el color de su sección ---------- */
  safe('anillo',()=>{
    if(!weekday)return;
    const NS='http://www.w3.org/2000/svg',C=2*Math.PI*46;
    function ring(host){
      let svg=host.querySelector(':scope > svg.tone-ring');
      if(svg)return svg;
      svg=document.createElementNS(NS,'svg');
      svg.setAttribute('class','tone-ring');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('aria-hidden','true');
      const track=document.createElementNS(NS,'circle'),arc=document.createElementNS(NS,'circle');
      for(const c of [track,arc]){c.setAttribute('cx','50');c.setAttribute('cy','50');c.setAttribute('r','46')}
      track.setAttribute('class','tone-track');arc.setAttribute('class','tone-arc');
      arc.setAttribute('stroke-dasharray',String(C));
      svg.append(track,arc);
      host.prepend(svg);
      return svg;
    }
    function paint(){
      const now=Date.now();
      sectionRows.forEach((r,i)=>{
        const p=state.parts[i];
        if(!p||!r.counters)return;
        const host=r.counters.firstElementChild;
        if(!host)return;
        const arc=ring(host).querySelector('.tone-arc');
        const limit=p.min*60000,left=limit>0?Math.max(0,Math.min(1,1-value(p,now)/limit)):0;
        arc.setAttribute('stroke-dashoffset',String(C*(1-left)));
        host.dataset.tone=r.card.dataset.sectionTone||'opening';
        host.classList.add('has-tone-ring');
      });
    }
    paint();
    heartbeat(paint,500);
  });
})();
