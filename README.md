# Cronómetro de reunión · versión 13

## Actualización

Sustituye los archivos anteriores por los de este ZIP. Mantén index.html en la raíz, junto a app.js, style.css y version.json. Mantener la misma dirección web y el mismo navegador permite recuperar la plantilla y la sesión de la versión anterior.

## Modo Presidencia

En Opciones elige Modo Presidencia. Si ya usabas la vista compacta, se conserva tu preferencia y aparece este modo automáticamente. El iPad también puede activarlo por defecto al abrir en una ventana estrecha, si aún no elegiste una vista.

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
