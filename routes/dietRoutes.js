import express from 'express';
import { handleDietRequest } from '../controllers/dietController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

/**
 * Middleware para limitar el número de peticiones.
 * Si el usuario no tiene la librería instalada y falla temporalmente, 
 * el código puede seguir usando el enrutador normal si se requiere.
 */
let dietLimiter;
try {
    dietLimiter = rateLimit({
        windowMs: 24 * 60 * 60 * 1000, // 24 horas
        max: 2, // Limite a 2 solicitudes por IP por día
        message: { reply: 'Has alcanzado el límite diario de 2 recetas generadas. Por favor, ¡vuelve mañana!' }
    });
} catch (e) {
    // Fallback passthrough si la librería no está instalada aún
    dietLimiter = (req, res, next) => next(); 
}

router.post('/', dietLimiter, handleDietRequest);

export default router;
