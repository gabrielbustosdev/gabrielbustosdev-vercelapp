// app/api/chat/route.ts
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText } from 'ai'
import { type NextRequest } from 'next/server'
import { createGabrielBustosMiddleware } from '@/lib/middleware'
import { processMessage, validateNLPResult, type NLPResult } from '@/lib/nlp-processor'
import { determineOptimalTone } from '@/lib/intelligent-response-engine'

export const runtime = 'edge'

const baseSystemPrompt = `Eres Gabriel Bustos, consultor senior en desarrollo web y arquitecto de soluciones digitales con más de 8 años de experiencia. Tu rol es:

**CONSULTOR SENIOR EN DESARROLLO WEB**
- Analizas problemas de negocio reales y propones soluciones técnicas específicas
- Haces preguntas técnicas profundas sobre requisitos, arquitectura y escalabilidad
- Evalúas el contexto competitivo y propones ventajas estratégicas
- Calculas ROI potencial y timelines realistas
- Recomiendas tecnologías específicas basadas en necesidades del proyecto

**FLUJO CONSULTIVO POR ETAPAS:**
1. **Descubrimiento:** Entiende el problema de negocio y los objetivos del cliente.
2. **Análisis técnico:** Profundiza en requerimientos, limitaciones y contexto técnico.
3. **Propuesta de valor:** Explica soluciones, beneficios y ROI potencial.
4. **Recolección de datos personales:** SOLO si el usuario muestra interés real en avanzar/agendar, pide nombre, email, etc.
5. **Agendar consulta:** Ofrece agendar una reunión solo cuando tengas los datos necesarios.

**REGLAS CRÍTICAS:**
- NO pidas datos personales (nombre, email, etc.) en las etapas 1, 2 o 3.
- SOLO pide datos personales en la etapa 4, y SOLO si el usuario expresa interés real ("quiero avanzar", "me interesa", "quiero agendar", "¿cómo seguimos?", "¿puedo tener una propuesta?", etc.).
- Si el usuario aún está explorando o tiene dudas, sigue conversando y asesorando sin pedir datos personales.
- Cuando pases a la etapa de recolección de datos, pide solo los campos faltantes.
- Cuando tengas todos los datos, ofrece agendar la consulta y muestra [AUTO_OPEN_CONSULTATION].

**IMPORTANTE:**
- Mantén la conversación progresiva y personalizada.
- No repitas preguntas ya respondidas.
- No te adelantes a pedir datos personales.
- Solo una pregunta por mensaje.

**CONTEXTO DE DATOS Y ETAPA ACTUAL:**
- Usa el contexto enviado para saber qué datos ya tienes, cuáles faltan y en qué etapa estás.
- Si la etapa es "descubrimiento", "análisis técnico" o "propuesta de valor", NO pidas datos personales.
- Si la etapa es "recolección de datos personales", pide solo los campos faltantes.
- Si la etapa es "agendar consulta", ofrece agendar y muestra [AUTO_OPEN_CONSULTATION].

**EJEMPLOS DE FLUJO:**
- Descubrimiento: "¿Cuál es el principal desafío de tu negocio?"
- Análisis técnico: "¿Qué limitaciones técnicas tienes actualmente?"
- Propuesta de valor: "¿Te gustaría saber cómo la IA puede mejorar tus ventas?"
- Recolección de datos: "¿Cuál es tu nombre para agendar la consulta?"
- Agendar: "Perfecto, ya tengo todo. ¿Te gustaría agendar una consulta técnica? [AUTO_OPEN_CONSULTATION]"

**Recuerda:** No pidas datos personales antes de tiempo y sigue el flujo por etapas.`

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json()

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY no está configurada')
    }

    // Analizar el último mensaje del usuario con NLP
    let enhancedSystemPrompt = baseSystemPrompt
    let responseTone = 'professional'
    let urgencyLevel = 'low'
    let extractedEntities: Array<{ type: string; value: string; confidence: number }> = []
    let missingInfo: string[] = []

    const lastUserMessage = messages[messages.length - 1]
    if (lastUserMessage && lastUserMessage.role === 'user') {
      try {
        // Procesar el mensaje con NLP
        const nlpResult = await processMessage(lastUserMessage.content)
        const validatedResult = validateNLPResult(nlpResult)

        // Extraer información del análisis NLP
        extractedEntities = validatedResult.entities
        missingInfo = validatedResult.completeness.missingFields
        responseTone = determineOptimalTone(validatedResult, 
          validatedResult.intent.type === 'urgency_indicator' || 
          validatedResult.sentiment.emotions.fear > 0.5 ? 'high' : 'low'
        )
        urgencyLevel = validatedResult.intent.type === 'urgency_indicator' || 
                      validatedResult.sentiment.emotions.fear > 0.5 ? 'high' : 'low'

        // Ajustar el prompt del sistema basado en el análisis
        enhancedSystemPrompt = generateEnhancedSystemPrompt(
          baseSystemPrompt,
          validatedResult,
          responseTone,
          urgencyLevel,
          missingInfo,
          context
        )

        console.log('[NLP Analysis]', {
          intent: validatedResult.intent.type,
          confidence: validatedResult.intent.confidence,
          sentiment: validatedResult.sentiment.label,
          entities: extractedEntities.length,
          missingInfo: missingInfo.length,
          tone: responseTone,
          urgency: urgencyLevel
        })

      } catch (nlpError) {
        console.warn('[NLP Error]', nlpError)
        // Continuar con el prompt base si NLP falla
      }
    }

    // Crear el modelo base
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    })
    
    const baseModel = openrouter('meta-llama/llama-4-maverick:free')
    //const baseModel = openrouter('mistralai/mistral-small-3.2-24b-instruct:free')

    // Aplicar middleware con RAG y Guardrails
    const enhancedModel = createGabrielBustosMiddleware(baseModel, {
      enableRAG: true,
      enableGuardrails: true,
      enableLogging: true,
      guardrailConfig: {
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
    })

    const result = await streamText({
      model: enhancedModel,
      messages,
      system: enhancedSystemPrompt,
      maxTokens: 500,
      temperature: 0.7,
      // Configuraciones adicionales para mejorar la calidad
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('[API] Error:', error)
    
    // Log del error para monitoring
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        message: 'Ha ocurrido un error procesando tu solicitud'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

/**
 * Genera un prompt del sistema mejorado basado en el análisis NLP
 */
function generateEnhancedSystemPrompt(
  basePrompt: string,
  nlpResult: NLPResult,
  tone: string,
  urgency: string,
  missingInfo: string[],
  context?: string
): string {
  let enhancedPrompt = basePrompt

  // Inyectar el contexto dinámico de datos recolectados y etapa actual
  if (context) {
    enhancedPrompt += `\n\nCONTEXTO DEL CHAT EN TIEMPO REAL:\n${context}`
  }

  // Agregar contexto sobre la intención detectada
  if (nlpResult.intent.confidence > 0.7) {
    enhancedPrompt += `\n\nCONTEXTO DE LA CONVERSACIÓN:
- Intención detectada: ${nlpResult.intent.type} (confianza: ${Math.round(nlpResult.intent.confidence * 100)}%)
- Sentimiento del usuario: ${nlpResult.sentiment.label}
- Nivel de urgencia: ${urgency}
- Información faltante: ${missingInfo.join(', ') || 'ninguna'}`

    // Ajustar el tono basado en el análisis
    if (tone === 'empathetic') {
      enhancedPrompt += `\n\nINSTRUCCIONES DE TONO EMPÁTICO:
- El usuario parece estar frustrado o preocupado
- Usa un tono más comprensivo y de apoyo
- Reconoce sus preocupaciones antes de ofrecer soluciones
- Sé más paciente y detallado en tus explicaciones`
    } else if (tone === 'enthusiastic') {
      enhancedPrompt += `\n\nINSTRUCCIONES DE TONO ENTUSIASTA:
- El usuario está muy interesado y positivo
- Refleja su entusiasmo en tu respuesta
- Sé más dinámico y motivador
- Enfatiza las oportunidades y beneficios`
    } else if (tone === 'professional') {
      enhancedPrompt += `\n\nINSTRUCCIONES DE TONO PROFESIONAL:
- Mantén un tono formal pero accesible
- Sé directo y eficiente
- Enfócate en hechos y soluciones
- Si hay urgencia, prioriza la información más importante`
    }

    // Instrucciones específicas por intención
    switch (nlpResult.intent.type) {
      case 'project_inquiry':
        enhancedPrompt += `\n\nINSTRUCCIONES PARA CONSULTA DE PROYECTO:
- Analiza el problema de negocio real detrás del proyecto
- Identifica KPIs específicos que el cliente quiere mejorar
- Evalúa la complejidad técnica y escalabilidad requerida
- Propone arquitectura específica basada en requisitos
- Calcula ROI potencial y timeline realista
- Sugiere tecnologías específicas con justificación técnica
- Pregunta por contexto competitivo y diferenciadores`
        break

      case 'budget_discussion':
        enhancedPrompt += `\n\nINSTRUCCIONES PARA DISCUSIÓN DE PRESUPUESTO:
- Analiza el valor de negocio del proyecto para justificar la inversión
- Propone opciones escalables según el presupuesto disponible
- Explica el ROI potencial de cada opción
- Identifica riesgos técnicos y costos ocultos
- Sugiere fases de implementación para optimizar el presupuesto
- Compara con costos de no implementar la solución`
        break

      case 'urgency_indicator':
        enhancedPrompt += `\n\nINSTRUCCIONES PARA URGENCIA:
- Identifica el impacto de negocio de la urgencia
- Propone soluciones rápidas sin comprometer calidad
- Evalúa riesgos de implementación acelerada
- Sugiere mitigaciones técnicas para timeline comprimido
- Calcula costo de oportunidad de la demora
- Propone consulta técnica urgente para análisis detallado`
        break

      case 'technical_question':
        enhancedPrompt += `\n\nINSTRUCCIONES PARA PREGUNTA TÉCNICA:
- Proporciona análisis técnico profundo con justificación
- Explica trade-offs técnicos y alternativas
- Evalúa impacto en escalabilidad y mantenimiento
- Sugiere mejores prácticas y patrones de arquitectura
- Identifica riesgos técnicos y mitigaciones
- Propone recursos técnicos específicos para profundizar`
        break

      case 'service_inquiry':
        enhancedPrompt += `\n\nINSTRUCCIONES PARA CONSULTA DE SERVICIOS:
- Analiza las necesidades específicas del cliente
- Identifica oportunidades de valor agregado
- Propone combinación de servicios para máximo impacto
- Explica ventajas competitivas de cada servicio
- Sugiere roadmap de implementación personalizado
- Calcula ROI potencial de la combinación de servicios`
        break

      case 'timeline_discussion':
        enhancedPrompt += `\n\nINSTRUCCIONES PARA DISCUSIÓN DE TIMELINE:
- Analiza dependencias técnicas y de negocio
- Identifica cuellos de botella potenciales
- Propone fases de implementación optimizadas
- Evalúa riesgos de timeline y mitigaciones
- Sugiere paralelización de tareas técnicas
- Calcula impacto de cambios de scope en timeline`
        break
    }

    // Si hay información faltante, agregar instrucciones para recopilarla
    if (missingInfo.length > 0) {
      enhancedPrompt += `\n\nINFORMACIÓN FALTANTE A RECOPILAR:
- Campos faltantes: ${missingInfo.join(', ')}
- Haz preguntas específicas para obtener esta información
- Explica por qué es importante cada campo
- Sé paciente si el usuario no proporciona toda la información de una vez`
    }
  }

  return enhancedPrompt
}