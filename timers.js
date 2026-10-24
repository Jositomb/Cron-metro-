'use strict';
// Motor de tiempo: no almacena datos ni modifica la interfaz.
function cleanTimer(t){return {elapsed:Number.isFinite(t?.elapsed)&&t.elapsed>=0?t.elapsed:0,started:Number.isFinite(t?.started)&&t.started>0?t.started:null}}
function stop(t){t.elapsed=value(t);t.started=null}
function resetTimer(t){t.elapsed=0;t.started=null;t.done=false}