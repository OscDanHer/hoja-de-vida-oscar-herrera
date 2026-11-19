document.documentElement.classList.add('js');

const botonMenu = document.querySelector('.boton-menu');
const navegacion = document.querySelector('.navegacion');

if (botonMenu && navegacion) {
  botonMenu.addEventListener('click', () => {
    const abierto = botonMenu.getAttribute('aria-expanded') !== 'true';
    botonMenu.setAttribute('aria-expanded', String(abierto));
    botonMenu.textContent = abierto ? 'Cerrar menú' : 'Menú';
    navegacion.classList.toggle('abierta', abierto);
  });

  navegacion.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) {
      navegacion.classList.remove('abierta');
      botonMenu.setAttribute('aria-expanded', 'false');
      botonMenu.textContent = 'Menú';
    }
  });
}

const formularioFiltro = document.querySelector('.filtro');

if (formularioFiltro) {
  const tipos = ['todos', 'educacion', 'finanzas'];
  const solicitado = new URLSearchParams(window.location.search).get('sector');
  const tipo = tipos.includes(solicitado) ? solicitado : 'todos';
  formularioFiltro.elements.sector.value = tipo;
  let visibles = 0;

  document.querySelectorAll('.proyecto[data-sector]').forEach((proyecto) => {
    const mostrar = tipo === 'todos' || proyecto.dataset.sector === tipo;
    proyecto.hidden = !mostrar;
    if (mostrar) visibles++;
  });

  const aviso = document.querySelector('.sin-resultados');
  if (aviso) aviso.hidden = visibles > 0;
  const resultado = document.querySelector('.resultado-filtro');
  if (resultado) resultado.textContent = `${visibles} ${visibles === 1 ? 'proyecto' : 'proyectos'}`;
}
