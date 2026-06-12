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
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 10, // Limite a 10 solicitudes por IP por ventana de tiempo
        message: { reply: 'Demasiadas solicitudes desde esta IP. Por favor intenta de nuevo en 15 minutos para proteger el saldo de la API.' }
    });
} catch (e) {
    // Fallback passthrough si la librería no está instalada aún
    dietLimiter = (req, res, next) => next(); 
}

router.post('/', dietLimiter, handleDietRequest);

export default router;
