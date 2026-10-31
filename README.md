# Mi Presidencia · versión 48

Cronómetro y bosquejo para presidir la reunión de entre semana y la de fin de semana. Funciona sin conexión y guarda todo en el propio dispositivo.

- **Cómo usarla:** LEEME-MIERCOLES.md
- **Activar la descarga automática de la guía (una sola vez):** ACTIVAR-GUIA.md

## Actualizar a esta versión
1. Antes de nada, exporta una copia desde Opciones › Copia de seguridad.
2. Sube **todos** los archivos del ZIP a la raíz del repositorio, sustituyendo los anteriores. Respecto a la v45 hay siete archivos nuevos: `heartbeat.js`, `robust.js`, `big-clock.js`, `facil.js`, `mejoras.css`, `apariencia.css` y `nueva-version.py`.
3. Deja el workflow de GitHub donde está. Espera a que termine la publicación (marca verde en Actions).
4. Cierra todas las ventanas de la aplicación y vuelve a abrirla. En Opciones debe aparecer **v48**.
5. No borres los datos del navegador: tus preparaciones, programas y trazos se conservan y se convierten solos.

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
