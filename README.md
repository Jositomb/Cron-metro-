# Cronómetro de reunión · versión 18

## Actualización

Sustituye los archivos anteriores por los de este ZIP. Mantén index.html en la raíz, junto a app.js, style.css y version.json. Mantener la misma dirección web y el mismo navegador permite recuperar la plantilla y la sesión de la versión anterior.

## Modo Presidencia

La vista sencilla aparece por defecto al actualizar a esta versión. Después se recuerda la vista que elijas. En Opciones puedes volver a Vista completa, Modo atril o Vista sencilla sin cambiar los tiempos.

El número central muestra el tiempo restante de la asignación. Cuando se supera, aparece el exceso con signo + y color rojo. El total permanece arriba y la siguiente intervención debajo, con el nombre del participante si lo preparaste.

El botón grande cambia según el momento:

1. Iniciar asignación / Continuar asignación: inicia o retoma el contador.
2. Finalizar asignación: detiene el tiempo del estudiante y comienza un contador separado de consejos o transición. NO inicia la siguiente asignación.
3. Iniciar siguiente: detiene el contador de consejos y comienza la siguiente asignación cuando el hermano empiece a hablar.

El total sigue contando durante los consejos y las presentaciones. Pausa detiene únicamente la asignación; el botón grande permite continuarla. En la última intervención, tras finalizarla, termina el total desde su botón superior cuando corresponda.

Deshacer último cambio recupera el estado anterior de las asignaciones, los consejos y la selección. Sirve para corregir una finalización o un inicio equivocados y conserva el total real. Guarda una sola acción: no es un historial ilimitado. Si recuperas una asignación que estaba en marcha, su tiempo incluye el intervalo desde la pulsación equivocada. Esta recuperación también se conserva al recargar. Reiniciar la reunión o terminar el total elimina ese paso de deshacer.

Ver intervenciones despliega la lista con controles individuales. Opciones reúne Preparar reunión, Resumen, Reiniciar reunión, Reiniciar asignación y los cambios de vista. Los reinicios piden confirmación.

## Preparar reunión

Puedes cambiar títulos, duración, secciones, participantes y minutos de consejos. Se sugieren 1 minuto para la lectura y las asignaciones de Seamos mejores maestros al migrar plantillas antiguas. Revisa los valores según tu programa: no son una importación automática de la guía ni una asignación oficial de tiempos. Pon 0 si la parte no lleva consejos.

Indica también cuántos minutos prevés entre el inicio del total y la primera asignación. Usa 0 si inicias el total al empezar las palabras de introducción. Si lo inicias antes, introduce el tiempo previsto para esa apertura. Puedes añadir otras transiciones como filas si necesitas que cuenten en el programa preparado.

Guardar la preparación reinicia los tiempos tras confirmación. Prepárala antes de la reunión.

## Ritmo y hora prevista

El indicador compara el total real con el punto del programa en el que estás: minutos previos, duración de las partes anteriores, consejos previstos y avance de la parte o de los consejos actuales. Muestra Vamos a tiempo dentro de un margen de 30 segundos, o el margen/retraso en minutos y segundos.

La hora de finalización utiliza un objetivo de 105 minutos y ajusta la estimación según ese ritmo. No conoce tiempos futuros que no hayas incluido; conviene preparar todas las partes y transiciones relevantes. Si omites una parte saltando directamente a otra, la referencia temporal sigue siendo el orden de la plantilla.

## Colores y resumen

Conserva los colores de las secciones. Durante una asignación, ámbar cuando falta un minuto y rojo al exceder el tiempo. Los consejos muestran rojo si superan el tiempo que les hayas preparado. No emite sonidos ni vibraciones.

Fin del total detiene asignaciones y consejos y abre el resumen. Puedes abrirlo antes desde Opciones sin detener nada. Muestra tiempos previstos, reales, diferencias y una columna separada para consejos/transición.

La vista completa, el modo atril y el modo Presidencia usan el mismo botón por etapas. Finalizar asignación nunca inicia la siguiente; abre un intervalo separado de consejos/transición. Iniciar siguiente comienza la próxima asignación únicamente cuando tú lo pulses. El contador de consejos se muestra también en las otras vistas.

## iPad junto a JW Library

Abre el cronómetro en Safari y activa Slide Over desde los controles de ventana del iPad. Colócalo junto a JW Library y usa Modo Presidencia. La página adapta su contenido: la ventana flotante la gestiona iPadOS.

Los controles principales quedan agrupados sobre la lista plegable. Si la ventana es muy baja, los títulos son largos o amplías el texto, puede ser necesario desplazarla.

## Conservación de datos

La plantilla y los cronómetros se guardan en este navegador. Un contador en marcha sigue incluyendo el tiempo transcurrido al cerrar o recargar. Un contador detenido permanece detenido. Borrar los datos del sitio elimina la sesión. No existe sincronización entre dispositivos; evita usar varias pestañas para la misma reunión.

La aplicación solicita mantener la pantalla encendida cuando el navegador lo permite. No recarga por actualizaciones mientras el total está en marcha.

## Verificación

Comprobados mediante pruebas de lógica: recuperación de datos anteriores, cuenta atrás, avisos, pausa, finalización, consejos separados, botón por etapas, deshacer persistente, continuidad del total, ritmo, cambios de vista y resumen. Verificados la sintaxis y el contenido del ZIP. Queda pendiente comprobar la distribución visual en tu iPad físico.


## Versión 13 · interacción más segura

- Cuando hay un participante preparado, el botón de inicio muestra su nombre: «Iniciar a Manuel». Si no indicas un nombre, conserva una etiqueta genérica. Finalizar siempre detiene la asignación antes del consejo.
- Las acciones de inicio, fin y pausa tienen una protección de 0,9 segundos frente a un segundo toque accidental. Los botones principales se desactivan brevemente; Deshacer sigue disponible.
- El encabezado identifica el momento: ASIGNACIÓN, CONSEJOS o PRESENTACIÓN. Si una parte lleva consejos, su intervalo posterior incluye tus consejos y la presentación hasta que inicias la siguiente; nunca se añade al tiempo de ninguno de los estudiantes. Las partes con consejos a 0 muestran PRESENTACIÓN al terminar.
- En Opciones → Dejar una parte preparada, o desde Elegir próxima sin iniciar, puedes elegir la próxima intervención durante una canción o vídeo. Esto no inicia, pausa ni reinicia ningún contador. La parte elegida queda marcada como preparada. Tras finalizar la asignación actual, el botón principal iniciará esa parte cuando lo pulses. Puedes elegir otra; el último cambio se puede deshacer. Si todavía no hay asignación seleccionada, el botón inicial arranca la preparada. El ritmo sigue referido al orden original de la plantilla si saltas intervenciones.
- Consultar / preparar reunión abre el programa en modo de consulta mientras la reunión está en curso, incluso si has pausado el total. Para cambiarlo, pulsa Desbloquear edición y confirma. Guardar la preparación sigue pidiendo confirmación y reinicia los tiempos. Consultar, desbloquear o cancelar por sí solos no cambian los tiempos.

Comprobados la protección de doble toque, los nombres, la preparación sin modificar tiempos, su recuperación al recargar, deshacer, el bloqueo de edición, los momentos, la separación de consejos, los avisos, el resumen y el reinicio. La distribución visual en el iPad físico sigue pendiente de comprobar.


## Versión 14 · todo conservado, pantalla simplificada

La pantalla habitual muestra únicamente:

- Total de reunión y una frase sobre el ritmo.
- Asignación, participante y contador grande.
- Un botón principal que cambia entre finalizar y comenzar al siguiente.
- Pausa y Deshacer como acciones secundarias.
- La próxima intervención.

Programa abre la lista completa y permite dejar una parte preparada sin iniciarla. Los controles individuales siguen disponibles allí; iniciar una intervención cierra el programa y vuelve al cronómetro. En Vista completa, la lista sigue visible en la pantalla principal.

Opciones reúne el inicio del total, Finalizar reunión, la preparación/consulta bloqueada, el resumen, los reinicios protegidos y los cambios de vista. Tiempo y previsión despliega el objetivo, el tiempo restante de reunión y la hora prevista que antes ocupaban espacio en la pantalla principal. El total empieza automáticamente al iniciar una asignación; si quieres incluir antes la canción y la oración, usa Opciones → Iniciar total.

Se mantienen los nombres, la protección contra el doble toque, la selección sin iniciar, los consejos separados, la recuperación al recargar y la opción de deshacer. Abrir Programa u Opciones no detiene ni reinicia los tiempos.

Comprobados mediante pruebas de lógica: funciones anteriores, vista sencilla inicial, apertura y cierre del programa, consulta sin alterar los contadores y persistencia de la vista elegida. También se comprobaron sintaxis, estructura HTML y referencias de controles. La distribución visual en el iPad físico queda pendiente.


## Versión 15 · estilo de Mi Servicio

Renovación visual inspirada en Mi Servicio V257: metal cepillado, cristal, tarjetas con relieve, botones con bisel y tipografía del sistema. El modo claro utiliza plata y el modo oscuro materiales más oscuros; se adapta a la apariencia elegida en el dispositivo.

El contador se presenta en una esfera de cristal con un anillo fino. El anillo se vacía según el tiempo restante de la asignación. En consejos, el número sigue mostrando el tiempo transcurrido y el anillo refleja los minutos de consejos previstos; en partes o transiciones sin límite no se muestra un arco de progreso. El ámbar y el rojo continúan indicando los avisos. Los colores de la guía permanecen como detalles de la sección.

Iniciar utiliza un botón azul; Finalizar utiliza un acabado metálico. La etiqueta escrita sigue indicando la acción, sin depender del color. Los materiales tienen reflejos estáticos. El movimiento del anillo respeta la preferencia de reducir movimiento.

IMPORTANTE: incluye también theme.css al sustituir los archivos. La distribución, los accesos Programa/Opciones y todas las funciones anteriores se conservan. No se ha cambiado la clave de datos ni se reinician la sesión o la plantilla al actualizar.

Pruebas de lógica superadas para el anillo, consejos, fases, protección de doble toque, nombres, recuperación de tiempos, selección preparada, deshacer, consulta, bloqueo de edición, avisos, pausa, vistas, resumen y reinicio. Verificados sintaxis, estructura y ZIP. No se ha realizado una comprobación visual en un iPad físico.


## Versión 16 · total circular y cabecera compacta

El total de reunión tiene ahora su propio círculo de cristal, más pequeño que el de la asignación. Su anillo se completa al llegar al objetivo de 105 minutos; al superarlo cambia al color de aviso, sin detener el contador.

La cabecera queda en una sola fila: Reunión, Programa y Opciones. El subtítulo se oculta y el menú Opciones empieza plegado tanto en la vista sencilla como en la completa. Cuando lo abres aparece sobre el contenido, en vez de ocupar altura y empujar el cronómetro. Se cierra al elegir una acción, tocar fuera o pulsar Escape.

La tarjeta del total presenta el círculo y el indicador de ritmo a su lado. En ventanas más bajas, el círculo se reduce para ahorrar espacio. Los tiempos, las asignaciones y las preferencias se mantienen.

Comprobados el avance del anillo de total, su exceso y recuperación, el menú plegado en ambas vistas y la lógica anterior. Verificados HTML, referencias y ZIP. Queda pendiente la comprobación visual en el iPad físico.


## Versión 17 · pulido visual sin nuevos pasos

La vista sencilla reúne los dos relojes en un único panel de cristal: el total pequeño ocupa la esquina superior derecha y la asignación mantiene el reloj central. Los bordes y reflejos son más suaves, con menos sombras. El nombre del participante se destaca por encima del título; si no hay nombre, el título gana protagonismo.

El contador cambia ligeramente de tono al pasar a CONSEJOS, sin desplazar los controles. La transición respeta Reducir movimiento. La próxima intervención se muestra en una franja compacta con nombre y minutos. El acabado claro/oscuro y los colores de sección se conservan.

No cambia la lógica de los cronómetros, las etiquetas de los botones ni los pasos para finalizar, dar consejos e iniciar al siguiente. Tampoco cambia los datos guardados. Para actualizar, sustituye todos los archivos, incluido theme.css.

Verificados: sintaxis, estructura HTML, referencias, ZIP, anillos, cambio de fase y sección del panel, consejos separados, nombres, bloqueo de doble toque, recuperación de tiempos, preparación sin iniciar, deshacer, consulta, bloqueo de edición, avisos, pausa, vistas, resumen y reinicio. La distribución visual en el iPad físico queda pendiente de comprobar.


## Versión 18 · cristal azul y mayor contraste

El reloj principal utiliza cristal azul profundo y números blancos. Durante los consejos adopta un tono cálido; la presentación usa azul grisáceo. Las etiquetas escritas identifican cada momento. El ámbar y el rojo siguen diferenciando los avisos de tiempo.

La intervención actual tiene más presencia y la próxima aparece en una franja discreta. Iniciar conserva el botón azul y Finalizar el metálico, con una respuesta breve al pulsar. No se añade ningún paso ni control. Reducir movimiento desactiva la animación de pulsación.

El reloj se amplía cuando hay más espacio y se recoge en ventanas estrechas o bajas, usando el ancho real del contenido y la altura disponible. En ventanas muy pequeñas o con texto ampliado puede ser necesario desplazar la pantalla.

La sesión, la plantilla y los pasos de presidencia no cambian. Para actualizar, sustituye todos los archivos del ZIP, incluido theme.css. La lógica anterior supera sus comprobaciones; queda pendiente la revisión visual en el iPad físico.
