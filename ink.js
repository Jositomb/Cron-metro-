'use strict';
// Cuaderno para el consejo (Apple Pencil). v58: dibujo fluido.
//  · Solo se pinta el tramo nuevo de cada trazo (antes se redibujaba todo en cada movimiento).
//  · Se aprovechan todos los puntos del Pencil (getCoalescedEvents) y se descartan los repetidos.
//  · Más capacidad: 20 000 puntos por estudiante (antes 6 000, se llenaba enseguida).
//  · El Pencil nunca desplaza la página mientras escribe; el dedo sigue desplazando fuera del cuaderno.
// Mismo formato de datos que antes: [[ [x,y], ... ], ...] con coordenadas de 0 a 1.
const INK_LIMIT=20000,INK_MIN_STEP=.0012;
function inkNear(stroke,p,limit=.025){
  return stroke.some((a,i)=>{
    const b=stroke[i+1]||a,dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy,t=len?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/len)):0;
    return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)<limit;
  });
}
function appendInkPad(host,part){
  const box=document.createElement('details');
  box.className='ink-pad';
  const heading=document.createElement('summary');
  heading.textContent='✎ Cuaderno para el consejo';
  box.append(heading);
  const help=document.createElement('p');
  help.textContent='Escribe con el Apple Pencil. La goma elimina trazos completos. Para desplazarte, desliza con el dedo fuera del cuaderno.';
  const toolbar=document.createElement('div');
  toolbar.className='ink-toolbar';
  const canvas=document.createElement('canvas');
  canvas.setAttribute('aria-label','Consejos escritos a mano de '+(part.participant||part.title));
  canvas.setAttribute('role','img');
  const status=document.createElement('p');
  status.setAttribute('role','status');
  box.append(help,toolbar,canvas,status);
  host.append(box);
  const ctx=canvas.getContext?.('2d');
  if(!ctx){status.textContent='Este navegador no permite usar el cuaderno.';return box}
  let strokes=validInk(part.ink)?JSON.parse(JSON.stringify(part.ink||[])):[],undo=[],active=null,before=null,mode='pen',points=0;
  const count=()=>strokes.reduce((n,s)=>n+s.length,0);
  function button(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;toolbar.append(b);return b}
  const pen=button('Lápiz',()=>{mode='pen';paint()}),eraser=button('Goma',()=>{mode='eraser';paint()});
  const back=button('Deshacer trazo',()=>{if(!undo.length)return;strokes=undo.pop();persist();paint()});
  button('Borrar cuaderno…',()=>{if(!strokes.length||!confirm('¿Borrar los trazos de este estudiante?'))return;rememberInk();strokes=[];persist();paint()});
  function rememberInk(){undo.push(JSON.parse(JSON.stringify(strokes)));if(undo.length>20)undo.shift()}
  function persist(){
    const current=state.parts.find(p=>p.id===part.id);
    if(!current)return;
    current.ink=JSON.parse(JSON.stringify(strokes));
    state.undo=null;
    save();
    if(!storageOK){status.textContent='No se pudo guardar el cuaderno. No cierres la página.';return}
    status.textContent='Trazos guardados';
    try{if(!rehearsalActive&&state.programId&&ProgramStore.read().programs.some(p=>p.id===state.programId))ProgramStore.saveProgram(state.programName||'Mi reunión',state.programWeek||'')}
    catch(e){status.textContent='Guardado en esta sesión; no se pudo actualizar el programa semanal.'}
  }
  let size={w:0,h:0};
  function setup(){
    const rect=canvas.getBoundingClientRect();
    if(!rect.width)return false;
    const ratio=window.devicePixelRatio||1,w=rect.width,h=rect.height||w/2;
    const W=Math.round(w*ratio),H=Math.round(h*ratio);
    // Solo se cambia el tamaño del lienzo si de verdad ha cambiado (cambiarlo lo borra y es lento).
    if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H}
    ctx.setTransform(ratio,0,0,ratio,0,0);
    ctx.strokeStyle='#334b48';ctx.fillStyle='#334b48';ctx.lineWidth=2.2;ctx.lineCap='round';ctx.lineJoin='round';
    size={w,h};
    return true;
  }
  function paint(){
    if(!setup())return;
    const {w,h}=size;
    ctx.clearRect(0,0,w,h);
    for(const s of strokes){
      if(!s.length)continue;
      if(s.length===1){ctx.beginPath();ctx.arc(s[0][0]*w,s[0][1]*h,1.1,0,Math.PI*2);ctx.fill();continue}
      ctx.beginPath();
      s.forEach((p,i)=>i?ctx.lineTo(p[0]*w,p[1]*h):ctx.moveTo(p[0]*w,p[1]*h));
      ctx.stroke();
    }
    pen.setAttribute('aria-pressed',String(mode==='pen'));
    eraser.setAttribute('aria-pressed',String(mode==='eraser'));
    back.disabled=!undo.length;
  }
  function segment(a,b){
    const {w,h}=size;
    ctx.beginPath();ctx.moveTo(a[0]*w,a[1]*h);ctx.lineTo(b[0]*w,b[1]*h);ctx.stroke();
  }
  function point(e,r){
    return [Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*1e4)/1e4,Math.round(Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))*1e4)/1e4];
  }
  const wants=e=>e.pointerType!=='touch'&&e.button<=0;
  // El Pencil en Safari también genera eventos táctiles: se anulan para que no desplace la página.
  canvas.addEventListener('touchstart',e=>{if([...e.touches].some(t=>t.touchType==='stylus'))e.preventDefault()},{passive:false});
  canvas.addEventListener('touchmove',e=>{if(active!==null)e.preventDefault()},{passive:false});
  canvas.onpointerdown=e=>{
    if(!wants(e)||active!==null)return;
    e.preventDefault();
    points=count();
    if(mode==='pen'&&(strokes.length>=600||points>=INK_LIMIT)){status.textContent='Cuaderno lleno. Borra algunos trazos para seguir.';return}
    setup();
    before=JSON.parse(JSON.stringify(strokes));
    active=e.pointerId;
    try{canvas.setPointerCapture(e.pointerId)}catch(err){}
    const r=canvas.getBoundingClientRect(),p=point(e,r);
    if(mode==='pen'){strokes.push([p]);points++;ctx.beginPath();ctx.arc(p[0]*size.w,p[1]*size.h,1.1,0,Math.PI*2);ctx.fill()}
    else{strokes=strokes.filter(s=>!inkNear(s,p));paint()}
  };
  canvas.onpointermove=e=>{
    if(active!==e.pointerId)return;
    e.preventDefault();
    const r=canvas.getBoundingClientRect();
    const list=(typeof e.getCoalescedEvents==='function'&&e.getCoalescedEvents().length)?e.getCoalescedEvents():[e];
    if(mode==='eraser'){
      const n=strokes.length;
      for(const ev of list){const p=point(ev,r);strokes=strokes.filter(s=>!inkNear(s,p))}
      if(strokes.length!==n)paint();
      return;
    }
    const s=strokes[strokes.length-1];if(!s)return;
    for(const ev of list){
      if(points>=INK_LIMIT){status.textContent='Cuaderno lleno. Borra algunos trazos para seguir.';break}
      const p=point(ev,r),last=s[s.length-1];
      if(last&&Math.abs(p[0]-last[0])<INK_MIN_STEP&&Math.abs(p[1]-last[1])<INK_MIN_STEP)continue;
      s.push(p);points++;
      if(last)segment(last,p);
    }
  };
  function finish(e){
    if(active!==e.pointerId)return;
    active=null;
    if(JSON.stringify(before)!==JSON.stringify(strokes)){undo.push(before);if(undo.length>20)undo.shift();persist()}
    before=null;
    paint();
  }
  canvas.onpointerup=finish;
  canvas.onpointercancel=finish;
  canvas.onlostpointercapture=finish;
  box.ontoggle=()=>{if(box.open)paint()};
  if(typeof ResizeObserver!=='undefined'){
    const observer=new ResizeObserver(()=>{
      if(!box.isConnected){observer.disconnect();return}
      if(box.open&&active===null)paint();
    });
    observer.observe(canvas);
  }
  return box;
}
