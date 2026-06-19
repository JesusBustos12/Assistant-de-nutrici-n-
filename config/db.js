import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Creamos un Connection Pool para eficiencia en entornos Serverless
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 3000, // Previene que Vercel cancele el proceso (max 10s) si TiDB tarda
    ssl: {
        rejectUnauthorized: true
    }
});

// Verificamos la conexión inicial
pool.getConnection()
    .then(connection => {
        console.log('✅ Conectado exitosamente a TiDB Cloud (MySQL)');
        connection.release();
    })
    .catch(error => {
        console.error('❌ Error conectando a TiDB Cloud:', error.message);
    });

export default pool;
