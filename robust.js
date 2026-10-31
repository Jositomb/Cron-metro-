'use strict';
// v46 · Protección de datos y pantalla durante la reunión.
(()=>{
  const weekday=typeof state!=='undefined'&&typeof ProgramStore!=='undefined';
  const weekendPage=typeof weekendValidate==='function';

  // 1. Pedir a Safari que no borre los datos de la aplicación.
  let persisted=null;
  if(navigator.storage&&navigator.storage.persist){
    navigator.storage.persisted().then(already=>already||navigator.storage.persist()).then(ok=>{persisted=!!ok;paintStorage()}).catch(()=>{});
  }

  // 2. Aligerar los trazos ya guardados (sesión actual y programas semanales).
  if(weekday){
    try{
      let changed=false;
      for(const p of state.parts){
        if(Array.isArray(p.ink)&&p.ink.length){const r=roundInk(p.ink);if(JSON.stringify(r)!==JSON.stringify(p.ink)){p.ink=r;changed=true}}
      }
      if(state.undo&&Array.isArray(state.undo.parts)){
        for(const p of state.undo.parts){if('ink' in p){delete p.ink;changed=true}}
      }
      if(changed)save();
      const raw=localStorage.getItem('cronometro-programs-v1');
      if(raw){
        const data=JSON.parse(raw);let libChanged=false;
        for(const prog of data.programs||[])for(const p of prog.parts||[]){
          if(Array.isArray(p.ink)&&p.ink.length){const r=roundInk(p.ink);if(JSON.stringify(r)!==JSON.stringify(p.ink)){p.ink=r;libChanged=true}}
        }
        if(libChanged)localStorage.setItem('cronometro-programs-v1',JSON.stringify(data));
      }
    }catch(e){console.error(e)}
  }

  // 3. Espacio usado, visible en Opciones; aviso antes de que se llene.
  const LIMIT=5*1024*1024;
  function used(){
    let n=0;
    try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);n+=(k.length+(localStorage.getItem(k)||'').length)*2}}catch(e){}
    return n;
  }
  const info=document.createElement('small');
  info.className='storage-info';
  info.setAttribute('role','status');
  const host=document.getElementById('toolsMenu')||document.querySelector('.weekend-footer');
  if(host)host.append(info);
  let warned=false;
  function paintStorage(){
    const bytes=used(),mb=(bytes/1048576).toLocaleString('es-ES',{maximumFractionDigits:1,minimumFractionDigits:1});
    const pct=bytes/LIMIT;
    info.textContent='Espacio usado: '+mb+' MB de unos 5 MB'+(persisted===true?' · protegido':persisted===false?' · instala en pantalla de inicio para protegerlo':'');
    info.dataset.level=pct>.8?'full':pct>.6?'high':'ok';
    if(pct>.7&&!warned){
      warned=true;
      const msg='El almacenamiento está al '+Math.round(pct*100)+' %. Exporta una copia y borra cuadernos o programas antiguos.';
      const n=document.getElementById('notice')||document.getElementById('weekendNotice');
      if(n)n.textContent=msg;
    }
  }
  paintStorage();
  heartbeat(paintStorage,15000);

  // 4. Pantalla encendida mientras haya cualquier cronómetro en marcha.
  function anyRunning(){
    if(weekday)return state.total.started!==null||state.parts.some(p=>p.started!==null||p.after?.started!==null);
    if(weekendPage)return ['total','talk','watchtower'].some(k=>weekend[k]?.started!==null);
    return false;
  }
  window.meetingRunning=anyRunning;
  let lock=null;
  function keepAwake(){
    const want=!document.hidden&&(anyRunning()||document.body.classList.contains('bigclock-open')||document.body.classList.contains('atril'));
    if(weekday){
      if(want&&!wake)acquireWake();
      else if(!want&&wake)releaseWake();
      return;
    }
    if(!navigator.wakeLock)return;
    if(want&&!lock){
      lock='pending';
      navigator.wakeLock.request('screen').then(w=>{lock=w;w.addEventListener('release',()=>{lock=null},{once:true})}).catch(()=>{lock=null});
    }else if(!want&&lock&&lock!=='pending'){
      lock.release().catch(()=>{});lock=null;
    }
  }
  if(weekday||weekendPage)heartbeat(keepAwake,1000);

  // 5. Si el guardado falla, que se note de verdad.
  if(weekday){
    heartbeat(()=>document.body.classList.toggle('save-failed',storageOK===false),1000);
  }
})();
