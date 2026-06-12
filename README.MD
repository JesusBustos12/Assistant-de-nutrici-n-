# Asistente de Nutrición con IA - Portafolio Full-Stack (Arquitectura Senior)

## Descripción
Aplicación web full-stack que genera **dietas personalizadas** utilizando la API de Chat Completions de OpenAI (modelo GPT-4o-mini).  

El usuario responde paso a paso a una serie de preguntas conversacionales sobre su peso, altura, meta nutricional (adelgazar, mantener peso o ganar masa muscular), alergias, alimentos que no le gustan y número de comidas al día. Una vez recopilada la información, la IA genera un plan semanal completo en formato de tabla Markdown con las siguientes columnas:

- Día
- Platillos
- Ingredientes
- Calorías
- Total de calorías del día
- Número total de platillos (estrictamente el número solicitado por el usuario)

Todo ello con un diseño conversacional con estilo "Premium Lite" (Glassmorphism), construido con **Node.js, Express, JavaScript Vanilla (ES Modules) y CSS puro** (sin frameworks). El proyecto cuenta con una arquitectura de nivel empresarial (MVC), seguridad avanzada (Rate Limiting y protección XSS) y un sistema de estado en el cliente para soportar despliegues Serverless.

Perfecto para demostrar habilidades full-stack reales y avanzadas en un portafolio profesional.

## Objetivo
Como desarrollador autodidacta, creé este proyecto para:

- Mostrar dominio completo de Node.js + Express en el backend con una arquitectura **MVC (Model-View-Controller)** escalable.
- Integrar de forma segura y eficiente la API de chat de OpenAI mediante servicios modulares y tipado con JSDoc.
- Diseñar prompts avanzados que manejen datos incompletos o erróneos basándose en estadística o probabilidad.
- Construir interfaces web atractivas con CSS moderno (animaciones elásticas, CSS variables, glassmorphism) mejorando la experiencia del usuario.
- Aplicar ingeniería de seguridad web: protección contra inyecciones XSS, ocultamiento de API Keys y prevención de abusos con **Rate Limiting**.
- Solucionar problemas arquitectónicos complejos, como la pérdida de estado en entornos **Serverless** (Vercel), trasladando la máquina de estados al cliente de forma eficiente.
- Implementar Unit Testing automatizado en el servidor para garantizar la robustez del código.

## Características
- **Arquitectura MVC y ES Modules**: Código 100% modular, separando rutas, controladores, servicios y lógica de UI/API sin requerir empaquetadores complejos.
- **Máquina de Estado en el Cliente**: Flujo conversacional optimizado que recolecta respuestas localmente para hacer una única petición segura al backend, ahorrando costos e invocaciones lambda.
- **Diseño Premium y Dinámico**: Interfaz que guía al usuario con transiciones fluidas, feedback visual y bloqueo interactivo para prevenir el spam.
- **Seguridad y Rate Limiting**: Limitador de peticiones integrado para proteger los créditos de OpenAI de ataques de denegación o bots.
- **Generación Inteligente**: Corrige entradas inválidas, completa datos faltantes con valores probables y respeta estrictamente preferencias.
- **Testing Automatizado**: Pruebas unitarias configuradas para validar la robustez de los endpoints.

## Tecnologías utilizadas
- **Node.js + Express** → Servidor backend, rutas y middleware de seguridad.
- **express-rate-limit** → Protección contra abusos de la API.
- **OpenAI Chat Completions API (GPT-4o-mini)** → Generación de dietas con control estricto de formato.
- **JavaScript Vanilla (ES6 Modules)** → Frontend modular (`api.js`, `ui.js`, `main.js`) y fetch nativo.
- **Jest + Supertest** → Pruebas unitarias automatizadas.
- **HTML5 + CSS3 puro** → Diseño Glassmorphism, CSS Variables, animaciones `@keyframes` y diseño completamente responsive.
- **dotenv** → Gestión segura de variables de entorno.
- **markdown-it** → Renderizado seguro de Markdown a HTML en el cliente.

## Estructura del proyecto
pro_4---assistant-de-nutricion-con-ia/
├── app.js                    # Punto de entrada del servidor Express
├── routes/
│   └── dietRoutes.js         # Enrutador de la API y middlewares
├── controllers/
│   └── dietController.js     # Lógica de validación HTTP y respuestas
├── services/
│   └── openaiService.js      # Comunicación con OpenAI y Prompts
├── tests/
│   └── diet.test.js          # Pruebas unitarias con Jest
├── package.json
├── .env.example              # Plantilla para variables de entorno
├── .gitignore                
├── public/
│   ├── index.html            # UI principal
│   ├── Assets/
│   │   ├── CSS/styles.css    # Estilos Premium (Glassmorphism, variables)
│   │   ├── JS/api.js         # Fetch y comunicación con backend
│   │   ├── JS/ui.js          # Manipulación del DOM y renderizado Markdown
│   │   ├── JS/main.js        # Orquestador del estado de la app
│   │   └── Imgs/             
└── README.md                 # Esta documentación

## Habilidades demostradas
Este proyecto refleja competencias de un desarrollador Full-Stack avanzado (Nivel Ssr) listo para aportar valor:

- **Arquitectura de Software:** Separación de responsabilidades (MVC) y modularización nativa sin frameworks (ES Modules).
- **Resolución de Problemas:** Adaptación del flujo de la app para persistencia de datos en entornos Serverless (Vercel).
- **Backend Sólido y Seguro:** Manejo de peticiones asíncronas, Unit Testing, Rate Limiting y validación estricta.
- **Ingeniería de Prompts Avanzada:** Control de formato estricto y manejo estadístico de parámetros ausentes.
- **Frontend y Diseño Moderno:** Creación de UI/UX fluida con físicas elásticas, prevención de bugs de cliente (bloqueo de eventos) y sanitización de outputs.
- Producto completo, seguro, escalable y listo para producción empresarial.

## Demo en vivo
(https://assistant-de-nutrici-n.vercel.app/)

## Notas para empleadores
Este es uno de mis proyectos full-stack más completos y robustos hasta la fecha. Lo construí desde cero enfocándome tanto en la funcionalidad y experiencia de usuario, como en la calidad subyacente del código. Demuestra que:

- Entiendo y aplico patrones de diseño de software (MVC, Módulos).
- Domino backend y frontend sin depender de frameworks pesados, conociendo a fondo JavaScript.
- Me preocupo por la seguridad, el testing automatizado y la protección de recursos en la nube.
- Escribo prompts estructurados que garantizan resultados consistentes en Inteligencia Artificial.
- Estoy capacitado para identificar problemas de infraestructura (como la pérdida de estado en Serverless) y solucionarlos con reingeniería inteligente.

Estoy 100% listo para aportar valor real en un equipo como Full-Stack Developer. Busco mi primera oportunidad profesional y ¡me encantaría trabajar contigo!

## Contacto
- **GitHub:** github.com/JesusBustos12
- **LinkedIn:** linkedin.com/in/jesus-bustos-arizmendi-325329283
- **Correo:** jesusbustosarizmendi0@gmail.com

¡Gracias por revisar mi trabajo! 🚀
