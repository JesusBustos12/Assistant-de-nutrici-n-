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
const maxDietsPerDay = 2;

function checkLimit() {
    const today = new Date().toLocaleDateString();
    let usageData = JSON.parse(localStorage.getItem('nutriIA_usage')) || { date: today, count: 0 };
    
    if (usageData.date !== today) {
        usageData = { date: today, count: 0 };
        localStorage.setItem('nutriIA_usage', JSON.stringify(usageData));
    }
    
    return usageData;
}

function updateLimitIndicator() {
    const usageData = checkLimit();
    const limitIndicator = document.getElementById("limitIndicator");
    const limitBar = document.getElementById("limitBar");
    const container = document.querySelector(".header__limit-container");
    
    if (limitIndicator && limitBar && container) {
        const remaining = Math.max(0, maxDietsPerDay - usageData.count);
        limitIndicator.textContent = `${remaining}/${maxDietsPerDay}`;
        
        const percentage = (remaining / maxDietsPerDay) * 100;
        limitBar.style.width = `${percentage}%`;
        
        if (remaining <= 0) {
            container.classList.add("limit-reached");
        } else {
            container.classList.remove("limit-reached");
        }
    }
}

function incrementLimit() {
    const usageData = checkLimit();
    usageData.count += 1;
    localStorage.setItem('nutriIA_usage', JSON.stringify(usageData));
    updateLimitIndicator();
}

const startDiet = async () => {
    if (currentStep === 0) {
        const usageData = checkLimit();
        if (usageData.count >= maxDietsPerDay) {
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
        incrementLimit();
        
        setTimeout(() => {
            createMessages("¡Dieta generada! Si quieres otra, empecemos de nuevo. ¿Cuanto pesas en (Kl)?", "bot");
        }, 1000);
    } catch (error) {
        console.error("Error en la petición:", error);
        createMessages(error.message || 'Hubo un error al generar la dieta. Por favor intenta de nuevo.', 'bot');
        
        // Si el backend nos rechaza por rate limit (429), sincronizamos el límite local
        if (error.status === 429) {
            const usageData = checkLimit();
            usageData.count = maxDietsPerDay;
            localStorage.setItem('nutriIA_usage', JSON.stringify(usageData));
            updateLimitIndicator();
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

const initApp = () => {
    updateLimitIndicator();
    const usageData = checkLimit();
    if (usageData.count >= maxDietsPerDay) {
        showLimitPopup();
    }
};

initApp();