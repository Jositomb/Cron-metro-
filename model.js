 'use strict';
function newPartId(){return 'p-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10)}
function validTemplatePart(p){return p&&typeof p.title==='string'&&p.title.trim().length>0&&p.title.length<=150&&Number.isFinite(p.min)&&p.min>=0&&p.min<=180&&typeof p.section==='string'&&p.section.length<=100&&typeof p.participant==='string'&&p.participant.length<=120&&Number.isFinite(p.adviceMin)&&p.adviceMin>=0&&p.adviceMin<=10&&validSupport(p)&&validOutline(p)&&(p.kind===undefined||PART_KINDS.some(([k])=>k===p.kind))&&(p.role===undefined||p.role===''||p.role==='conclusion')}
function blankPart(p){return {...p,id:p.id||newPartId(),elapsed:0,started:null,done:false,after:{elapsed:0,started:null}}}
function templateOf(session){return {name:session.programName||'Mi reunión',meeting:meetingOf(session.meeting),week:session.programWeek||'',leadInMin:session.leadInMin||0,parts:session.parts.map(p=>({id:p.id||newPartId(),title:p.title,min:p.min,section:p.section||'',participant:p.participant||'',adviceMin:p.adviceMin||0,supportNote:p.supportNote||'',lesson:p.lesson||'',praise:p.praise||'',emphasis:p.emphasis||'',...outlineOf(p),role:p.role||'',kind:partKind(p,session.parts)}))}}

const rehearsalKey='cronometro-rehearsal-v1';let rehearsalActive=false;try{rehearsalActive=localStorage.getItem('cronometro-rehearsal-active')==='1'}catch(e){}
function validSupport(p){return [['supportNote',300],['lesson',120],['praise',250],['emphasis',250]].every(([k,n])=>p[k]===undefined||typeof p[k]==='string'&&p[k].length<=n)}

// La apertura y la conclusión no forman parte de la numeración de la guía.
function isUnnumberedPart(parts,index){const p=parts[index];if(!p)return true;if(p.kind==='opening'||p.kind==='conclusion'||p.role==='conclusion'||/^palabras de (introducci[oó]n|apertura|conclusi[oó]n|cierre)/i.test(p.title||''))return true;const treasures=parts.findIndex(x=>x.section==='TESOROS DE LA BIBLIA');return treasures>=0&&index<treasures;}
function numberedPartTitle(parts,index){const p=parts[index];if(!p)return '';if(isUnnumberedPart(parts,index))return p.title;let number=0;for(let i=0;i<=index;i++)if(!isUnnumberedPart(parts,i))number++;return number+'. '+p.title;}
