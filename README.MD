# Asistente de Nutrición con IA

## Descripción
Aplicación web full-stack que genera **dietas personalizadas** utilizando la API de Chat Completions de OpenAI (modelo GPT-4o-mini).

El usuario responde a una serie de preguntas mediante una interfaz conversacional, indicando datos como peso, altura, metas nutricionales, alergias y preferencias alimenticias. Una vez recopilada la información, la IA genera un plan semanal estructurado en formato Markdown.

Construido con **Node.js, Express, JavaScript Vanilla (ES Modules) y CSS puro**, el proyecto se enfoca en rendimiento, escalabilidad y una experiencia de usuario fluida con un diseño moderno (Glassmorphism).

## Características Principales

- **Arquitectura MVC y ES Modules**: Código modular separando rutas, controladores, servicios y lógica de UI/API.
- **Seguridad y Rate Limiting Avanzado**: Implementación de límite de peticiones (Rate Limiting) validado por una base de datos MySQL en la nube. Emplea un sistema de control por IP para mitigar vulnerabilidades y abusos, previniendo evasiones mediante la eliminación de datos del navegador (Clear Data). Las peticiones se restablecen de manera automatizada cada 24 horas.
- **Interfaz Reactiva e Inteligente**: Flujo conversacional optimizado y componentes visuales que reflejan el estado del servidor en tiempo real. La barra de límite de peticiones se sincroniza dinámicamente con la lógica del backend mediante validaciones por IP, garantizando consistencia visual inquebrantable.
- **Exportación Segura a PDF**: Funcionalidad de descarga de recetas en formato PDF procesada de forma segura en el lado del cliente (Client-side rendering). Esto optimiza los recursos del servidor y protege la privacidad de los datos generados al no requerir viajes de retorno (round-trips) al backend.
- **Optimización SEO**: Implementación de etiquetas semánticas, meta descripciones y Open Graph (OG) adaptadas al contexto de la aplicación, optimizando el posicionamiento web y la visualización enriquecida al compartir enlaces en redes.
- **Generación Inteligente**: Corrección de entradas inválidas y manejo de datos incompletos mediante prompts avanzados, respetando estrictamente las preferencias del usuario.
- **Protección contra Prompt Injection**: Integración de validación estricta de esquemas de datos en el servidor utilizando **Zod**, previniendo ataques maliciosos o el envío masivo de caracteres hacia la API de OpenAI.
- **Exportación a PDF de Alto Contraste**: Generación de documentos PDF limpios con un modo de "Exportación" que desactiva las transparencias del *Glassmorphism* en favor de colores sólidos y vibrantes, asegurando una lectura óptima fuera de la pantalla.

## Tecnologías Utilizadas

- **Backend**: Node.js, Express, MySQL (mysql2).
- **IA**: OpenAI Chat Completions API (GPT-4o-mini).
- **Frontend**: JavaScript Vanilla (ES6 Modules), HTML5 semántico, CSS3 puro (CSS Variables, Glassmorphism, animaciones).
- **Librerías y Herramientas**: `dotenv` para gestión de entorno, `zod` para validación estricta de *payloads*, `markdown-it` para renderizado seguro de Markdown, `html2pdf.js` para generación de documentos.
- **Testing**: Jest + Supertest para pruebas unitarias automatizadas.

## Estructura del Proyecto

```text
pro_4---assistant-de-nutricion-con-ia/
├── app.js                    # Punto de entrada del servidor Express
├── config/                   # Configuraciones de conexión (Base de datos)
├── routes/
│   └── dietRoutes.js         # Enrutador de la API y middlewares de límite
├── controllers/
│   └── dietController.js     # Lógica de validación HTTP y respuestas
├── services/
│   └── openaiService.js      # Comunicación con OpenAI y Prompts
├── tests/
│   └── diet.test.js          # Pruebas unitarias con Jest
├── package.json
├── public/
│   ├── index.html            # UI principal, estructura semántica y meta tags (SEO)
│   ├── Assets/
│   │   ├── CSS/styles.css    # Estilos (Glassmorphism, variables)
│   │   ├── JS/api.js         # Fetch y comunicación asíncrona con el backend
│   │   ├── JS/ui.js          # Manipulación del DOM, Markdown y Exportación PDF
│   │   ├── JS/main.js        # Orquestador del estado de la app
│   │   └── Imgs/             
└── README.md                 # Esta documentación
```

## Demo en vivo
https://assistant-de-nutrici-n.vercel.app/

## Contacto
- **GitHub:** [JesusBustos12](https://github.com/JesusBustos12)
- **LinkedIn:** [Jesus Bustos Arizmendi](https://linkedin.com/in/jesus-bustos-arizmendi-325329283)
- **Correo:** jesusbustosarizmendi0@gmail.com
