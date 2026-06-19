import express from 'express';
import { handleDietRequest } from '../controllers/dietController.js';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

const dietLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 horas
    max: 2, // Limite a 2 solicitudes por IP por día
    message: { reply: 'Has alcanzado el límite diario de 2 recetas generadas. Por favor, ¡vuelve mañana!' },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post('/', dietLimiter, handleDietRequest);

export default router;
