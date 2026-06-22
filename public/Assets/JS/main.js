import { sendDietRequest } from './api.js';
import { createMessages, renderDietMarkdown, setInputsDisabled } from './ui.js';

// Selectores principales
const inputText = document.getElementById("inputText");
const chatForm = document.getElementById("chatForm");

const questions = [
    "¿Cual es tu altura en (Cm)?",
    "¿Cual es tu meta? (Adelgazar, mantener peso, ganar peso)",
    "¿Le tienes alergia a algun ingrediente?",
    "¿Que alimentos no te gustan?",
    "¿Cuantas comidas quieres hacer por dia?"
];
const keys = ["peso", "altura", "meta", "alergia", "noGuAlimento", "numComida"];
let currentStep = 0;
const dataUser = {};
async function fetchLimitStatus() {
    try {
        const response = await fetch('/api/assistant-diet/limit-status');
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error("Error al obtener limite:", error);
    }
    // Fallback if network fails
    return { count: 0, max: 2 };
}

async function updateLimitIndicator() {
    const { count, max } = await fetchLimitStatus();
    const limitIndicator = document.getElementById("limitIndicator");
    const limitBar = document.getElementById("limitBar");
    const container = document.querySelector(".header__limit-container");
    
    if (limitIndicator && limitBar && container) {
        const remaining = Math.max(0, max - count);
        limitIndicator.textContent = `${remaining}/${max}`;
        
        const percentage = (remaining / max) * 100;
        limitBar.style.width = `${percentage}%`;
        
        if (remaining <= 0) {
            container.classList.add("limit-reached");
        } else {
            container.classList.remove("limit-reached");
        }
        return remaining;
    }
    return Math.max(0, max - count);
}

const startDiet = async () => {
    if (currentStep === 0) {
        const remaining = await updateLimitIndicator();
        if (remaining <= 0) {
            showLimitPopup();
            return false;
        }
    }

    const myMessage = inputText.value;
    if (!myMessage) return false;

    inputText.value = "";
    setInputsDisabled(true);

    createMessages(myMessage, "user");

    // Guardar respuesta actual
    dataUser[keys[currentStep]] = myMessage;
    currentStep++;

    // Si aún faltan preguntas, hacer la siguiente
    if (currentStep < keys.length) {
        setTimeout(() => {
            createMessages(questions[currentStep - 1], "bot");
            setInputsDisabled(false);
        }, 500);
        return;
    }

    // Si ya tenemos todas las respuestas, enviar al backend a través del servicio API
    createMessages('<div class="loader"></div>', "bot");

    try {
        const reply = await sendDietRequest(dataUser);
        renderDietMarkdown(reply);
        
        await updateLimitIndicator();
        
        setTimeout(() => {
            createMessages("¡Dieta generada! Si quieres otra, empecemos de nuevo. ¿Cuanto pesas en (Kl)?", "bot");
        }, 1000);
    } catch (error) {
        console.error("Error en la petición:", error);
        // Remover el efecto de carga reemplazando el último mensaje
        const msgBot = document.querySelectorAll(".chat__message--ia");
        const lastMsgBot = msgBot[msgBot.length - 1];
        if (lastMsgBot) {
            lastMsgBot.innerHTML = error.message || 'Hubo un error al generar la dieta. Por favor intenta de nuevo.';
        } else {
            createMessages(error.message || 'Hubo un error al generar la dieta. Por favor intenta de nuevo.', 'bot');
        }
        
        // Si el backend nos rechaza por rate limit (429), actualizamos UI
        if (error.status === 429) {
            await updateLimitIndicator();
            showLimitPopup();
        }
    } finally {
        setInputsDisabled(false);
        // Reiniciar estado si se desea otra dieta
        currentStep = 0;
    }
}

function showLimitPopup() {
    const chatSection = document.querySelector('.layout__chat');
    const popupSection = document.getElementById('limitPopup');
    if (chatSection && popupSection) {
        chatSection.classList.add('hidden');
        popupSection.classList.remove('hidden');
    }
}

// Eventos
if (chatForm) {
    chatForm.addEventListener("submit", (event) => {
        event.preventDefault();
        startDiet();
    });
}

const initApp = async () => {
    const remaining = await updateLimitIndicator();
    if (remaining <= 0) {
        showLimitPopup();
    }
};

initApp();