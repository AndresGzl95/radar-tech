// =============================================
// Archivo: panel.js
// Descripción: Lógica para el panel de administración de noticias.
// Permite agregar noticias mediante un formulario y renderizarlas dinámicamente.
// =============================================

const noticias = [];

document.getElementById("formulario-noticia").addEventListener("submit", function (e) {
  e.preventDefault();

  const nueva = {
    titulo: document.getElementById("titulo").value,
    resumen: document.getElementById("resumen").value,
    fuente: document.getElementById("fuente").value,
    enlace: document.getElementById("enlace").value
  };

  noticias.push(nueva);
  actualizarVista();
  this.reset();
});

// ===============================
// Evento: submit del formulario de noticias
// Descripción: Captura los datos del formulario, crea una nueva noticia y actualiza la vista.
// ===============================

function actualizarVista() {
  const contenedor = document.getElementById("lista-noticias");
  contenedor.innerHTML = "";

  noticias.forEach((n, i) => {
    const bloque = document.createElement("div");
    bloque.className = "noticia";
    bloque.innerHTML = `
      <h3>${n.titulo}</h3>
      <p>${n.resumen}</p>
      <p><strong>Fuente:</strong> ${n.fuente}</p>
      <a href="${n.enlace}" target="_blank">Leer más</a>
    `;
    contenedor.appendChild(bloque);
  });
}

// ===============================
// Función: actualizarVista
// Descripción: Renderiza la lista de noticias en el contenedor correspondiente.
// ===============================