// Ejemplo: mostrar alerta al cargar nueva edición
window.onload = function() {
  console.log("Bienvenido a Radar Tech & IA · Edición Septiembre 2025");
};

function renderMarkdownFile(path, elementId) {
  const contenedor = document.getElementById(elementId);
  if (!contenedor) return;

  return fetch(path)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then(texto => {
      if (typeof marked === "undefined") {
        contenedor.innerHTML = texto.replace(/\n/g, "<br>");
        return;
      }
      contenedor.innerHTML = marked.parse(texto);
    })
    .catch(error => {
      contenedor.innerHTML = `<p>❌ No se pudo cargar el contenido de ${path}.</p>`;
      console.error(`Error al cargar ${path}:`, error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const capsulasContainer = document.getElementById("edicion-dinamica");
  if (capsulasContainer) {
    renderMarkdownFile("data/ediciones.md", "edicion-dinamica");
  }

  const diarioContenedor = document.getElementById("contenido-diario");
  if (diarioContenedor) {
    renderMarkdownFile("data/lecturas.md", "contenido-diario");
  }

  const noticiasContainer = document.getElementById("noticias-semanales");
  if (noticiasContainer && typeof noticiasIA !== "undefined") {
    noticiasIA.forEach(noticia => {
      const bloque = document.createElement("div");
      bloque.className = "noticia";
      bloque.innerHTML = `
        <h3>${noticia.titulo}</h3>
        <p>${noticia.resumen}</p>
        <p><strong>Fuente:</strong> ${noticia.fuente}</p>
        <a href="${noticia.enlace}" target="_blank">Leer más</a>
      `;
      noticiasContainer.appendChild(bloque);
    });
  }
});

function setupMenuToggle() {
  const toggleButton = document.querySelector('.toggle-menu');
  const closeButton = document.querySelector('.close-menu');
  const menu = document.querySelector('.radar-menu');

  if (toggleButton && menu) {
    toggleButton.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
  }

  if (closeButton && menu) {
    closeButton.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  }
}

document.addEventListener("DOMContentLoaded", setupMenuToggle);

function renderCapsulas() {
  if (typeof ediciones === "undefined") return;
  const contenedor = document.getElementById("edicion-dinamica");
  if (!contenedor) return;

  contenedor.innerHTML = ediciones.map(e => `
    <article class="blog-post" id="${e.id}">
      <h2>${e.titulo}</h2>
      <p class="meta">Publicado el ${e.fecha} · ${e.autor}</p>
      <img src="${e.imagen}" alt="${e.titulo}" width="100%">
      ${e.secciones.map(sec => `
        <section>
          <h3>${sec.subtitulo}</h3>
          ${sec.cita ? `<p class="quote">“${sec.cita}”</p>` : ""}
          ${sec.contenido.map(p => `<p>${p}</p>`).join("")}
        </section>
      `).join("")}
      <section class="comparativa-iphone">
        <h2>${e.comparativa.titulo}</h2>
        <table class="tabla-comparativa">
          <thead>
            <tr>${e.comparativa.tabla.encabezados.map(h => `<th>${h}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${e.comparativa.tabla.filas.map(row => `
              <tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>
            `).join("")}
          </tbody>
        </table>
        <p class="quote">“${e.comparativa.cita}”</p>
        <p>${e.comparativa.reflexion}</p>
      </section>
    </article>
    ${e.audio ? `
  <section class="capsula-audio">
    <h4>🎧 Cápsula narrada</h4>
    <audio controls>
      <source src="${e.audio.url}" type="audio/mpeg">
      Tu navegador no soporta audio HTML5.
    </audio>
    <p class="meta-audio">Narrador: ${e.audio.narrador} · Duración: ${e.audio.duracion}</p>
  </section>
` : ""}
  `).join("");
}

document.addEventListener("DOMContentLoaded", renderCapsulas);
