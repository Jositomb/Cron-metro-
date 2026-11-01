'use strict';
// Caché para uso sin conexión.
// v51: los archivos opcionales (iconos) ya no pueden bloquear una actualización, las páginas se
// piden siempre recién publicadas al instalar, y nunca se mezclan archivos de dos versiones.
const CACHE='cronometro-reunion-v51',BASE=new URL('./',self.location.href);
const ASSETS=['./heartbeat.js?v=51','./robust.js?v=51','./big-clock.js?v=51','./mejoras.css?v=51','./apariencia.css?v=51','./facil.js?v=51','./unica.js?v=51','./distintivo.css?v=51','./clarity.js?v=51','./presidencia.css?v=51','./presidencia.js?v=51','./index.html','./weekday.html','./weekend.html','./portal.css?v=51','./home.js?v=51','./weekend.js?v=51','./app.css?v=51','./polish.css?v=51','./colour.css?v=51','./outline-model.js?v=51','./outline-view.js?v=51','./model.js?v=51','./timers.js?v=51','./storage.js?v=51','./app.js?v=51','./programs.js?v=51','./inline-edit.js?v=51','./sections.js?v=51','./lesson-panel.js?v=51','./support.js?v=51','./offline.js?v=51','./menu.js?v=51','./ink.js?v=51','./new-meeting.js?v=51','./guide-import.js?v=51','./guide-index.json'];
const OPTIONAL=['./icon-180.png','./icon-192.png','./icon-512.png','./manifest.webmanifest','./icon.svg'];
const ALL=[...ASSETS,...OPTIONAL];
async function store(cache,path,required){
  const url=new URL(path,BASE);
  // Las rutas sin ?v= (páginas, guía) se piden con una marca para saltarse cualquier copia antigua.
  const fresh=new URL(url);
  if(!fresh.searchParams.has('v'))fresh.searchParams.set('sw',CACHE);
  try{
    const response=await fetch(new Request(fresh.href,{cache:'no-store'}));
    if(!response.ok)throw Error(path+' '+response.status);
    await cache.put(url.href,response);
  }catch(e){if(required)throw e}
}
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(async cache=>{
  await Promise.all(ASSETS.map(p=>store(cache,p,true)));
  await Promise.all(OPTIONAL.map(p=>store(cache,p,false)));
})));
// La página pide activar la versión nueva solo cuando no hay reunión en marcha ni edición abierta.
self.addEventListener('message',event=>{if(event.data==='skipWaiting')self.skipWaiting()});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('cronometro-reunion-v')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname)||url.pathname.endsWith('/version.json'))return;
  const relative=url.pathname.slice(BASE.pathname.length);
  if(/^guide-(?:index|\d{4}-\d{2}-\d{2})\.json$/.test(relative)){
    event.respondWith(caches.open(CACHE).then(async cache=>{
      try{const response=await fetch(event.request);if(response.ok){await cache.put(new URL(relative,BASE).href,response.clone());return response}}catch(e){}
      const saved=await cache.match(event.request,{ignoreSearch:true});
      return saved||new Response('Sin guía disponible sin conexión',{status:503});
    }));
    return;
  }
  const known=ALL.some(p=>p.replace('./','').split('?')[0]===(relative||'index.html'));
  if(!known)return;
  event.respondWith(caches.open(CACHE).then(async cache=>{
    if(event.request.mode==='navigate'){
      const page=await cache.match(new URL(relative||'index.html',BASE).href,{ignoreSearch:true});
      if(page)return page;
      return fetch(event.request);
    }
    // Coincidencia exacta (misma versión). Si no la hay, se pide a la red; solo sin conexión se usa otra versión.
    const exact=await cache.match(event.request);
    if(exact)return exact;
    try{return await fetch(event.request)}
    catch(e){const any=await cache.match(event.request,{ignoreSearch:true});if(any)return any;throw e}
  }));
});
