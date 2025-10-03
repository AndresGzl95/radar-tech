
// chatbot.js
// Chatbot accesible con soporte de voz para radar-tech

/*
===============================================
Mejoras recientes (octubre 2025):
-----------------------------------------------
- Se agregaron botones visibles dentro del chat para:
  • Leer Página: lee en voz alta el contenido principal.
  • Reproducir Cápsula: reproduce el primer audio disponible (en Cápsulas o Bitácora).
  • Detener: cancela la narración por voz y pausa cualquier audio en reproducción.
- Los botones permiten interacción accesible y directa, sin necesidad de escribir comandos.
- Se mantiene la compatibilidad con entrada por texto y voz.
===============================================
*/


// ===============================
// Chatbot accesible Radar-Tech
// ===============================

// Crear botón flotante de acceso al chat
// ===============================
// Renderizado e inserción de UI
// ===============================
// Respuestas básicas y funciones especiales
const chatbotBtn = document.createElement('button');
chatbotBtn.id = 'chatbot-fab';
chatbotBtn.setAttribute('aria-label', 'Abrir chat de asistencia');
chatbotBtn.innerHTML = '💬';
chatbotBtn.style.position = 'fixed';
chatbotBtn.style.bottom = '24px';
chatbotBtn.style.right = '24px';
chatbotBtn.style.width = '56px';
chatbotBtn.style.height = '56px';
chatbotBtn.style.background = '#1976d2';
chatbotBtn.style.color = '#fff';
chatbotBtn.style.border = 'none';
chatbotBtn.style.borderRadius = '50%';
chatbotBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
chatbotBtn.style.fontSize = '2rem';
chatbotBtn.style.zIndex = '10000';
chatbotBtn.style.cursor = 'pointer';
chatbotBtn.style.display = 'flex';
chatbotBtn.style.alignItems = 'center';
chatbotBtn.style.justifyContent = 'center';
chatbotBtn.style.transition = 'background 0.2s';
chatbotBtn.tabIndex = 0;

const chatbotContainer = document.createElement('div');
chatbotContainer.id = 'chatbot';
chatbotContainer.innerHTML = `
  <div id="chatbot-header" tabindex="0">Asistente Radar-Tech <button id="chatbot-close" aria-label="Cerrar chat" style="float:right;background:none;border:none;font-size:1.2em;cursor:pointer;">✕</button></div>
  <div id="chatbot-messages" aria-live="polite"></div>
  <div id="chatbot-actions" style="display:flex;gap:8px;justify-content:center;padding:8px 0;">
    <button type="button" id="chatbot-leer" aria-label="Leer página">🗣️ Leer Página</button>
    <button type="button" id="chatbot-audio" aria-label="Reproducir cápsula">🎧 Reproducir Cápsula</button>
    <button type="button" id="chatbot-detener" aria-label="Detener narración o audio">⏹️ Detener</button>
  </div>
  <form id="chatbot-form" autocomplete="off">
    <input id="chatbot-input" type="text" placeholder="Escribe o usa el micrófono..." aria-label="Mensaje al bot" />
    <button type="button" id="chatbot-mic" aria-label="Hablar"><span>🎤</span></button>
    <button type="submit" aria-label="Enviar">Enviar</button>
  </form>
`;
chatbotContainer.style.position = 'fixed';
chatbotContainer.style.bottom = '90px';
chatbotContainer.style.right = '24px';
chatbotContainer.style.width = '320px';
chatbotContainer.style.maxWidth = '90vw';
chatbotContainer.style.background = '#fff';
chatbotContainer.style.border = '2px solid #222';
chatbotContainer.style.borderRadius = '12px';
chatbotContainer.style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)';
chatbotContainer.style.zIndex = '9999';
chatbotContainer.style.fontFamily = 'inherit';
chatbotContainer.style.display = 'none';

// Insertar en el body y asignar acciones a los botones del chat
window.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(chatbotBtn);
  document.body.appendChild(chatbotContainer);
  // Acciones de botones
  const btnLeer = document.getElementById('chatbot-leer');
  const btnAudio = document.getElementById('chatbot-audio');
  const btnDetener = document.getElementById('chatbot-detener');
  if (btnLeer) btnLeer.onclick = () => {
    agregarMensaje('Leyendo el contenido principal de la página.', 'bot');
    leerContenidoPagina();
  };
  if (btnAudio) btnAudio.onclick = () => {
    if (esCapsulas() || esBitacora()) {
      agregarMensaje('Reproduciendo la primera cápsula de audio disponible.', 'bot');
      reproducirPrimerAudio();
    } else {
      agregarMensaje('Esta función solo está disponible en las secciones de Cápsulas y Bitácora.', 'bot');
    }
  };
  if (btnDetener) btnDetener.onclick = () => {
    detenerNarracionYAudio();
    agregarMensaje('Narración y audio detenidos.', 'bot');
  };
});
// ===============================
// Función: detenerNarracionYAudio
// Descripción: Detiene la síntesis de voz y pausa cualquier audio en reproducción.
// ===============================
function detenerNarracionYAudio() {
  // Detener voz
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  // Pausar todos los audios
  document.querySelectorAll('audio').forEach(audio => {
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
}

const messagesDiv = chatbotContainer.querySelector('#chatbot-messages');
const form = chatbotContainer.querySelector('#chatbot-form');
const input = chatbotContainer.querySelector('#chatbot-input');
const micBtn = chatbotContainer.querySelector('#chatbot-mic');


// Respuestas básicas y funciones especiales
const respuestas = [
  { q: /noticias|novedades/i, a: 'Puedes encontrar las últimas noticias en la sección "Noticias" del menú principal.' },
  { q: /archivo/i, a: 'El archivo contiene ediciones pasadas y recursos históricos del sitio.' },
  { q: /panel/i, a: 'El panel es una sección de administración y control de contenido.' },
  { q: /diario|bitácora/i, a: 'El diario recopila las publicaciones y reflexiones recientes. ¿Quieres que lea el contenido de la página o reproducir alguna cápsula de audio? Escribe "leer página" o "reproducir cápsula".' },
  { q: /capsulas|cápsulas/i, a: 'En la sección Cápsulas puedes escuchar y leer análisis editoriales. ¿Quieres que lea el contenido de la página o reproducir una cápsula? Escribe "leer página" o "reproducir cápsula".' },
  { q: /gracias/i, a: 'La sección de agradecimientos reconoce a quienes han colaborado en el proyecto.' },
  { q: /sobre|quién/i, a: 'En la sección "Sobre" puedes conocer más sobre el propósito y el equipo de Radar-Tech.' },
  { q: /accesibilidad|discapacidad|inclusi/i, a: 'Radar-Tech está diseñado para ser accesible, incluyendo soporte para lectores de pantalla y navegación por teclado. Puedes pedirme que lea la página actual diciendo "leer página".' },
  { q: /leer página|lee la página|lectura/i, a: '', special: 'leerPagina' },
  { q: /reproducir cápsula|pon cápsula|escuchar cápsula/i, a: '', special: 'reproducirCapsula' },
  { q: /.*/, a: '¿En qué puedo ayudarte? Pregúntame sobre las secciones del sitio, cómo navegar, o pide "leer página" para escuchar el contenido.' }
];

// ===============================
// Función: agregarMensaje
// Descripción: Agrega un mensaje al chat, lo muestra en la interfaz y, si es del bot, lo lee en voz alta.
// Parámetros:
//   texto: string - El mensaje a mostrar
//   emisor: 'bot' | 'user' - Quién envía el mensaje
// ===============================
function agregarMensaje(texto, emisor = 'bot') {
  const msg = document.createElement('div');
  msg.className = 'chatbot-msg ' + emisor;
  msg.textContent = texto;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  if (emisor === 'bot') hablar(texto);
}

// ===============================
// Función: hablar
// Descripción: Utiliza SpeechSynthesis para leer en voz alta un texto.
// Parámetros:
//   texto: string - El texto a vocalizar
// ===============================
function hablar(texto) {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = 'es-ES';
    window.speechSynthesis.speak(utter);
  }
}

// ===============================
// Configuración de reconocimiento de voz (SpeechRecognition)
// Permite entrada por voz en el chat.
// ===============================
let reconocimiento;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  reconocimiento = new SpeechRecognition();
  reconocimiento.lang = 'es-ES';
  reconocimiento.continuous = false;
  reconocimiento.interimResults = false;
  reconocimiento.onresult = function(event) {
    const texto = event.results[0][0].transcript;
    input.value = texto;
    form.dispatchEvent(new Event('submit'));
  };
}

// ===============================
// Evento: micBtn click
// Descripción: Inicia el reconocimiento de voz al presionar el botón de micrófono.
// ===============================
micBtn.addEventListener('click', () => {
  if (reconocimiento) {
    reconocimiento.start();
  } else {
    agregarMensaje('Tu navegador no soporta reconocimiento de voz.', 'bot');
  }
});


// ===============================
// Evento: form submit
// Descripción: Procesa el mensaje del usuario, busca respuesta y ejecuta funciones especiales si aplica.
// ===============================
form.addEventListener('submit', e => {
  e.preventDefault();
  const texto = input.value.trim();
  if (!texto) return;
  agregarMensaje(texto, 'user');
  input.value = '';
  // Buscar respuesta
  const r = respuestas.find(r => r.q.test(texto));
  if (r && r.special === 'leerPagina') {
    leerContenidoPagina();
    agregarMensaje('Leyendo el contenido principal de la página.', 'bot');
  } else if (r && r.special === 'reproducirCapsula') {
    if (esCapsulas() || esBitacora()) {
      reproducirPrimerAudio();
      agregarMensaje('Reproduciendo la primera cápsula de audio disponible.', 'bot');
    } else {
      agregarMensaje('Esta función solo está disponible en las secciones de Cápsulas y Bitácora.', 'bot');
    }
  } else {
    agregarMensaje(r ? r.a : respuestas[respuestas.length-1].a, 'bot');
  }
});

// ===============================
// Función: esCapsulas
// Descripción: Detecta si la página actual es la sección de Cápsulas.
// ===============================
function esCapsulas() {
  return window.location.pathname.includes('capsulas');
}

// ===============================
// Función: esBitacora
// Descripción: Detecta si la página actual es la sección de Bitácora (diario).
// ===============================
function esBitacora() {
  return window.location.pathname.includes('diario');
}

// ===============================
// Función: leerContenidoPagina
// Descripción: Lee en voz alta el contenido principal de la página (main o body).
// Límite de 1800 caracteres por accesibilidad.
// ===============================
function leerContenidoPagina() {
  let texto = '';
  const main = document.querySelector('main');
  if (main) {
    texto = main.innerText;
  } else {
    texto = Array.from(document.body.children)
      .filter(el => el.id !== 'chatbot' && el.id !== 'chatbot-container' && el.id !== 'chatbot-fab')
      .map(el => el.innerText || '').join('\n');
  }
  if (texto) {
    hablar(texto.slice(0, 1800));
  }
}

// ===============================
// Función: reproducirPrimerAudio
// Descripción: Busca y reproduce el primer elemento <audio> visible en la página.
// Si no hay audio, avisa al usuario.
// ===============================
function reproducirPrimerAudio() {
  const audio = document.querySelector('main audio, .audio-capsula audio, .capsula-audio audio');
  if (audio) {
    audio.play();
    audio.focus && audio.focus();
  } else {
    hablar('No se encontró ninguna cápsula de audio en esta página.');
  }
}


// Mostrar/ocultar chat
chatbotBtn.addEventListener('click', () => {
  chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'block' : 'none';
  if (chatbotContainer.style.display === 'block') {
    setTimeout(() => {
      input.focus();
    }, 200);
  }
});

// Cerrar chat con botón
chatbotContainer.addEventListener('click', e => {
  if (e.target.id === 'chatbot-close') chatbotContainer.style.display = 'none';
});

// Accesibilidad: cerrar con Escape
chatbotContainer.addEventListener('keydown', e => {
  if (e.key === 'Escape') chatbotContainer.style.display = 'none';
});

// Estilos mínimos para mensajes, botón flotante y acciones
const style = document.createElement('style');
style.textContent = `
#chatbot { font-size: 1rem; }
#chatbot-header { background: #222; color: #fff; padding: 8px 12px; border-radius: 12px 12px 0 0; font-weight: bold; }
#chatbot-messages { height: 180px; overflow-y: auto; padding: 8px; background: #f9f9f9; }
.chatbot-msg { margin: 6px 0; padding: 6px 10px; border-radius: 8px; max-width: 90%; }
.chatbot-msg.user { background: #e0f7fa; align-self: flex-end; text-align: right; }
.chatbot-msg.bot { background: #e8eaf6; align-self: flex-start; }
#chatbot-form { display: flex; gap: 4px; padding: 8px; }
#chatbot-input { flex: 1; padding: 6px; border-radius: 6px; border: 1px solid #bbb; }
#chatbot-mic, #chatbot-form button[type=submit] { background: #222; color: #fff; border: none; border-radius: 6px; padding: 0 10px; cursor: pointer; }
#chatbot-mic:focus, #chatbot-form button[type=submit]:focus { outline: 2px solid #1976d2; }
#chatbot-fab:focus { outline: 2px solid #1976d2; }
#chatbot-actions button { background: #1976d2; color: #fff; border: none; border-radius: 6px; padding: 6px 10px; font-size: 1em; cursor: pointer; transition: background 0.2s; }
#chatbot-actions button:focus { outline: 2px solid #1976d2; }
`;
document.head.appendChild(style);
