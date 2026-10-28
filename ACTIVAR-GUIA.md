# Activar la guía automática en tu GitHub

Tu dirección seguirá siendo https://jositomb.github.io/Cron-metro-/.
Este ZIP no cambia por sí solo la web: hay que subir los archivos y activar esta configuración una sola vez.

1. Descomprime el ZIP y sube los archivos al repositorio `jositomb/Cron-metro-`.
   Conserva las carpetas `scripts` y `guide-data` completas.
2. El archivo de actualización tiene que estar exactamente en:
   `.github/workflows/actualizar-guia.yml`
   Si no aparece la carpeta oculta al subir archivos desde el iPad, en GitHub pulsa
   **Add file → Create new file**, escribe esa ruta completa como nombre y pega el
   contenido del archivo del mismo nombre que encontrarás también en
   `CONFIGURACION/actualizar-guia.txt`. Guarda con **Commit changes**.
3. Ve a **Settings → Pages → Build and deployment → Source** y elige **GitHub Actions**.
   Esta configuración sustituye la publicación anterior desde una rama.
   Si tienes otro workflow que publique esta misma web, desactívalo para que no sobrescriba esta publicación.
4. En **Actions**, abre **Actualizar guía y publicar cronómetro** y pulsa
   **Run workflow → Run workflow**. Si GitHub pide habilitar Actions, habilítalo.
5. Espera a que termine con una marca verde. Luego abre tu dirección habitual,
   cierra las ventanas anteriores de la app y vuelve a entrar. En **Opciones →
   Cargar guía de la semana**, elige la semana, revisa y carga.

La actualización se ejecutará cada domingo y cuando subas cambios a main o master.
No necesitas contraseñas adicionales ni servicios de terceros. GitHub puede retrasar
las ejecuciones programadas o suspenderlas por inactividad; puedes reactivarlas en
Actions y ejecutar Run workflow cuando lo necesites.

## Qué hace y qué conserva

- Descarga únicamente las guías en español de jw.org; reconoce el bimestre de la
  semana actual y el siguiente, y valida fechas, numeración, tiempos y canciones.
- Publica los archivos de la app junto a las semanas disponibles. Si la descarga
  actual falla o cambia la estructura de la fuente, no publica un resultado incompleto.
- En la app, los temas, minutos, instrucciones, lecturas, referencias y lecciones
  aparecen en cada asignación bajo Guía de actividades. Las canciones se colocan en su lugar.
- La carga incluye nombres y notas personales solo si marcas Conservar. La asociación
  es por tipo y orden: revisa los participantes, porque las asignaciones pueden cambiar.
  Las notas y trazos no se envían a GitHub: siguen en este dispositivo.
- Si cambia la lección, el texto manual de la lección anterior se limpia para no
  confundirlo con la nueva; se conservan las notas del consejo y los trazos si eliges conservar.
- Una sesión con tiempos no se sustituye. Usa Preparar nueva reunión primero.
- La guía cargada se guarda en la sesión y se incluye en las copias. Para cargar otra
  semana sin internet, debes haber abierto su vista previa con conexión previamente.
- El programa guardado anterior no se modifica automáticamente al importar.

## Si no aparece ninguna semana

Revisa que el workflow esté verde y que Pages use GitHub Actions. La copia del ZIP
sin ejecutar el workflow muestra un aviso de activación, no semanas inventadas.
Si hay un error en Actions, comparte una captura del paso que aparece en rojo.

Comprobado el analizador con el HTML oficial del 26 de octubre al 1 de noviembre
2026 y las reglas de conservación de datos con pruebas. La ejecución y publicación
en tu repositorio requieren los pasos anteriores; no se han activado desde este chat.
