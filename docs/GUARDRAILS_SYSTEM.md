# Sistema de Guardrails Expandido - Gabriel Bustos Dev

## Resumen Ejecutivo

El sistema de guardrails expandido implementa un conjunto robusto de reglas, filtros y mecanismos de control para mantener el chatbot enfocado, seguro y de alta calidad. Este sistema va más allá de las validaciones básicas para incluir análisis de calidad, recuperación de conversación, límites de tiempo y métricas avanzadas.

## Arquitectura del Sistema

### Componentes Principales

1. **Guardrails Core** (`lib/guardrails.ts`)
   - Validaciones de contenido y alcance
   - Filtros de calidad de respuesta
   - Sistema de recuperación de conversación
   - Límites de tiempo y longitud

2. **Middleware Integrado** (`lib/middleware.ts`)
   - Integración con el pipeline de IA
   - Logging y métricas en tiempo real
   - Gestión de sesiones de conversación

3. **Componente de Visualización** (`components/GuardrailsDisplay.tsx`)
   - Dashboard en tiempo real
   - Métricas y estadísticas
   - Debugging y monitoreo

## Funcionalidades Implementadas

### 1. Reglas de Guardrails Expandidas

#### Contenido Prohibido
```typescript
const prohibitedContent = [
  'precios exactos sin consulta',
  'garantía 100%',
  'información confidencial',
  'datos de otros clientes',
  'código fuente completo',
  'contraseñas o credenciales',
  'información personal de otros',
  'detalles de seguridad',
  'información financiera específica',
  'contratos o términos legales',
  'información médica o de salud',
  'consejos legales específicos'
]
```

#### Temas Sensibles
```typescript
const sensitiveTopics = [
  'recetas de cocina',
  'consejos médicos',
  'información legal específica',
  'temas políticos',
  'contenido adulto',
  'servicios de contabilidad',
  'servicios legales',
  'servicios financieros',
  'servicios de salud',
  'servicios educativos',
  'servicios de transporte',
  'servicios de entretenimiento'
]
```

#### Palabras Clave de Servicios
```typescript
const gabrielBustosKeywords = [
  // Servicios principales
  'desarrollo web', 'landing page', 'plataforma web', 'aplicación web',
  'inteligencia artificial', 'chatbot', 'automatización', 'rebranding',
  'optimización', 'seo', 'responsive', 'frontend', 'backend',
  
  // Tecnologías
  'next.js', 'react', 'typescript', 'javascript', 'tailwind css',
  'supabase', 'vercel', 'openai', 'langchain', 'node.js',
  
  // Procesos y metodologías
  'consultoría técnica', 'análisis de requerimientos', 'arquitectura web',
  'diseño ui/ux', 'testing', 'deployment', 'mantenimiento',
  
  // Empresa y personal
  'gabriel bustos', 'gabrielbustosdev', 'gabriel bustos dev',
  'desarrollador web', 'consultor técnico', 'especialista en ia'
]
```

### 2. Filtros de Calidad de Respuesta

#### Indicadores de Calidad Positiva
```typescript
const qualityIndicators = {
  positive: [
    'específico', 'detallado', 'claro', 'preciso', 'útil', 'relevante',
    'profesional', 'estructurado', 'completo', 'actualizado'
  ],
  negative: [
    'vago', 'confuso', 'incompleto', 'irrelevante', 'desactualizado',
    'genérico', 'superficial', 'contradictorio', 'inconsistente'
  ]
}
```

#### Algoritmo de Calidad
- **Puntuación de Relevancia**: Verifica si la respuesta contiene palabras relacionadas con la pregunta
- **Indicadores Positivos**: Cuenta palabras que indican calidad alta
- **Indicadores Negativos**: Penaliza palabras que indican calidad baja
- **Estructura**: Evalúa la coherencia y estructura de la respuesta

### 3. Sistema de Recuperación de Conversación

#### Detección de Desviación
```typescript
export function analyzeConversationDeviation(
  messages: ChatMessage[],
  metrics: ConversationMetrics
): GuardrailResult | null
```

**Criterios de Desviación:**
- Más del 60% de mensajes recientes fuera de tema
- Más de 5 minutos sin abordar temas relevantes
- Múltiples intentos de recuperación fallidos

#### Frases de Recuperación
```typescript
const recoveryPhrases = [
  'Volviendo a nuestros servicios de desarrollo web, ¿te gustaría que te explique más sobre...',
  'Para enfocarnos en lo que mejor puedo ayudarte, ¿tienes alguna consulta sobre...',
  'Como especialista en desarrollo web, puedo ayudarte mejor con temas como...',
  'Permíteme recordarte que soy el asistente de Gabriel Bustos, especializado en...',
  'Para brindarte el mejor servicio, ¿podrías contarme más sobre tu proyecto web?'
]
```

### 4. Límites de Tiempo y Longitud

#### Configuración de Límites
```typescript
const defaultConfig: GuardrailConfig = {
  enableContentFiltering: true,
  enableFactChecking: true,
  enableToneValidation: true,
  enableScopeValidation: true,
  enableQualityFiltering: true,
  enableTimeLimits: true,
  enableConversationRecovery: true,
  maxResponseLength: 800,
  maxConversationLength: 50,
  maxConversationTime: 30, // minutos
  qualityThreshold: 0.7,
  recoveryAttempts: 3
}
```

#### Validaciones de Límites
- **Tiempo de Conversación**: Máximo 30 minutos
- **Número de Mensajes**: Máximo 50 mensajes
- **Longitud de Respuesta**: Máximo 800 caracteres
- **Intentos de Recuperación**: Máximo 3 por sesión

### 5. Métricas de Conversación

#### Estructura de Métricas
```typescript
export interface ConversationMetrics {
  messageCount: number
  conversationDuration: number // en minutos
  offTopicCount: number
  qualityScore: number
  lastOnTopicTime: number // timestamp
  recoveryAttempts: number
}
```

#### Criterios de Redirección
```typescript
export function shouldRedirectToConsultation(metrics: ConversationMetrics): boolean {
  return (
    metrics.messageCount > 20 ||
    metrics.conversationDuration > 15 ||
    metrics.offTopicCount > 5 ||
    metrics.recoveryAttempts >= 3
  )
}
```

## Integración con el Sistema

### 1. Middleware de Guardrails

El middleware intercepta todas las respuestas del modelo de IA y aplica las validaciones:

```typescript
const guardrailMiddleware: LanguageModelV1Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const result = await doGenerate()
    
    // Extraer mensajes y métricas
    const messages = extractMessages(params.prompt as unknown[])
    const metrics = getConversationMetrics(sessionId)
    
    // Verificar redirección
    if (shouldRedirectToConsultation(updatedMetrics)) {
      return redirectResponse
    }
    
    // Aplicar validaciones
    const guardrailResults = validateResponse(
      result.text, 
      query, 
      messages,
      updatedMetrics,
      startTime,
      guardrailConfig
    )
    
    // Procesar resultado
    const overallAction = getOverallAction(guardrailResults)
    
    switch (overallAction) {
      case 'block':
        return generateFallbackResponse(guardrailResults)
      case 'modify':
        return modifyResponse(result.text, guardrailResults)
      case 'redirect':
        return redirectToConsultation()
      case 'allow':
      default:
        return result
    }
  }
}
```

### 2. Componente de Visualización

El componente `GuardrailsDisplay` proporciona:

- **Resumen Rápido**: Interacciones totales y calidad promedio
- **Acciones**: Distribución de acciones (allow, modify, block, redirect)
- **Problemas Principales**: Top 5 categorías de problemas
- **Métricas de Conversación**: Mensajes, fuera de tema, recuperaciones
- **Uso de RAG**: Porcentaje de uso de la base de conocimiento
- **Longitud de Respuestas**: Promedio de caracteres por respuesta

### 3. Logging y Monitoreo

#### Estructura de Log
```typescript
interface LogEntry {
  timestamp: string
  query: string
  response: string
  action: 'allow' | 'modify' | 'block' | 'redirect'
  guardrailResults?: GuardrailResult[]
  ragContext?: string
  conversationMetrics?: ConversationMetrics
  guardrailSummary?: {
    totalChecks: number
    passedChecks: number
    failedChecks: number
    criticalIssues: number
    recommendations: string[]
  }
}
```

#### Funciones de Reporte
- `getMiddlewareStats()`: Estadísticas generales del middleware
- `getGuardrailsReport()`: Reporte detallado de guardrails
- `getConversationMetricsById()`: Métricas específicas por sesión

## Configuración y Personalización

### Configuración de Guardrails

```typescript
const customGuardrailConfig: GuardrailConfig = {
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

### Personalización de Reglas

#### Agregar Nuevas Palabras Prohibidas
```typescript
const customProhibitedContent = [
  ...prohibitedContent,
  'nueva palabra prohibida',
  'otra regla específica'
]
```

#### Modificar Umbrales de Calidad
```typescript
const customQualityThreshold = 0.8 // Más estricto
const customMaxResponseLength = 600 // Más corto
```

## Beneficios del Sistema

### 1. Seguridad y Cumplimiento
- **Protección de Información**: Previene divulgación de datos sensibles
- **Cumplimiento Legal**: Evita consejos legales o médicos inapropiados
- **Profesionalismo**: Mantiene el tono y calidad profesional

### 2. Enfoque y Relevancia
- **Mantenimiento de Alcance**: Asegura que las respuestas estén dentro del área de especialización
- **Recuperación Automática**: Detecta y corrige desviaciones de tema
- **Redirección Inteligente**: Sugiere consultas cuando es apropiado

### 3. Calidad de Respuesta
- **Filtros de Calidad**: Evalúa y mejora la calidad de las respuestas
- **Estructura**: Asegura respuestas coherentes y bien estructuradas
- **Relevancia**: Verifica que las respuestas sean útiles y específicas

### 4. Monitoreo y Analytics
- **Métricas en Tiempo Real**: Dashboard de estado del sistema
- **Logging Detallado**: Registro completo de todas las interacciones
- **Reportes**: Análisis de rendimiento y problemas

## Casos de Uso

### 1. Conversación Normal
- Usuario pregunta sobre servicios de desarrollo web
- Sistema valida contenido y calidad
- Respuesta aprobada y enviada

### 2. Contenido Prohibido
- Usuario solicita información confidencial
- Sistema detecta contenido prohibido
- Respuesta bloqueada, se envía fallback

### 3. Conversación Desviada
- Usuario cambia a temas no relacionados
- Sistema detecta desviación después de 3 mensajes
- Se aplica frase de recuperación

### 4. Límites Excedidos
- Conversación supera 30 minutos o 50 mensajes
- Sistema sugiere redirección a consulta
- Se abre modal de programación automáticamente

### 5. Calidad Baja
- Respuesta del modelo es vaga o confusa
- Sistema detecta indicadores de calidad negativa
- Respuesta modificada con estructura mejorada

## Próximos Pasos

### 1. Mejoras Planificadas
- **Machine Learning**: Entrenar modelos para detección automática de calidad
- **Personalización**: Aprendizaje de preferencias del usuario
- **Integración Externa**: APIs para validación de hechos en tiempo real

### 2. Optimizaciones
- **Performance**: Optimización de validaciones para latencia mínima
- **Escalabilidad**: Soporte para múltiples sesiones concurrentes
- **Persistencia**: Almacenamiento de métricas en base de datos

### 3. Nuevas Funcionalidades
- **Análisis de Sentimiento**: Detección de emociones del usuario
- **Predicción de Intención**: Anticipación de necesidades del usuario
- **A/B Testing**: Comparación de diferentes configuraciones

## Conclusión

El sistema de guardrails expandido proporciona una capa robusta de control y calidad para el chatbot de Gabriel Bustos. Con validaciones múltiples, recuperación automática y monitoreo en tiempo real, asegura que cada interacción sea profesional, relevante y de alta calidad.

El sistema es altamente configurable y extensible, permitiendo ajustes específicos según las necesidades del negocio y la evolución de los servicios ofrecidos. 