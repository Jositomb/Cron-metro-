'use strict';
// v53 · Resaltar el texto de la lección con el Apple Pencil (o con el dedo, activándolo).
// Los resaltados se guardan pegados al texto (posiciones de caracteres), no a la pantalla:
// se conservan al cambiar el tamaño de letra o de dispositivo. Si cambias el texto, se descartan.
(()=>{
  if(typeof state==='undefined'||typeof ProgramStore==='undefined')return;
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n};
  const COLORS=[['yellow','Amarillo'],['green','Verde'],['pink','Rosa']];
  let color='yellow',fingerMode=false;
  const undoStacks=new Map();
  const WORD=/[\p{L}\p{N}]/u;

  function hash(text){let h=5381;for(let i=0;i<text.length;i++)h=((h<<5)+h+text.charCodeAt(i))|0;return text.length+':'+h}
  function marksOf(p){
    const text=p.lessonText||'';
    if(!text||!p.lessonMarks||p.lessonMarks.of!==hash(text)||!Array.isArray(p.lessonMarks.list))return [];
    return p.lessonMarks.list.filter(m=>Number.isInteger(m.s)&&Number.isInteger(m.e)&&m.s>=0&&m.e<=text.length&&m.e>m.s);
  }
  function setMarks(p,list,remember=true){
    if(remember){const st=undoStacks.get(p.id)||[];st.push(marksOf(p));if(st.length>30)st.shift();undoStacks.set(p.id,st)}
    p.lessonMarks={of:hash(p.lessonText||''),list};
    save();
  }
  function addMark(list,n){
    const out=[];
    for(const m of list){
      if(m.e<=n.s||m.s>=n.e){out.push(m);continue}
      if(m.s<n.s)out.push({...m,e:n.s});
      if(m.e>n.e)out.push({...m,s:n.e});
    }
    out.push(n);
    out.sort((a,b)=>a.s-b.s);
    const merged=[];
    for(const m of out){const last=merged[merged.length-1];if(last&&last.c===m.c&&last.e>=m.s)last.e=Math.max(last.e,m.e);else merged.push({...m})}
    return merged.slice(0,400);
  }
  function snap(text,a,b){
    let s=Math.max(0,Math.min(a,b)),e=Math.min(text.length,Math.max(a,b));
    while(s>0&&WORD.test(text[s-1]))s--;
    while(e<text.length&&WORD.test(text[e]))e++;
    while(s<e&&/\s/.test(text[s]))s++;
    while(e>s&&/\s/.test(text[e-1]))e--;
    return [s,e];
  }

  // Pinta el texto con sus resaltados (y una vista previa mientras se desliza).
  function render(box,p,preview){
    const text=p.lessonText||'';
    let list=marksOf(p);
    if(preview)list=addMark(list,preview);
    const sig=hash(text)+'|'+JSON.stringify(list);
    if(box.dataset.marks===sig)return;
    box.dataset.marks=sig;
    box.replaceChildren();
    let at=0;
    for(const m of list){
      if(m.s>at)box.append(document.createTextNode(text.slice(at,m.s)));
      const mk=el('mark','lesson-mark c-'+m.c,text.slice(m.s,m.e));
      mk.dataset.s=m.s;mk.dataset.e=m.e;
      if(preview&&m.s===preview.s&&m.e===preview.e)mk.classList.add('preview');
      box.append(mk);at=m.e;
    }
    if(at<text.length)box.append(document.createTextNode(text.slice(at)));
  }
  function offsetAt(box,x,y){
    let node=null,off=0;
    if(document.caretRangeFromPoint){const r=document.caretRangeFromPoint(x,y);if(r){node=r.startContainer;off=r.startOffset}}
    else if(document.caretPositionFromPoint){const r=document.caretPositionFromPoint(x,y);if(r){node=r.offsetNode;off=r.offset}}
    if(!node||!box.contains(node))return null;
    if(node.nodeType!==3){
      // Punto entre nodos: convertir a desplazamiento de texto.
      const kids=[...node.childNodes];let total=0;
      const walker0=document.createTreeWalker(box,NodeFilter.SHOW_TEXT);
      const target=kids[off]||null;let t;
      while((t=walker0.nextNode())){if(target&&(target===t||target.contains?.(t)))return total;total+=t.length}
      return total;
    }
    const walker=document.createTreeWalker(box,NodeFilter.SHOW_TEXT);let total=0,t;
    while((t=walker.nextNode())){if(t===node)return total+off;total+=t.length}
    return null;
  }

  function attach(r,p){
    const panel=r.lessonPanel;if(!panel)return;
    const box=panel.querySelector('.lesson-inline-text');
    if(!box||box.classList.contains('empty')||!(p.lessonText||'').trim()){panel.querySelector('.mark-toolbar')?.remove();return}
    if(box.dataset.markPart!==p.id){
      box.dataset.markPart=p.id;
      box.classList.add('markable');
      let start=null,active=null,last=null;
      const current=()=>state.parts.find(x=>x.id===p.id);
      const wants=e=>e.pointerType==='pen'||(fingerMode&&(e.pointerType==='touch'||e.pointerType==='mouse'));
      // Evita que el Pencil desplace la página o seleccione texto mientras resalta.
      box.addEventListener('touchstart',e=>{if(fingerMode||[...e.touches].some(t=>t.touchType==='stylus'))e.preventDefault()},{passive:false});
      box.addEventListener('pointerdown',e=>{
        if(!wants(e)||active!==null)return;
        const off=offsetAt(box,e.clientX,e.clientY);if(off===null)return;
        e.preventDefault();
        active=e.pointerId;start=off;last=off;
        try{box.setPointerCapture(e.pointerId)}catch(err){}
      });
      box.addEventListener('pointermove',e=>{
        if(e.pointerId!==active)return;
        e.preventDefault();
        const off=offsetAt(box,e.clientX,e.clientY);if(off!==null)last=off;
        const part=current();if(!part)return;
        const [s,eE]=snap(part.lessonText,start,last);
        if(eE>s)render(box,part,{s,e:eE,c:color});
      });
      const finish=e=>{
        if(e.pointerId!==active)return;
        active=null;
        const part=current();if(!part)return;
        if(Math.abs(last-start)<2){
          // Toque: quitar el resaltado tocado.
          const hit=marksOf(part).find(m=>start>=m.s&&start<m.e);
          if(hit)setMarks(part,marksOf(part).filter(m=>m!==hit));
        }else{
          const [s,eE]=snap(part.lessonText,start,last);
          if(eE>s)setMarks(part,addMark(marksOf(part),{s,e:eE,c:color}));
        }
        box.dataset.marks='';render(box,part);paintToolbar(panel,part);
      };
      box.addEventListener('pointerup',finish);
      box.addEventListener('pointercancel',finish);
    }
    if(!panel.querySelector('.mark-toolbar'))buildToolbar(panel,box,p);
    const part=current(p);render(box,part);paintToolbar(panel,part);
  }
  const current=p=>state.parts.find(x=>x.id===p.id)||p;

  function buildToolbar(panel,box,p){
    const bar=el('div','mark-toolbar');
    const hint=el('p','mark-hint','Con el Apple Pencil, desliza sobre el texto para resaltar. Toca un resaltado para quitarlo.');
    const row=el('div','mark-row');
    for(const [c,name] of COLORS){
      const b=el('button','mark-color c-'+c);b.type='button';b.dataset.color=c;b.setAttribute('aria-label','Resaltar en '+name.toLowerCase());
      b.onclick=()=>{color=c;document.querySelectorAll('.mark-color').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.color===color)))};
      row.append(b);
    }
    const finger=el('button','mark-finger','Con el dedo');finger.type='button';
    finger.onclick=()=>{fingerMode=!fingerMode;document.body.classList.toggle('mark-finger-on',fingerMode);document.querySelectorAll('.mark-finger').forEach(x=>{x.setAttribute('aria-pressed',String(fingerMode));x.textContent=fingerMode?'Dedo: resaltando':'Con el dedo'})};
    const undo=el('button','mark-undo','Deshacer');undo.type='button';
    undo.onclick=()=>{const part=current(p),st=undoStacks.get(part.id);if(!st||!st.length)return;setMarks(part,st.pop(),false);box.dataset.marks='';render(box,part);paintToolbar(panel,part)};
    const clear=el('button','mark-clear','Quitar todo');clear.type='button';
    clear.onclick=()=>{const part=current(p);if(!marksOf(part).length||!confirm('¿Quitar todos los resaltados de esta lección?'))return;setMarks(part,[]);box.dataset.marks='';render(box,part);paintToolbar(panel,part)};
    row.append(finger,undo,clear);
    bar.append(hint,row);
    box.before(bar);
  }
  function paintToolbar(panel,p){
    const bar=panel.querySelector('.mark-toolbar');if(!bar)return;
    bar.querySelectorAll('.mark-color').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.color===color)));
    const n=marksOf(p).length;
    bar.querySelector('.mark-clear').hidden=!n;
    bar.querySelector('.mark-undo').disabled=!(undoStacks.get(p.id)||[]).length;
    bar.querySelector('.mark-finger').setAttribute('aria-pressed',String(fingerMode));
  }

  function paint(){
    sectionRows.forEach((r,i)=>{const p=state.parts[i];if(p&&isStudentPart(p))try{attach(r,p)}catch(e){console.error(e)}});
  }
  paint();
  heartbeat(paint,700);
})();
