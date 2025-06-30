# Gabriel Bustos - Portfolio Profesional

## 🚀 Descripción

Portfolio profesional de Gabriel Bustos, desarrollador full-stack especializado en tecnologías modernas, inteligencia artificial y automatización. El proyecto incluye un chatbot inteligente con contexto evolutivo, sistema de formularios robusto y una arquitectura escalable.

## ✨ Características Principales

### 🤖 Chatbot Inteligente
- **Contexto Evolutivo**: Sistema que aprende y mantiene contexto de conversaciones
- **Sugerencias Inteligentes**: Recomendaciones contextuales basadas en la conversación
- **Análisis de Intención**: Detección automática de intenciones del usuario
- **Persistencia de Estado**: Conversaciones guardadas con Zustand
- **Integración con IA**: Conexión con OpenAI para respuestas inteligentes

### 🎨 Interfaz Moderna
- **Diseño Responsivo**: Optimizado para todos los dispositivos
- **Tema Oscuro**: Interfaz elegante con gradientes y efectos visuales
- **Animaciones Suaves**: Transiciones fluidas con Framer Motion
- **Componentes Reutilizables**: Arquitectura modular y escalable

### 📝 Sistema de Formularios
- **Validación Robusta**: Validación en tiempo real con patrones personalizados
- **Componentes Reutilizables**: FormField y Modal genéricos
- **Hooks Personalizados**: useForm para manejo de estado de formularios
- **Tipos TypeScript**: Tipado completo para formularios y validación

### 🔧 Arquitectura Técnica
- **Estado Centralizado**: Zustand para manejo de estado global
- **Tipos Robustos**: TypeScript con tipos bien definidos
- **Logging Estructurado**: Sistema de logging configurable
- **Middleware de Seguridad**: Guardrails para protección de APIs
- **Base de Conocimiento**: Sistema de conocimiento contextual

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático completo
- **Tailwind CSS**: Framework de estilos utilitarios
- **Framer Motion**: Animaciones y transiciones
- **Zustand**: Manejo de estado global
- **Lucide React**: Iconografía moderna

### Backend & APIs
- **Next.js API Routes**: APIs serverless
- **OpenAI API**: Integración con GPT para el chatbot
- **Nodemailer**: Envío de emails
- **Middleware**: Validación y seguridad

### Herramientas de Desarrollo
- **ESLint**: Linting de código
- **PostCSS**: Procesamiento de CSS
- **TypeScript**: Compilador y verificador de tipos

## 📁 Estructura del Proyecto

```
gabrielbustosdev/
├── app/                    # App Router de Next.js
│   ├── api/               # APIs serverless
│   │   ├── chat/          # API del chatbot
│   │   ├── contact/       # API de contacto
│   │   ├── quote/         # API de cotizaciones
│   │   └── ...
│   ├── contacto/          # Página de contacto
│   ├── portafolio/        # Página de portafolio
│   ├── servicios/         # Página de servicios
│   └── ...
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI reutilizables
│   │   ├── FormField.tsx # Campo de formulario genérico
│   │   └── Modal.tsx     # Modal reutilizable
│   ├── Chatbot.tsx       # Componente principal del chatbot
│   ├── ChatSuggestions.tsx # Sugerencias del chatbot
│   └── ...
├── lib/                  # Utilidades y servicios
│   ├── hooks/           # Hooks personalizados
│   │   ├── useForm.ts   # Hook para formularios
│   │   └── useContextEvolution.ts # Hook de contexto evolutivo
│   ├── services/        # Servicios de negocio
│   │   ├── contextEvolution.ts # Servicio de contexto evolutivo
│   │   ├── validation.ts # Servicio de validación
│   │   └── logger.ts    # Servicio de logging
│   ├── store/           # Estado global
│   │   └── chatStore.ts # Store del chatbot con Zustand
│   ├── types/           # Tipos TypeScript
│   │   ├── chat.ts      # Tipos del chatbot
│   │   ├── forms.ts     # Tipos de formularios
│   │   └── index.ts     # Tipos globales
│   ├── email.ts         # Configuración de email
│   ├── guardrails.ts    # Middleware de seguridad
│   └── knowledge-base.ts # Base de conocimiento
├── public/              # Archivos estáticos
│   ├── projects/        # Imágenes de proyectos
│   └── tech/           # Iconos de tecnologías
└── ...
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de OpenAI (para el chatbot)

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/gabrielbustosdev.git
cd gabrielbustosdev
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus configuraciones:
```env
# OpenAI
OPENAI_API_KEY=tu_api_key_de_openai

# Email (opcional)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=tu_email@gmail.com
EMAIL_SERVER_PASS=tu_password_de_aplicacion

# Configuración de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
# o
yarn dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 🔧 Configuración Avanzada

### Configuración del Chatbot

El chatbot utiliza un sistema de contexto evolutivo que se puede configurar en `lib/services/contextEvolution.ts`:

```typescript
// Configuración del contexto evolutivo
const CONTEXT_CONFIG = {
  maxEntries: 50,
  confidenceThreshold: 0.7,
  contextWindow: 2000,
  enableLearning: true
}
```

### Configuración de Validación

Los formularios utilizan un sistema de validación centralizado en `lib/services/validation.ts`:

```typescript
// Agregar nuevas reglas de validación
export const CUSTOM_VALIDATION = {
  customField: {
    required: true,
    pattern: /^[A-Za-z]+$/,
    customMessage: "Solo letras permitidas"
  }
}
```

### Configuración de Logging

El sistema de logging se puede configurar en `lib/services/logger.ts`:

```typescript
// Configuración de niveles de log
const LOG_LEVELS = {
  development: 'debug',
  production: 'warn',
  test: 'error'
}
```

## 📊 Características del Chatbot

### Contexto Evolutivo
- **Análisis de Mensajes**: Extrae información relevante automáticamente
- **Memoria de Conversación**: Mantiene contexto entre sesiones
- **Aprendizaje Continuo**: Mejora respuestas basado en interacciones
- **Sugerencias Inteligentes**: Ofrece recomendaciones contextuales

### Funcionalidades
- **Detección de Intención**: Identifica automáticamente el propósito del usuario
- **Extracción de Datos**: Captura información de proyectos, presupuestos, etc.
- **Sugerencias de Consulta**: Propone agendar consultas cuando es apropiado
- **Persistencia**: Guarda conversaciones en localStorage

## 🎯 Páginas Principales

### Home (`/`)
- Hero section con información personal
- Servicios destacados
- Proyectos recientes
- Chatbot integrado

### Servicios (`/servicios`)
- Catálogo completo de servicios
- Formularios de cotización
- Información detallada de cada servicio

### Portafolio (`/portafolio`)
- Galería de proyectos
- Casos de estudio
- Tecnologías utilizadas

### Contacto (`/contacto`)
- Formulario de contacto
- Información de contacto
- Ubicación y horarios

## 🔒 Seguridad

### Middleware de Protección
- **Rate Limiting**: Protección contra spam
- **Validación de Entrada**: Sanitización de datos
- **Guardrails**: Protección contra prompts maliciosos
- **CORS**: Configuración de seguridad para APIs

### Validación de Formularios
- **Validación del Cliente**: Validación en tiempo real
- **Validación del Servidor**: Doble verificación
- **Sanitización**: Limpieza de datos de entrada
- **Tipos Seguros**: TypeScript para prevenir errores

## 📈 Optimizaciones

### Performance
- **Lazy Loading**: Carga diferida de componentes
- **Image Optimization**: Optimización automática de imágenes
- **Code Splitting**: División automática de código
- **Caching**: Cache inteligente con Next.js

### SEO
- **Meta Tags**: Configuración completa de SEO
- **Sitemap**: Generación automática
- **Structured Data**: Datos estructurados para buscadores
- **Performance**: Core Web Vitals optimizados

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e
```

### Cobertura de Código
```bash
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

### Otros Proveedores
- **Netlify**: Configuración similar a Vercel
- **AWS**: Usar AWS Amplify
- **Docker**: Dockerfile incluido para contenedores

## 🤝 Contribución

### Guías de Contribución
1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Estándares de Código
- **TypeScript**: Tipado estricto requerido
- **ESLint**: Configuración automática
- **Prettier**: Formateo automático
- **Commits**: Convención de commits semánticos

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Contacto

- **Email**: gabriel@bustos.dev
- **LinkedIn**: [Gabriel Bustos](https://linkedin.com/in/gabrielbustos)
- **GitHub**: [@gabrielbustos](https://github.com/gabrielbustos)
- **Portfolio**: [gabrielbustos.dev](https://gabrielbustos.dev)

## 🙏 Agradecimientos

- **OpenAI**: Por la API de GPT
- **Vercel**: Por la plataforma de hosting
- **Tailwind CSS**: Por el framework de estilos
- **Framer Motion**: Por las animaciones
- **Zustand**: Por el manejo de estado

---

**Desarrollado con ❤️ por Gabriel Bustos**
