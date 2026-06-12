import { generateDietContext } from '../services/openaiService.js';

/**
 * Controlador que maneja la lógica de validación y la respuesta del endpoint.
 * 
 * @param {import('express').Request} req Petición HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 */
export const handleDietRequest = async (req, res) => {
    try {
        const { peso, altura, meta, alergia, noGuAlimento, numComida } = req.body;

        // Validación de datos robusta (Regresa HTTP 400 Bad Request si faltan)
        if(!peso || !altura || !meta || !alergia || !noGuAlimento || !numComida) {
            return res.status(400).json({ reply: 'Faltan datos para crear la dieta.' });
        }

        const diet = await generateDietContext(req.body);

        return res.json({
            reply: diet,
            isFinal: true
        });

    } catch (error) {
        console.error("Error procesando petición:", error);
        return res.status(500).json({
            reply: 'Hubo un error al procesar la solicitud en el servidor.'
        });
    }
};
