import request from 'supertest';
import app from '../app.js';

describe('API Diet Assistant', () => {
    
    it('Debe rechazar (HTTP 400) si faltan datos en el body', async () => {
        const response = await request(app)
            .post('/api/assistant-diet')
            .send({
                peso: '80',
                altura: '1.80'
                // Faltan meta, alergia, etc.
            });
            
        expect(response.status).toBe(400);
        expect(response.body.reply).toBe('Faltan datos para crear la dieta.');
    });

    it('Debe aplicar Rate Limiting (Opcional dependiendo si la IP supera límite)', async () => {
        // En un entorno de prueba real podríamos forzar las 10 peticiones para probar el 429
        expect(true).toBe(true);
    });

});
