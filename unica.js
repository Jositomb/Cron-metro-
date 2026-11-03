'use strict';
// v49 · Funciones propias de Mi Presidencia: frases de presentación, ayuda para recuperar tiempo,
// consejo con un toque, cuenta atrás y lista «Antes de empezar», historial, reloj TOTAL por secciones,
// columna de progreso, atril oscuro y aviso de los últimos 10 segundos.
// Cada bloque va aislado: si uno fallara, el resto y los cronómetros siguen funcionando.
(()=>{
  const weekday=typeof state!=='undefined'&&typeof ProgramStore!=='undefined';
  const weekendPage=typeof weekendValidate==='function';
  const home=!weekday&&!weekendPage;
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null&&text!=='')n.textContent=text;return n};
  const hms=ms=>{const s=Math.round(Math.max(0,ms)/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?h+' h '+String(m).padStart(2,'0')+' min':m+' min'};
  const mmss=ms=>{const s=Math.floor(Math.max(0,ms)/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
  const safe=(name,fn)=>{try{fn()}catch(e){console.error('v49 '+name,e)}};
  const read=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch(e){return d}};
  const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
  const TARGET=105*60000;
  const TONES={opening:'#28666c',treasures:'#46606f',teaching:'#8a6526',living:'#8b4559',talk:'#28666c',watchtower:'#8b4559'};
  const toneOf=section=>section==='TESOROS DE LA BIBLIA'?'treasures':section==='SEAMOS MEJORES MAESTROS'?'teaching':section==='NUESTRA VIDA CRISTIANA'?'living':'opening';
  const directing=()=>document.body.classList.contains('directing-view');
  const cleanTitle=t=>String(t||'').replace(/^\s*\d+\.\s*/,'').replace(/^[«"]|[»"]$/g,'').trim();

  // Añadir un botón a un bloque del menú agrupado (v48).
  function addToMenu(groupTitle,node){
    const menu=document.getElementById('toolsMenu')||document.querySelector('.weekend-footer');
    if(!menu)return;
    const group=[...menu.querySelectorAll('.menu-group')].find(g=>g.querySelector('.menu-group-title')?.textContent===groupTitle)||menu.querySelector('.menu-group')||menu;
    group.append(node);
  }
  function dialog(title,cls){
    const d=el('dialog','v49-dialog '+(cls||''));
    d.append(el('h2','',title));
    const body=el('div','v49-body');
    const close=el('button','v49-close','Cerrar');
    close.type='button';
    close.onclick=()=>{d.close();d.remove()};
    d.append(body,close);
    d.addEventListener('cancel',()=>setTimeout(()=>d.remove(),0));
    document.body.append(d);
    return {d,body};
  }

  /* ================= 1. Frases de presentación ================= */
  function transitionFor(i){
    const p=state.parts[i];if(!p)return '';
    const kind=partKind(p);
    if(['opening','conclusion'].includes(kind))return '';
    const name=(p.participant||'').trim();
    if(!name)return '';
    const prev=state.parts[i-1];
    const thanks=prev&&prev.participant?.trim()&&partKind(prev)!=='opening'?'Gracias, '+prev.participant.trim()+'. ':'';
    let t=cleanTitle(p.title);
    const generic=/^(intervenci[oó]n|nueva intervenci[oó]n|parte de nuestra vida cristiana|discurso de tesoros)\s*\d*$/i.test(t);
    const named=generic?'':' «'+t+'»';
    const enter=p.section==='TESOROS DE LA BIBLIA'?'Pasamos a la sección Tesoros de la Biblia. ':p.section==='SEAMOS MEJORES MAESTROS'?'Pasamos a la sección Seamos Mejores Maestros. ':p.section==='NUESTRA VIDA CRISTIANA'?'Pasamos a la sección Nuestra Vida Cristiana. ':'';
    const ref=(p.reference||'').trim();
    const companion=(p.companion||'').trim(),reader=(p.reader||'').trim();
    let s;
    switch(kind){
      case 'treasure':s=name+' nos presenta el discurso'+(named||'')+'.';break;
      case 'pearls':s='Ahora '+name+' dirige la sección'+(named||' de perlas espirituales')+'.';break;
      case 'reading':s='A continuación, '+name+' hará la lectura de la Biblia'+(ref&&ref.length<80?': '+ref:'')+'.';break;
      case 'student':s='La siguiente asignación es'+(named||' una intervención')+(p.min?', de '+p.min+' minutos':'')+'. La presenta'+(companion?'n '+name+' y '+companion:' '+name)+'.';break;
      case 'studentTalk':s='A continuación, '+name+' presenta el discurso'+(named||'')+'.';break;
      case 'living':s=name+' tratará la parte'+(named||'')+'.';break;
      case 'study':s='Pasamos al estudio bíblico de congregación, que dirige '+name+(reader?'. '+reader+' leerá los párrafos':'')+'.';break;
      default:s='A continuación, '+name+(named?' con'+named:'')+'.';
    }
    return (thanks+enter+s).replace(/\s+/g,' ').trim();
  }
  if(weekday)safe('frases',()=>{
    function paint(){
      sectionRows.forEach((r,i)=>{
        const p=state.parts[i];if(!p||!r.brief)return;
        let box=r.brief.querySelector(':scope > .intro-suggestion');
        const own=(p.presentation||'').trim();
        const text=own?'':transitionFor(i);
        if(!text){box?.remove();return}
        if(!box){
          box=el('section','intro-suggestion');
          const head=el('div','intro-head');
          head.append(el('small','','PARA PRESENTAR · SUGERENCIA'));
          const use=el('button','intro-use','Usar y editar');
          use.type='button';
          use.onclick=()=>{
            const id=p.id,txt=box.dataset.text;
            try{saveInlinePart(id,{presentation:txt});openPartFieldEditor(id,'presentation')}
            catch(e){announce(e.message)}
          };
          head.append(use);
          box.append(head,el('p','intro-text'));
          r.brief.prepend(box);
        }
        if(box.dataset.text!==text){box.dataset.text=text;box.querySelector('.intro-text').textContent=text}
        box.classList.toggle('already-started',p.started!==null||p.done||value(p)>0);
      });
    }
    // v57 · La tarjeta «Después» muestra también la frase para presentar la siguiente parte.
    function paintNext(){
      const card=document.querySelector('.atril-next');if(!card)return;
      const i=state.parts.findIndex(p=>p.id===sectionViewedId)+1,p=state.parts[i];
      let line=card.querySelector('.next-intro');
      const text=p?((p.presentation||'').trim()||transitionFor(i)):'';
      if(!text){line?.remove();return}
      if(!line){line=el('span','next-intro');card.append(line)}
      if(line.textContent!==text)line.textContent=text;
    }
    paint();paintNext();heartbeat(paint,1000);heartbeat(paintNext,500);
  });

  /* ================= 2. Ayuda para recuperar tiempo ================= */
  if(weekday)safe('recuperar',()=>{
    const pace=document.getElementById('pace');if(!pace)return;
    const tip=el('p','recovery-tip');tip.setAttribute('role','status');tip.hidden=true;
    pace.after(tip);
    function paint(){
      const now=Date.now();
      if(state.total.started===null||state.endedAt){tip.hidden=true;return}
      const drift=paceAt(now);
      if(drift===null||drift<60000){tip.hidden=true;return}
      const from=Number.isInteger(state.focusIndex)?state.focusIndex+(state.parts[state.focusIndex]?.started===null&&!state.parts[state.focusIndex]?.done?0:1):0;
      const ideas=[];
      for(let i=from;i<state.parts.length;i++){
        const p=state.parts[i],k=partKind(p);
        if(k==='living'&&p.min>=5)ideas.push([numberedPartTitle(state.parts,i),Math.min(2,Math.floor(p.min*.15))*60000]);
        else if(k==='conclusion'&&p.min>=2)ideas.push([cleanTitle(p.title),60000]);
        else if(k==='study'&&p.min>=25)ideas.push([cleanTitle(p.title),60000]);
      }
      const counsel=state.parts.slice(from).filter(p=>isStudentPart(p)&&p.adviceMin>=1).length;
      if(counsel)ideas.push(['Consejos más breves ('+counsel+')',counsel*20000]);
      let sum=0;const picked=[];
      for(const it of ideas){if(sum>=drift)break;picked.push(it);sum+=it[1]}
      tip.hidden=false;
      tip.textContent=picked.length?'Para recuperar '+mmss(drift)+': '+picked.map(([n,ms])=>n+' −'+(ms%60000===0?ms/60000+' min':ms<60000?Math.round(ms/1000)+' s':mmss(ms))).join(' · ')+(sum<drift?' · el resto, al final':''):'Llevas '+mmss(drift)+' de retraso: quedan pocas partes ajustables; abrevia transiciones y anuncios.';
    }
    paint();heartbeat(paint,2000);
  });

  /* ================= 3. Consejo con un toque ================= */
  if(weekday)safe('consejo',()=>{
    const GOOD=['Buena introducción','Contacto visual','Naturalidad','Tono conversacional','Uso de la Biblia','Buen ejemplo','Preguntas eficaces','Conclusión clara','Buen ritmo','Ajustado al tiempo'];
    const BETTER=['Más contacto visual','Ritmo más pausado','Más volumen','Leer con más expresión','Explicar el texto','Aplicación práctica','Ajustarse al tiempo'];
    function build(r,p){
      const box=el('section','advice-chips');
      box.dataset.partId=p.id;
      box.append(el('small','advice-chips-title','CONSEJO RÁPIDO · toca para marcar'));
      for(const [label,list,tone] of [['Encomiar',GOOD,'good'],['Mejorar',BETTER,'better']]){
        const row=el('div','chip-row chip-'+tone);
        row.append(el('span','chip-label',label));
        for(const t of list){
          const c=el('button','chip',t);c.type='button';c.dataset.tag=tone+':'+t;
          c.onclick=()=>{
            const part=state.parts.find(x=>x.id===p.id);if(!part)return;
            const tags=new Set(Array.isArray(part.adviceTags)?part.adviceTags:[]);
            tags.has(c.dataset.tag)?tags.delete(c.dataset.tag):tags.add(c.dataset.tag);
            part.adviceTags=[...tags].slice(0,30);
            save();paintBox(box,part);
          };
          row.append(c);
        }
        box.append(row);
      }
      const clear=el('button','chip-clear','Borrar marcas');clear.type='button';
      clear.onclick=()=>{const part=state.parts.find(x=>x.id===p.id);if(part){part.adviceTags=[];save();paintBox(box,part)}};
      box.append(el('p','chip-summary'),clear);
      (r.lessonPanel||r.brief).append(box);
      return box;
    }
    function paintBox(box,part){
      const tags=new Set(Array.isArray(part.adviceTags)?part.adviceTags:[]);
      box.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',String(tags.has(c.dataset.tag))));
      const good=[...tags].filter(t=>t.startsWith('good:')).map(t=>t.slice(5)),better=[...tags].filter(t=>t.startsWith('better:')).map(t=>t.slice(7));
      const sum=box.querySelector('.chip-summary');
      sum.textContent=(good.length?'Encomiar: '+good.join(', ')+'. ':'')+(better.length?'Mejorar: '+better.join(', ')+'.':'');
      sum.hidden=!sum.textContent;
      box.querySelector('.chip-clear').hidden=!tags.size;
      box.classList.toggle('has-tags',!!tags.size);
    }
    function paint(){
      sectionRows.forEach((r,i)=>{
        const p=state.parts[i];if(!p||!isStudentPart(p))return;
        let box=r.card.querySelector('.advice-chips');
        if(box&&box.dataset.partId!==p.id){box.remove();box=null}
        if(!box)box=build(r,p);
        paintBox(box,p);
        const counsel=state.focusIndex===i&&p.done&&p.after?.started!==null;
        box.classList.toggle('in-counsel',counsel);
      });
    }
    paint();heartbeat(paint,700);
  });

  /* ================= 4. Horario, cuenta atrás y «Antes de empezar» ================= */
  const DAYS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  const schedule=()=>read('presidencia-horario-v1',{});
  function nextStart(cfg,now=new Date()){
    if(!cfg||!Number.isInteger(cfg.dow)||!/^\d{2}:\d{2}$/.test(cfg.time||''))return null;
    const [h,m]=cfg.time.split(':').map(Number);
    const d=new Date(now);d.setHours(h,m,0,0);
    let add=(cfg.dow-d.getDay()+7)%7;
    d.setDate(d.getDate()+add);
    if(d.getTime()<now.getTime()-2*3600000)d.setDate(d.getDate()+7);
    return d;
  }
  function untilText(ms){
    if(ms<=0)return 'ya ha empezado';
    const min=Math.ceil(ms/60000);
    if(min<60)return 'empieza en '+min+' min';
    const h=Math.floor(min/60);
    if(h<24)return 'empieza en '+h+' h '+(min%60?min%60+' min':'');
    const days=Math.round(ms/86400000);
    return 'faltan '+days+(days===1?' día':' días');
  }
  function openSchedule(){
    const {d,body}=dialog('Día y hora de las reuniones','schedule-dialog');
    const cfg=schedule();
    const rows={};
    for(const [key,label,defDow,defTime] of [['weekday','Entre semana',3,'19:00'],['weekend','Fin de semana',0,'10:00']]){
      const row=el('div','schedule-row');
      row.append(el('strong','',label));
      const day=el('select');DAYS.forEach((n,i)=>{const o=el('option','',n);o.value=i;day.append(o)});
      day.value=String(cfg[key]?.dow??defDow);
      const time=el('input');time.type='time';time.value=cfg[key]?.time||defTime;
      row.append(day,time);body.append(row);rows[key]={day,time};
    }
    body.append(el('p','v49-note','Sirve para la cuenta atrás y la lista «Antes de empezar». Se guarda solo en este dispositivo.'));
    const ok=el('button','v49-primary','Guardar');ok.type='button';
    ok.onclick=()=>{
      const out={};
      for(const k of ['weekday','weekend'])out[k]={dow:Number(rows[k].day.value),time:rows[k].time.value||'19:00'};
      write('presidencia-horario-v1',out);d.close();d.remove();
    };
    body.append(ok);
    d.showModal();
  }
  function checklistItems(){
    if(weekday){
      const m=state.meeting||{},items=[];
      items.push(['Presidente',m.chairman],['Canción inicial',m.openingSong],['Oración inicial',m.openingPrayer]);
      state.parts.forEach((p,i)=>{if(p.participant?.trim()&&!['opening','conclusion'].includes(partKind(p)))items.push([numberedPartTitle(state.parts,i),p.participant+(p.companion?' y '+p.companion:'')])});
      items.push(['Canción intermedia',m.middleSong],['Canción final',m.closingSong],['Oración final',m.closingPrayer]);
      return items.map(([a,b])=>a+(b?.trim?.()?': '+b.trim():' · sin indicar'));
    }
    const t=weekend.talk||{},w=weekend.watchtower||{};
    return ['Discursante: '+(t.speaker||'sin indicar'),'Tema: '+(t.theme||'sin indicar'),'Canción: '+(t.song||'sin indicar'),'Conduce el estudio: '+(w.conductor||'sin indicar'),'Lector: '+(w.reader||'sin indicar'),'Canción del estudio: '+(w.song||'sin indicar')];
  }
  function openChecklist(){
    const type=weekday?'weekday':'weekend',day=new Date().toISOString().slice(0,10),k='presidencia-checklist-'+type+'-'+day;
    const done=new Set(read(k,[]));
    const {d,body}=dialog('Antes de empezar','checklist-dialog');
    const items=[...checklistItems(),'Audio, vídeo y micrófonos comprobados','iPad cargado y en modo No molestar','Reloj de la sala a la hora'];
    for(const text of items){
      const lab=el('label','check-item'),box=el('input');box.type='checkbox';box.checked=done.has(text);
      box.onchange=()=>{box.checked?done.add(text):done.delete(text);write(k,[...done])};
      lab.append(box,el('span','',text));body.append(lab);
    }
    d.showModal();
  }
  if(!home)safe('horario',()=>{
    const sched=el('button','','Día y hora de la reunión');sched.type='button';sched.onclick=openSchedule;
    const check=el('button','','Antes de empezar');check.type='button';check.onclick=openChecklist;
    addToMenu('Preparar',sched);
    addToMenu(weekday?'Preparar':'Durante la reunión',check);
    const banner=el('div','start-banner');banner.hidden=true;
    const text=el('span','start-text'),open=el('button','start-check','Antes de empezar');open.type='button';open.onclick=openChecklist;
    banner.append(text,open);
    const bar=document.querySelector('.presidencia-bar');(bar||document.querySelector('header'))?.after(banner);
    function paint(){
      const cfg=schedule()[weekday?'weekday':'weekend'],start=nextStart(cfg);
      const started=weekday?(state.total.started!==null||value(state.total)>0):(weekend.total.started!==null||weekend.total.elapsed>0);
      if(!start||started){banner.hidden=true;return}
      const left=start.getTime()-Date.now();
      if(left>60*60000||left<-30*60000){banner.hidden=true;return}
      banner.hidden=false;
      banner.classList.toggle('soon',left<=5*60000);
      text.textContent=left>0?(left<10*60000?'Empieza en '+mmss(left):'La reunión '+untilText(left)+' · '+cfg.time):'Hora de empezar ('+cfg.time+')';
    }
    paint();heartbeat(paint,1000);
  });
  if(home)safe('inicio',()=>{
    const grid=document.querySelector('.portal-grid');if(!grid)return;
    const card=el('section','next-meeting');
    grid.before(card);
    function paint(){
      const cfg=schedule();card.replaceChildren();
      const opts=[['weekday','Entre semana','weekday.html'],['weekend','Fin de semana','weekend.html']].map(([k,n,u])=>({n,u,cfg:cfg[k],at:nextStart(cfg[k])})).filter(o=>o.at).sort((a,b)=>a.at-b.at);
      if(!opts.length){
        card.append(el('small','','PRÓXIMA REUNIÓN'),el('p','','Indica el día y la hora de tus reuniones para ver la cuenta atrás.'));
        const b=el('button','next-config','Configurar horario');b.type='button';b.onclick=()=>{openSchedule();setTimeout(paint,300)};card.append(b);return;
      }
      const o=opts[0],left=o.at.getTime()-Date.now();
      const link=el('a','next-link');link.href=o.u;
      link.append(el('small','','PRÓXIMA REUNIÓN · '+o.n.toUpperCase()),el('strong','',DAYS[o.at.getDay()]+' '+o.cfg.time),el('span','next-left',untilText(left)));
      card.append(link);
      card.classList.toggle('soon',left>0&&left<=60*60000);
      const b=el('button','next-config','Cambiar horario');b.type='button';b.onclick=()=>{openSchedule()};card.append(b);
    }
    paint();heartbeat(paint,15000);
    document.addEventListener('close',()=>setTimeout(paint,50),true);
  });

  /* ================= 5. Historial y tendencias ================= */
  const HKEY='presidencia-historial-v1';
  function record(entry){
    const list=read(HKEY,[]).filter(h=>!(h.type===entry.type&&h.day===entry.day));
    list.unshift(entry);write(HKEY,list.slice(0,60));
  }
  if(weekday)safe('historial-registro',()=>{
    const original=$('stopTotal').onclick;
    $('stopTotal').onclick=function(...a){
      const r=original.apply(this,a);
      try{
        if(!rehearsalActive&&value(state.total)>60000)record({type:'weekday',day:new Date().toISOString().slice(0,10),finishedAt:Date.now(),name:state.programName||'Entre semana',total:value(state.total),
          parts:state.parts.map(p=>({title:p.title,kind:partKind(p),planned:p.min,elapsed:value(p),advice:value(p.after),adviceMin:p.adviceMin||0}))});
      }catch(e){console.error(e)}
      return r;
    };
  });
  if(weekendPage)safe('historial-registro-finde',()=>{
    const btn=document.getElementById('finishWeekend'),original=btn.onclick;
    btn.onclick=function(...a){
      const r=original.apply(this,a);
      try{if(weekend.ended&&weekendValue(weekend.total)>60000)record({type:'weekend',day:new Date().toISOString().slice(0,10),finishedAt:Date.now(),name:'Fin de semana',total:weekendValue(weekend.total),
        parts:[['talk','Discurso público'],['watchtower','Estudio de La Atalaya']].map(([k,t])=>({title:t,kind:k,planned:weekend[k].min,elapsed:weekendValue(weekend[k]),advice:0,adviceMin:0}))})}catch(e){console.error(e)}
      return r;
    };
  });
  const KIND_NAMES={opening:'Introducción',treasure:'Discurso de Tesoros',pearls:'Perlas espirituales',reading:'Lectura de la Biblia',student:'Asignaciones de estudiantes',studentTalk:'Discursos de estudiantes',living:'Nuestra vida cristiana',study:'Estudio bíblico',conclusion:'Conclusión',talk:'Discurso público',watchtower:'Estudio de La Atalaya'};
  function openHistory(){
    let list=read(HKEY,[]);
    if(weekday){
      try{
        const old=ProgramStore.read().history||[];
        for(const h of old){
          const day=new Date(h.finishedAt).toISOString().slice(0,10);
          if(!list.some(x=>x.type==='weekday'&&x.day===day))list.push({type:'weekday',day,finishedAt:h.finishedAt,name:h.name,total:h.total,parts:(h.parts||[]).map(p=>({title:p.title,kind:'',planned:p.planned,elapsed:p.elapsed,advice:p.advice}))});
        }
      }catch(e){}
    }
    const type=weekday?'weekday':'weekend';
    list=list.filter(h=>h.type===type).sort((a,b)=>b.finishedAt-a.finishedAt);
    const {d,body}=dialog('Tu historial','history-dialog');
    if(!list.length){body.append(el('p','','Aún no hay reuniones registradas. Se guardan al pulsar Finalizar reunión.'));d.showModal();return}
    const avg=list.reduce((s,h)=>s+h.total,0)/list.length;
    const diff=avg-TARGET;
    const head=el('div','history-head');
    head.append(el('strong','',list.length+(list.length===1?' reunión':' reuniones')),el('span','','Duración media '+hms(avg)+' · '+(Math.abs(diff)<30000?'justo a tiempo':diff>0?mmss(diff)+' más que el objetivo':mmss(-diff)+' antes del objetivo')));
    body.append(head);
    const by={};
    for(const h of list)for(const p of h.parts||[]){
      if(!p.elapsed||!p.planned)continue;
      const k=p.kind||'otros';(by[k]=by[k]||[]).push(p.elapsed-p.planned*60000);
    }
    const trends=Object.entries(by).filter(([k,v])=>v.length&&k!=='otros').map(([k,v])=>[k,v.reduce((a,b)=>a+b,0)/v.length]).sort((a,b)=>b[1]-a[1]);
    if(trends.length){
      body.append(el('h3','','Tendencias'));
      const ul=el('ul','trend-list');
      for(const [k,ms] of trends){
        const li=el('li','trend '+(ms>15000?'late':ms<-15000?'early':'ok'));
        li.append(el('span','',KIND_NAMES[k]||k),el('strong','',(Math.abs(ms)<15000?'a tiempo':(ms>0?'+':'−')+mmss(Math.abs(ms))+' de media')));
        ul.append(li);
      }
      body.append(ul);
    }
    body.append(el('h3','','Últimas reuniones'));
    const ul=el('ul','history-list');
    for(const h of list.slice(0,12)){
      const li=el('li');
      const date=new Date(h.finishedAt).toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'});
      const dd=h.total-TARGET;
      li.append(el('span','',date),el('strong','',hms(h.total)),el('em',Math.abs(dd)<30000?'ok':dd>0?'late':'early',Math.abs(dd)<30000?'a tiempo':(dd>0?'+':'−')+mmss(Math.abs(dd))));
      ul.append(li);
    }
    body.append(ul);
    d.showModal();
  }
  if(!home)safe('historial-menu',()=>{
    const b=el('button','','Tu historial');b.type='button';b.onclick=openHistory;
    addToMenu('Durante la reunión',b);
  });

  /* ================= Forzar actualización ================= */
  if(!home)safe('forzar',()=>{
    const b=el('button','','Forzar actualización');b.type='button';
    b.onclick=()=>{location.href='actualizar.html'};
    addToMenu('Copias y datos',b);
  });

  /* ================= 6. Reloj TOTAL por secciones ================= */
  function segmentsWeekday(){
    const segs=[];let acc=(state.leadInMin||0)*60000,group='opening';
    const add=(tone,ms)=>{const last=segs[segs.length-1];if(last&&last.tone===tone)last.len+=ms;else segs.push({tone,start:acc,len:ms});acc+=ms};
    if(acc)segs.push({tone:'opening',start:0,len:acc});
    for(const p of state.parts){if(p.section)group=toneOf(p.section);add(group,(p.min+(p.adviceMin||0))*60000)}
    return segs;
  }
  function segmentsWeekend(){return [{tone:'talk',start:0,len:(weekend.talk.min||30)*60000},{tone:'watchtower',start:(weekend.talk.min||30)*60000+5*60000,len:(weekend.watchtower.min||60)*60000}]}
  const NS='http://www.w3.org/2000/svg',C=2*Math.PI*46;
  function paintSegments(svg,segs,before){
    let g=svg.querySelector('g.total-segments');
    if(!g){g=document.createElementNS(NS,'g');g.setAttribute('class','total-segments');svg.insertBefore(g,before||null)}
    const sig=JSON.stringify(segs);
    if(g.dataset.sig===sig)return;
    g.dataset.sig=sig;g.replaceChildren();
    for(const s of segs){
      const c=document.createElementNS(NS,'circle');
      for(const [k,v] of [['cx',50],['cy',50],['r',46]])c.setAttribute(k,v);
      const len=Math.max(0,Math.min(C,s.len/TARGET*C)-1.2),off=s.start/TARGET*C;
      c.setAttribute('stroke-dasharray',len+' '+C);c.setAttribute('stroke-dashoffset',String(-off));
      c.setAttribute('stroke',TONES[s.tone]);c.setAttribute('class','total-segment');
      g.append(c);
    }
  }
  if(weekday)safe('anillo-total',()=>{
    const svg=document.querySelector('#totalFace .total-ring');if(!svg)return;
    document.getElementById('totalFace').classList.add('sectioned');
    const paint=()=>paintSegments(svg,segmentsWeekday(),document.getElementById('totalArc'));
    paint();heartbeat(paint,2000);
  });
  if(weekendPage)safe('anillo-total-finde',()=>{
    const dial=document.querySelector('.weekend-total .small-dial');if(!dial)return;
    dial.classList.add('sectioned');
    const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('class','total-ring weekend-ring');svg.setAttribute('aria-hidden','true');
    const arc=document.createElementNS(NS,'circle');for(const [k,v] of [['cx',50],['cy',50],['r',46]])arc.setAttribute(k,v);
    arc.setAttribute('class','weekend-arc');arc.setAttribute('stroke-dasharray',String(C));
    svg.append(arc);dial.prepend(svg);
    const paint=()=>{paintSegments(svg,segmentsWeekend(),arc);const f=Math.min(1,weekendValue(weekend.total)/TARGET);arc.setAttribute('stroke-dashoffset',String(C*(1-f)));dial.classList.toggle('over',weekendValue(weekend.total)>TARGET)};
    paint();heartbeat(paint,500);
  });

  /* ================= 7. Columna de progreso ================= */
  if(!home)safe('columna',()=>{
    const spine=el('div','progress-spine');spine.setAttribute('aria-hidden','true');
    const segBox=el('div','spine-segments'),shade=el('div','spine-shade'),dot=el('div','spine-dot');
    spine.append(segBox,shade,dot);document.body.append(spine);
    let sig='';
    function paint(){
      const segs=weekday?segmentsWeekday():segmentsWeekend();
      const s=JSON.stringify(segs);
      if(s!==sig){
        sig=s;segBox.replaceChildren();
        for(const g of segs){const b=el('span');b.style.top=(g.start/TARGET*100)+'%';b.style.height=Math.max(0,g.len/TARGET*100-.4)+'%';b.style.background=TONES[g.tone];segBox.append(b)}
      }
      const total=weekday?value(state.total):weekendValue(weekend.total);
      const f=Math.min(1,total/TARGET)*100;
      shade.style.top=f+'%';dot.style.top=f+'%';
      spine.classList.toggle('live',weekday?state.total.started!==null:weekend.total.started!==null);
      spine.classList.toggle('over',total>TARGET);
    }
    paint();heartbeat(paint,1000);
  });

  /* ================= 8. Atril oscuro ================= */
  safe('oscuro',()=>{
    const apply=on=>{
      document.body.classList.toggle('atril-oscuro',on);
      document.querySelectorAll('meta[name=theme-color]').forEach(m=>m.setAttribute('content',on?'#121817':'#eee5d7'));
    };
    apply(read('presidencia-oscuro',false)===true);
    if(home)return;
    const b=el('button','dark-toggle');b.type='button';
    const label=()=>{b.textContent=document.body.classList.contains('atril-oscuro')?'Atril claro':'Atril oscuro';b.setAttribute('aria-pressed',String(document.body.classList.contains('atril-oscuro')))};
    b.onclick=()=>{const on=!document.body.classList.contains('atril-oscuro');apply(on);write('presidencia-oscuro',on);label()};
    label();
    addToMenu('Durante la reunión',b);
  });

  /* ================= 9. Últimos 10 segundos ================= */
  if(!home)safe('final',()=>{
    function paint(){
      let on=false;
      try{
        const m=window.MeetingAction?.model(weekendPage?{weekendId:['talk','watchtower'].find(k=>weekend[k].started!==null)}:undefined);
        if(m&&m.running&&m.limit>0){const left=m.limit-m.elapsed;on=left>0&&left<=10000}
      }catch(e){}
      document.body.classList.toggle('final-ten',on);
    }
    heartbeat(paint,250);
  });
})();
