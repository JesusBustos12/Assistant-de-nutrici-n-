import express from 'express';
import { handleDietRequest } from '../controllers/dietController.js';
import pool from '../config/db.js';

const router = express.Router();

const dietLimiter = async (req, res, next) => {
    // Obtener la IP
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Usamos UTC para consistencia
    const today = new Date().toISOString().split('T')[0]; 

    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS rate_limits (
                ip VARCHAR(45) PRIMARY KEY,
                requests INT DEFAULT 1,
                last_date DATE
            )
        `);

        const [rows] = await pool.query("SELECT requests, DATE_FORMAT(last_date, '%Y-%m-%d') as last_date_str FROM rate_limits WHERE ip = ?", [ip]);

        if (rows.length === 0) {
            await pool.query('INSERT INTO rate_limits (ip, requests, last_date) VALUES (?, 1, ?)', [ip, today]);
            return next();
        }

        const record = rows[0];
        
        if (record.last_date_str !== today) {
            await pool.query('UPDATE rate_limits SET requests = 1, last_date = ? WHERE ip = ?', [today, ip]);
            return next();
        }

        if (record.requests >= 2) {
            return res.status(429).json({ reply: 'Has alcanzado el límite diario de 2 recetas generadas. Por favor, ¡vuelve mañana!' });
        }

        await pool.query('UPDATE rate_limits SET requests = requests + 1 WHERE ip = ?', [ip]);
        next();

    } catch (error) {
        console.error("Error en DB Rate Limiter:", error);
        // Fallback: Permitir la solicitud si la base de datos falla (fail-open)
        next();
    }
};

router.post('/', dietLimiter, handleDietRequest);

export default router;
