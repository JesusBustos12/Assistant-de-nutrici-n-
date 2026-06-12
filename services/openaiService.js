import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Genera la dieta consultando a OpenAI.
 * Tipado mediante JSDoc para mejorar el autocompletado y validación (Nivel Senior).
 * 
 * @param {Object} create Objeto con los datos recolectados del usuario.
 * @param {string} create.peso Peso del usuario.
 * @param {string} create.altura Altura del usuario.
 * @param {string} create.meta Meta nutricional (ej. Adelgazar).
 * @param {string} create.alergia Alergias reportadas.
 * @param {string} create.noGuAlimento Alimentos que no le gustan.
 * @param {string} create.numComida Número de comidas por día.
 * @returns {Promise<string>} La respuesta generada por GPT en formato Markdown.
 */
export async function generateDietContext(create) {
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

        ¡Si cualquiera de las características no está presente o tiene otro valor, quiero que en base a estadística o probabilidad inventes un valor para esa característica.

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

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: promptSystem },
                { role: "user", content: promptUser }
            ],
            temperature: 0.25,
            max_tokens: 1250
        });

        return completion.choices[0].message.content.trim();
    } catch(exception) {
        console.error(exception, "Error con la respuesta del modelo.");
        throw new Error('Error con la comunicación del servidor de IA.');
    }
}
