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
