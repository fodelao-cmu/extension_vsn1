// background.js

let buffer = []; // Guarda datos detectados temporalmente

// Recibe mensajes del content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "DETECTED" && Array.isArray(msg.data)) {
    buffer.push(...msg.data);
  }
});

// Envía el buffer al servidor cada 10 segundos
setInterval(() => {
  if (!buffer.length) return; // nada que enviar

  fetch("http://localhost:4000/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buffer)
  })
    .then(() => console.log("Data sent:", buffer))
    .catch(err => console.error("Error sending data:", err));

  buffer = []; // limpia buffer después de enviar
}, 10000);
