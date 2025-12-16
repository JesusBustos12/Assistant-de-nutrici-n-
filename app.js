import express from "express";
import dotenv from "dotenv";
import OpenAI  from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Configuraciones del servidor:
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

//Middleware:
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//apiKey del OpenAI:
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

//Funcion para la configuracion del modelo y su contexto:
async function modelContext(create){

    const promptSystem = `
        Quiero que actues como un experto en nutricion con decadas de experiencia.

        Solo aceptaras a responder a las preguntas o a las caracteristicas que se presentan a acontinuacion:
        peso - ${create.peso}.
        altura - ${create.altura}.
        meta - ${create.meta}.
        alergia - ${create.alergia}.
        noGuAlimento - ${create.noGuAlimento}.
        numComida - ${create.numComida}.

        ¡Cualquier otra pregunta que no tenga relacion con la nutricion sera denegada!

    `;

    const promptUser = `
        Toma en cuenta las caracteristicas que se presentan a acontinuacion:
        peso - ${create.peso}.
        altura - ${create.altura}.
        meta - ${create.meta}.
        alergia - ${create.alergia}.
        noGuAlimento - ${create.noGuAlimento}.
        numComida - ${create.numComida}.

        ¡Si cualquiera de las caracteristicas no esta presente o tenga otro valor quiero que en vase a estadistica o probabilidad
        inventes un valor para esa caracteristica. Ejemplo: peso: 88 altura: njcbsj. Como puedes ver altura no tiene sentido entoces tu tienes que inventarte el valor mas provable. Talves en esta caso seria altura: 1.80. Esto vasado en el peso.!

        ¡Tambien si existen palabras entrecortadas como por ejemplo: adel. Quiere decir que debes de buscar acompletar en una plabra posible o con sentido la palabra imcompleta. En esta caso talves pueda ser: adelgazar!

        Quiero el input o datos de entrada del usuario este en formato: 'MarkDown'. Solo quiero la dieta con estas columnas de acontinuacion:
        Dia - Dia de la semana.
        Platillos - Basica mente es el platillo de la dieta.
        Ingredientes - Son los ingredientes de la comida de la dieta.
        Calorias - las calorias que aporta esa comida concreta.
        Total de calorias del dia - Debe ser *estrictamente* la suma exacta de las calorias de *todos* los platillos de ese dia.
        Numero total de platillos - Debes incluir estrictamente ${create.numComida} platillos por cada día de la semana.

        Las filas son los dias de la semana de lunes a domingo.

        Una ves creada la dieta quiero que la respuesta entregada sea en formato de: 'Tabla markdown' o 'markdownit'.

        ¡Posdata. Solo quiero la dieta sin datios adicionales como: esta es la dieta creada para ti o sigbolos estraños como: $,%,#,* entre otros!

    `;

    try{

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {role: "system", content: promptSystem},
                {role: "user", content: promptUser}
            ],
            temperature: 0.25,
            max_tokens: 1250
        });

        const ia = completion.choices[0].message.content.trim();

        return ia;

    }catch(exception){
        console.log(exception, "Error con la respuesta del modelo.");
        return res.status(500).json({
            exception: 'Error con la comunicación del servidor de IA.'
        });
    }

}

const dataUser = {};

//Gestion de las peticiones http de tipo post:
app.post("/api/assistant-diet", async(req, res) => {

    const userId = req.body.id;
    const userMessage = req.body.message;

    if(!dataUser[userId]){
        dataUser[userId] = {};
    }

    if(!dataUser[userId].peso){
        dataUser[userId].peso = userMessage;

        return res.json({
            reply: '¿Cual es tu altura en (Cm)?',
            isFinal: false
        });
    }

    if(!dataUser[userId].altura){
        dataUser[userId].altura = userMessage;

        return res.json({
            reply: '¿Cual es tu meta? (Adelgazar, mantener peso, ganar peso)',
            isFinal: false
        });
    }

    if(!dataUser[userId].meta){
        dataUser[userId].meta = userMessage;

        return res.json({
            reply: '¿Le tienes alergia algun ingrediente?',
            isFinal: false
        });
    }

    if(!dataUser[userId].alergia){
        dataUser[userId].alergia = userMessage;

        return res.json({
            reply: '¿Que alimentos no te gustan?',
            isFinal: false
        });
    }

    if(!dataUser[userId].noGuAlimento){
        dataUser[userId].noGuAlimento = userMessage;

        return res.json({
            reply: '¿Cuantas comidas quieres hacer por dia?',
            isFinal: false
        });
    }

    if(!dataUser[userId].numComida){
        dataUser[userId].numComida = userMessage;

        const diet = await modelContext(dataUser[userId]);

        if (dataUser[userId].peso && dataUser[userId].altura && dataUser[userId].meta
            && dataUser[userId].alergia && dataUser[userId].noGuAlimento && dataUser[userId].numComida
        ){
            dataUser[userId] = {};
            console.log(dataUser[userId]);
        } 

        // Limpiar datos del usuario tras completar
        delete dataUser[userId];

        return res.json({
            reply: diet,
            isFinal: true
        });

    }

});

//Servir el Back-end:
app.listen(port, () => {
    console.log("Tu servidor esta iniciando en: http://localhost:" + port);

});

// Exportar la app para Vercel
export default app;
