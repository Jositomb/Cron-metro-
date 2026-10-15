# Cronómetro de reunión · versión 8

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
