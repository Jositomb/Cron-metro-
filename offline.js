'use strict';
// Uso sin conexión y actualizaciones.
// v50: una versión nueva se aplica sola en cuanto es seguro (ningún cronómetro en marcha y nada a medio
// editar). Si hay una reunión en curso, espera hasta que termine: nunca cambia la app en plena reunión.
(function(){
  const status=document.getElementById('offlineStatus');
  const say=t=>{if(status)status.textContent=t};
  if(location.protocol!=='https:'&&location.hostname!=='localhost'){say('Uso sin conexión: requiere abrir la dirección web segura.');return}
  if(!('serviceWorker' in navigator)){say('Este navegador no permite preparar la apertura sin conexión.');return}
  const hadController=!!navigator.serviceWorker.controller;
  let reloading=false,registration=null;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
    // Solo recarga al cambiar de versión, no la primera vez que se instala.
    if(!hadController||reloading)return;
    reloading=true;
    try{if(typeof save==='function')save()}catch(e){}
    location.reload();
  });
  function busy(){
    try{if(typeof window.meetingRunning==='function'&&window.meetingRunning())return true}catch(e){}
    if(document.querySelector('dialog[open], details.inline-part-editor[open], details.weekend-edit[open], details.lesson-inline-editor[open]'))return true;
    const a=document.activeElement;
    if(a&&(a.tagName==='TEXTAREA'||a.tagName==='SELECT'||(a.tagName==='INPUT'&&a.type!=='button'&&a.type!=='checkbox'))||document.querySelector('canvas:active'))return true;
    return false;
  }
  function apply(){
    const waiting=registration&&registration.waiting;
    if(!waiting)return;
    if(busy()){say('Actualización preparada: se aplicará al terminar la reunión.');return}
    say('Actualizando…');
    waiting.postMessage('skipWaiting');
  }
  navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(async reg=>{
    registration=reg;
    await navigator.serviceWorker.ready;
    say(reg.waiting?'Actualización preparada.':'Disponible sin conexión en este dispositivo.');
    apply();
    reg.addEventListener('updatefound',()=>{
      const worker=reg.installing;
      worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)apply()});
    });
    // Al volver a la app (por ejemplo, una pestaña de Safari que se quedó abierta), busca versión nueva.
    document.addEventListener('visibilitychange',()=>{if(!document.hidden){reg.update().catch(()=>{});apply()}});
    setInterval(()=>{if(!document.hidden)apply()},30000);
    reg.update().catch(()=>{});
  }).catch(()=>{say('No se pudo preparar el uso sin conexión. Abre de nuevo con internet.')});
})();
