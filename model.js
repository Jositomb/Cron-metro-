 'use strict';
function newPartId(){return 'p-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10)}
function validTemplatePart(p){return p&&typeof p.title==='string'&&p.title.trim().length>0&&p.title.length<=150&&Number.isFinite(p.min)&&p.min>=0&&p.min<=180&&typeof p.section==='string'&&p.section.length<=100&&typeof p.participant==='string'&&p.participant.length<=120&&Number.isFinite(p.adviceMin)&&p.adviceMin>=0&&p.adviceMin<=10&&validSupport(p)&&validOutline(p)&&(p.role===undefined||p.role===''||p.role==='conclusion')}
function blankPart(p){return {...p,id:p.id||newPartId(),elapsed:0,started:null,done:false,after:{elapsed:0,started:null}}}
function templateOf(session){return {name:session.programName||'Mi reunión',meeting:meetingOf(session.meeting),week:session.programWeek||'',leadInMin:session.leadInMin||0,parts:session.parts.map(p=>({id:p.id||newPartId(),title:p.title,min:p.min,section:p.section||'',participant:p.participant||'',adviceMin:p.adviceMin||0,supportNote:p.supportNote||'',lesson:p.lesson||'',praise:p.praise||'',emphasis:p.emphasis||'',...outlineOf(p),role:p.role||''}))}}

const rehearsalKey='cronometro-rehearsal-v1';let rehearsalActive=false;try{rehearsalActive=localStorage.getItem('cronometro-rehearsal-active')==='1'}catch(e){}
function validSupport(p){return [['supportNote',300],['lesson',120],['praise',250],['emphasis',250]].every(([k,n])=>p[k]===undefined||typeof p[k]==='string'&&p[k].length<=n)}
