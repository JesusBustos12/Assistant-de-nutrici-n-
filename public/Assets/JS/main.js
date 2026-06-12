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

const startDiet = async () => {
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
    } catch (error) {
        console.error("Error en la petición:", error);
        createMessages(error.message || 'Hubo un error al generar la dieta. Por favor intenta de nuevo.', 'bot');
    } finally {
        setInputsDisabled(false);
        // Reiniciar estado si se desea otra dieta
        currentStep = 0;
    }
}

// Eventos
if (chatForm) {
    chatForm.addEventListener("submit", (event) => {
        event.preventDefault();
        startDiet();
    });
}