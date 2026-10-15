# Cronómetro de reunión · versión 10

Reemplaza los archivos de la versión anterior por los de este ZIP. index.html debe quedar en la raíz del repositorio, junto a app.js, style.css y version.json. Conserva la misma dirección web para recuperar la plantilla y los tiempos guardados en ese navegador.

## Uso

- Cada intervención tiene Inicio, Fin y Reinicio. Al iniciar otra, se detiene la anterior.
- El total empieza automáticamente al iniciar una intervención. Sigue contando entre intervenciones. Puedes iniciarlo antes para incluir la canción y la oración.
- Fin de una intervención conserva su tiempo; Inicio lo continúa. Reinicio de una intervención solo borra su contador.
- Siguiente finaliza la intervención seleccionada e inicia la siguiente. Si aún no has seleccionado ninguna, inicia la primera.
- El contador de cada fila muestra el tiempo transcurrido. Debajo del título se indica el tiempo restante o el exceso.
- Ámbar cuando falta un minuto en una parte en marcha; rojo al superar el tiempo. Sin sonidos ni vibración. Un tiempo de 0 minutos significa sin límite.
- El total tiene un objetivo de 105 minutos. «Fin previsto» estima la hora de finalización incorporando las diferencias de las partes finalizadas y el exceso de la parte activa. Es una estimación: no conoce la duración futura de las canciones o de los comentarios del presidente si no los añades a la plantilla. La diferencia se muestra en minutos y segundos respecto al objetivo.
- Modo atril amplía la intervención seleccionada y mantiene visibles el total y los controles. Puedes salir con el botón o con Escape.
- Fin del total detiene todos los tiempos y abre el resumen. Inicio del total permite continuar después.
- Resumen muestra tiempos previstos, reales y diferencias por intervención; se puede abrir en cualquier momento sin pausar.
- Editar permite cambiar títulos, minutos y encabezados de sección, añadir canciones, oraciones, consejos y otras intervenciones. Guardar una plantilla reinicia los tiempos tras confirmación si ya hay tiempos registrados.

## Recuperación

La plantilla y el estado de los contadores se guardan en el navegador. Si recargas o cierras la página, un contador que estaba en marcha incluye el tiempo transcurrido mientras estuvo cerrada. Los que estaban detenidos permanecen detenidos. Se conserva la clave de almacenamiento de la versión anterior.

No se transfieren entre dispositivos o navegadores. Borrar los datos del sitio también borra la plantilla y la sesión. Si el navegador impide guardar, se muestra un aviso. Evita varias pestañas simultáneas para la misma reunión.

## iPhone

Abre la dirección habitual en Safari. Puedes usar Compartir → Añadir a pantalla de inicio. El diseño ajusta las filas a la altura disponible; con muchas intervenciones o texto ampliado se puede desplazar la lista. El modo atril permite leer cómodamente una intervención sin buscarla en la lista.

Solicita mantener la pantalla encendida cuando el navegador lo permite. Los cronómetros usan marcas de tiempo, por lo que no dependen de que Safari siga ejecutando la animación en segundo plano. La comprobación de nuevas versiones no recarga durante una reunión en marcha.

## Archivos

- index.html: interfaz.
- style.css: diseño, colores y modo atril.
- app.js: controles, recuperación, estimación y resumen.
- version.json: versión 8 para actualización.

Se ha comprobado la sintaxis y la lógica de los controles mediante pruebas automatizadas. Falta verificar visualmente la distribución en un iPhone físico.

## Versión 9 · vista compacta para iPad

Pulsa «Vista compacta» para ver el total, la hora prevista, la intervención seleccionada y los botones Inicio/Fin, Reiniciar y Siguiente. «Ver intervenciones» despliega la lista con todos los controles individuales. «Vista completa» vuelve al diseño habitual. La elección se guarda en el navegador; el modo atril sigue disponible en la vista completa.

En un iPad, sin una preferencia guardada, se activa al abrir en una ventana de 660 píxeles de ancho o menos. También puedes elegirla manualmente en cualquier dispositivo. Reducir la ventana no cambia los tiempos ni la plantilla.

Para dejar el cronómetro sobre JW Library en iPadOS 27, abre su dirección en Safari y usa los controles de ventana del iPad para activar Slide Over. La página adapta su contenido; no puede activar Slide Over por sí sola. Después puedes ajustar el tamaño de la ventana. La lista cerrada deja más espacio para leer JW Library.

La vista compacta no introduce sincronización entre iPhone e iPad: cada navegador conserva sus propios datos.


## Versión 10 · consola lateral para dirigir la reunión

Activa «Consola lateral» desde Opciones. Conserva la preferencia de la vista compacta anterior. El total sigue visible arriba y el número central muestra el tiempo RESTANTE de la asignación; cuando se supera, muestra el exceso con signo + y en rojo. El tiempo transcurrido queda debajo en pequeño. El encabezado utiliza el color de la sección de la guía y muestra la próxima intervención.

- Pausa detiene solo la asignación y Continuar retoma su tiempo. El total sigue contando.
- Finalizar marca la asignación como terminada. Úsalo al comenzar tus consejos o al presentar al siguiente participante; el total continúa y aparece un aviso que lo recuerda.
- Siguiente termina la asignación seleccionada e inicia la próxima. Púlsalo cuando comience la nueva intervención.
- Reiniciar borra solo el tiempo de la asignación, tras confirmación.
- Ver intervenciones despliega la lista completa. Opciones reúne la plantilla, el resumen y las otras vistas.

La ventana flotante la activa iPadOS mediante Slide Over. La consola adapta el contenido dentro de esa ventana. La pantalla puede desplazarse si la ventana es muy baja, los títulos son largos o tienes el texto ampliado; los controles principales permanecen agrupados encima de la lista desplegable.

Comprobados la pausa, la reanudación, el tiempo restante, el exceso, el siguiente participante y la continuidad del total mediante pruebas de lógica. La distribución visual queda pendiente de comprobar en el iPad físico.
