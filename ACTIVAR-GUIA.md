# Subir todo sin carpetas

1. Descomprime el ZIP y sube TODOS los archivos sueltos al repositorio jositomb/Cron-metro-.
2. GitHub exige una ruta especial para la automatización. Este es el único paso que no puede hacerse dejando todo en la raíz:
   - Abre el archivo actualizar-guia.yml que acabas de subir. Copia su contenido.
   - Pulsa Add file > Create new file.
   - Como nombre escribe exactamente .github/workflows/actualizar-guia.yml
   - Pega el contenido y guarda con Commit changes. GitHub crea esas carpetas por ti.
   - Si ya existe ese archivo de la entrega anterior, edítalo y sustituye TODO su contenido por el del nuevo actualizar-guia.yml.
3. Settings > Pages > Source: elige GitHub Actions.
4. Actions > Actualizar guía y publicar cronómetro > Run workflow. Espera la marca verde.
5. Abre la aplicación habitual, cierra las ventanas anteriores y vuelve a entrar. Opciones > Cargar guía de la semana.

El archivo actualizar-guia.yml situado en la raíz es solo una copia fácil de subir y consultar: por sí solo no activa Actions. El paso 2 es necesario. No hace falta crear carpetas en el iPad.

Si conservas archivos de la entrega anterior, no interfieren, pero debes actualizar el workflow existente para que use el nuevo update-guide.py de la raíz. Si hay otro workflow publicando Pages, desactívalo para evitar publicaciones que se sobrescriban.

La actualización descargará las guías oficiales de jw.org cada domingo y al subir cambios. Los datos de las semanas se publican como archivos sueltos guide-AAAA-MM-DD.json. Los nombres, notas y trazos siguen en tu dispositivo. La web no se modifica hasta que tú subas los archivos y actives el workflow.
