// Ejemplo: mostrar alerta al cargar nueva edición
window.onload = function() {
  console.log("Bienvenido a Radar Tech & IA · Edición Septiembre 2025");
};
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("edicion-dinamica");
  const edicionActual = ediciones.find(e => e.id === "octubre-2025");

  if (edicionActual) {
    contenedor.innerHTML = `
      <h1>${edicionActual.titulo}</h1>
      <p class="autor">Por ${edicionActual.autor} · ${edicionActual.fecha}</p>
      <img src="${edicionActual.imagen}" alt="Imagen de la edición" />
      <p><em>${edicionActual.resumen}</em></p>
      ${edicionActual.contenido}
    `;
  }
});
fetch("data/lecturas.md")
  .then(response => response.text())
  .then(texto => {
    document.getElementById("contenido-diario").innerHTML = marked.parse(texto);
  });
  
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("noticias-semanales");
  if (!contenedor || typeof noticiasIA === "undefined") return;

  noticiasIA.forEach(noticia => {
    const bloque = document.createElement("div");
    bloque.className = "noticia";
    bloque.innerHTML = `
      <h3>${noticia.titulo}</h3>
      <p>${noticia.resumen}</p>
      <p><strong>Fuente:</strong> ${noticia.fuente}</p>
      <a href="${noticia.enlace}" target="_blank">Leer más</a>
    `;
    contenedor.appendChild(bloque);
  });
});
function renderCapsulas() {
  const contenedor = document.getElementById("edicion-dinamica");
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