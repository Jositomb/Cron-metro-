# Cronómetro de reunión · versión 21

## Actualizar

Copia todos los archivos de este ZIP a la raíz de tu sitio, conservando la misma dirección. La interfaz usa ahora app.css y varios archivos JavaScript separados: es importante subirlos todos. Los archivos style.css y theme.css antiguos ya no se utilizan. No borres los datos del sitio: la plantilla y la sesión se migran automáticamente.

## Preparar → Dirigir → Terminar

En Opciones → Programas semanales puedes guardar el programa actual con nombre y fecha de semana, duplicar un programa o cargar uno para dirigirlo. Después de cargarlo, usa Consultar / preparar reunión para ajustar partes, participantes y minutos.

Cargar un programa inicia una sesión nueva tras confirmación si hay tiempos. Antes guarda un resumen de la sesión actual en Reuniones anteriores. Guardar un programa o duplicarlo no modifica los contadores.

Durante la reunión se conserva la pantalla sencilla, los dos círculos, los colores y el botón principal. Finalizar asignación abre los consejos; Iniciar siguiente pone en marcha al siguiente hermano. Pausa y Deshacer siguen disponibles, junto con los controles individuales de Programa y las otras vistas.

Al finalizar el total se abre el resumen. Preparar otra reunión lleva a los programas, sin borrar tiempos hasta que decidas cargar uno. Se conservan los últimos 30 resúmenes locales.

## Editar sin reiniciar

Corregir nombres, títulos, minutos, secciones o consejos conserva los tiempos, el total y la asignación en curso. La edición sigue bloqueada durante la sesión hasta que la desbloquees expresamente.

Las partes tienen identidad estable: una corrección no crea una asignación nueva. No se permite quitar una fila que ya tiene tiempos o está en marcha; puedes corregirla o comenzar otra sesión. Añadir o retirar una fila futura sin tiempos conserva el resto. Guardar la edición elimina el paso anterior de Deshacer para evitar restaurar un programa incompatible, pero conserva los cronómetros.

Reiniciar continúa siendo una acción independiente y pide confirmación.

## Recuperación

Al volver a abrir una reunión sin finalizar, aparece Hay una reunión en curso. Continuar conserva todos los contadores; Finalizar detiene la reunión y muestra el resumen. Los contadores que estaban en marcha incluyen el tiempo transcurrido con la app cerrada. El aviso no reinicia ni pausa automáticamente.

## Copia de seguridad

Opciones → Copia de seguridad permite descargar un JSON con los programas, los resúmenes y una plantilla de la sesión actual sin sus cronómetros en marcha. Puedes guardarlo en Archivos e importarlo en el iPad o el iPhone.

Importar valida el archivo antes de guardar y añade programas sin sobrescribir la sesión actual. No es sincronización automática. Importar una copia varias veces añade copias adicionales. Tamaño máximo de importación: 1 MB. La biblioteca tiene un límite de 200 programas y 700 KB para proteger el guardado local.

## Apertura sin conexión

Requiere servir el sitio por HTTPS y abrirlo una primera vez con internet. En Opciones espera a ver Disponible sin conexión en este dispositivo. Después podrás abrirlo desde esa misma dirección o desde su acceso de pantalla de inicio sin conexión, mientras Safari conserve los datos del sitio.

La primera visita sin internet no puede funcionar. Si borras los datos del navegador o este los elimina, abre de nuevo con internet para preparar la copia local. El guardado de programas y cronómetros se realiza en ese navegador; no depende de internet ni se comparte automáticamente entre dispositivos.

La instalación de una actualización no sustituye la versión mientras una ventana anterior permanezca abierta. Al terminar una reunión, cierra las ventanas del cronómetro y vuelve a abrirlo para activar una actualización pendiente. No se fuerza la recarga durante una reunión en marcha.

## Estructura

- model.js: identidad y validación de las partes y programas.
- timers.js: cálculo y control básico del tiempo.
- storage.js: guardado de la sesión compatible con versiones anteriores.
- app.js: flujo de presidencia, presentación y controles.
- programs.js: programas semanales, resúmenes, copias y recuperación.
- offline.js / sw.js: preparación y caché para abrir sin conexión.
- app.css: estilos consolidados, conservando el orden de la apariencia anterior.
- index.html, manifest.webmanifest, icon.svg y version.json: interfaz e instalación.

## Verificación

Superadas pruebas de lógica para editar conservando tiempos, migración, guardar/duplicar/cargar semanas, archivar una sesión, recuperar la reunión en curso, importar sin alterar el estado y rechazar copias inválidas. Comprobadas también las funciones anteriores de reloj, anillos, consejos, doble toque, deshacer, preparación de partes, pausa, vistas y resumen.

El manejador sin conexión se comprobó con una caché simulada que sirve página y scripts sin red. La instalación real del service worker y la apertura en modo avión quedan pendientes de comprobar en Safari del iPad; no se dispone de un navegador instalado en este entorno para esa prueba. Verificados sintaxis de todos los scripts, HTML, controles, referencias y ZIP.


## Versión 20 · apoyo personal y ensayo

En Consultar / preparar reunión, cada intervención permite añadir opcionalmente:

- Nota de apoyo (300 caracteres).
- Lección que trabaja el estudiante (120 caracteres).
- Qué encomiar y qué destacar (250 caracteres cada una).

La nota se muestra plegada bajo el contador. Al finalizar una asignación con consejos, aparece la tarjeta de consejo con tus notas, abierta para consultarla. Puedes plegarla. Si no has escrito nada no se muestra ningún panel. Los textos son tuyos: no se genera ni importa automáticamente el consejo. Se conservan al guardar, duplicar y exportar programas.

Opciones → Modo ensayo abre una sesión de práctica con el mismo programa y los tiempos a cero, separados del almacenamiento real. Una franja ENSAYO recuerda el modo y permite salir. Puedes probar botones y editar notas o nombres: al salir vuelve la sesión real intacta. Si cierras la página durante el ensayo, se recupera ese ensayo y el botón Salir vuelve a la reunión real.

Para proteger una reunión que está en curso, no se permite entrar en ensayo mientras la sesión real no esté finalizada. Durante el ensayo, la gestión de programas y copias reales se bloquea: sal primero del ensayo. La práctica no se añade a Reuniones anteriores. El total y las notas reales se conservan. Las opciones de guardar en el navegador son necesarias para usar el ensayo.

Se añaden support.js y sus recursos a la caché sin conexión. Actualiza todos los archivos. Se comprobaron la visibilidad de notas y consejos, su conservación en programas, la separación de almacenamiento de ensayo, su recuperación y salida, y el bloqueo de modificaciones en programas reales durante la práctica. Siguen pasando las pruebas de edición sin reiniciar, programas, archivo, recuperación y copia. El mecanismo offline se verificó con una caché simulada; la prueba visual y la apertura en modo avión en Safari siguen pendientes en el iPad físico.


## Versión 21 · secciones desplegables

La pantalla se abre por defecto en la vista por secciones, inspirada en la referencia: Apertura, Tesoros, Seamos mejores maestros y Nuestra vida cristiana, con sus colores. Cada sección contiene las intervenciones de tu plantilla y cada intervención puede plegarse para dejar solo el título y su estado.

Al iniciar una asignación se abre su sección y se pliegan las demás; la asignación actual se despliega. Al finalizar se mantiene esa parte abierta para dar el consejo. Iniciar siguiente avanza cuando tú lo pulsas y abre la sección que corresponda. Puedes desplegar otras secciones o partes manualmente sin iniciar ni detener nada.

Cada parte muestra el tiempo transcurrido, el restante, su participante y controles. Si lleva consejos, muestra un contador separado que empieza al finalizar la asignación. En Notas y apoyo puedes escribir una nota breve y consultar tu tarjeta de consejos. La nota se guarda en la sesión actual; guarda el programa semanal si quieres conservarla también en esa plantilla.

El total continúa visible arriba. Para volver al reloj de cristal, usa Opciones → Volver al reloj. Opciones → Vista por secciones recupera esta vista. Se recuerda tu elección. La vista completa y el modo atril siguen disponibles.

No se pierde ninguna función anterior. Si eliges iniciar una parte mientras otra está en marcha, se pide confirmación antes de cambiar. La tarjeta de la parte actual mantiene el flujo Finalizar asignación → consejo → Iniciar siguiente, para separar los tiempos.

Verificados la estructura de secciones, la apertura automática, el plegado manual sin alterar tiempos, los consejos separados, el avance a otra sección, las notas, la recuperación de la vista y la alternancia con el reloj. Siguen pasando las comprobaciones de programas, edición, copias y ensayo. Recursos offline comprobados mediante caché simulada. La revisión visual en el iPad y el modo avión real quedan pendientes.
