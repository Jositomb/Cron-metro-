'use strict';
// v52 · Marca «avisado» junto a cada participante.
// Se guarda el nombre avisado: si cambias a la persona, la marca desaparece sola.
(()=>{
  const weekday=typeof state!=='undefined'&&typeof ProgramStore!=='undefined';
  const weekendPage=typeof weekendValidate==='function';
  if(!weekday&&!weekendPage)return;
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n};
  const WKEY='presidencia-avisados-weekend';

  function store(){
    if(weekday){if(!state.notified||typeof state.notified!=='object')state.notified={};return state.notified}
    try{const v=JSON.parse(localStorage.getItem(WKEY));return v&&typeof v==='object'?v:{}}catch(e){return {}}
  }
  function persist(map){
    if(weekday){state.notified=map;save();return}
    try{localStorage.setItem(WKEY,JSON.stringify(map))}catch(e){}
  }
  // Lista de personas a avisar: [clave, nombre, papel]
  function people(){
    const list=[];
    const add=(key,name,role)=>{name=(name||'').trim();if(name)list.push({key,name,role})};
    if(weekday){
      const m=state.meeting||{};
      add('m:chairman',m.chairman,'Presidente');
      add('m:openingPrayer',m.openingPrayer,'Oración inicial');
      state.parts.forEach((p,i)=>{
        const kind=partKind(p),title=numberedPartTitle(state.parts,i);
        if(!['opening','conclusion'].includes(kind))add(p.id+':participant',p.participant,title);
        if(kind==='student')add(p.id+':companion',p.companion,title+' · acompañante');
        if(kind==='study')add(p.id+':reader',p.reader,title+' · lector');
      });
      add('m:closingPrayer',m.closingPrayer,'Oración final');
    }else{
      add('talk:speaker',weekend.talk?.speaker,'Discurso público');
      add('watchtower:conductor',weekend.watchtower?.conductor,'Estudio de La Atalaya · conductor');
      add('watchtower:reader',weekend.watchtower?.reader,'Estudio de La Atalaya · lector');
    }
    return list;
  }
  const isDone=(map,p)=>map[p.key]===p.name;
  function toggle(key){
    const p=people().find(x=>x.key===key);if(!p)return;
    const map={...store()};
    if(isDone(map,p))delete map[key];else map[key]=p.name;
    persist(map);paint();
  }
  function makeToggle(key){
    const b=el('button','notify-toggle');
    b.type='button';b.dataset.key=key;
    b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggle(key)});
    return b;
  }
  function setToggle(b,done,name){
    b.textContent=done?'✓ Avisado':'Avisar';
    b.classList.toggle('done',done);
    b.setAttribute('aria-pressed',String(done));
    b.setAttribute('aria-label',(done?'Avisado: ':'Marcar como avisado: ')+name);
  }

  // Marcas dentro de cada tarjeta (entre semana)
  const OUTLINE_KEYS={chairman:'m:chairman',openingPrayer:'m:openingPrayer',closingPrayer:'m:closingPrayer',companion:'companion',reader:'reader'};
  function paintCards(map,list){
    const byKey=new Map(list.map(p=>[p.key,p]));
    sectionRows.forEach((r,i)=>{
      const part=state.parts[i];if(!part)return;
      const meta=r.card.querySelector('.assignment-meta');
      const pKey=part.id+':participant',pp=byKey.get(pKey);
      let t=r.card.querySelector('.assignment-heading > .notify-toggle');
      if(pp&&meta&&!meta.hidden){
        if(!t){t=makeToggle(pKey);meta.after(t)}
        t.dataset.key=pKey;setToggle(t,isDone(map,pp),pp.name);
      }else t?.remove();
      r.brief.querySelectorAll(':scope > section.outline-block[data-outline-key]').forEach(block=>{
        const k=OUTLINE_KEYS[block.dataset.outlineKey];if(!k)return;
        const key=k.startsWith('m:')?k:part.id+':'+k,p=byKey.get(key);
        let b=block.querySelector(':scope > .notify-toggle');
        if(!p){b?.remove();return}
        if(!b){b=makeToggle(key);block.append(b)}
        setToggle(b,isDone(map,p),p.name);
      });
    });
  }

  // Menú: «Avisos · 5 de 9» con la lista completa
  const menuBtn=el('button','notify-menu');menuBtn.type='button';
  const menu=document.getElementById('toolsMenu')||document.querySelector('.weekend-footer');
  const group=menu&&[...menu.querySelectorAll('.menu-group')].find(g=>g.querySelector('.menu-group-title')?.textContent===(weekday?'Preparar':'Durante la reunión'));
  (group||menu)?.append(menuBtn);
  let dialogList=null;
  menuBtn.onclick=()=>{
    const d=el('dialog','v49-dialog notify-dialog');
    d.append(el('h2','','Avisos a participantes'));
    const count=el('p','notify-count');
    const ul=el('ul','notify-list');
    const close=el('button','v49-close','Cerrar');close.type='button';
    close.onclick=()=>{d.close();d.remove();dialogList=null};
    d.addEventListener('cancel',()=>setTimeout(()=>{d.remove();dialogList=null},0));
    d.append(count,ul,close);document.body.append(d);
    dialogList={ul,count};
    paint();
    d.showModal();
  };
  function paintDialog(map,list){
    if(!dialogList)return;
    const {ul,count}=dialogList;
    const done=list.filter(p=>isDone(map,p)).length;
    count.textContent=list.length?done+' de '+list.length+' avisados':'Aún no hay participantes con nombre.';
    const sig=JSON.stringify(list.map(p=>[p.key,p.name,isDone(map,p)]));
    if(ul.dataset.sig===sig)return;
    ul.dataset.sig=sig;ul.replaceChildren();
    for(const p of list){
      const li=el('li','notify-row'+(isDone(map,p)?' done':''));
      const who=el('div','notify-who');who.append(el('strong','',p.name),el('span','',p.role));
      const b=makeToggle(p.key);setToggle(b,isDone(map,p),p.name);
      li.append(who,b);ul.append(li);
    }
  }
  function paint(){
    const map=store(),list=people();
    const done=list.filter(p=>isDone(map,p)).length;
    menuBtn.textContent='Avisos a participantes · '+done+' de '+list.length;
    menuBtn.hidden=!list.length;
    if(weekday)paintCards(map,list);
    paintDialog(map,list);
  }
  paint();
  heartbeat(paint,700);
})();
