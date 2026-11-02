# Mi Presidencia · versión 56

Cronómetro y bosquejo para presidir la reunión de entre semana y la de fin de semana. Funciona sin conexión y guarda todo en el propio dispositivo.

- **Cómo usarla:** LEEME-MIERCOLES.md
- **Activar la descarga automática de la guía (una sola vez):** ACTIVAR-GUIA.md

## Actualizar a esta versión
1. Antes de nada, exporta una copia desde Opciones › Copia de seguridad.
2. Sube **todos** los archivos del ZIP a la raíz del repositorio, sustituyendo los anteriores. Respecto a la v45 hay archivos nuevos: `heartbeat.js`, `robust.js`, `big-clock.js`, `facil.js`, `unica.js`, `mejoras.css`, `apariencia.css`, `distintivo.css`, `nueva-version.py` y los iconos `icon-180.png`, `icon-192.png` e `icon-512.png`.
3. Deja el workflow de GitHub donde está. Espera a que termine la publicación (marca verde en Actions).
4. Cierra todas las ventanas de la aplicación y vuelve a abrirla. En Opciones debe aparecer **v56**.
5. No borres los datos del navegador: tus preparaciones, programas y trazos se conservan y se convierten solos.

## Corrección de la v56 (importante)
- **Por qué no llegaban las versiones nuevas:** la publicación de GitHub descarga antes la guía de jw.org y, si no podía leer la del bimestre actual, cancelaba toda la publicación, también la de la app. Desde el lunes 2 de noviembre necesita la guía de noviembre-diciembre, así que las v54 y v55 no llegaron a publicarse.
- **Corregido** en `update-guide.py`: la app se publica siempre. La guía se añade solo si se ha podido leer (también se intenta con la del bimestre anterior). Si falla, en Actions sale un aviso amarillo, no un error rojo.
- **Inicio limpio:** ya no aparecen «Continuar mi reunión», «Preparación guardada · continuar» ni «Reunión en curso · continuar» en la pantalla de inicio.

## Novedades de la v55 · el TOTAL desde el principio
- **«Empezar reunión».** Antes de empezar, la barra de abajo (en Dirigir) muestra «Empezar reunión · Canción y oración inicial». Pone en marcha solo el reloj TOTAL, que así cuenta desde la canción.
- Mientras suena la canción, la barra indica «Canción y oración» y ofrece «Iniciar» la introducción cuando toque.
- El ritmo («vamos a tiempo / retraso») cuenta esos minutos. Si no tenías ninguno configurado, se ponen 5 (canción y oración); puedes cambiarlo en Opciones › Organizar asignaciones.
- En Opciones, «Iniciar total» ahora se llama «Empezar reunión (canción y oración)».
- Lo mismo en el fin de semana: «Empezar reunión» y después «Iniciar» el discurso.
- Si prefieres no cronometrar la canción, puedes seguir empezando directamente por la introducción desde su tarjeta.

## Novedades de la v54 · que no te pierdas
- **Deslizar entre asignaciones viene desactivado.** Un roce lateral ya no te cambia de tarjeta. Si lo quieres, actívalo en Opciones › Durante la reunión › Deslizar entre asignaciones. Aun así, pide un deslizamiento claro.
- **«↩ Volver a…» siempre a mano.** Con la reunión en marcha, si consultas otra tarjeta aparece un botón fijo abajo que te devuelve a la asignación en curso (o a la siguiente).
- **El gesto «atrás» de Safari no te saca de la reunión** mientras está en marcha; avisa de que sigues en ella. Desde el icono de la pantalla de inicio ese gesto no existe.
- **«‹ Inicio» pregunta** si la reunión está en marcha (los relojes nunca se detienen al salir).
- **Iniciar fuera de orden pide confirmación:** si con la reunión en marcha pulsas «Iniciar asignación» en una tarjeta que no es la siguiente, pregunta antes.
- Recuerda: la barra inferior sigue siempre el orden del programa, y «Deshacer» revierte el último cambio de cronómetro.

## Novedades de la v53
- **Resaltar la lección con el Apple Pencil.** En las partes de estudiantes, desliza el Pencil sobre el texto de la lección que has pegado y queda resaltado como con un rotulador, ajustado a palabras completas. Hay tres colores (amarillo, verde y rosa). Toca un resaltado para quitarlo; tienes también «Deshacer» y «Quitar todo».
- Con el dedo sigues desplazándote como siempre. Si no tienes el Pencil (por ejemplo, en el iPhone), pulsa «Con el dedo» para resaltar con el dedo y vuelve a pulsarlo para desplazarte.
- Los resaltados van pegados a las palabras, no a la pantalla: se mantienen al cambiar el tamaño de letra y se ven también en Dirigir. Si cambias el texto de la lección, se descartan para no quedar en palabras equivocadas.
- No pasan al otro dispositivo con «Pasar a otro dispositivo»: resalta en el aparato que vayas a usar en la reunión.

## Novedades de la v52
- **Marca «Avisado» junto a cada participante.** En Preparar, junto a cada nombre (participante, acompañante, lector, presidente y oraciones) aparece «Avisar»; tócalo y queda «✓ Avisado». También hay una lista completa en Opciones › Preparar › Avisos a participantes («3 de 9»), y en el fin de semana en Herramientas de la reunión.
- Si cambias a un participante, su marca se quita sola. Al preparar una reunión nueva, todo empieza sin marcar. En Dirigir las marcas no se muestran en las tarjetas.
- Se actualiza sola desde la v51: no hace falta cerrar nada.

## Corrección de la v51 (importante)
- **Por qué Safari no se actualizaba:** la publicación de GitHub (`update-guide.py`) solo copiaba archivos .html, .js, .css, .json, .svg y .webmanifest. Los iconos .png de la v49 no se publicaban, el sistema sin conexión no podía guardarlos y rechazaba toda la actualización. Los navegadores que ya tenían la app instalada, como Safari, se quedaban en la versión anterior.
- **Corregido:** `update-guide.py` publica también los .png. Además, si en el futuro faltara un archivo opcional (un icono), la actualización se instalará igual, las páginas se piden siempre recién publicadas y nunca se mezclan archivos de dos versiones.
- **Nueva página `actualizar.html`** (también en Opciones › Copias y datos › Forzar actualización). Borra solo la copia sin conexión, nunca tus datos, y abre la versión publicada.

## Novedades de la v50
- **Actualización automática y segura.** Al publicar una versión nueva, la app se actualiza sola en cuanto no hay ningún cronómetro en marcha ni nada a medio editar, también en una pestaña de Safari que se quedó abierta. Si hay una reunión en curso, espera a que termine y en Opciones indica «se aplicará al terminar la reunión».
- **Una vez, para pasar a la v50 en Safari:** cierra del todo la pestaña de la app (en el selector de pestañas, desliza para cerrarla) y vuelve a abrir el enlace. Si aún sale la versión anterior, ciérrala y ábrela otra vez. A partir de la v50 ya no hará falta.

## Novedades de la v49
**Funciones propias**
- **Frases de presentación.** Cada asignación con participante muestra una frase sugerida para presentarla, con el agradecimiento a la parte anterior, la sección, el tema y los nombres. En Preparar, «Usar y editar» la convierte en tu texto para retocarlo. En Dirigir desaparece cuando la parte ya ha empezado.
- **Ayuda para recuperar tiempo.** Con más de 1 min de retraso, bajo el ritmo aparece dónde recuperarlo, por ejemplo: «Para recuperar 02:10: Parte de vida cristiana −2 min · Conclusión −1 min».
- **Consejo con un toque.** En las partes de estudiantes, fichas para marcar qué encomiar y qué mejorar mientras hablan. Durante el consejo se destacan con un resumen grande. Complementa el cuaderno del Pencil.
- **Cuenta atrás y «Antes de empezar».** En Opciones › Preparar › Día y hora de la reunión. La pantalla de inicio muestra la próxima reunión. Desde una hora antes, la reunión enseña «Empieza en 07:46» y una lista para marcar: presidente, canciones, oraciones, participantes, audio y modo No molestar.
- **Tu historial.** Opciones › Durante la reunión › Tu historial. Se guarda al pulsar Finalizar reunión (en el modo ensayo no se guarda) e incluye las reuniones anteriores que ya tenías. Muestra la duración media y en qué partes tiendes a pasarte o a quedarte corto.

**Toque distintivo**
- **Reloj TOTAL por secciones:** el anillo de 105 min dividido en los colores de cada sección; en el fin de semana, discurso y estudio.
- **Columna de progreso** a la izquierda, con los colores de sección y un punto que avanza con la reunión.
- **Títulos con letra editorial** («New York» en iPad e iPhone); los números siguen en la letra actual.
- **Icono propio** para la pantalla de inicio: el reloj con el anillo por secciones. Para verlo, borra el icono antiguo y vuelve a añadirla.
- **Atril oscuro** opcional (Opciones › Durante la reunión), que se recuerda en cada dispositivo.
- **Latido suave** del tiempo en los últimos 10 segundos y transición suave al cambiar de asignación.

## Novedades de la v48
**Más fácil de usar**
- **Barra fija abajo en Dirigir:** muestra la asignación, el tiempo restante y un solo botón que hace el siguiente paso (iniciar, finalizar, finalizar consejo, iniciar la siguiente, finalizar reunión), con Pausa y Reloj grande al lado. Sigue siempre el orden del programa. Para saltarte el orden, usa «Iniciar asignación» en la tarjeta que quieras. Tocar el nombre lleva a esa tarjeta. En Preparar solo aparece si hay un cronómetro en marcha.
- **Opciones por bloques:** Durante la reunión, Preparar, Copias y datos, y Empezar de nuevo (en rojo y al final).
- **Preparación guiada:** «Revisar preparación» pregunta los datos que faltan uno a uno (participantes, acompañantes y canciones). Escribes, pulsas «Guardar y seguir» o «Saltar».
- **Deslizar a los lados** en Dirigir para pasar a la asignación siguiente o anterior sin abrir ni cerrar tarjetas. No afecta al cuaderno del Pencil ni a los campos de texto.
- **Solo dos vistas:** Preparar y Dirigir. Las vistas antiguas, que ya estaban ocultas, se han retirado del menú.

**Apariencia, con el mismo estilo**
- Un solo botón destacado por tarjeta; el resto con borde fino.
- El anillo de cada reloj se va vaciando con el color de su sección (Apertura, Tesoros, Maestros, Vida cristiana) y pasa a ámbar y rojo al final.
- En Preparar, los datos vacíos se agrupan en una línea: «＋ Completar 3 datos: presidente, canción inicial…».
- Iconos coherentes en todos los botones y un lápiz de edición más claro, que desaparece en Dirigir.
- Etiquetas pequeñas algo más grandes para leerlas desde el atril.

Si algo de la v48 no te convence antes de la reunión, vuelve a subir la v47: los datos son compatibles en los dos sentidos.

## Corrección v47
- El menú Opciones se abría a mitad de lista en el iPad: la cabecera quedaba en medio y no se podía llegar a las primeras opciones. Ahora empieza arriba y se desplaza entero.

## Novedades de la v46
**Más segura durante la reunión**
- **Trazos del Apple Pencil hasta 2,5 veces más ligeros.** Se guardan con la precisión que se ve en pantalla, y las notas que ya tenías se convierten solas al abrir. Además, «Deshacer» ya no duplica los trazos, así que el espacio ya no se agota tras unas semanas de notas a mano.
- **Espacio usado visible** al final del menú Opciones, con aviso cuando pasa del 70 %.
- **Protección del almacenamiento.** La aplicación pide a Safari que no borre sus datos. Para que surta efecto, instálala en la pantalla de inicio (Compartir › Añadir a pantalla de inicio).
- **Pantalla siempre encendida** con cualquier cronómetro en marcha, también en el fin de semana. Antes solo funcionaba con el reloj TOTAL.
- **Un único reloj interno** en lugar de cinco, que se detiene cuando la pantalla está oculta y así gasta menos batería. Los tiempos no se alteran porque se calculan con la hora real.
- **Aviso en rojo** en la franja superior si el navegador no puede guardar.

**Más clara al dirigir**
- **Reloj grande.** El botón ⛶ junto a cada cronómetro abre el tiempo restante a pantalla completa: verde en marcha, ámbar en el último minuto (en el consejo, en los últimos 15 s) y rojo al pasarse. Desde ahí puedes finalizar, pausar, pasar al consejo e iniciar la siguiente asignación. Un doble toque accidental solo cuenta una vez.
- **Un solo menú «•••».** «Pasar a otro dispositivo» y el estado de guardado están ahora en Opciones; en el fin de semana, en Herramientas de la reunión. Reiniciar es un botón pequeño junto al cronómetro y sigue pidiendo confirmación.
- **Menú Opciones corregido.** Antes se partía en dos columnas y la segunda («Resumen», «Deshacer», «Elegir próxima») quedaba fuera de la pantalla.
- **Menos repeticiones.** «Añadir presidente» ya no sale dos veces y el tiempo restante cabe en una línea («Quedan 01:00»).
- **Franja superior más limpia en el iPhone**, en una sola línea.

**Pasar la reunión al iPhone en un toque**
- «Enviar reunión preparada», «Exportar copia» y «Copia de seguridad» abren la hoja de Compartir: AirDrop, Mensajes o Guardar en Archivos.

## Para futuras versiones
Ejecuta `python3 nueva-version.py`. Cambia el número de versión en todos los archivos a la vez (HTML, caché sin conexión, `app.js`, menú y `version.json`), para que ninguna pieza se quede atrás.

## Comprobado antes de entregar
Se ha simulado una reunión completa (asignaciones, pausas, consejo, recarga de la página y fin de semana) con la v45 y con la v46, y los tiempos y datos guardados coinciden. También se ha comprobado que los datos de la v45 se abren sin cambios. La interfaz se ha revisado en tamaño iPad (vertical y horizontal) e iPhone, sin errores. Antes del miércoles, conviene probarla en Safari real y con el Apple Pencil.
