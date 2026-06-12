const boxMessages = document.querySelector(".chat__messages");
const inputText = document.getElementById("inputText");
const inputBtn = document.getElementById("inputBtn");

/**
 * Crea y añade un mensaje al DOM
 * @param {string} messageValue El contenido del mensaje
 * @param {string} sender 'user' o 'bot'
 */
export function createMessages(messageValue, sender) {
    const messages = document.createElement("div");

    messages.classList.add("chat__message");
    messages.classList.add(sender === "user" ? "chat__message--user" : "chat__message--bot");
    if (sender === "bot") messages.classList.add("chat__message--ia");

    messages.innerHTML = messageValue;
    boxMessages.appendChild(messages);
    boxMessages.scrollTop = boxMessages.scrollHeight;
}

/**
 * Renderiza el texto final de la dieta usando markdown-it
 * @param {string} markdownText El texto en formato markdown
 */
export function renderDietMarkdown(markdownText) {
    const msgBot = document.querySelectorAll(".chat__message--ia");
    const lastMsgBot = msgBot[msgBot.length - 1];

    if (lastMsgBot) {
        try {
            // Se asume que markdownit está cargado de forma global en index.html
            const msgDiet = new window.markdownit({ html: false });
            lastMsgBot.innerHTML = msgDiet.render(markdownText);
        } catch (exception) {
            console.error(exception);
            lastMsgBot.textContent = markdownText;
        }
        boxMessages.scrollTop = boxMessages.scrollHeight;
    } else {
        console.error("Error: No se encontró el último mensaje del bot para actualizar.");
    }
}

/**
 * Habilita o deshabilita los inputs del chat
 * @param {boolean} disabled True para deshabilitar, False para habilitar
 */
export function setInputsDisabled(disabled) {
    inputText.disabled = disabled;
    inputBtn.disabled = disabled;
    if (!disabled) {
        inputText.focus();
    }
}
