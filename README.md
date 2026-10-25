# Bosquejo de presidencia con cronómetros · versión 32

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


## Versión 23 · editar desde cada asignación

Despliega una asignación y abre Editar esta asignación. Desde ahí puedes rellenar título, duración, participante, acompañante, lector, referencias, presentación, textos, bosquejo, preguntas, materiales, lección y notas del consejo. Guardar asignación conserva sus cronómetros y el total; Cancelar descarta lo escrito en ese editor. La ficha vuelve a mostrar los datos guardados. Deshacer se limpia al editar para evitar restaurar datos antiguos.

En Palabras de conclusión aparece Anuncios y un campo específico Anuncios de la congregación dentro de su editor. Usa los mismos datos de anuncios que ya existían: se conservan y no se duplica su contenido al final de la sección. La identificación de conclusión se conserva aunque después cambies su título.

El acceso Preparar se sustituye por Datos generales. Úsalo para fecha, presidente, canciones, oraciones y datos de cierre. Añadir o quitar asignaciones queda plegado dentro de ese formulario, como opción de estructura. Ya no es necesario ir al formulario general para rellenar una parte.

Si la sesión está vinculada a un programa semanal existente, guardar la asignación también actualiza ese programa. Si no hay programa guardado, se conserva en la sesión actual y en la plantilla incluida en la copia exportada; puedes guardar una semana desde Opciones. En ensayo los cambios continúan separados de los datos reales.

Verificados: edición directa sin reiniciar, anuncios en conclusión, validación, conservación al recargar y en plantillas exportables, además de las funciones anteriores. Los archivos y el caché offline se comprobaron mediante simulación. Queda pendiente la revisión visual en el iPad y la apertura real en modo avión.

## Versión 24 · dos reuniones desde Inicio
Abre index.html: permite entrar a Entre semana o Fin de semana. La reunión de entre semana conserva todos sus datos existentes, usando la misma dirección y dispositivo. No borres el almacenamiento del navegador al actualizar. Sube TODOS los archivos del ZIP a la misma carpeta de tu web; conserva weekday.html y weekend.html. Cierra todas las ventanas de la app y vuelve a abrir para activar la actualización.

Fin de semana tiene dos tarjetas: discurso público y estudio de La Atalaya. Edita los datos directamente en cada asignación. El discurso admite tema, discursante, canción, próximo discursante, tema del próximo discurso y notas. La Atalaya admite tema, conductor, canción, lector y notas. Duraciones iniciales de 30 y 60 minutos, siempre editables. Los dos cronómetros son independientes: solo se permite una parte en marcha a la vez. Pausar o finalizar una parte no detiene el total; Finalizar reunión detiene todo. Volver a Inicio o cerrar la página no detiene los relojes; al reabrir incluyen el tiempo transcurrido. Reiniciar tiempos mantiene los datos escritos.

La copia de seguridad del fin de semana se exporta e importa desde su propia pantalla, por separado de los programas entre semana. Importar sustituye la sesión de fin de semana tras confirmación y deja los relojes pausados. Los campos se guardan al pulsar Guardar asignación. Los cambios que aún no hayas guardado se pierden al salir.

Para uso sin conexión, primero abre la app en su dirección HTTPS con internet y espera el aviso de disponibilidad. Inicio, Entre semana y Fin de semana quedan preparados en el mismo caché. Verificado con pruebas de lógica y caché simulado; pendiente revisión visual y prueba de instalación en un iPad físico.

## Versión 25 · numeración de las asignaciones
La primera parte de Tesoros lleva el número 1. La apertura y las palabras de conclusión no llevan número ni cuentan para la secuencia. La misma numeración aparece al elegir la próxima asignación. Este ajuste solo cambia la presentación: conserva los títulos, datos, programas y tiempos.

## Versión 26 · preparar cada parte en su lugar
El botón Datos generales desaparece. La introducción contiene fecha, presidente, canción y oración inicial, y las palabras de bienvenida. La conclusión contiene anuncios, próxima reunión, repaso, canción y oración final. Los datos ya escritos en versiones anteriores aparecen en estas partes sin necesidad de copiarlos.

Editar esta asignación muestra los campos adecuados al tipo: Tesoros, perlas, lectura, estudiante con acompañante, discurso de estudiante, vida cristiana y estudio de congregación. El tipo se puede corregir en la propia edición. Los consejos se reservan a lectura y estudiantes. Si se cambia de tipo, los campos que ya contenían información se conservan en Otros datos que ya habías guardado. Los campos sin guardar se pierden al salir de la página.

Una tarjeta Canción intermedia se coloca por defecto antes de Nuestra vida cristiana, como en el esquema de referencia. Permite introducir número o título y moverla antes de Seamos mejores maestros. No crea un contador ni altera la numeración. Sus datos se incluyen en los programas y copias de seguridad.

Opciones > Organizar asignaciones permite añadir o quitar partes y ajustar títulos, duración o secciones; los participantes y el bosquejo se editan dentro de cada asignación. Los datos y tiempos existentes se conservan al actualizar, siempre en la misma dirección web y navegador. No borres el almacenamiento. Sube todos los archivos de este ZIP y cierra todas las ventanas para activar el nuevo caché.

Verificadas edición contextual, conservación de tiempos, copia/duplicado/importación de programas y caché sin conexión simulado. Sigue pendiente la comprobación visual y de instalación en un iPad físico.

## Versión 27 · vista más sencilla y limpia
Cabecera con Entre semana, total circular y menú de opciones. Una sola sección y una sola asignación desplegada: abrir otra no altera los cronómetros. La fila plegada muestra tema, participante y duración.

Un botón principal permite Iniciar, Finalizar asignación e Iniciar siguiente. En lectura y asignaciones de estudiantes, finalizar congela el tiempo del estudiante y destaca el reloj separado de CONSEJO. Al iniciar la siguiente, el consejo termina y el siguiente cronómetro empieza desde su propio tiempo. La última parte ofrece Finalizar reunión para pulsarlo después de la canción y la oración final. A continuación muestra la siguiente parte y su participante, respetando la asignación que hayas dejado preparada.

El lápiz abre los datos esenciales; Añadir notas o detalles contiene el bosquejo, los apoyos y el tipo de asignación. Los textos que ya habías preparado se conservan y siguen visibles en el bosquejo. El menú de puntos de cada parte contiene Reiniciar; Opciones incluye Deshacer último cambio y Elegir próxima asignación.

Paleta suave, fondo liso, sombras reducidas, canciones en una franja compacta, adaptación a pantalla estrecha, modo oscuro y reducción de movimiento. La reunión de fin de semana y la pantalla principal comparten el acabado más limpio.

Actualiza todos los archivos sin borrar los datos del navegador. Cierra todas las ventanas de la aplicación para activar la nueva versión. Verificados la navegación de los desplegables, la edición, el consejo separado, los controles, las copias, los relojes y el caché simulado. Pendiente la comprobación visual e instalación en un iPad físico.

## Versión 28 · lección en un globo sobre el cronómetro
Dentro de Editar asignación, en las lecturas y asignaciones de estudiantes, escribe el número o título de la lección y un enlace HTTPS opcional. En Añadir notas o detalles puedes pegar el texto de la lección (hasta 16.000 caracteres) para consultarlo sin conexión. Guardar conserva los tiempos.

Al tocar el botón de la lección se abre un globo con Cerrar, el tiempo de la asignación o del consejo y el total de reunión. Los relojes continúan. Si esa es la parte activa, también permite finalizarla o pasar a la siguiente desde el globo, respetando la separación del consejo. Consultar la lección de otra parte no cambia la parte activa.

Si hay texto guardado, el globo lo muestra primero. Ver enlace intenta mostrar la página dentro de un marco aislado, sin navegar fuera de la aplicación. Algunas páginas pueden impedir esa visualización o necesitar internet; en ese caso usa el texto guardado. No se descarga ni extrae automáticamente el contenido del enlace, ni se guarda la página web para uso sin conexión.

El texto y el enlace se incluyen en programas, duplicados y copias de seguridad. Solo se aceptan enlaces HTTPS sin credenciales. La vista del enlace se descarta al cerrar el globo.

Probadas apertura/cierre sin alterar relojes, consejo separado, controles del globo, texto guardado, persistencia y validación de enlaces. La carga real de páginas externas y la apariencia en iPad requieren comprobación en ese dispositivo.

## Versión 29 · presentar la siguiente antes de iniciar su cronómetro
Se retira Iniciar siguiente. Abrir una asignación desde su encabezado o desde Ver asignación solo permite consultar su presentación, tema y bosquejo. Su tiempo no empieza hasta pulsar Iniciar dentro de esa tarjeta. La pantalla consultada y la parte cronometrada se mantienen separadas: finalizar la anterior no vuelve a cerrar la próxima presentación.

Si consultas otra parte mientras corre un reloj, una franja muestra el tiempo en curso y permite volver a él o finalizarlo. En las asignaciones con consejo, Finalizar asignación detiene al estudiante y comienza el consejo. Finalizar consejo detiene ese contador; el total continúa mientras presentas la siguiente parte. El siguiente estudiante empieza a contar cuando pulses Iniciar en su tarjeta. Ver próxima asignación nunca inicia el siguiente contador.

La vista de la lección ya no intenta incrustar la web: jw.org utiliza X-Frame-Options SAMEORIGIN, por lo que esa vista no puede usarse desde esta aplicación. El enlace original se ofrece como enlace externo explícito. Para consultar sin salir del cronómetro, pega el texto en el propio globo y pulsa Guardar texto. Se conserva para uso sin conexión. No se descarga automáticamente el contenido del enlace.

Pruebas: consulta anticipada sin alterar tiempos, permanencia de la presentación al finalizar otra parte, franja del reloj activo, consejo separado, inicio manual del siguiente estudiante, guardado de texto desde el globo, programas y copias, caché simulado y regresión de fin de semana. La navegación real del enlace externo depende del navegador y JW Library del dispositivo.

## Versión 30 · apoyo a la izquierda, cronómetro a la derecha
Se elimina la ventana flotante de la lección. La tarjeta de la asignación muestra a la izquierda el bosquejo, la lección con su texto guardado, Qué encomiar, Qué destacar, las notas para la presidencia y la edición. A la derecha quedan solo el cronómetro, el consejo y los controles.

El texto de la lección se puede añadir o corregir directamente en ese panel, sin cambiar de pantalla. La fuente se conserva como enlace externo explícito. Los textos y enlaces ya guardados aparecen automáticamente en la columna izquierda; no se borra ningún dato. En tabletas anchas los controles permanecen a la vista al recorrer una lección larga. En pantallas estrechas, el reloj aparece arriba y el contenido debajo.

Se conserva la consulta de la próxima presentación antes de iniciar su cronómetro, el consejo separado y la franja del reloj que sigue en curso mientras consultas otra asignación.

Pruebas superadas: posición de cada elemento en la columna correspondiente, guardado/cancelación del texto sin alterar tiempos, consejo, consulta previa de la próxima parte, programas/duplicados/copia, recuperación y caché simulado. Pendiente revisión visual en el iPad físico. Actualiza todos los archivos y cierra y abre la aplicación.

## Versión 31 · preparación directa y controles más claros
Toca el tema, el participante, la lección o una canción para abrir su campo de edición dentro de la asignación. Tocar esos datos no abre un cronómetro ni cambia los tiempos. El lápiz conserva el formulario completo y sus opciones menos frecuentes.

Cada parte indica Preparada, En curso, En pausa, Consejo o Finalizada. Los botones dicen Iniciar asignación, Continuar asignación, Finalizar asignación y Finalizar consejo. Ver presentación abre el bosquejo de la próxima parte sin iniciar su reloj; la parte pendiente muestra Cronómetro sin iniciar. Deshacer está junto a los controles y sigue disponible en Opciones.

Al iniciar una asignación se recogen los formularios y quedan visibles el bosquejo, la lección y las notas guardadas. Los borradores que aún no hayas guardado se mantienen en esos campos mientras no se reconstruya la pantalla; para conservarlos entre sesiones pulsa Guardar. Las notas breves siguen guardándose al escribir.

Se conservan los programas, copias, consejo separado, consulta anticipada de la próxima parte, distribución izquierda/derecha, opciones y reunión de fin de semana.

Verificados los accesos directos de edición, separación de tiempos, estados, deshacer, conservación de borradores al recoger formularios y regresión de programas y copias. Pendiente revisión visual en un iPad físico. Actualiza todos los archivos y cierra y vuelve a abrir la aplicación.

## Versión 32 · conclusión organizada y acabado visual
Antes de Anuncios aparecen Resumen de la reunión y Adelanto de la próxima reunión, siempre visibles aunque aún estén vacíos. Se editan tocando el bloque o desde los campos esenciales de la conclusión. Se reutilizan closingWords (antes Repaso / conclusión) y nextWeek (antes Próxima reunión), por lo que todos los textos anteriores, programas y copias siguen siendo compatibles.

Orden del cierre: resumen, adelanto, anuncios, canción y oración final. Los tres primeros bloques tienen acentos suaves en verde, azul y ámbar. El reloj tiene una superficie discreta y las tarjetas abiertas un acento con el color de su sección. No se repite el estado en la cabecera y el interior al abrir una tarjeta; el aviso Cronómetro sin iniciar se reserva a la consulta de otra asignación durante la reunión. Se mantienen las letras legibles, modo oscuro y adaptación al móvil.

Probados orden y edición de los bloques, conservación de textos anteriores, tiempos, programas, duplicados, copias, consulta anticipada y regresión de fin de semana. Pendiente revisión visual en el iPad físico. Sustituye todos los archivos y cierra y vuelve a abrir la aplicación.

## Versión 33 · Inicio con color
Bienvenida, tarjetas azul petróleo y terracota, iconos destacados y fondo suave. Adaptación al móvil, modo oscuro y navegación por teclado. Los datos, relojes y pantallas de reunión se conservan.

## Versión 34 · azul petróleo y tarjetas de color
Acabado oscuro uniforme, también si el sistema usa apariencia clara. Fondo azul petróleo, tarjetas azules, detalles turquesa, consejo ámbar y bloques de conclusión verdes, azules y dorados. Se conservan los colores de las secciones y las alertas de exceso. No añade controles ni cambia datos, relojes o distribución. La pantalla de inicio y el fin de semana comparten la nueva paleta. Probadas las funciones y el caché; pendiente revisión visual en el dispositivo físico.

## Versión 35 · cierre fiable del menú
El botón de puntos controla explícitamente apertura y cierre sin depender del cambio nativo del desplegable. Cierra también al tocar fuera, pulsar Escape, elegir una acción habilitada o pulsar Cerrar. Cabecera de menú fija y desplazamiento interno limitado al alto de pantalla. v35 aparece junto a Opciones para reconocer la actualización. No cambia datos ni tiempos. Probados los eventos de cierre y el caché; pendiente prueba táctil en el iPad físico.
