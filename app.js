'use strict';
const defaults=[['Palabras de introducción',1,''],['Discurso de Tesoros',10,'TESOROS DE LA BIBLIA'],['Perlas espirituales',10,''],['Lectura de la Biblia',4,''],['Intervención 1',3,'SEAMOS MEJORES MAESTROS'],['Intervención 2',4,''],['Intervención 3',5,''],['Intervención 4',5,''],['Parte de nuestra vida cristiana',15,'NUESTRA VIDA CRISTIANA'],['Estudio bíblico de congregación',30,''],['Palabras de conclusión',3,'']];
const key='cronometro-reunion-v1';
let state={parts:defaults.map(([title,min,section])=>({title,min,section,elapsed:0,started:null})),total:{elapsed:0,started:null}};
try{const s=JSON.parse(localStorage.getItem(key));if(s&&Array.isArray(s.parts)&&s.parts.length&&s.total)state=s;}catch(e){}
// Actualiza la plantilla anterior sin perder los tiempos de las asignaciones.
state.parts=state.parts.filter(p=>!['Canción y oración','Canción','Canción y oración final'].includes(p.title));
const life=state.parts.find(p=>p.title==='Parte de nuestra vida cristiana');if(life&&!life.section)life.section='NUESTRA VIDA CRISTIANA';
// Añade la cuarta intervención una sola vez a las plantillas existentes.
if(!state.templateRevision){const pos=state.parts.findIndex(p=>p.title==='Intervención 3');if(pos>=0&&!state.parts.some(p=>p.title==='Intervención 4'))state.parts.splice(pos+1,0,{title:'Intervención 4',min:5,section:'',elapsed:0,started:null});state.templateRevision=4;}
const $=id=>document.getElementById(id), value=(t,now=Date.now())=>t.elapsed+(t.started===null?0:Math.max(0,now-t.started)),fmt=ms=>{const s=Math.floor(ms/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
function save(){try{localStorage.setItem(key,JSON.stringify(state));$('status').textContent='Guardado';}catch(e){$('status').textContent='Sin guardado local';}}
function stop(t){t.elapsed=value(t);t.started=null;}
function action(t,a){if(a==='start'){if(t.started===null)t.started=Date.now();}if(a==='stop')stop(t);if(a==='reset'){t.elapsed=0;t.started=null;}}
function render(){const root=$('rows');root.replaceChildren();state.parts.forEach((p,i)=>{if(p.section){const s=document.createElement('div');s.className='section';s.textContent=p.section;root.append(s);}const row=document.createElement('div');row.className='row';row.id='row'+i;const label=document.createElement('div');label.className='label';label.textContent=p.title;const hint=document.createElement('small');hint.textContent=p.min+' min';hint.id='hint'+i;label.append(hint);const clock=document.createElement('div');clock.className='clock';clock.id='clock'+i;const controls=document.createElement('div');controls.className='controls';[['start','▶','Inicio'],['stop','■','Fin'],['reset','↺','Reinicio']].forEach(([a,s,title])=>{const b=document.createElement('button');b.textContent=s;b.setAttribute('aria-label',title+': '+p.title);b.onclick=()=>{if(a==='start'){state.parts.forEach(x=>{if(x!==p)stop(x);});action(state.total,'start');}action(p,a);save();tick();};controls.append(b);});row.append(label,clock,controls);root.append(row);});tick();}
function tick(){updateActivePanel();const now=Date.now(),total=value(state.total,now),planned=state.parts.reduce((s,p)=>s+p.min*60000,0);$('total').textContent=fmt(total);$('progress').style.width=Math.min(100,planned?total/planned*100:0)+'%';$('totalInfo').textContent='Asignaciones: '+Math.round(planned/60000)+' min · '+(total>planned?'Exceso '+fmt(total-planned):'Restan '+fmt(planned-total));state.parts.forEach((p,i)=>{const t=value(p,now);$('clock'+i).textContent=fmt(t);$('row'+i).classList.toggle('active',p.started!==null);$('hint'+i).textContent=p.min+' min'+(p.started!==null?' · ● EN CURSO':'');$('row'+i).classList.toggle('over',t>p.min*60000);});}
[['startTotal','start'],['stopTotal','stop'],['resetTotal','reset']].forEach(([id,a])=>{$(id).setAttribute('aria-label',a==='start'?'Iniciar reunión':a==='stop'?'Finalizar reunión':'Reiniciar reunión');$(id).onclick=()=>{if(a==='reset'&&!confirm('¿Reiniciar todos los cronómetros? La plantilla se conserva.'))return;if(a!=='start')state.parts.forEach(p=>a==='reset'?action(p,'reset'):stop(p));action(state.total,a);save();tick();};});
function field(p){const d=document.createElement('div');d.className='field';const title=document.createElement('input');title.value=p.title;title.required=true;title.setAttribute('aria-label','Título');const min=document.createElement('input');min.type='number';min.min='0';min.max='180';min.step='1';min.value=p.min;min.required=true;min.setAttribute('aria-label','Minutos');const del=document.createElement('button');del.type='button';del.textContent='×';del.setAttribute('aria-label','Quitar intervención');del.onclick=()=>d.remove();d.dataset.section=p.section||'';d.append(title,min,del);$('fields').append(d);}
$('edit').onclick=()=>{$('fields').replaceChildren();state.parts.forEach(field);$('editor').showModal();};$('cancel').onclick=()=>$('editor').close();$('add').onclick=()=>field({title:'Nueva intervención',min:5,section:''});$('form').onsubmit=e=>{e.preventDefault();const fields=[...$('fields').children];if(!fields.length){alert('Añade al menos una intervención.');return;}if(value(state.total)>0&&!confirm('Guardar la plantilla reinicia los cronómetros. ¿Continuar?'))return;state.parts=fields.map(d=>({title:d.children[0].value.trim()||'Intervención',min:Number(d.children[1].value),section:d.dataset.section,elapsed:0,started:null}));state.total={elapsed:0,started:null};save();render();$('editor').close();};
render();setInterval(tick,250);document.addEventListener('visibilitychange',()=>{tick();save();});

// Comprueba nuevas versiones al abrir o volver a la aplicación.
const BUILD='5';
let checkingUpdate=false;
async function checkUpdate(){
 if(checkingUpdate||!navigator.onLine||location.protocol==='file:')return;
 checkingUpdate=true;
 try{
  const response=await fetch(new URL('version.json?check='+Date.now(),location.href),{cache:'no-store'});
  if(!response.ok)return;
  const latest=await response.json();
  if(typeof latest.version!=='string'||latest.version===BUILD)return;
  // Espera a que termine la asignación activa antes de recargar.
  if(state.parts.some(p=>p.started!==null))return;
  const url=new URL(location.href);
  if(url.searchParams.get('version')===latest.version)return;
  save();url.searchParams.set('version',latest.version);location.replace(url.href);
 }catch(e){/* Sin conexión: conserva la sesión actual. */}
 finally{checkingUpdate=false;}
}
checkUpdate();
setInterval(checkUpdate,60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkUpdate();});

// Reparte la altura disponible entre las filas y ajusta el tamaño de los controles.
function fitScreen(){
 const main=document.querySelector('main'),rows=$('rows');
 const cs=getComputedStyle(main);
 const panelHeight=$('activePanel').hidden?0:$('activePanel').getBoundingClientRect().height+8;
 const overhead=panelHeight+document.querySelector('header').getBoundingClientRect().height+document.querySelector('.total').getBoundingClientRect().height+document.querySelector('footer').getBoundingClientRect().height+parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom)+32;
 const sections=[...rows.querySelectorAll('.section')].reduce((sum,e)=>sum+e.getBoundingClientRect().height+10,0);
 const height=Math.max(40,(window.innerHeight-overhead-sections)/state.parts.length-4);
 main.style.setProperty('--row-height',height+'px');
 main.style.setProperty('--button-size',Math.max(30,Math.min(44,height-10,window.innerWidth<370?34:44))+'px');
 main.style.setProperty('--label-size',Math.max(11,Math.min(15,height*.25))+'px');
 main.style.setProperty('--clock-size',Math.max(14,Math.min(20,height*.34))+'px');
}
window.addEventListener('resize',fitScreen);
new ResizeObserver(fitScreen).observe($('rows'));
fitScreen();

function updateActivePanel(){
 const active=state.parts.find(p=>p.started!==null),panel=$('activePanel');
 const changed=panel.hidden===Boolean(active);
 panel.hidden=!active;
 if(active){
  $('activeTitle').textContent=active.title;
  $('activeTime').textContent=fmt(value(active));
  const remaining=active.min*60000-value(active);
  $('activeTarget').textContent=remaining<0?'Exceso '+fmt(-remaining):'Restan '+fmt(remaining)+' · '+active.min+' min';
  panel.classList.toggle('over',remaining<0);
 }
 if(changed)requestAnimationFrame(fitScreen);
}
