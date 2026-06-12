//Selectores:
const inputText = document.getElementById("inputText");
const inputBtn = document.getElementById("inputBtn");
const boxMessages = document.querySelector(".chat__messages");

//Id:
const userId = crypto.randomUUID();

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

    // Deshabilitar inputs
    inputText.disabled = true;
    inputBtn.disabled = true;

    //Añadir los argumentos:
    createMessages(myMessage, "user");
    createMessages('<div class="loader"></div>', "bot");

    try {
        const response = await fetch("/api/assistant-diet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: userId, message: myMessage
            })
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
    } finally {
        // Habilitar inputs
        inputText.disabled = false;
        inputBtn.disabled = false;
        inputText.focus();
    }

}

//Eventos:
const chatForm = document.getElementById("chatForm");

if (chatForm) {
    chatForm.addEventListener("submit", (event) => {
        event.preventDefault();
        startDiet();
    });
}