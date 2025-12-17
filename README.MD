# Asistente de Nutrición con IA - Portafolio Full-Stack

## Descripción
Aplicación web full-stack que genera **dietas personalizadas** utilizando la API de Chat Completions de OpenAI (modelo GPT-4o-mini).  

El usuario responde paso a paso a una serie de preguntas conversacionales sobre su peso, altura, meta nutricional (adelgazar, mantener peso o ganar masa muscular), alergias, alimentos que no le gustan y número de comidas al día. Una vez recopilada la información, la IA genera un plan semanal completo en formato de tabla Markdown con las siguientes columnas:

- Día
- Platillos
- Ingredientes
- Calorías
- Total de calorías del día
- Número total de platillos (estrictamente el número solicitado por el usuario)

Todo ello con un diseño conversacional limpio, moderno y totalmente responsive, construido con **Node.js, Express, JavaScript vanilla y CSS puro** (sin frameworks).

Perfecto para demostrar habilidades full-stack reales en un portafolio profesional.

## Objetivo
Como desarrollador autodidacta, creé este proyecto para:

- Mostrar dominio completo de Node.js + Express en el backend.
- Integrar de forma segura y eficiente la API de chat de OpenAI para generar contenido estructurado.
- Diseñar prompts avanzados que manejen datos incompletos o erróneos (corrigiendo palabras incompletas y estimando valores probables basados en estadísticas).
- Crear una interfaz de chat intuitiva y atractiva con excelente experiencia de usuario.
- Aplicar buenas prácticas: variables de entorno, manejo de estado por usuario, código limpio, seguro y escalable.
- Tener un proyecto funcional, visualmente atractivo y listo para producción que resuelva un problema real: la creación de dietas personalizadas.

## Características
- Interfaz conversacional que guía al usuario pregunta por pregunta.
- Generación inteligente de dietas: corrige entradas inválidas, completa datos faltantes con valores probables y respeta estrictamente alergias y preferencias.
- Salida en tabla Markdown estricta, renderizada automáticamente en HTML.
- Feedback visual de carga con animación "Cargando...".
- Totalmente responsive (móvil, tablet y escritorio).
- Protección de la API key con `dotenv` (nunca expuesta).
- Listo para desplegar en Render, Vercel, Railway, Hostinger, etc.

## Tecnologías utilizadas
- **Node.js + Express** → Servidor backend, rutas API y manejo de estado conversacional.
- **OpenAI Chat Completions API (GPT-4o-mini)** → Generación de dietas con prompts avanzados y control estricto del formato.
- **JavaScript vanilla** → Lógica frontend (fetch, eventos, manipulación del DOM, renderizado de Markdown con `markdown-it`).
- **HTML5 + CSS3 puro** → Diseño moderno con flexbox, transiciones, loader animado y tablas responsive.
- **dotenv** → Gestión segura de variables de entorno.
- **markdown-it** → Renderizado de Markdown a HTML en el cliente.
- **Nodemon** → Desarrollo rápido con recarga automática.
- **Git & GitHub** → Control de versiones.

## Estructura del proyecto
pro_4---assistant-de-nutricion-con-ia/
├── index.js                    # Servidor Express + lógica OpenAI y rutas API
├── package.json
├── package-lock.json
├── .env.example              # Plantilla para variables de entorno (sin clave)
├── .gitignore                # Protege .env y node_modules
├── public/
│   ├── index.html            # Página principal con el chat
│   ├── Assets/
│   │   ├── CSS/styles.css    # Estilos limpios y responsive
│   │   ├── JS/main.js        # Lógica frontend (eventos, fetch, render)
│   │   └── Imgs/             # Imágenes (comida-sana.png, etc.)
└── README.md                 # Esta documentación
text## Habilidades demostradas
Este proyecto refleja competencias reales de un Junior Full-Stack listo para aportar valor:

- Backend sólido: rutas POST, async/await, manejo de estado por usuario (IDs únicos), integración segura de API externa compleja.
- Ingeniería de prompts avanzada: control de formato estricto, manejo de entradas erróneas/incompletas y restricciones temáticas.
- Frontend limpio sin frameworks: manipulación del DOM, eventos, fetch nativo y renderizado dinámico.
- Diseño UI/UX cuidado: paleta coherente, feedback visual, responsive design y atención al detalle.
- Seguridad y buenas prácticas: variables de entorno, .gitignore correcto, código mantenible.
- Producto completo, funcional y listo para producción.

## Demo en vivo
(https://assistant-de-nutrici-n.vercel.app/)

## Notas para empleadores
Este es uno de mis proyectos full-stack más completos y útiles hasta la fecha.
Lo construí desde cero, enfocándome tanto en la funcionalidad como en la experiencia del usuario.
Demuestra que:

Puedo integrar APIs avanzadas de OpenAI de forma segura y efectiva.
Domino backend y frontend sin depender de frameworks pesados.
Me importa el detalle visual y la usabilidad.
Escribo prompts robustos que garantizan resultados consistentes.
Entrego productos completos, seguros y listos para producción.

Estoy 100% listo para aportar valor real en un equipo como Junior Full-Stack Developer.
Contacto
Busco mi primera oportunidad como desarrollador web full-stack.
¡Me encantaría trabajar contigo!

## Contacto
GitHub: github.com/JesusBustos12
LinkedIn: linkedin.com/in/jesus-bustos-arizmendi-325329283
Correo: jesusbustosarizmendi0@gmail.com
Celular/WhatsApp: +52 762 119 2732


¡Gracias por revisar mi trabajo! 🚀

