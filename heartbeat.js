'use strict';
// v46 · Un único reloj para refrescar la pantalla y utilidades compartidas.
// Los cronómetros se calculan con marcas de tiempo, así que pausar el refresco
// con la pantalla oculta no altera ningún tiempo: solo ahorra batería.
const Heartbeat=(()=>{
  const jobs=[];let timer=null,last=0;
  function run(force){
    const now=Date.now();
    for(const job of jobs){
      if(!force&&now-job.at<job.every-20)continue;
      job.at=now;
      try{job.fn()}catch(e){console.error(e)}
    }
    last=now;
  }
  function start(){if(timer===null)timer=setInterval(()=>{if(!document.hidden)run(false)},250)}
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)run(true)});
  window.addEventListener('pageshow',()=>run(true));
  return {
    every(ms,fn){jobs.push({fn,every:Math.max(250,ms),at:0});start()},
    now(){run(true)}
  };
})();
function heartbeat(fn,ms=250){Heartbeat.every(ms,fn)}

// Comparte un archivo con la hoja de Compartir (AirDrop, Archivos, Mensajes…)
// y, si el navegador no puede, lo descarga como antes.
async function shareOrDownload(blob,filename,title){
  try{
    const file=new File([blob],filename,{type:blob.type||'application/json'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){
      await navigator.share({files:[file],title:title||filename});
      return 'shared';
    }
  }catch(e){
    if(e&&e.name==='AbortError')return 'cancelled';
  }
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
  return 'downloaded';
}

// Redondea trazos del Apple Pencil a 4 decimales (0,1 px en un cuaderno de 1000 px):
// a la vista son idénticos y ocupan unas tres veces menos.
function roundInk(ink){
  if(!Array.isArray(ink))return ink;
  return ink.map(s=>Array.isArray(s)?s.map(p=>Array.isArray(p)?[Math.round(p[0]*1e4)/1e4,Math.round(p[1]*1e4)/1e4]:p):s);
}
