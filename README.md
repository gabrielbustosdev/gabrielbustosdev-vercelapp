# Gabriel Bustos Dev - Portafolio Profesional con Chatbot Inteligente

## 🚀 Descripción del Proyecto

Portafolio profesional de Gabriel Bustos, desarrollador especializado en desarrollo web moderno e integración de inteligencia artificial. El proyecto incluye un chatbot conversacional avanzado con capacidades de procesamiento de lenguaje natural (NLP), personalización dinámica y sistema de guardrails robusto.

## ✨ Características Principales

### 🌐 Sitio Web Profesional
- **Diseño Moderno**: Interfaz elegante con gradientes y animaciones
- **Responsive**: Optimizado para todos los dispositivos
- **Performance**: Construido con Next.js 15 y optimizado para velocidad
- **SEO**: Configurado para mejor posicionamiento en buscadores

### 🤖 Chatbot Inteligente Avanzado
- **Procesamiento de Lenguaje Natural (NLP)**: Análisis inteligente de mensajes
- **Personalización Dinámica**: Adaptación automática al tipo de cliente
- **Sistema de Guardrails**: Control de calidad y seguridad
- **Motor de Conversación Natural**: Flujo conversacional fluido
- **Extracción de Entidades**: Detección automática de información clave
- **Análisis de Sentimiento**: Comprensión del estado emocional del usuario

## 🏗️ Arquitectura del Sistema

### Frontend
```
app/
├── page.tsx                    # Página principal
├── layout.tsx                  # Layout global
├── globals.css                 # Estilos globales
├── servicios/                  # Página de servicios
├── portafolio/                 # Portafolio de proyectos
├── contacto/                   # Formulario de contacto
├── privacidad/                 # Política de privacidad
└── terminos/                   # Términos y condiciones
```

### API Routes
```
app/api/
├── chat/                       # Endpoint principal del chatbot
├── chat-consultation/          # Gestión de consultas del chat
├── contact/                    # Formulario de contacto
├── quote/                      # Solicitudes de cotización
└── schedule-consultation/      # Agendamiento de consultas
```

### Componentes Principales
```
components/
├── Chatbot.tsx                 # Componente principal del chatbot
├── ChatBotProvider.tsx         # Provider del contexto del chatbot
├── ChatConsultationModal.tsx   # Modal de consulta del chat
├── ConsultationModal.tsx       # Modal de agendamiento
├── QuoteModal.tsx              # Modal de cotización
├── Hero.tsx                    # Sección hero principal
├── Navbar.tsx                  # Navegación
├── Footer.tsx                  # Pie de página
└── [Componentes de UI]         # Componentes de interfaz
```

### Hooks Personalizados
```
hooks/
├── use-chatbot.ts              # Hook principal del chatbot
├── chatbot-reducer.ts          # Reducer para estado del chat
├── use-personalization.ts      # Personalización dinámica
├── client-personality-detector.ts # Detector de personalidad
├── personalized-response-engine.ts # Motor de respuestas
├── natural-conversation-engine.ts # Motor de conversación natural
├── use-form-validation.ts      # Validación de formularios
└── types.ts                    # Tipos TypeScript
```

### Librerías y Utilidades
```
lib/
├── nlp-processor.ts            # Procesamiento de lenguaje natural
├── guardrails.ts               # Sistema de guardrails
├── middleware.ts               # Middleware de IA
├── intelligent-response-engine.ts # Motor de respuestas inteligentes
├── knowledge-base.ts           # Base de conocimiento
└── email.ts                    # Configuración de email
```

### Esquemas y Validaciones
```
schemas/
├── client.ts                   # Esquemas de cliente
├── projects.ts                 # Esquemas de proyectos
├── conversation.ts             # Esquemas de conversación
├── validations.ts              # Validaciones con Zod
└── index.ts                    # Exportaciones
```

## 🤖 Sistema de Chatbot Inteligente

### 1. Procesamiento de Lenguaje Natural (NLP)

#### Entidades Detectadas
- **Nombres**: Detección automática de nombres de personas
- **Emails**: Extracción de direcciones de correo
- **Teléfonos**: Identificación de números de contacto
- **Presupuestos**: Detección de montos y rangos de presupuesto
- **Tipos de Proyecto**: Clasificación automática de servicios
- **Plazos**: Extracción de fechas y timelines
- **Empresas**: Identificación de nombres de empresas
- **Ubicaciones**: Detección de ubicaciones geográficas

#### Intenciones Clasificadas
- Saludos y despedidas
- Consultas sobre proyectos
- Discusiones de presupuesto
- Solicitudes de contacto
- Preguntas técnicas
- Indicadores de urgencia
- Confirmaciones y objeciones

#### Análisis de Sentimiento
- **Score**: -1 (muy negativo) a 1 (muy positivo)
- **Emociones**: Alegría, tristeza, ira, miedo, sorpresa
- **Adaptación de Tono**: Respuestas ajustadas al estado emocional

### 2. Sistema de Personalización Dinámica

#### Tipos de Cliente Detectados
- **Ejecutivo**: Enfoque en ROI, resultados, estrategia
- **Emprendedor**: Enfoque en crecimiento, escalabilidad, innovación
- **Desarrollador**: Enfoque en arquitectura, performance, mejores prácticas
- **Marketer**: Enfoque en conversión, experiencia de usuario, branding
- **Consultor**: Enfoque en estrategia, proceso, recomendaciones

#### Características Analizadas
- Nivel técnico (principiante, intermedio, avanzado)
- Nivel de urgencia (bajo, medio, alto)
- Sensibilidad al presupuesto
- Estilo de toma de decisiones
- Preferencias de comunicación

### 3. Sistema de Guardrails Expandido

#### Contenido Prohibido
- Precios exactos sin consulta
- Garantías 100%
- Información confidencial
- Datos de otros clientes
- Código fuente completo
- Contraseñas o credenciales

#### Filtros de Calidad
- **Indicadores Positivos**: Específico, detallado, claro, preciso
- **Indicadores Negativos**: Vago, confuso, incompleto, irrelevante
- **Puntuación de Relevancia**: Verificación de coherencia temática
- **Estructura**: Evaluación de coherencia y organización

#### Límites de Control
- **Tiempo de Conversación**: Máximo 30 minutos
- **Número de Mensajes**: Máximo 50 mensajes
- **Longitud de Respuesta**: Máximo 800 caracteres
- **Intentos de Recuperación**: Máximo 3 por sesión

### 4. Motor de Conversación Natural

#### Estados de Conversación
- **idle**: Estado inicial
- **greeting**: Saludo inicial
- **collecting_info**: Recolectando información
- **suggesting_consultation**: Sugiriendo consulta
- **consultation_modal_open**: Modal de consulta abierto
- **completed**: Conversación completada

#### Flujo Inteligente
- Detección automática de oportunidades de consulta
- Extracción de información clave
- Sugerencias contextuales
- Apertura automática de modales

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15**: Framework de React con App Router
- **React 19**: Biblioteca de interfaz de usuario
- **TypeScript**: Tipado estático para JavaScript
- **Tailwind CSS**: Framework de CSS utility-first
- **Motion**: Animaciones y transiciones
- **Lucide React**: Iconografía moderna

### Backend y APIs
- **OpenRouter AI**: Proveedor de modelos de IA
- **AI SDK**: SDK oficial de Vercel para IA
- **Nodemailer**: Envío de emails
- **Google APIs**: Integración con servicios de Google

### Validación y Tipos
- **Zod**: Validación de esquemas en tiempo de ejecución
- **TypeScript**: Tipado estático completo

### Herramientas de Desarrollo
- **ESLint**: Linting de código
- **PostCSS**: Procesamiento de CSS
- **Turbopack**: Bundler rápido para desarrollo

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm, yarn, pnpm o bun

### Instalación
```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd gabrielbustosdev

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
```

### Variables de Entorno
```env
# API Keys
OPENROUTER_API_KEY=tu_api_key_de_openrouter

# Email (opcional)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=tu_email@gmail.com
EMAIL_SERVER_PASSWORD=tu_password_de_aplicacion

# Google APIs (opcional)
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
```

### Comandos Disponibles
```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con Turbopack

# Producción
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción

# Linting
npm run lint         # Ejecutar ESLint
```

## 🎯 Funcionalidades Avanzadas

### Modo Admin del Chatbot
- **Activación**: Presionar `Ctrl+M` mientras el chat está abierto
- **Paneles Disponibles**:
  - Métricas de conversación en tiempo real
  - Análisis de personalización
  - Progreso de información recopilada
  - Sistema de guardrails
  - Análisis NLP

### Sistema de Validación en Tiempo Real
- Validación de formularios con feedback inmediato
- Debounce automático para mejor UX
- Mensajes de error personalizados en español
- Integración con React sin problemas

### Motor de Respuestas Inteligentes
- Plantillas dinámicas basadas en contexto
- Ajuste automático de tono según sentimiento
- Preguntas de seguimiento automáticas
- Indicadores de urgencia

### Base de Conocimiento Integrada
- Información sobre servicios y tecnologías
- Respuestas contextuales y precisas
- Actualización dinámica de contenido
- Integración con RAG (Retrieval-Augmented Generation)

## 📊 Estructura de Datos

### Esquemas de Cliente
```typescript
interface ClientBasicInfo {
  name: string
  email: string
  phone?: string
  company?: string
}

interface CompleteClient extends ClientBasicInfo {
  location: LocationInfo
  company: CompanyInfo
  preferences: ClientPreferences
}
```

### Esquemas de Proyecto
```typescript
interface BaseProject {
  id: string
  title: string
  description: string
  category: ProjectCategory
  serviceType: ServiceType
  complexity: 'simple' | 'medium' | 'complex'
}

interface WebDevelopmentProject extends BaseProject {
  requirements: WebRequirements
  technologies: string[]
  timeline: TimelineInfo
}
```

### Esquemas de Conversación
```typescript
interface ConversationData {
  clientName?: string
  clientEmail?: string
  projectType?: string
  budget?: string
  timeline?: string
  requirements?: string
  urgency?: 'low' | 'medium' | 'high'
}
```

## 🔧 Configuración Avanzada

### Personalización del Chatbot
```typescript
// hooks/use-personalization.ts
const {
  clientPersonality,
  serviceContext,
  conversationMemory,
  currentTone,
  analyzeConversation,
  generatePersonalizedResponse
} = usePersonalization()
```

### Configuración de Guardrails
```typescript
// lib/guardrails.ts
const guardrailConfig = {
  enableContentFiltering: true,
  enableFactChecking: true,
  enableToneValidation: true,
  enableScopeValidation: true,
  enableQualityFiltering: true,
  enableTimeLimits: true,
  enableConversationRecovery: true,
  maxResponseLength: 800,
  maxConversationLength: 50,
  maxConversationTime: 30,
  qualityThreshold: 0.7,
  recoveryAttempts: 3
}
```

### Configuración de NLP
```typescript
// lib/nlp-processor.ts
const nlpConfig = {
  enableEntityExtraction: true,
  enableIntentClassification: true,
  enableSentimentAnalysis: true,
  enableCompletenessDetection: true,
  confidenceThreshold: 0.7
}
```

## 📈 Métricas y Monitoreo

### Métricas de Conversación
- Número total de mensajes
- Duración de conversación
- Mensajes fuera de tema
- Puntuación de calidad
- Intentos de recuperación

### Análisis de Personalización
- Tipo de cliente detectado
- Nivel de confianza
- Características identificadas
- Preferencias inferidas

### Sistema de Guardrails
- Contenido filtrado
- Calidad de respuestas
- Desviaciones detectadas
- Recuperaciones exitosas

## 🚨 Manejo de Errores

### Errores de API
- Validación de datos con Zod
- Manejo de errores de red
- Respuestas de error estructuradas
- Logging detallado para debugging

### Errores del Chatbot
- Fallback a respuestas estándar
- Recuperación automática de conversación
- Notificaciones de error al usuario
- Logging para análisis posterior

## 🔒 Seguridad

### Protección de Datos
- Validación estricta de inputs
- Sanitización de contenido
- Límites de rate limiting
- Protección contra inyección

### Privacidad
- No almacenamiento de datos sensibles
- Anonimización de métricas
- Cumplimiento con GDPR
- Política de privacidad clara

## 📝 Documentación Adicional

### Archivos de Documentación
- `docs/GUARDRAILS_SYSTEM.md`: Sistema de guardrails detallado
- `docs/NLP_SYSTEM.md`: Procesamiento de lenguaje natural
- `docs/PERSONALIZATION_SYSTEM.md`: Sistema de personalización
- `hooks/README.md`: Documentación de hooks
- `schemas/README.md`: Documentación de esquemas
- `CHANGELOG.md`: Historial de cambios

### Ejemplos de Uso
- Integración del chatbot en componentes
- Configuración de personalización
- Uso de esquemas de validación
- Implementación de guardrails

## 🤝 Contribución

### Guías de Contribución
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de Código
- TypeScript estricto
- ESLint configurado
- Prettier para formato
- Tests unitarios (recomendado)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Gabriel Bustos**: Desarrollador principal
- **Email**: gabrielbustosdev@gmail.com
- **WhatsApp**: +54 9 3571 59-5365
- **Portfolio**: [URL del portfolio](https://gabrielbustosdev.vercel.app/)

---

**Nota**: Este proyecto está en desarrollo activo. Las funcionalidades pueden cambiar y mejorar con el tiempo.
