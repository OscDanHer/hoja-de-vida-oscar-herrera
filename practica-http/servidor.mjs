import http from 'node:http';
import { readFile } from 'node:fs/promises';

const mensajes = new Map();
let consecutivo = 1;

function responder(respuesta, estado, contenido) {
  respuesta.writeHead(estado, { 'Content-Type': 'application/json; charset=utf-8' });
  respuesta.end(JSON.stringify(contenido));
}

async function leerDatos(peticion) {
  let texto = '';
  for await (const fragmento of peticion) {
    texto += fragmento;
    if (texto.length > 10000) throw new Error('El mensaje es demasiado largo.');
  }
  const datos = JSON.parse(texto);
  if (!datos || typeof datos !== 'object') throw new Error('Los datos no son válidos.');
  for (const campo of ['nombre', 'correo', 'mensaje']) {
    if (typeof datos[campo] !== 'string' || !datos[campo].trim()) {
      throw new Error('Complete nombre, correo y mensaje.');
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) {
    throw new Error('Escriba un correo válido.');
  }
  return { nombre: datos.nombre.trim(), correo: datos.correo.trim(), mensaje: datos.mensaje.trim() };
}

const servidor = http.createServer(async (peticion, respuesta) => {
  const ruta = new URL(peticion.url, 'http://127.0.0.1:8767').pathname;
  respuesta.on('finish', () => console.log(`${peticion.method} ${ruta} ${respuesta.statusCode}`));
  try {
    if (peticion.method === 'GET' && ['/', '/index.html', '/formulario.js'].includes(ruta)) {
      const archivo = ruta === '/formulario.js' ? 'formulario.js' : 'index.html';
      const contenido = await readFile(new URL(archivo, import.meta.url));
      respuesta.writeHead(200, { 'Content-Type': archivo.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8' });
      respuesta.end(contenido);
    } else if (ruta === '/api/mensajes' && peticion.method === 'GET') {
      responder(respuesta, 200, Array.from(mensajes.values()));
    } else if (ruta === '/api/mensajes' && peticion.method === 'POST') {
      const datos = await leerDatos(peticion);
      const registro = { id: consecutivo++, ...datos };
      mensajes.set(registro.id, registro);
      responder(respuesta, 201, registro);
    } else if (/^\/api\/mensajes\/\d+$/.test(ruta) && peticion.method === 'PUT') {
      const id = Number(ruta.split('/').pop());
      if (!mensajes.has(id)) {
        responder(respuesta, 404, { error: 'No existe el registro indicado.' });
        return;
      }
      const registro = { id, ...await leerDatos(peticion) };
      mensajes.set(id, registro);
      responder(respuesta, 200, registro);
    } else if (ruta.startsWith('/api/mensajes')) {
      respuesta.setHeader('Allow', 'GET, POST, PUT');
      responder(respuesta, 405, { error: 'Método no permitido para esta ruta.' });
    } else {
      responder(respuesta, 404, { error: 'Ruta no encontrada.' });
    }
  } catch (error) {
    responder(respuesta, 400, { error: error.message });
  }
});

servidor.listen(8767, '127.0.0.1', () => console.log('Práctica HTTP: http://127.0.0.1:8767'));
