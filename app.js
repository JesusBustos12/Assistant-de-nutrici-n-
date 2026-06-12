import express from "express";
import dotenv from "dotenv";
import OpenAI  from "openai";
import path from "path";

dotenv.config();

//Configuraciones del servidor:
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(process.cwd(), 'public')));

//Middleware:
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

//apiKey del OpenAI:
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

//Funcion para la configuracion del modelo y su contexto:
async function modelContext(create){

    const promptSystem = `
        Quiero que actúes como un experto en nutrición con décadas de experiencia.

        Solo aceptarás responder a las preguntas o a las características que se presentan a continuación:
        peso - ${create.peso}.
        altura - ${create.altura}.
        meta - ${create.meta}.
        alergia - ${create.alergia}.
        noGuAlimento - ${create.noGuAlimento}.
        numComida - ${create.numComida}.

        ¡Cualquier otra pregunta que no tenga relación con la nutrición será denegada!

    `;

    const promptUser = `
        Toma en cuenta las características que se presentan a continuación:
        peso - ${create.peso}.
        altura - ${create.altura}.
        meta - ${create.meta}.
        alergia - ${create.alergia}.
        noGuAlimento - ${create.noGuAlimento}.
        numComida - ${create.numComida}.

        ¡Si cualquiera de las características no está presente o tiene otro valor, quiero que en base a estadística o probabilidad
        inventes un valor para esa característica. Ejemplo: peso: 88 altura: njcbsj. Como puedes ver, la altura no tiene sentido, entonces tienes que inventar el valor más probable. Tal vez en este caso sería altura: 1.80. Esto basado en el peso.!

        ¡También si existen palabras entrecortadas como por ejemplo: adel, quiere decir que debes buscar completar con una palabra posible o con sentido la palabra incompleta. En este caso tal vez pueda ser: adelgazar!

        Quiero que el input o datos de entrada del usuario esté en formato: 'MarkDown'. Solo quiero la dieta con estas columnas a continuación:
        Dia - Dia de la semana.
        Platillos - Básicamente es el platillo de la dieta.
        Ingredientes - Son los ingredientes de la comida de la dieta.
        Calorias - las calorías que aporta esa comida concreta.
        Total de calorias del dia - Debe ser *estrictamente* la suma exacta de las calorias de *todos* los platillos de ese dia.
        Numero total de platillos - Debes incluir estrictamente ${create.numComida} platillos por cada día de la semana.

        Las filas son los dias de la semana de lunes a domingo.

        Una vez creada la dieta, quiero que la respuesta entregada sea en formato de: 'Tabla markdown' o 'markdownit'.

        ¡Posdata. Solo quiero la dieta sin datos adicionales como: esta es la dieta creada para ti, o símbolos extraños como: $,%,#,* entre otros!

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

app.post("/api/assistant-diet", async(req, res) => {
    try {
        const { peso, altura, meta, alergia, noGuAlimento, numComida } = req.body;

        if(!peso || !altura || !meta || !alergia || !noGuAlimento || !numComida) {
            return res.status(400).json({ reply: 'Faltan datos para crear la dieta.' });
        }

        const diet = await modelContext(req.body);

        return res.json({
            reply: diet,
            isFinal: true
        });

    } catch (error) {
        console.error("Error procesando petición:", error);
        return res.status(500).json({
            reply: 'Hubo un error al procesar la solicitud en el servidor.'
        });
    }

});

//Servir el Back-end:
app.listen(port, () => {
    console.log("Tu servidor esta iniciando en: http://localhost:" + port);
});