const formulario = document.querySelector('#formulario');
const estado = document.querySelector('#estado');
const resultado = document.querySelector('#resultado');

async function enviar(metodo, ruta, datos) {
  try {
    const respuesta = await fetch(ruta, {
      method: metodo,
      ...(datos ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) } : {})
    });
    const contenido = await respuesta.json();
    estado.textContent = `${metodo} ${ruta} — HTTP ${respuesta.status}`;
    resultado.textContent = JSON.stringify(contenido, null, 2);
  } catch {
    estado.textContent = 'No fue posible conectar con el servidor local.';
  }
}

function datosFormulario() {
  return { nombre: formulario.elements.nombre.value, correo: formulario.elements.correo.value, mensaje: formulario.elements.mensaje.value };
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  enviar('POST', '/api/mensajes', datosFormulario());
});

document.querySelector('#consultar').addEventListener('click', () => enviar('GET', '/api/mensajes'));

document.querySelector('#actualizar').addEventListener('click', () => {
  if (!formulario.reportValidity()) return;
  const id = formulario.elements.id.value;
  if (!/^[1-9]\d*$/.test(id)) {
    estado.textContent = 'Indique un identificador entero mayor que cero.';
    return;
  }
  enviar('PUT', `/api/mensajes/${id}`, datosFormulario());
});
