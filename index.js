import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuraciones del servidor
const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos de la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Configuración de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Función para generar la dieta con el modelo
async function modelContext(create) {
  const promptSystem = `
    Quiero que actues como un experto en nutricion con decadas de experiencia.

    Solo aceptaras a responder a las preguntas o a las caracteristicas que se presentan a continuacion:
    peso - ${create.peso}.
    altura - ${create.altura}.
    meta - ${create.meta}.
    alergia - ${create.alergia}.
    noGuAlimento - ${create.noGuAlimento}.
    numComida - ${create.numComida}.

    ¡Cualquier otra pregunta que no tenga relacion con la nutricion sera denegada!
  `;

  const promptUser = `
    Toma en cuenta las caracteristicas que se presentan a continuacion:
    peso - ${create.peso}.
    altura - ${create.altura}.
    meta - ${create.meta}.
    alergia - ${create.alergia}.
    noGuAlimento - ${create.noGuAlimento}.
    numComida - ${create.numComida}.

    ¡Si cualquiera de las caracteristicas no esta presente o tenga otro valor quiero que en base a estadistica o probabilidad
    inventes un valor para esa caracteristica. Ejemplo: peso: 88 altura: njcbsj. Como puedes ver altura no tiene sentido entonces tu tienes que inventarte el valor mas probable. Tal vez en esta caso seria altura: 1.80. Esto basado en el peso!

    ¡Tambien si existen palabras entrecortadas como por ejemplo: adel. Quiere decir que debes de buscar completar en una palabra posible o con sentido la palabra incompleta. En esta caso tal vez pueda ser: adelgazar!

    Quiero el input o datos de entrada del usuario este en formato: 'MarkDown'. Solo quiero la dieta con estas columnas de a continuacion:
    Dia - Dia de la semana.
    Platillos - Basicamente es el platillo de la dieta.
    Ingredientes - Son los ingredientes de la comida de la dieta.
    Calorias - las calorias que aporta esa comida concreta.
    Total de calorias del dia - Debe ser *estrictamente* la suma exacta de las calorias de *todos* los platillos de ese dia.
    Numero total de platillos - Debes incluir estrictamente ${create.numComida} platillos por cada día de la semana.

    Las filas son los dias de la semana de lunes a domingo.

    Una vez creada la dieta quiero que la respuesta entregada sea en formato de: 'Tabla markdown' o 'markdownit'.

    ¡Posdata. Solo quiero la dieta sin datos adicionales como: esta es la dieta creada para ti o símbolos extraños como: $,%,#,* entre otros!
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: promptSystem },
        { role: "user", content: promptUser },
      ],
      temperature: 0.25,
      max_tokens: 1250,
    });

    return completion.choices[0].message.content.trim();
  } catch (exception) {
    console.error("Error con la respuesta del modelo:", exception);
    throw new Error("Error con la comunicación del servidor de IA.");
  }
}

const dataUser = {};

// Ruta API para el asistente de dieta
app.post("/api/assistant-diet", async (req, res) => {
  const userId = req.body.id;
  const userMessage = req.body.message;

  if (!dataUser[userId]) {
    dataUser[userId] = {};
  }

  if (!dataUser[userId].peso) {
    dataUser[userId].peso = userMessage;
    return res.json({
      reply: "¿Cuál es tu altura en (Cm)?",
      isFinal: false,
    });
  }

  if (!dataUser[userId].altura) {
    dataUser[userId].altura = userMessage;
    return res.json({
      reply: "¿Cuál es tu meta? (Adelgazar, mantener peso, ganar peso)",
      isFinal: false,
    });
  }

  if (!dataUser[userId].meta) {
    dataUser[userId].meta = userMessage;
    return res.json({
      reply: "¿Le tienes alergia a algún ingrediente?",
      isFinal: false,
    });
  }

  if (!dataUser[userId].alergia) {
    dataUser[userId].alergia = userMessage;
    return res.json({
      reply: "¿Qué alimentos no te gustan?",
      isFinal: false,
    });
  }

  if (!dataUser[userId].noGuAlimento) {
    dataUser[userId].noGuAlimento = userMessage;
    return res.json({
      reply: "¿Cuántas comidas quieres hacer por día?",
      isFinal: false,
    });
  }

  if (!dataUser[userId].numComida) {
    dataUser[userId].numComida = userMessage;

    try {
      const diet = await modelContext(dataUser[userId]);

      // Limpiar datos del usuario después de generar la dieta
      delete dataUser[userId];

      return res.json({
        reply: diet,
        isFinal: true,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Error generando la dieta",
      });
    }
  }
});

export default app;
