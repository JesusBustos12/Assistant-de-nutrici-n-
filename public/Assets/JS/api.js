/**
 * Módulo de API
 * Centraliza la comunicación con el servidor (Backend).
 * 
 * @param {Object} dataUser Datos recolectados del formulario.
 * @returns {Promise<string>} La dieta generada en Markdown.
 */
export async function sendDietRequest(dataUser) {
    const response = await fetch("/api/assistant-diet", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataUser)
    });

    if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
            const errData = await response.json();
            if (errData && errData.reply) {
                errorMsg = errData.reply;
            }
        } catch(e) {}
        
        const error = new Error(errorMsg);
        error.status = response.status;
        throw error;
    }

    const data = await response.json();
    return data.reply;
}
