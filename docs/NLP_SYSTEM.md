# Sistema de Procesamiento de Lenguaje Natural (NLP) - Fase 3

## Descripción General

El sistema NLP implementado en la Fase 3 proporciona capacidades avanzadas de procesamiento de lenguaje natural para el chatbot, incluyendo extracción de entidades, clasificación de intenciones, análisis de sentimiento y detección de información completa vs incompleta.

## Arquitectura del Sistema

### 1. Procesador NLP Principal (`lib/nlp-processor.ts`)

#### Funcionalidades Principales:
- **Extracción de Entidades**: Detecta nombres, emails, teléfonos, presupuestos, tipos de proyecto, plazos, empresas y ubicaciones
- **Clasificación de Intenciones**: Identifica 16 tipos diferentes de intenciones del usuario
- **Análisis de Sentimiento**: Evalúa el sentimiento general y emociones específicas
- **Detección de Completitud**: Determina qué información falta para completar una consulta

#### Tipos de Entidades Soportadas:
```typescript
type EntityType = 
  | 'name'        // Nombres de personas
  | 'email'       // Direcciones de correo
  | 'phone'       // Números de teléfono
  | 'budget'      // Presupuestos y montos
  | 'project_type' // Tipos de proyecto
  | 'timeline'    // Plazos y fechas
  | 'company'     // Nombres de empresas
  | 'location'    // Ubicaciones geográficas
```

#### Tipos de Intenciones Detectadas:
```typescript
type IntentType = 
  | 'greeting'              // Saludos
  | 'project_inquiry'       // Consultas sobre proyectos
  | 'budget_discussion'     // Discusiones de presupuesto
  | 'timeline_discussion'   // Discusiones de plazos
  | 'service_inquiry'       // Consultas sobre servicios
  | 'contact_request'       // Solicitudes de contacto
  | 'portfolio_request'     // Solicitudes de portafolio
  | 'consultation_request'  // Solicitudes de consulta
  | 'pricing_inquiry'       // Consultas de precios
  | 'technical_question'    // Preguntas técnicas
  | 'general_question'      // Preguntas generales
  | 'goodbye'              // Despedidas
  | 'clarification_request' // Solicitudes de aclaración
  | 'confirmation'         // Confirmaciones
  | 'objection'            // Objeciones
  | 'urgency_indicator'    // Indicadores de urgencia
```

### 2. Motor de Respuesta Inteligente (`lib/intelligent-response-engine.ts`)

#### Características:
- **Plantillas Dinámicas**: Respuestas basadas en plantillas que se adaptan al contexto
- **Ajuste de Tono**: Modifica el tono de respuesta según el sentimiento del usuario
- **Preguntas de Seguimiento**: Genera preguntas automáticas para información faltante
- **Indicadores de Urgencia**: Detecta y responde a situaciones urgentes

#### Tipos de Tono de Respuesta:
```typescript
type ResponseTone = 
  | 'professional'  // Tono formal y directo
  | 'empathetic'    // Tono comprensivo y de apoyo
  | 'enthusiastic'  // Tono dinámico y motivador
  | 'casual'        // Tono informal y cercano
```

### 3. Integración con la API (`app/api/chat/route.ts`)

#### Mejoras Implementadas:
- **Análisis en Tiempo Real**: Cada mensaje del usuario se procesa con NLP
- **Prompt Dinámico**: El prompt del sistema se ajusta según el análisis
- **Contexto Enriquecido**: Se proporciona contexto adicional al modelo de IA
- **Logging Detallado**: Registro de análisis para monitoreo y debugging

## Patrones de Extracción

### Emails
```regex
([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})
```

### Teléfonos
```regex
(\+?[\d\s\-\(\)]{7,})
```

### Presupuestos
```regex
(?:presupuesto|budget|precio|costo|inversión|gasto|valor|monto|dinero|euros?|dólares?|pesos?)\s*:?\s*([€$]?\s*\d+(?:[.,]\d{3})*(?:[.,]\d{2})?)
```

### Plazos
```regex
(?:fecha|deadline|plazo|tiempo|entrega|finalización|completar|terminar)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d+\s*(?:días?|semanas?|meses?|años?))
```

## Análisis de Sentimiento

### Escala de Sentimiento
- **Score**: -1 (muy negativo) a 1 (muy positivo)
- **Etiquetas**: very_negative, negative, neutral, positive, very_positive

### Emociones Detectadas
- **Joy**: Alegría y entusiasmo
- **Sadness**: Tristeza y decepción
- **Anger**: Ira y frustración
- **Fear**: Miedo y preocupación
- **Surprise**: Sorpresa y asombro

## Sistema de Completitud

### Campos Requeridos
1. **name**: Nombre del cliente
2. **email**: Email de contacto
3. **project_description**: Descripción del proyecto
4. **budget**: Presupuesto disponible
5. **timeline**: Plazo de entrega

### Cálculo de Completitud
- **Score**: 0 a 1 (0% a 100%)
- **Umbral**: 80% para considerar información completa
- **Campos Faltantes**: Lista de campos que necesitan información

## Integración con el Estado del Chatbot

### Nuevos Campos de Estado
```typescript
interface ChatbotState {
  // ... campos existentes
  responseTone: ResponseTone
  urgencyLevel: UrgencyLevel
  nlpEntities: NLPEntity[]
  lastSentiment: NLPSentiment | null
}
```

### Nuevas Acciones
```typescript
type ChatbotAction = 
  // ... acciones existentes
  | { type: 'SET_RESPONSE_TONE'; payload: ResponseTone }
  | { type: 'SET_URGENCY_LEVEL'; payload: UrgencyLevel }
  | { type: 'SET_NLP_ENTITIES'; payload: NLPEntity[] }
  | { type: 'SET_LAST_SENTIMENT'; payload: NLPSentiment }
```

## Componente de Visualización

### NLPAnalysisDisplay
- **Propósito**: Mostrar análisis NLP en tiempo real para debugging
- **Características**:
  - Visualización de intenciones y confianza
  - Gráficos de sentimiento y emociones
  - Lista de entidades extraídas
  - Estado de completitud de información
  - Texto procesado

## Flujo de Procesamiento

### 1. Recepción de Mensaje
```typescript
const nlpResult = await processMessage(userMessage)
```

### 2. Validación
```typescript
const validatedResult = validateNLPResult(nlpResult)
```

### 3. Extracción de Información
```typescript
// Mapear entidades a datos de conversación
validatedResult.entities.forEach(entity => {
  switch (entity.type) {
    case 'name': extractedData.clientName = entity.value
    case 'email': extractedData.clientEmail = entity.value
    // ... más casos
  }
})
```

### 4. Análisis de Completitud
```typescript
if (!validatedResult.completeness.isComplete) {
  // Generar preguntas de seguimiento
  const followUpQuestions = generateFollowUpQuestions(missingInfo)
}
```

### 5. Ajuste de Tono
```typescript
const optimalTone = determineOptimalTone(nlpResult, urgencyLevel)
```

### 6. Generación de Respuesta
```typescript
const response = generateIntelligentResponse({
  nlpResult: validatedResult,
  conversationData: extractedData,
  responseTone: optimalTone,
  urgencyLevel,
  missingInfo: validatedResult.completeness.missingFields
})
```

## Configuración y Personalización

### Palabras Clave Personalizables
- **Intenciones**: Configurables en `INTENT_KEYWORDS`
- **Sentimiento**: Configurables en `SENTIMENT_KEYWORDS`
- **Patrones**: Configurables en `PATTERNS`

### Umbrales Ajustables
- **Confianza de Intención**: Mínimo 0.6 para considerar válida
- **Completitud**: 80% para considerar información completa
- **Urgencia**: Basada en emociones de miedo > 0.5

## Monitoreo y Logging

### Logs Automáticos
```typescript
console.log('[NLP Analysis]', {
  intent: validatedResult.intent.type,
  confidence: validatedResult.intent.confidence,
  sentiment: validatedResult.sentiment.label,
  entities: extractedEntities.length,
  missingInfo: missingInfo.length,
  tone: responseTone,
  urgency: urgencyLevel
})
```

### Métricas Clave
- **Tasa de Detección de Entidades**: Porcentaje de entidades extraídas correctamente
- **Precisión de Intenciones**: Confianza promedio de clasificación
- **Tiempo de Procesamiento**: Latencia del análisis NLP
- **Tasa de Completitud**: Porcentaje de conversaciones con información completa

## Beneficios del Sistema

### Para el Usuario
- **Respuestas Más Relevantes**: El chatbot entiende mejor el contexto
- **Menos Repetición**: No necesita repetir información ya proporcionada
- **Experiencia Personalizada**: Tono adaptado al estado emocional
- **Detección de Urgencia**: Respuestas prioritarias cuando es necesario

### Para el Negocio
- **Mejor Calificación de Leads**: Información más completa y estructurada
- **Reducción de Fricción**: Menos preguntas repetitivas
- **Análisis de Sentimiento**: Entendimiento del estado emocional del cliente
- **Automatización Inteligente**: Respuestas más precisas y contextuales

## Próximos Pasos (Fase 4)

### Mejoras Planificadas
1. **Machine Learning**: Entrenamiento con datos reales de conversaciones
2. **Análisis de Contexto**: Consideración del historial de conversación
3. **Detección de Idiomas**: Soporte multiidioma
4. **Análisis de Personalidad**: Perfiles de usuario más detallados
5. **Predicción de Intenciones**: Anticipación de necesidades del usuario

### Optimizaciones Técnicas
1. **Caching**: Almacenamiento en caché de análisis frecuentes
2. **Batch Processing**: Procesamiento por lotes para mejor rendimiento
3. **API Externa**: Integración con servicios NLP especializados
4. **A/B Testing**: Comparación de diferentes estrategias de respuesta

## Conclusión

El sistema NLP implementado en la Fase 3 proporciona una base sólida para un chatbot inteligente y contextual. La combinación de extracción de entidades, análisis de sentimiento y generación de respuestas adaptativas crea una experiencia de usuario significativamente mejorada mientras optimiza la recopilación de información para el negocio.

El sistema es modular, extensible y está diseñado para evolucionar con el tiempo, permitiendo mejoras continuas basadas en datos reales de uso. 