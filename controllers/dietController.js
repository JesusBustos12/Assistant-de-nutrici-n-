import { generateDietContext } from '../services/openaiService.js';

import { z } from 'zod';

const dietSchema = z.object({
    peso: z.string().min(1).max(15, "El peso debe tener máximo 15 caracteres"),
    altura: z.string().min(1).max(15, "La altura debe tener máximo 15 caracteres"),
    meta: z.string().min(1).max(50, "La meta debe tener máximo 50 caracteres"),
    alergia: z.string().min(1).max(100, "La alergia debe tener máximo 100 caracteres"),
    noGuAlimento: z.string().min(1).max(100, "Los alimentos a excluir deben tener máximo 100 caracteres"),
    numComida: z.string().min(1).max(15, "El número de comidas debe tener máximo 15 caracteres")
});

/**
 * Controlador que maneja la lógica de validación y la respuesta del endpoint.
 * 
 * @param {import('express').Request} req Petición HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 */
export const handleDietRequest = async (req, res) => {
    try {
        // Validación estricta con Zod
        const validationResult = dietSchema.safeParse(req.body);
        
        if (!validationResult.success) {
            // Regresa el primer error encontrado
            const errorMessage = validationResult.error.errors[0].message;
            return res.status(400).json({ reply: errorMessage });
        }

        const validData = validationResult.data;
        const diet = await generateDietContext(validData);

        return res.json({
            reply: diet,
            isFinal: true
        });

    } catch (error) {
        console.error("Error procesando petición:", error);
        return res.status(500).json({
            reply: 'Fallo en el servidor: ' + error.message
        });
    }
};
