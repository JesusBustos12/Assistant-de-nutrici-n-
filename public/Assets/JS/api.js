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
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
}
