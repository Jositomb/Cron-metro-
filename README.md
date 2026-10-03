# Cronómetro de reunión

Plantilla editable para la reunión de entre semana. Los títulos y minutos iniciales son orientativos: ajusta las intervenciones a la guía de actividades de cada semana mediante **Editar**.

- Las canciones y oraciones no aparecen en la lista de asignaciones. El total de la reunión sigue contando durante ellas si está iniciado.
- Cada intervención tiene Inicio, Fin y Reinicio. La activa se resalta en verde con borde luminoso y la indicación EN CURSO.
- Al iniciar otra intervención se detiene la anterior y sigue el total de reunión.
- El total cuenta también las transiciones entre partes. Fin del total detiene todos los relojes; su Reinicio pide confirmación y reinicia todos.
- Los tiempos se conservan en el navegador del dispositivo. El cálculo usa la hora del dispositivo para recuperar el tiempo tras pasar a segundo plano. Evita cambiar la hora durante la reunión.
- Diseño compacto para iPhone. Si añades muchas partes o usas texto ampliado, puedes desplazarte.

## Subir a GitHub

1. Descomprime el ZIP en Archivos.
2. Abre tu repositorio y elige **Add file → Upload files**.
3. Sube index.html, style.css, app.js y version.json a la raíz del repositorio, junto con este README si lo deseas, y confirma con **Commit changes**.
4. Para publicarlo, abre **Settings → Pages** y selecciona **Deploy from a branch**, rama **main**, carpeta **/(root)**. Guarda y usa el enlace que muestre GitHub al terminar.
5. En Safari abre ese enlace y usa **Compartir → Añadir a pantalla de inicio**.

No necesita instalaciones, cuentas ni dependencias. La primera carga requiere conexión. Mantén la pantalla encendida durante el uso.

## Actualizaciones

Esta versión comprueba version.json al abrirse, al volver a primer plano y cada minuto. Si hay una versión nueva, recarga automáticamente y conserva los tiempos y la plantilla. Mientras una asignación está en curso, espera para evitar interrumpirla. Para futuras versiones, cambia el número BUILD de app.js, la versión de version.json y los parámetros v de los archivos CSS y JS en index.html al mismo número nuevo. Sube todos los archivos juntos. La primera instalación de este mecanismo requiere cargar esta versión una vez en el acceso directo existente.

La plantilla incluye cuatro intervenciones de Seamos mejores maestros. Quita la cuarta cuando no corresponda y ajusta sus minutos. Las filas y botones crecen según la altura y anchura de pantalla disponibles; con muchas asignaciones o texto ampliado se permite desplazamiento.
