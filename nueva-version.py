#!/usr/bin/env python3
"""Sube el número de versión en TODOS los sitios a la vez.

Uso (desde la carpeta del proyecto):
    python3 nueva-version.py          -> pasa a la siguiente versión (46 -> 47)
    python3 nueva-version.py 50       -> pasa a la versión 50

Cambia: los ?v=NN de los HTML y de sw.js, el nombre del caché sin conexión,
BUILD en app.js, la etiqueta vNN del menú Opciones y version.json.
Así el caché sin conexión nunca se queda con archivos de otra versión.
"""
import json, pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent
old = json.loads((root / 'version.json').read_text())['version']
new = sys.argv[1] if len(sys.argv) > 1 else str(int(old) + 1)
if not new.isdigit():
    sys.exit('La versión debe ser un número, por ejemplo 47.')

rules = [
    (r'\?v=' + old + r'\b', '?v=' + new),
    (r"cronometro-reunion-v" + old + r"\b", 'cronometro-reunion-v' + new),
    (r"BUILD='" + old + "'", "BUILD='" + new + "'"),
    (r'<small>v' + old + r'</small>', '<small>v' + new + '</small>'),
]
changed = []
for path in sorted(root.iterdir()):
    if path.suffix not in ('.html', '.js') or path.name == 'nueva-version.py':
        continue
    text = path.read_text(encoding='utf-8')
    updated = text
    for pattern, repl in rules:
        updated = re.sub(pattern, repl, updated)
    if updated != text:
        path.write_text(updated, encoding='utf-8')
        changed.append(path.name)
(root / 'version.json').write_text(json.dumps({'version': new}, separators=(',', ':')))
changed.append('version.json')

left = [p.name for p in root.iterdir() if p.suffix in ('.html', '.js') and '?v=' + old in p.read_text(encoding='utf-8')]
print(f'Versión {old} -> {new}. Archivos actualizados: {", ".join(changed)}')
if left:
    sys.exit('Atención: aún queda ?v=' + old + ' en ' + ', '.join(left))
