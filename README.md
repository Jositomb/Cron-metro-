# Bosquejo de presidencia con cronómetros · versión 22

## Una sola interfaz

La aplicación utiliza ahora una única vista de presidencia por secciones desplegables. Las vistas alternativas de reloj, atril y lista completa se retiran de la interfaz. Se mantienen el total, los cronómetros por asignación, los consejos separados, la protección contra el doble toque, la preparación semanal, las copias, el ensayo y la recuperación de sesión.

La cabecera muestra Preparar y Opciones. No hay que elegir entre varios modos de lectura.

## Rellenarlo tú

Preparar abre el formulario existente. Si hay una reunión en curso, puedes consultarlo y desbloquear la edición para modificarlo; guardar conserva sus tiempos.

En Datos generales, apertura y conclusión puedes introducir:

- Fecha y presidente.
- Canción y oración iniciales.
- Introducción general.
- Anuncios y próxima reunión.
- Repaso o conclusión.
- Canción y oración finales.

En cada intervención: título o tema, duración, participante y tiempo para consejos. En Bosquejo, acompañante y referencias aparecen:

- Acompañante.
- Lector (para el estudio, el conductor va en Participante).
- Referencia de la guía.
- Palabras para presentar la parte.
- Textos bíblicos o lecturas.
- Bosquejo e indicaciones.
- Preguntas.
- Vídeos y materiales.

Se mantienen los campos de lección, qué encomiar, qué destacar y nota breve de apoyo. Todos son opcionales. La aplicación no rellena contenidos de la guía ni genera instrucciones; tú preparas lo necesario para dirigir. Las referencias y los textos se muestran como texto, sin ejecutar HTML. Los vídeos se reproducen desde JW Library u otra aplicación; el bosquejo guarda su indicación, no el archivo multimedia.

## Leer y dirigir desde el iPad

Despliega la sección y la asignación. En pantallas amplias, el bosquejo ocupa la columna izquierda y los cronómetros y controles la derecha. En ventanas estrechas o en el teléfono, se colocan uno debajo de otro.

Opciones → Letra del bosquejo permite elegir entre 16 y 26. Se recuerda en ese navegador. Puedes usar el acceso de pantalla de inicio para leer sin las barras de Safari; la aplicación aprovecha el ancho disponible sin cambiar los ajustes de ventana del iPad.

Finalizar asignación detiene al estudiante y abre el intervalo separado de consejos. Iniciar siguiente comienza al siguiente cuando tú lo pulses. El total continúa. Plegar o desplegar no modifica los tiempos.

## Semanas, copias y ensayo

Opciones → Programas semanales guarda o duplica programas. Al cargar uno se prepara otra sesión y, si hay tiempos, se pide confirmación y se conserva un resumen de la anterior.

Las copias exportadas incluyen ahora el bosquejo, los acompañantes y los datos generales. Las copias antiguas siguen siendo compatibles: los campos nuevos quedan vacíos. Importar añade programas y conserva la sesión actual. Guardar una preparación semanal es distinto de editar la sesión actual: vuelve a guardar el programa si quieres actualizarlo con tus cambios.

El modo ensayo conserva una sesión separada, recuperable al recargar. No permite entrar durante una reunión real en curso; al salir, los datos reales siguen intactos.

## Actualizar y abrir sin conexión

Sube todos los archivos del ZIP a la misma dirección, sin borrar los datos del sitio. Se incluyen outline-model.js y outline-view.js. Después de instalar una actualización offline, cierra las ventanas antiguas del cronómetro al terminar y vuelve a abrirlo.

La apertura offline requiere HTTPS y una primera carga con internet; en Opciones espera Disponible sin conexión. Los archivos multimedia no se descargan. Safari debe conservar los datos del sitio. Los programas y el bosquejo se guardan en el navegador; para pasarlos a otro dispositivo utiliza la copia JSON.

## Verificación

Pruebas superadas: datos manuales generales y por parte, acompañantes y lectores, guardar/duplicar/cargar/exportar, migración de programas anteriores, edición sin reiniciar, persistencia tras recargar y una sola interfaz visible. Se conservan las comprobaciones de cronómetros, consejos, secciones, notas, copia, recuperación y ensayo. El caché offline se comprobó con una simulación sin red; no se ha verificado una apertura real en modo avión ni el diseño en un iPad físico.
