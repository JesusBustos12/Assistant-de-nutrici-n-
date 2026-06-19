import express from "express";
import dotenv from "dotenv";
import path from "path";
import dietRoutes from './routes/dietRoutes.js';

dotenv.config();

// Configuraciones del servidor:
const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1); // Confía en el primer proxy (Vercel, Nginx, etc.) para leer correctamente la IP

app.use(express.static(path.join(process.cwd(), 'public')));

// Middlewares:
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Enrutadores modulares de la API
app.use("/api/assistant-diet", dietRoutes);

// Servir el Back-end:
app.listen(port, () => {
    console.log("Tu servidor esta iniciando en: http://localhost:" + port);
});

export default app;