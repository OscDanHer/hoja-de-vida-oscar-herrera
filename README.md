# Hoja de vida web de Oscar Herrera

Actividad de transferencia de Introducción a los Lenguajes de Internet.

Sitio publicado: https://oscdanher.github.io/hoja-de-vida-oscar-herrera/

El sitio presenta el perfil, la experiencia, la formación y los proyectos del CV de noviembre de 2026. Utiliza HTML, CSS y JavaScript separados.

## Abrir el sitio

Abrir `index.html` en un navegador o servir la carpeta con un servidor estático. Los enlaces de contacto abren el correo, el teléfono o el perfil seleccionado.

La publicación en GitHub Pages usa la rama `main`, carpeta raíz, en **Settings > Pages**. El archivo `.nojekyll` mantiene la publicación como HTML estático.

## Archivos

- `index.html`: perfil y presentación.
- `experiencia.html`: trayectoria laboral.
- `formacion.html`: estudios y tabla de habilidades.
- `proyectos.html`: proyectos y filtro GET por sector.
- `css`, `js` y `assets`: estilos, interacciones e imágenes SVG propias.
- `practica-http`: ejercicio local de formularios, separado de la hoja de vida pública.

## Práctica de formularios

Requiere Node.js. Desde la carpeta del proyecto:

```text
node practica-http/servidor.mjs
```

Abrir `http://127.0.0.1:8767`. El formulario crea registros con POST, los consulta con GET y los reemplaza con PUT. Usar datos ficticios. Los registros se reinician al detener el servidor con Ctrl+C.

GitHub Pages publica archivos estáticos. Este servidor se ejecuta por separado y no recibe mensajes desde el sitio público.
