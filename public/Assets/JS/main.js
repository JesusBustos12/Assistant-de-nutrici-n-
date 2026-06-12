//Selectores:
const inputText = document.getElementById("inputText");
const inputBtn = document.getElementById("inputBtn");
const boxMessages = document.querySelector(".chat__messages");
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

//Funcion para la creacion de los mensajes:
function createMessages(messageValue, sender){

    const messages = document.createElement("div");

    messages.classList.add("chat__message");
    messages.classList.add(sender === "user" ? "chat__message--user" : "chat__message--bot");
    if (sender === "bot") messages.classList.add("chat__message--ia");

    messages.innerHTML = messageValue;
    console.log(`Mensaje creado: ${messageValue}, de tipo: ${sender}`);

    boxMessages.appendChild(messages);
    boxMessages.scrollTop = boxMessages.scrollHeight;

}

//Funcion para el proceso de las peticiones http:
const startDiet = async() => {

    const myMessage = inputText.value;

    if(!myMessage) return false;

    inputText.value = "";
    
    // Deshabilitar inputs temporalmente
    inputText.disabled = true;
    inputBtn.disabled = true;

    createMessages(myMessage, "user");

    // Guardar respuesta actual
    dataUser[keys[currentStep]] = myMessage;
    currentStep++;

    // Si aún faltan preguntas, hacer la siguiente
    if (currentStep < keys.length) {
        setTimeout(() => {
            createMessages(questions[currentStep - 1], "bot");
            inputText.disabled = false;
            inputBtn.disabled = false;
            inputText.focus();
        }, 500);
        return;
    }

    // Si ya tenemos todas las respuestas, enviar al backend
    createMessages('<div class="loader"></div>', "bot");

    try {
        const response = await fetch("/api/assistant-diet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataUser)
        });

        const data = await response.json();

        console.log("Respuesta de la API:", data);

        //Sacar el ultimo mensaje del bot:
        const msgBot = document.querySelectorAll(".chat__message--ia");
        const lastMsgBot = msgBot[msgBot.length - 1];

        //Rutear la respuesta data.reply:
        if(lastMsgBot){

            try{
                const msgDiet = new markdownit({ html: false });
                const msgFinally = msgDiet.render(data.reply);
                lastMsgBot.innerHTML = msgFinally;
            }catch(exception){
                console.log(exception);
                lastMsgBot.textContent = data.reply;
            }

            boxMessages.scrollTop = boxMessages.scrollHeight;

        }else{
            console.log("Error: No se encontró el último mensaje del bot para actualizar.");
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        createMessages('Hubo un error al generar la dieta. Por favor intenta de nuevo.', 'bot');
    } finally {
        // Habilitar inputs
        inputText.disabled = false;
        inputBtn.disabled = false;
        inputText.focus();
        
        // Reiniciar estado si se desea otra dieta (Opcional)
        currentStep = 0;
    }

}

//Eventos:
if (chatForm) {
    chatForm.addEventListener("submit", (event) => {
        event.preventDefault();
        startDiet();
    });
}