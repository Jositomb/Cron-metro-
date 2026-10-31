# Mi Presidencia · versión 46

Cronómetro y bosquejo para presidir la reunión de entre semana y la de fin de semana. Funciona sin conexión y guarda todo en el propio dispositivo.

- **Cómo usarla:** LEEME-MIERCOLES.md
- **Activar la descarga automática de la guía (una sola vez):** ACTIVAR-GUIA.md

## Actualizar a esta versión
1. Antes de nada, exporta una copia desde Opciones › Copia de seguridad.
2. Sube **todos** los archivos del ZIP a la raíz del repositorio, sustituyendo los anteriores. Hay cinco archivos nuevos: `heartbeat.js`, `robust.js`, `big-clock.js`, `mejoras.css` y `nueva-version.py`.
3. Deja el workflow de GitHub donde está. Espera a que termine la publicación (marca verde en Actions).
4. Cierra todas las ventanas de la aplicación y vuelve a abrirla. En Opciones debe aparecer **v46**.
5. No borres los datos del navegador: tus preparaciones, programas y trazos se conservan y se convierten solos.

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
