'use strict';
// Una única vista: bosquejo y controles dentro de las secciones.
document.body.classList.toggle('outline-mode',true);setSections(true,false);
for(const id of ['outlineToggle','sectionsToggle','compactToggle','atril'])$(id).hidden=true;
let font=18;try{const saved=Number(localStorage.getItem('cronometro-outline-font'));if([16,18,20,22,26].includes(saved))font=saved}catch(e){}
function applyOutlineFont(size){document.body.style.setProperty('--outline-font',size+'px');$('outlineFont').value=String(size)}
applyOutlineFont(font);$('outlineFont').onchange=()=>{const size=Number($('outlineFont').value);if(![16,18,20,22,26].includes(size))return;applyOutlineFont(size);try{localStorage.setItem('cronometro-outline-font',String(size))}catch(e){}};
$('programOpen').hidden=true;$('edit').textContent='Organizar asignaciones';$('meetingEditor').hidden=true;
