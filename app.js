'use strict';
const BUILD='48',key='cronometro-reunion-v1';
const defaults=[['Palabras de introducción',1,''],['Discurso de Tesoros',10,'TESOROS DE LA BIBLIA'],['Perlas espirituales',10,''],['Lectura de la Biblia',4,''],['Intervención 1',3,'SEAMOS MEJORES MAESTROS'],['Intervención 2',4,''],['Intervención 3',5,''],['Intervención 4',5,''],['Parte de nuestra vida cristiana',15,'NUESTRA VIDA CRISTIANA'],['Estudio bíblico de congregación',30,''],['Palabras de conclusión',3,'']];
const $=id=>document.getElementById(id),value=(t,now=Date.now())=>t.elapsed+(t.started===null?0:Math.max(0,now-t.started));
function fmt(ms){const s=Math.max(0,Math.floor(ms/1000));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function timeOfDay(ms){return new Date(ms).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})}

let state={parts:defaults.map(([title,min,section])=>({title,min,section,elapsed:0,started:null,done:false})),total:{elapsed:0,started:null},focusIndex:null,templateRevision:4};
let restored=false,storageOK=true,wake=null;
try{const s=JSON.parse(localStorage.getItem(rehearsalActive?rehearsalKey:key));if(s&&Array.isArray(s.parts)&&s.parts.length&&s.parts.every(p=>typeof p.title==='string'&&Number.isFinite(p.min)&&p.min>=0&&p.min<=180)&&s.total){state={...s,parts:s.parts.map(p=>({...p,title:p.title.slice(0,150),section:typeof p.section==='string'?p.section:'',...cleanTimer(p),done:!!p.done})),total:cleanTimer(s.total)};restored=value(state.total)>0;}}catch(e){}
if(!state.templateRevision){const i=state.parts.findIndex(p=>p.title==='Intervención 3');if(i>=0&&!state.parts.some(p=>p.title==='Intervención 4'))state.parts.splice(i+1,0,{title:'Intervención 4',min:5,section:'',elapsed:0,started:null,done:false});state.templateRevision=4;}
if(!Number.isInteger(state.focusIndex)||!state.parts[state.focusIndex])state.focusIndex=null;
const running=state.parts.findIndex(p=>p.started!==null);if(running>=0)state.focusIndex=running;
// Conserva plantillas anteriores y añade preparación y consejos.
state.meeting=meetingOf(state.meeting);
let sectionForMigration='';
state.parts.forEach(p=>{if(!p.id)p.id=newPartId();p.kind=partKind(p,state.parts);if(!p.role)p.role=/^palabras de conclusi[oó]n/i.test(p.title)?'conclusion':''});
state.parts.forEach(p=>{if(p.section)sectionForMigration=p.section;p.participant=typeof p.participant==='string'?p.participant.slice(0,120):'';p.adviceMin=Number.isFinite(p.adviceMin)?Math.max(0,Math.min(10,p.adviceMin)):(sectionForMigration==='SEAMOS MEJORES MAESTROS'||p.title==='Lectura de la Biblia'?1:0);p.after=cleanTimer(p.after)});
state.leadInMin=Number.isFinite(state.leadInMin)?Math.max(0,Math.min(60,state.leadInMin)):0;
if(!Number.isInteger(state.preparedIndex)||!state.parts[state.preparedIndex]||state.preparedIndex===state.focusIndex)state.preparedIndex=null;
let inputGuardUntil=0,editingUnlocked=false;
function guarded(fn){if(Date.now()<inputGuardUntil)return;inputGuardUntil=Date.now()+900;fn();tick();}
function upcomingIndex(){if(Number.isInteger(state.preparedIndex)&&state.parts[state.preparedIndex]&&state.preparedIndex!==state.focusIndex)return state.preparedIndex;const next=state.focusIndex===null?0:state.focusIndex+1;return state.parts[next]?next:null;}
function namedStart(i,fallback){const name=state.parts[i]?.participant;return name?'Iniciar a '+name:fallback;}
function meetingInProgress(){return !state.endedAt&&(state.total.started!==null||value(state.total)>0);}
function stagePart(i){if(!Number.isInteger(i)||!state.parts[i]||i===state.focusIndex){announce('Elige una intervención distinta de la actual.');return false;}remember();state.preparedIndex=i;save();tick();announce('Preparada: '+state.parts[i].title+'. Su cronómetro sigue detenido.');return true;}
function openPrepare(){const select=$('prepareSelect');select.replaceChildren();state.parts.forEach((p,i)=>{if(i===state.focusIndex)return;const option=document.createElement('option');option.value=i;option.textContent=numberedPartTitle(state.parts,i)+(p.participant?' · '+p.participant:'');select.append(option)});const next=upcomingIndex();if(next!==null)select.value=String(next);$('prepareSave').disabled=state.parts.length<=1&&state.focusIndex!==null;$('toolsDisclosure').open=false;$('programDialog').close();$('prepareDialog').showModal();}
function remember(){const {undo,...rest}=state;state.undo=JSON.parse(JSON.stringify({parts:rest.parts.map(({ink,...p})=>p),focusIndex:rest.focusIndex,preparedIndex:rest.preparedIndex,endedAt:rest.endedAt??null}));}
function undoLast(){if(!state.undo)return;const previous=state.undo,inkById=new Map(state.parts.map(p=>[p.id,p.ink]));state.parts=previous.parts.map(p=>inkById.get(p.id)!==undefined?{...p,ink:inkById.get(p.id)}:p);state.focusIndex=previous.focusIndex;state.preparedIndex=previous.preparedIndex??null;inputGuardUntil=0;state.endedAt=previous.endedAt;state.undo=null;if(state.total.started===null){state.parts.forEach(p=>{stop(p);stop(p.after)})}save();render();announce('Último cambio deshecho. El total se conserva.');}
function stopTransitions(){state.parts.forEach(p=>stop(p.after))}
function pausePart(i){const p=state.parts[i];if(!p)return;remember();stop(p);p.done=false;state.focusIndex=i;save();tick()}
function finishCounsel(i){const p=state.parts[i];if(!p||!p.done||p.after.started===null)return;remember();stop(p.after);save();tick();announce((isStudentPart(p)&&p.adviceMin>0?'Consejo finalizado.':'Presentación finalizada.')+' El tiempo de la próxima asignación sigue detenido.');}
function primaryAction(){const i=state.focusIndex,p=i===null?null:state.parts[i];if(!p){startPart(upcomingIndex()??0);return;}if(p.started!==null){finishPart(i);return;}if(!p.done){startPart(i);return;}if(isStudentPart(p)&&p.adviceMin>0&&p.after.started!==null)finishCounsel(i);if(upcomingIndex()!==null){if(typeof previewNextPart==='function')previewNextPart();else openPrepare();}else if(state.total.started!==null)$('stopTotal').onclick();}
function paceAt(now){const i=state.focusIndex;if(i===null)return null;let expected=state.leadInMin*60000;for(let j=0;j<i;j++)expected+=(state.parts[j].min+state.parts[j].adviceMin)*60000;const p=state.parts[i];expected+=p.done?p.min*60000+Math.min(value(p.after,now),p.adviceMin*60000):Math.min(value(p,now),p.min*60000);return value(state.total,now)-expected;}



function acquireWake(){if(navigator.wakeLock&&!wake&&!document.hidden&&(state.total.started!==null||state.parts.some(p=>p.started!==null||p.after?.started!==null)||atril||document.body.classList.contains('bigclock-open'))){navigator.wakeLock.request('screen').then(w=>{wake=w;w.addEventListener('release',()=>wake=null,{once:true})}).catch(()=>{});}}
function releaseWake(){if(wake)wake.release().catch(()=>{});wake=null}
function startPart(i,keepUndo=false){const p=state.parts[i];if(!p)return;if(p.started!==null){state.focusIndex=i;if(typeof closePreparationForms==='function')closePreparationForms();save();tick();return;}if(!keepUndo)remember();stopTransitions();state.parts.forEach((x,j)=>{if(j!==i&&x.started!==null){stop(x);x.done=true}});p.started=Date.now();p.done=false;state.focusIndex=i;if(state.preparedIndex===i)state.preparedIndex=null;if(state.total.started===null)state.total.started=Date.now();state.endedAt=null;if(typeof closePreparationForms==='function')closePreparationForms();save();tick();acquireWake()}
function finishPart(i,keepUndo=false){const p=state.parts[i];if(!p||p.done)return;if(!keepUndo)remember();stopTransitions();stop(p);p.done=true;state.focusIndex=i;if(state.total.started!==null)p.after.started=Date.now();save();tick()}
function resetPart(i){const p=state.parts[i];if(!p)return;if(!confirm('¿Reiniciar el tiempo de esta intervención y sus consejos? El total se conserva.'))return;remember();resetTimer(p);resetTimer(p.after);state.focusIndex=i;save();tick()}
function nextPart(){const next=upcomingIndex();if(next===null){announce('Has llegado a la última intervención.');return;}remember();if(state.focusIndex!==null)finishPart(state.focusIndex,true);startPart(next,true)}
function announce(text){$('notice').textContent=text}
function render(){const root=$('rows');root.replaceChildren();let group='';state.parts.forEach((p,i)=>{if(p.section)group=p.section;const colorGroup=group==='TESOROS DE LA BIBLIA'?'treasures':group==='SEAMOS MEJORES MAESTROS'?'teaching':group==='NUESTRA VIDA CRISTIANA'?'living':'';if(p.section){const section=document.createElement('div');section.className='section '+colorGroup;section.textContent=p.section;root.append(section)}const row=document.createElement('div');row.className='row '+colorGroup;row.id='row'+i;const label=document.createElement('div');label.className='label';label.textContent=p.title+(p.participant?' · '+p.participant:'');const hint=document.createElement('small');hint.id='hint'+i;label.append(hint);const clock=document.createElement('div');clock.className='clock';clock.id='clock'+i;const controls=document.createElement('div');controls.className='controls';[['start','▶','Inicio'],['stop','■','Fin'],['reset','↺','Reinicio']].forEach(([a,s,title])=>{const b=document.createElement('button');b.textContent=s;b.dataset.action=a;b.setAttribute('aria-label',title+': '+p.title);b.onclick=()=>guarded(()=>{if(a==='start'){startPart(i);$('programDialog').close();}else if(a==='stop')finishPart(i);else resetPart(i)});controls.append(b)});row.append(label,clock,controls);root.append(row)});tick();requestAnimationFrame(fitScreen)}
function statusFor(p,now){const remaining=p.min*60000-value(p,now);return {remaining,over:p.min>0&&remaining<0,warning:p.min>0&&remaining>=0&&remaining<=60000&&p.started!==null}}
function tick(){const now=Date.now(),total=value(state.total,now),target=105*60000;$('total').textContent=fmt(total);$('progress').style.width=Math.min(100,total/target*100)+'%';$('totalArc').style.strokeDashoffset=String(289.027*(1-Math.max(0,Math.min(1,total/target))));$('totalFace').classList.toggle('over',total>target);$('totalFace').classList.toggle('long-time',$('total').textContent.length>6);$('totalInfo').textContent='Objetivo 105 min · '+(total>target?'Exceso '+fmt(total-target):'Restan '+fmt(target-total));const scheduleDrift=paceAt(now),drift=scheduleDrift??0;const pace=$('pace');pace.textContent=scheduleDrift===null?'Preparada para empezar':Math.abs(drift)<30000?'Vamos a tiempo':drift>0?'Llevamos '+fmt(drift)+' de retraso':'Tenemos '+fmt(-drift)+' de margen';pace.dataset.rhythm=drift>=30000?'late':drift<=-30000?'early':'ontime';const offset=Math.max(0,total-target);if(state.endedAt){$('eta').textContent='Terminó a las '+timeOfDay(state.endedAt)+(offset?' · +'+fmt(offset):'');}else if(state.total.started!==null){$('eta').textContent=total>=target?'Objetivo superado · +'+fmt(offset):'Fin previsto '+timeOfDay(now+Math.max(0,target-total+drift))+(Math.abs(drift)>=1000?' · '+(drift>0?'+':'−')+fmt(Math.abs(drift)):'');}else{$('eta').textContent=total?'Total en pausa · al continuar: '+timeOfDay(now+Math.max(0,target-total)):'Hora de finalización al iniciar';}
$('startTotal').disabled=state.total.started!==null;$('stopTotal').disabled=state.total.started===null;
state.parts.forEach((p,i)=>{const t=value(p,now),s=statusFor(p,now),row=$('row'+i);$('clock'+i).textContent=fmt(t);row.classList.toggle('active',p.started!==null);row.classList.toggle('over',s.over);row.classList.toggle('warning',s.warning);row.classList.toggle('done',!!p.done);$('hint'+i).textContent=p.min+' min · '+(p.min===0?'Sin límite':s.over?'Exceso '+fmt(-s.remaining):'Quedan '+fmt(s.remaining))+(p.done?' · ✓':'');row.querySelector('[data-action=start]').disabled=p.started!==null;row.querySelector('[data-action=stop]').disabled=p.started===null;});updateActivePanel(now);if(typeof updateSupport==='function')updateSupport();if(typeof updateSections==='function')updateSections();}
function updateActivePanel(now=Date.now()){
 const i=state.focusIndex,p=i===null?null:state.parts[i],panel=$('activePanel');
 const changed=panel.hidden===Boolean(p);panel.hidden=!p;$('emptyAtril').hidden=!!p;if(!p){$('meetingPanel').dataset.moment='ready';$('meetingPanel').dataset.section='opening';}
 if(p){
  const s=statusFor(p,now),elapsed=value(p,now);
  $('activeState').textContent=p.started!==null?'ASIGNACIÓN':p.done?(p.adviceMin>0?'CONSEJOS':'PRESENTACIÓN'):elapsed>0?'ASIGNACIÓN · EN PAUSA':'ASIGNACIÓN · PREPARADA';panel.dataset.moment=p.done?(p.adviceMin>0?'advice':'presentation'):'assignment';
  panel.classList.toggle('has-participant',!!p.participant);$('meetingPanel').dataset.moment=panel.dataset.moment;
  $('activeTitle').textContent=p.title;$('activeParticipant').textContent=p.participant;$('activeParticipant').hidden=!p.participant;
  $('activeClockLabel').textContent=compact?(s.over?'EXCESO':p.min>0?'TIEMPO RESTANTE':'TRANSCURRIDO'):'Transcurrido';
  $('activeTime').textContent=compact&&p.min>0?(s.over?'+':'')+fmt(Math.abs(s.remaining)):fmt(elapsed);
  $('activeElapsed').textContent='Transcurrido '+fmt(elapsed)+' · previsto '+p.min+' min';
  if(p.done){$('activeClockLabel').textContent=p.adviceMin>0?'CONSEJOS':'PRESENTACIÓN';$('activeTime').textContent=fmt(value(p.after,now));$('activeElapsed').textContent='Asignación finalizada: '+fmt(elapsed);}
  $('primaryAction').textContent=p.started!==null?'Finalizar asignación':p.done?'Ver próxima asignación':elapsed>0?'Continuar asignación':'Iniciar asignación';$('primaryAction').disabled=p.done&&i===state.parts.length-1;$('undoAction').disabled=!state.undo;
  $('activeTarget').textContent=compact?(p.min===0?'Sin límite':s.over?'Tiempo superado':s.warning?'Queda menos de un minuto':'Asignación de '+p.min+' min'):(p.min===0?'Sin límite':s.over?'Exceso '+fmt(-s.remaining):'Quedan '+fmt(s.remaining));
  if(p.done)$('activeTarget').textContent=p.adviceMin>0?'Consejos previstos: '+p.adviceMin+' min':'El total sigue contando';
  $('clockFace').classList.toggle('long-time',$('activeTime').textContent.length>6);const dialLimit=(p.done?p.adviceMin:p.min)*60000,dialElapsed=p.done?value(p.after,now):elapsed,dialFraction=dialLimit>0?Math.max(0,Math.min(1,1-dialElapsed/dialLimit)):0;$('clockArc').style.strokeDashoffset=String(289.027*(1-dialFraction));$('clockFace').classList.toggle('no-limit',dialLimit===0);
  const afterOver=p.done&&p.adviceMin>0&&value(p.after,now)>p.adviceMin*60000;panel.classList.toggle('over',p.done?afterOver:s.over);panel.classList.toggle('warning',!p.done&&s.warning);
  let group='';for(let j=0;j<=i;j++)if(state.parts[j].section)group=state.parts[j].section;
  $('meetingPanel').dataset.section=group==='TESOROS DE LA BIBLIA'?'treasures':group==='SEAMOS MEJORES MAESTROS'?'teaching':group==='NUESTRA VIDA CRISTIANA'?'living':'opening';
  panel.classList.toggle('treasures',group==='TESOROS DE LA BIBLIA');panel.classList.toggle('teaching',group==='SEAMOS MEJORES MAESTROS');panel.classList.toggle('living',group==='NUESTRA VIDA CRISTIANA');
  $('activeStart').hidden=p.started!==null;$('activeStart').textContent=elapsed>0?'▶ Continuar':'▶ Inicio';
  $('activePause').hidden=p.started===null;$('activeStop').hidden=p.done;
  $('activeNext').disabled=p.done&&i===state.parts.length-1;
  $('chairGap').hidden=!(p.done&&state.total.started!==null);
  const nextIndex=upcomingIndex(),next=nextIndex===null?null:state.parts[nextIndex];$('upNextLabel').textContent=next?(state.preparedIndex!==null?'PREPARADA · SIN INICIAR':'A CONTINUACIÓN'):'FIN DEL PROGRAMA';$('upNextTitle').textContent=next?next.title+(next.participant?' · '+next.participant:''):'Última intervención';$('upNextDuration').textContent=next?next.min+' min':'Finaliza el total después de la canción y la oración.';
 }
 const focused=state.parts[state.focusIndex],nextIndex=upcomingIndex();
 const actionLabel=!focused?namedStart(nextIndex,'Iniciar primera asignación'):focused.started!==null?'Finalizar asignación':focused.done?'Ver próxima asignación':value(focused,now)>0?'Continuar asignación':namedStart(state.focusIndex,'Iniciar asignación');
 const lastDone=!!focused&&focused.done&&nextIndex===null;
 ['next','activeNext','primaryAction'].forEach(id=>{$(id).textContent=lastDone?'Programa terminado':actionLabel;$(id).disabled=lastDone||now<inputGuardUntil;$(id).dataset.intent=lastDone?'complete':focused?.started!==null&&focused?'finish':'start'});
 $('beginFirst').textContent=namedStart(nextIndex,'Iniciar primera asignación');$('beginFirst').disabled=now<inputGuardUntil;
 $('preparedEmpty').textContent=nextIndex===null?'':state.parts[nextIndex].title+(state.parts[nextIndex].participant?' · '+state.parts[nextIndex].participant:'');

 if(changed)requestAnimationFrame(fitScreen);
}

$('startTotal').onclick=()=>{if(state.total.started===null)state.total.started=Date.now();const focused=state.parts[state.focusIndex];if(focused?.done&&focused.after.started===null)focused.after.started=Date.now();state.endedAt=null;if(typeof closePreparationForms==='function')closePreparationForms();save();tick();acquireWake()};
$('stopTotal').onclick=()=>{stopTransitions();state.undo=null;state.parts.forEach(p=>{if(p.started!==null){stop(p);p.done=true}});stop(state.total);state.endedAt=Date.now();save();tick();releaseWake();openSummary()};
$('resetTotal').onclick=()=>{if(!confirm('¿Reiniciar todos los cronómetros? La plantilla se conserva.'))return;state.parts.forEach(p=>{resetTimer(p);resetTimer(p.after)});state.undo=null;resetTimer(state.total);state.focusIndex=null;state.preparedIndex=null;inputGuardUntil=0;state.endedAt=null;save();announce('Tiempos reiniciados.');tick();releaseWake()};
$('primaryAction').onclick=()=>guarded(primaryAction);$('undoAction').onclick=undoLast;$('resetSelected').onclick=()=>{if(state.focusIndex!==null)resetPart(state.focusIndex);else announce('Selecciona primero una asignación.');};$('next').onclick=()=>guarded(primaryAction);$('activeNext').onclick=()=>guarded(primaryAction);$('activeStart').onclick=()=>guarded(()=>startPart(state.focusIndex));$('activeStop').onclick=()=>guarded(()=>finishPart(state.focusIndex));$('activePause').onclick=()=>guarded(()=>pausePart(state.focusIndex));$('activeReset').onclick=()=>resetPart(state.focusIndex);$('beginFirst').onclick=()=>guarded(primaryAction);
$('programOpen').onclick=()=>{placeProgramList(true);$('partsDisclosure').open=true;$('programDialog').showModal()};$('programClose').onclick=()=>{$('programDialog').close();placeProgramList()};$('programDialog').addEventListener('close',()=>placeProgramList());$('prepareOpen').onclick=openPrepare;$('prepareInline').onclick=openPrepare;$('prepareCancel').onclick=()=>$('prepareDialog').close();$('prepareSave').onclick=()=>{if(stagePart(Number($('prepareSelect').value)))$('prepareDialog').close()};
let compact=false,compactPreference=null;
let atril=false;function setAtril(on){if(on&&compact)setCompact(false);atril=on;document.body.classList.toggle('atril',on);$('atril').textContent=on?'Salir del atril':'Modo atril';$('atril').setAttribute('aria-pressed',String(on));placeProgramList(compact||atril);requestAnimationFrame(fitScreen);if(on)acquireWake()}
$('atril').onclick=()=>setAtril(!atril);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&atril)setAtril(false)});
function openSummary(){const root=$('summaryRows');root.replaceChildren();let planned=0,real=0;state.parts.forEach(p=>{const t=value(p),target=p.min*60000;planned+=target;real+=t;const row=document.createElement('tr');[p.title,p.min?fmt(target):'—',fmt(t),p.min?(t>=target?'+':'−')+fmt(Math.abs(t-target)):'—',fmt(value(p.after))].forEach((text,i)=>{const cell=document.createElement(i===0?'th':'td');if(i===0)cell.scope='row';cell.textContent=text;row.append(cell)});root.append(row)});$('summaryTotal').textContent='Total de reunión: '+fmt(value(state.total))+' · objetivo 105:00';$('summaryParts').textContent='Intervenciones: '+fmt(real)+' · previstas '+fmt(planned)+'. El total incluye canciones, oraciones y transiciones que hayas cronometrado con el contador general.';$('summary').showModal()}
$('summaryOpen').onclick=()=>{if(compact)$('toolsDisclosure').open=false;openSummary()};$('summaryClose').onclick=()=>$('summary').close();
function field(p){const d=document.createElement('div');d.className='field';d.dataset.partId=p.id||newPartId();const title=document.createElement('input');title.value=p.title;title.required=true;title.maxLength=150;title.setAttribute('aria-label','Título');const min=document.createElement('input');min.type='number';min.min='0';min.max='180';min.step='0.5';min.value=p.min;min.required=true;min.setAttribute('aria-label','Minutos');const del=document.createElement('button');del.type='button';del.textContent='×';del.setAttribute('aria-label','Quitar intervención');del.onclick=()=>d.remove();const section=document.createElement('select');section.setAttribute('aria-label','Encabezado de sección');['','TESOROS DE LA BIBLIA','SEAMOS MEJORES MAESTROS','NUESTRA VIDA CRISTIANA'].forEach(g=>{const o=document.createElement('option');o.value=g;o.textContent=g||'Continuar sección anterior';section.append(o)});section.value=p.section||'';const name=document.createElement('input');name.value=p.participant||'';name.placeholder='Participante';name.maxLength=120;name.setAttribute('aria-label','Participante');const advice=document.createElement('input');advice.type='number';advice.min=0;advice.max=10;advice.step='0.5';advice.value=p.adviceMin??0;advice.setAttribute('aria-label','Minutos para consejos');advice.title='Minutos para consejos (0 si no lleva)';const nameCaption=document.createElement('small');nameCaption.className='participant-caption';nameCaption.textContent='Participante';const adviceCaption=document.createElement('small');adviceCaption.className='advice-caption';adviceCaption.textContent='Consejos (min)';d.append(title,min,del,section,name,advice,nameCaption,adviceCaption);[['supportNote','Nota de apoyo',300],['lesson','Lección que trabaja',120],['praise','Qué encomiar',250],['emphasis','Qué destacar',250]].forEach(([key,label,limit])=>{const l=document.createElement('label');l.className='support-field';l.textContent=label;const input=document.createElement('textarea');input.value=p[key]||'';input.maxLength=limit;input.dataset.noteKey=key;input.rows=2;l.append(input);d.append(l)});addOutlineEditor(d,p);for(const element of [...d.children].slice(4))element.hidden=true;$('fields').append(d)}
function setEditLock(locked){$('preparationFields').disabled=locked;$('saveTemplate').disabled=locked;$('unlockEdit').hidden=!locked;$('editLockNote').hidden=!locked;editingUnlocked=!locked;}
function openEditor(){if(compact)$('toolsDisclosure').open=false;$('fields').replaceChildren();$('leadIn').value=state.leadInMin;state.parts.forEach(field);fillMeetingEditor();setEditLock(meetingInProgress());$('editor').showModal();}
$('edit').onclick=openEditor;
$('unlockEdit').onclick=()=>{if(confirm('Débloquear la edición durante la reunión. Guardar cambios reiniciará los tiempos, tras otra confirmación. ¿Desbloquear?'))setEditLock(false)};
$('cancel').onclick=()=>$('editor').close();$('add').onclick=()=>field({title:'Nueva intervención',min:5,section:''});
$('form').onsubmit=e=>{
 e.preventDefault();if(meetingInProgress()&&!editingUnlocked){announce('Desbloquea la edición para guardar.');return;}
 const fields=[...$('fields').children];const lead=Number($('leadIn').value);
 const proposed=fields.map(d=>({id:d.dataset.partId,title:d.children[0].value.trim(),min:Number(d.children[1].value),section:d.children[3].value,participant:d.children[4].value.trim(),adviceMin:Number(d.children[5].value),...readOutlineEditor(d),...Object.fromEntries([...d.children].filter(l=>l.className==='support-field').map(l=>[l.children[0].dataset.noteKey,l.children[0].value.trim()]))}));
 if(!proposed.length||proposed.some(p=>!validTemplatePart(p))||!Number.isFinite(lead)||lead<0||lead>60){alert('Revisa los títulos, minutos y consejos.');return;}
 const ids=new Set(proposed.map(p=>p.id));
 if(state.parts.some(p=>!ids.has(p.id)&&(value(p)>0||p.started!==null||p.done||value(p.after)>0))){alert('Esta parte ya tiene tiempos. Conserva esa fila; puedes cambiar su título y minutos. Para otro programa, prepara una nueva reunión.');return;}
 const focusId=state.parts[state.focusIndex]?.id,preparedId=state.parts[state.preparedIndex]?.id;
 const previous=new Map(state.parts.map(p=>[p.id,p]));state.parts=proposed.map(p=>({...blankPart(p),...previous.get(p.id),...p}));
 state.focusIndex=state.parts.findIndex(p=>p.id===focusId);if(state.focusIndex<0)state.focusIndex=null;
 state.preparedIndex=state.parts.findIndex(p=>p.id===preparedId);if(state.preparedIndex<0)state.preparedIndex=null;
 const meeting=readMeetingEditor();if(!validFields(meeting,MEETING_FIELDS)){alert('Revisa los datos generales.');return;}state.meeting=meeting;state.leadInMin=lead;state.undo=null;save();render();$('editor').close();announce('Cambios guardados. Los tiempos se conservan.');
};
function fitScreen(){if(atril||compact)return;const main=document.querySelector('main'),rows=$('rows');const cs=getComputedStyle(main);const panel=$('activePanel').hidden?0:$('activePanel').getBoundingClientRect().height+6;const other=panel+document.querySelector('header').getBoundingClientRect().height+document.querySelector('.total').getBoundingClientRect().height+document.querySelector('footer').getBoundingClientRect().height+$('toolbar').getBoundingClientRect().height+$('notice').getBoundingClientRect().height+parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom)+38;const sections=[...rows.querySelectorAll('.section')].reduce((sum,e)=>sum+e.getBoundingClientRect().height+6,0);const height=Math.max(32,(window.innerHeight-other-sections)/state.parts.length-4);main.style.setProperty('--row-height',height+'px');main.style.setProperty('--button-size',Math.max(28,Math.min(40,height-5,window.innerWidth<370?32:40))+'px');main.style.setProperty('--label-size',Math.max(12,Math.min(15,height*.29))+'px');main.style.setProperty('--clock-size',Math.max(15,Math.min(20,height*.4))+'px')}
window.addEventListener('resize',fitScreen);window.visualViewport?.addEventListener('resize',fitScreen);
document.addEventListener('visibilitychange',()=>{save();tick();if(!document.hidden){acquireWake();checkUpdate()}});window.addEventListener('pagehide',save);
let checkingUpdate=false;async function checkUpdate(){if(checkingUpdate||!navigator.onLine||location.protocol==='file:'||state.total.started!==null||state.parts.some(p=>p.started!==null))return;checkingUpdate=true;try{const response=await fetch(new URL('version.json?check='+Date.now(),location.href),{cache:'no-store'});if(!response.ok)return;const latest=await response.json();if(typeof latest.version!=='string'||latest.version===BUILD)return;const url=new URL(location.href);if(url.searchParams.get('version')===latest.version)return;save();url.searchParams.set('version',latest.version);location.replace(url.href)}catch(e){}finally{checkingUpdate=false}}
initCompact();render();if(restored)announce('Tiempos recuperados. Puedes continuar donde lo dejaste.');save();heartbeat(tick,250);setInterval(checkUpdate,60000);checkUpdate();acquireWake();


// La vista compacta adapta el contenido; Slide Over lo controla iPadOS.
function isIPad(){return /iPad/.test(navigator.userAgent||'')||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1}
function setCompact(on,persist=true){
 if(on&&atril)setAtril(false);
 compact=on;
 document.body.classList.toggle('compact',on);
 $('compactToggle').textContent=on?'Vista completa':'Vista sencilla';
 $('toolsDisclosure').open=false;
 $('compactToggle').setAttribute('aria-pressed',String(on));
 $('partsDisclosure').open=true;placeProgramList(on||atril);
 if(persist){compactPreference=on;try{localStorage.setItem('cronometro-compact-v1',JSON.stringify(on));localStorage.setItem('cronometro-simple-v1',JSON.stringify(on))}catch(e){}}
 if($('rows').children.length)tick();requestAnimationFrame(fitScreen);
}
function initCompact(){
 try{const saved=JSON.parse(localStorage.getItem('cronometro-simple-v1'));if(typeof saved==='boolean')compactPreference=saved}catch(e){}
 setCompact(compactPreference===null?true:compactPreference,false);
 $('compactToggle').onclick=()=>setCompact(!compact);
 window.addEventListener('resize',()=>{if(compactPreference===null&&!atril)setCompact(true,false)});
}

function placeProgramList(inDialog=compact||atril){$(inDialog?'programListHost':'fullProgramHost').append($('partsDisclosure'));$('partsDisclosure').open=true;}

