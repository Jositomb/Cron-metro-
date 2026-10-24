 'use strict';
function newPartId(){return 'p-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10)}
function validTemplatePart(p){return p&&typeof p.title==='string'&&p.title.trim().length>0&&p.title.length<=150&&Number.isFinite(p.min)&&p.min>=0&&p.min<=180&&typeof p.section==='string'&&p.section.length<=100&&typeof p.participant==='string'&&p.participant.length<=120&&Number.isFinite(p.adviceMin)&&p.adviceMin>=0&&p.adviceMin<=10}
function blankPart(p){return {...p,id:p.id||newPartId(),elapsed:0,started:null,done:false,after:{elapsed:0,started:null}}}
function templateOf(session){return {name:session.programName||'Mi reunión',week:session.programWeek||'',leadInMin:session.leadInMin||0,parts:session.parts.map(p=>({id:p.id||newPartId(),title:p.title,min:p.min,section:p.section||'',participant:p.participant||'',adviceMin:p.adviceMin||0}))}}
