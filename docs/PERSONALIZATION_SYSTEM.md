# Sistema de Personalización Dinámica

## Descripción General

El sistema de personalización dinámica permite que el chatbot se adapte automáticamente al tipo de cliente, contexto del servicio y memoria de conversación para proporcionar una experiencia más natural y efectiva.

## Componentes Principales

### 1. Detector de Personalidad del Cliente (`ClientPersonalityDetector`)

**Ubicación**: `hooks/client-personality-detector.ts`

**Funcionalidad**:
- Detecta automáticamente el tipo de cliente basado en patrones de lenguaje
- Analiza características como nivel técnico, urgencia, sensibilidad al presupuesto
- Determina preferencias de comunicación y detalle

**Tipos de Cliente Detectados**:
- **Ejecutivo**: Enfoque en ROI, resultados, estrategia
- **Emprendedor**: Enfoque en crecimiento, escalabilidad, innovación
- **Desarrollador**: Enfoque en arquitectura, performance, mejores prácticas
- **Marketer**: Enfoque en conversión, experiencia de usuario, branding
- **Consultor**: Enfoque en estrategia, proceso, recomendaciones
- **General**: Respuesta estándar cuando no hay indicadores claros

**Características Analizadas**:
```typescript
interface ClientPersonality {
  type: 'executive' | 'entrepreneur' | 'developer' | 'marketer' | 'consultant' | 'general'
  confidence: number
  characteristics: {
    technicalLevel: 'beginner' | 'intermediate' | 'advanced'
    urgencyLevel: 'low' | 'medium' | 'high'
    budgetSensitivity: 'low' | 'medium' | 'high'
    decisionMakingStyle: 'analytical' | 'intuitive' | 'collaborative'
    communicationStyle: 'formal' | 'casual' | 'technical'
  }
  preferences: {
    detailLevel: 'high' | 'medium' | 'low'
    examplesNeeded: boolean
    technicalExplanations: boolean
    timelineFocus: boolean
    budgetFocus: boolean
  }
}
```

### 2. Motor de Respuestas Personalizadas (`PersonalizedResponseEngine`)

**Ubicación**: `hooks/personalized-response-engine.ts`

**Funcionalidad**:
- Genera respuestas adaptadas al tipo de cliente
- Personaliza el tono y nivel de detalle
- Incluye contexto específico del servicio
- Sugiere acciones relevantes

**Adaptaciones por Tipo de Cliente**:

#### Ejecutivo
- **Tono**: Formal
- **Enfoque**: ROI, timeline, impacto en el negocio
- **Lenguaje**: Estratégico, resultados, impacto
- **Detalle**: Bajo, enfocado en resultados

#### Emprendedor
- **Tono**: Entusiasta
- **Enfoque**: Crecimiento, escalabilidad, oportunidad de mercado
- **Lenguaje**: Crecer, escalar, oportunidad, innovación
- **Detalle**: Medio, con ejemplos

#### Desarrollador
- **Tono**: Técnico
- **Enfoque**: Arquitectura, performance, mejores prácticas
- **Lenguaje**: Arquitectura, performance, escalabilidad, código
- **Detalle**: Alto, con explicaciones técnicas

#### Marketer
- **Tono**: Casual
- **Enfoque**: Conversión, experiencia de usuario, branding
- **Lenguaje**: Conversión, experiencia, marca, audiencia
- **Detalle**: Medio, con ejemplos

#### Consultor
- **Tono**: Formal
- **Enfoque**: Estrategia, proceso, recomendaciones
- **Lenguaje**: Estrategia, proceso, recomendación, experiencia
- **Detalle**: Alto, con explicaciones detalladas

### 3. Contexto del Servicio

**Funcionalidad**:
- Detecta automáticamente el tipo de servicio mencionado
- Analiza complejidad, timeline y presupuesto
- Extrae requerimientos técnicos y objetivos de negocio

**Tipos de Servicio Detectados**:
- Landing Page
- Plataforma de IA
- E-commerce
- Dashboard
- Desarrollo de API

**Información Contextual**:
```typescript
interface ServiceContext {
  serviceType: string
  complexity: 'simple' | 'medium' | 'complex'
  timeline: 'urgent' | 'standard' | 'flexible'
  budget: 'low' | 'medium' | 'high'
  technicalRequirements: string[]
  businessGoals: string[]
}
```

### 4. Memoria de Conversación

**Funcionalidad**:
- Rastrea temas clave, decisiones y preocupaciones
- Mantiene historial de menciones de timeline y presupuesto
- Almacena preguntas técnicas y preferencias expresadas

**Estructura**:
```typescript
interface ConversationMemory {
  keyTopics: string[]
  decisions: string[]
  concerns: string[]
  preferences: string[]
  timeline: Date[]
  budgetMentions: string[]
  technicalQuestions: string[]
}
```

### 5. Hook de Personalización (`usePersonalization`)

**Ubicación**: `hooks/use-personalization.ts`

**Funcionalidad**:
- Integra todos los componentes de personalización
- Proporciona estado y acciones centralizadas
- Maneja análisis automático de conversación

**Estado del Hook**:
```typescript
interface PersonalizationState {
  clientPersonality: ClientPersonality | null
  serviceContext: ServiceContext | null
  conversationMemory: ConversationMemory
  currentTone: 'formal' | 'casual' | 'technical' | 'empathetic' | 'enthusiastic'
  isAnalyzing: boolean
}
```

**Acciones Disponibles**:
- `analyzeConversation`: Analiza mensajes para detectar personalidad y contexto
- `generatePersonalizedResponse`: Genera respuestas personalizadas
- `updateMemory`: Actualiza la memoria de conversación
- `resetPersonalization`: Reinicia el estado de personalización

### 6. Componente de Visualización (`PersonalizationDisplay`)

**Ubicación**: `components/PersonalizationDisplay.tsx`

**Funcionalidad**:
- Muestra información de personalización en tiempo real
- Visualiza tipo de cliente, confianza y características
- Presenta contexto del servicio y memoria de conversación
- Interfaz toggleable para mostrar/ocultar información

## Integración en el Chatbot

### Flujo de Personalización

1. **Análisis Automático**: Cuando hay suficientes mensajes (≥2), se activa el análisis
2. **Detección de Personalidad**: Se analiza el lenguaje para determinar el tipo de cliente
3. **Contexto del Servicio**: Se identifica el tipo de proyecto y requerimientos
4. **Memoria de Conversación**: Se construye y actualiza la memoria
5. **Respuestas Personalizadas**: Se generan respuestas adaptadas al cliente
6. **Visualización**: Se muestra información de personalización en tiempo real

### Integración en el Componente Chatbot

```typescript
// Hook de personalización
const {
  clientPersonality,
  serviceContext,
  conversationMemory,
  currentTone,
  isAnalyzing,
  analyzeConversation,
  generatePersonalizedResponse,
  updateMemory,
  resetPersonalization
} = usePersonalization()

// Análisis automático
useEffect(() => {
  if (messages.length >= 2 && !isAnalyzing) {
    analyzeConversation(messages, conversationData)
  }
}, [messages, conversationData, analyzeConversation, isAnalyzing])
```

## Características Avanzadas

### 1. Adaptación de Tono en Tiempo Real

El sistema adapta automáticamente el tono de comunicación:
- **Formal**: Para ejecutivos y consultores
- **Casual**: Para marketers y clientes generales
- **Técnico**: Para desarrolladores
- **Entusiasta**: Para emprendedores
- **Empático**: Cuando se detectan preocupaciones

### 2. Preguntas de Seguimiento Personalizadas

Las preguntas de seguimiento se adaptan según:
- Tipo de cliente detectado
- Contexto del servicio
- Memoria de conversación
- Campo específico solicitado

### 3. Sugerencias de Acción Contextuales

Se sugieren acciones relevantes basadas en:
- Tipo de personalidad del cliente
- Contexto del servicio
- Estado de la conversación

### 4. Memoria Mejorada

La memoria de conversación incluye:
- Temas clave mencionados
- Decisiones tomadas
- Preocupaciones expresadas
- Preferencias del cliente
- Timeline y presupuesto mencionados
- Preguntas técnicas realizadas

## Configuración y Personalización

### Indicadores de Personalidad

Los indicadores se pueden personalizar en `ClientPersonalityDetector`:

```typescript
private static readonly PERSONALITY_INDICATORS = {
  executive: {
    keywords: ['ceo', 'director', 'gerente', 'presidente', 'vp', 'c-level'],
    patterns: ['resultados', 'impacto', 'negocio', 'estrategia'],
    // ... características
  },
  // ... otros tipos
}
```

### Plantillas de Respuesta

Las plantillas de respuesta se pueden personalizar en `PersonalizedResponseEngine`:

```typescript
private static readonly SERVICE_TEMPLATES = {
  landing_page: {
    templates: [
      "Perfecto para tu {project_type}. Una landing page optimizada puede aumentar tus conversiones hasta un {conversion_improvement}%.",
      // ... más plantillas
    ],
    focusAreas: ['conversion', 'design', 'user_experience'],
    examples: ['formularios de contacto', 'testimonios', 'llamadas a la acción']
  },
  // ... otros servicios
}
```

## Métricas y Monitoreo

### Métricas Disponibles

- **Confianza de Detección**: Porcentaje de confianza en la detección de personalidad
- **Tipo de Cliente**: Distribución de tipos de cliente detectados
- **Contexto de Servicio**: Tipos de servicio más solicitados
- **Tono de Comunicación**: Distribución de tonos utilizados
- **Memoria de Conversación**: Estadísticas de temas y decisiones

### Logging

El sistema incluye logging detallado:
```typescript
console.log('[Personalization] Analysis complete:', {
  personality: personality.type,
  confidence: personality.confidence,
  serviceType: serviceContext.serviceType,
  tone: currentTone
})
```

## Beneficios del Sistema

### 1. Experiencia Personalizada
- Cada cliente recibe respuestas adaptadas a su perfil
- El tono se ajusta automáticamente
- El nivel de detalle se personaliza

### 2. Mayor Efectividad
- Respuestas más relevantes y contextuales
- Mejor comprensión de las necesidades del cliente
- Sugerencias de acción más precisas

### 3. Escalabilidad
- Sistema automático que no requiere configuración manual
- Análisis en tiempo real de cada conversación
- Adaptación continua durante la conversación

### 4. Insights de Negocio
- Información detallada sobre tipos de cliente
- Análisis de patrones de conversación
- Métricas de efectividad por tipo de cliente

## Próximos Pasos

### Mejoras Futuras

1. **Machine Learning**: Implementar modelos ML para mejor detección
2. **Análisis de Sentimiento**: Integrar análisis de sentimiento en tiempo real
3. **Predicción de Intenciones**: Predecir intenciones futuras del cliente
4. **Optimización Automática**: Ajustar parámetros automáticamente
5. **Integración con CRM**: Conectar con sistemas de gestión de clientes

### Expansión de Tipos de Cliente

- **Influencer**: Enfoque en alcance, engagement, contenido
- **Educador**: Enfoque en aprendizaje, recursos, metodología
- **Investigador**: Enfoque en datos, análisis, metodología
- **Artista/Creativo**: Enfoque en diseño, creatividad, expresión

Este sistema de personalización dinámica proporciona una base sólida para crear experiencias de chatbot altamente personalizadas y efectivas. 