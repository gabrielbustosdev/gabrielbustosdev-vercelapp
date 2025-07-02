# gabrielbustosdev

Sitio web profesional de Gabriel Bustos, desarrollador web y consultor en automatización e inteligencia artificial.  
Incluye un chatbot inteligente, formularios de contacto avanzados y un flujo optimizado para la captación de leads y consultas.

---

## Índice

- [gabrielbustosdev](#gabrielbustosdev)
  - [Índice](#índice)
  - [Características principales](#características-principales)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Chatbot inteligente](#chatbot-inteligente)
  - [Formularios de contacto y modal de consulta](#formularios-de-contacto-y-modal-de-consulta)
  - [Resumen automático de conversación](#resumen-automático-de-conversación)
  - [Tecnologías utilizadas](#tecnologías-utilizadas)
  - [Instalación y ejecución](#instalación-y-ejecución)
  - [Despliegue](#despliegue)
  - [Contribuciones](#contribuciones)
  - [Licencia](#licencia)
  - [Variables de entorno necesarias](#variables-de-entorno-necesarias)
    - [Variables para email (Gmail API)](#variables-para-email-gmail-api)
    - [Variables generales del sitio](#variables-generales-del-sitio)
    - [Variables para OpenRouter (IA)](#variables-para-openrouter-ia)

---

## Características principales

- **Chatbot profesional** con IA, capaz de:
  - Guiar al usuario, descubrir necesidades y proponer soluciones personalizadas.
  - Detectar automáticamente la intención de agendar una consulta y mostrar un botón contextual.
  - Generar un resumen profesional de la conversación para facilitar el contacto y seguimiento.

- **Formularios de contacto** robustos y validados, integrados con el chatbot y preparados para futuras integraciones (CRM, email, etc.).

- **Modal de consulta** que muestra el resumen de la conversación y permite enviar una solicitud de contacto con contexto completo.

- **Persistencia de conversación** durante la sesión, asegurando continuidad y mejor experiencia de usuario.

---

## Estructura del proyecto

```
gabrielbustosdev/
  ├── app/                # Páginas y rutas API (Next.js App Router)
  │   ├── api/            # Endpoints backend (chat, summary, form)
  │   ├── contacto/       # Página de contacto
  │   ├── portafolio/     # Página de portafolio
  │   ├── servicios/      # Página de servicios
  │   └── ...             # Otras páginas (privacidad, términos, etc.)
  ├── components/         # Componentes reutilizables (Chatbot, Modal, Navbar, etc.)
  ├── hooks/              # Custom hooks (ChatContext)
  ├── lib/                # Lógica de negocio (detección de intención, guardrails, email, etc.)
  ├── public/             # Recursos estáticos (imágenes, íconos, etc.)
  ├── schemas/            # Esquemas de validación (Zod)
  ├── docs/               # Documentación y changelog
  └── ...                 # Configuración y archivos raíz
```

---

## Chatbot inteligente

- **Persistencia de mensajes:**  
  El contexto global (`ChatContext`) almacena los mensajes relevantes de usuario y asistente durante la sesión, excluyendo el mensaje de bienvenida.

- **Flujo conversacional guiado:**  
  El bot utiliza un prompt optimizado para descubrir la necesidad real del usuario, profundizar con preguntas y, cuando corresponde, invitar a agendar una reunión o consulta.

- **Detección de intención:**  
  Se utiliza la función `shouldShowScheduleButton` para analizar las respuestas del asistente y mostrar el botón "Agendar una consulta" solo cuando es relevante.

- **Validaciones y guardrails:**  
  El backend valida que el asistente:
  - Haga preguntas relevantes si la necesidad no está clara.
  - Invite a agendar una reunión cuando la necesidad esté clara.
  - No deje la conversación sin un siguiente paso concreto.

---

## Formularios de contacto y modal de consulta

- **Modal de consulta:**  
  Al hacer clic en "Agendar una consulta", se abre un modal que muestra el resumen de la conversación y un formulario de contacto.

- **Formulario validado:**  
  El formulario solicita datos clave (nombre, email, empresa, teléfono, tipo de proyecto, fecha y hora preferida, mensaje adicional) y adjunta automáticamente el resumen generado.

- **Envío seguro:**  
  Los datos se envían al backend, donde se validan y procesan (por ejemplo, para envío por email o integración futura con CRM).

---

## Resumen automático de conversación

- **Generación de resumen:**  
  El endpoint `/api/summary` recibe el historial de mensajes y genera un resumen profesional usando IA (modelo deepseek/deepseek-r1-0528-qwen3-8b:free).

- **Uso del resumen:**  
  El resumen se muestra en el modal de consulta y se adjunta al enviar el formulario, proporcionando contexto completo para el seguimiento.

---

## Tecnologías utilizadas

- **Frontend:** Next.js (App Router), React, TypeScript, TailwindCSS
- **Backend:** API Routes de Next.js, Vercel AI SDK, OpenRouter
- **Validación:** Zod
- **Email:** Plantillas personalizadas y envío desde backend
- **Otros:** Context API, hooks personalizados, buenas prácticas de UX y arquitectura

---

## Instalación y ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/gabrielbustosdev.git
   cd gabrielbustosdev
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Crea un archivo `.env.local` con tus claves necesarias (por ejemplo, `OPENROUTER_API_KEY`).

4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Despliegue

El proyecto está preparado para despliegue en Vercel.  
Consulta la [documentación oficial de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.

---

## Contribuciones

¡Las contribuciones son bienvenidas!  
Por favor, abre un issue o pull request siguiendo las buenas prácticas y convenciones del proyecto.

---

## Licencia

Este proyecto es de uso privado para la marca personal de Gabriel Bustos. El código fuente se publica únicamente con fines educativos y de referencia.

- **Prohibido el uso comercial:** No está permitido utilizar, redistribuir, vender o modificar este código con fines comerciales o lucrativos.
- **Licencia:** [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](LICENSE)

Para usos comerciales o colaboraciones, contacta a través del formulario del sitio.

---

## Variables de entorno necesarias

Para el correcto funcionamiento del sitio y sus integraciones (chatbot, formularios, email y generación de resumen), debes definir las siguientes variables de entorno en un archivo `.env.local` en la raíz del proyecto:

### Variables para email (Gmail API)

Estas variables permiten el envío seguro de emails desde los formularios de contacto:

```env
GMAIL_CLIENT_ID=tu_client_id_de_gmail
GMAIL_CLIENT_SECRET=tu_client_secret_de_gmail
GMAIL_REFRESH_TOKEN=tu_refresh_token_de_gmail
GMAIL_USER=tu_cuenta@gmail.com
ADMIN_EMAIL=correo_destino@tudominio.com
```
- **GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET / GMAIL_REFRESH_TOKEN:** Credenciales OAuth2 para autenticar el envío de emails vía Gmail API.
- **GMAIL_USER:** Cuenta de Gmail desde la que se envían los correos.
- **ADMIN_EMAIL:** Email del administrador o destino principal de los formularios.

### Variables generales del sitio

```env
NEXT_PUBLIC_SITE_URL=https://tusitio.com
```
- **NEXT_PUBLIC_SITE_URL:** URL pública del sitio, utilizada en enlaces y redirecciones.

### Variables para OpenRouter (IA)

El proyecto utiliza dos API keys de OpenRouter para distribuir la carga y evitar limitaciones de uso en modelos gratuitos:

```env
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_API_KEY=tu_api_key_chat
OPENROUTER_API_KEY_SUMMARY=tu_api_key_summary
```
- **OPENROUTER_BASE_URL:** URL base de la API de OpenRouter (por defecto: https://openrouter.ai/api/v1).
- **OPENROUTER_API_KEY:** API Key utilizada exclusivamente para el chatbot (interacción en tiempo real con el usuario).
- **OPENROUTER_API_KEY_SUMMARY:** API Key utilizada exclusivamente para la generación de resúmenes de conversación.

> **Nota:** Usar dos API keys diferentes permite balancear la carga y evitar bloqueos o límites de uso en modelos gratuitos, asegurando una mejor experiencia tanto en el chat como en la generación de resúmenes.

---

Asegúrate de no compartir ni subir este archivo a repositorios públicos.
