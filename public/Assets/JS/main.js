//Selectores:
const inputText = document.getElementById("inputText");
const inputBtn = document.getElementById("inputBtn");
const boxMessages = document.querySelector(".chat__messages");

//Id:
const userId = Date.now() + Math.floor(100 + Math.random() * 1000);

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

    //Añadir los argumentos:
    createMessages(myMessage, "user");
    createMessages('<div class="loader"></div>', "bot");

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

        if(true){

            try{

                const msgDiet = new markdownit();
                const msgFinally = msgDiet.render(data.reply);
                lastMsgBot.innerHTML = msgFinally;
                boxMessages.scrollTop = boxMessages.scrollHeight;

            }catch(exception){
                console.log(exception);
                lastMsgBot.textContent = data.reply;
            }

        }else{
            lastMsgBot.textContent = data.reply;
        }

        boxMessages.scrollTop = boxMessages.scrollHeight;

    }else{
        console.log("Error: No se encontró el último mensaje del bot para actualizar.");
    }

}

//Eventos:
inputBtn.addEventListener("click", startDiet);

inputText.addEventListener("keydown", (event) => {

    if(event.key === "Enter"){

        event.preventDefault();
        startDiet();

    }

});