// app/api/chat/route.ts
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText } from 'ai'
import { type NextRequest } from 'next/server'
import { createGabrielBustosMiddleware } from '@/lib/middleware'
import { processMessage, validateNLPResult, type NLPResult } from '@/lib/nlp-processor'
import { determineOptimalTone } from '@/lib/intelligent-response-engine'

export const runtime = 'edge'

const baseSystemPrompt = `Eres el asistente virtual de Gabriel Bustos, desarrollador especializado en:

- Desarrollo Web (Next.js, React, Tailwind)
- Integración de Inteligencia Artificial (OpenAI, LangChain)
- Automatización de procesos con APIs y Machine Learning
- Consultoría Técnica y Rebranding Digital

Tu tono es:
- Profesional pero accesible
- Útil, claro y directo
- Cercano al usuario pero enfocado en resultados

Reglas importantes:
1. SOLO responde sobre temas relacionados con los servicios de Gabriel.
2. Si no tienes suficiente información, sugiere contactar directamente.
3. NO inventes precios, plazos o detalles técnicos no confirmados.
4. Ofrece ejemplos o beneficios cuando sea útil.
5. SIEMPRE termina tu respuesta con una invitación a agendar una consulta gratuita.

INSTRUCCIONES ESPECIALES PARA CONSULTAS:
- Recopila información importante del usuario: nombre, tipo de proyecto, presupuesto aproximado, timeline
- Si el usuario muestra interés real en servicios, sugiere agendar una consulta
- Menciona que la consulta es gratuita y sin compromiso
- Ofrece opciones de contacto: WhatsApp, email o agendar directamente
- Sé proactivo en detectar oportunidades de negocio

DETECCIÓN DE INTERÉS EN CONSULTA:
- Si el usuario dice "quiero agendar", "me interesa", "quiero consultar", "agenda una consulta", "quiero trabajar contigo", "necesito un proyecto", responde con:
  "¡Perfecto! He detectado tu interés en trabajar juntos. Voy a abrir automáticamente el formulario de consulta gratuita con la información que hemos conversado. Solo necesitas completar algunos detalles adicionales y me pondré en contacto contigo dentro de las próximas 24 horas. [AUTO_OPEN_CONSULTATION]"

- Si el usuario pregunta por precios específicos o detalles de proyectos, sugiere agendar una consulta personalizada.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

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
          missingInfo
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
        maxResponseLength: 800 // Respuestas más concisas
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
  missingInfo: string[]
): string {
  let enhancedPrompt = basePrompt

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
- El usuario está interesado en un proyecto específico
- Recopila información sobre: ${missingInfo.join(', ')}
- Ofrece ejemplos relevantes de proyectos similares
- Sugiere agendar una consulta para discutir detalles`
        break

      case 'budget_discussion':
        enhancedPrompt += `\n\nINSTRUCCIONES PARA DISCUSIÓN DE PRESUPUESTO:
- El usuario está preocupado por el presupuesto
- Sé transparente sobre los rangos de precios
- Explica el valor que recibirá por su inversión
- Ofrece opciones escalables según su presupuesto`
        break

      case 'urgency_indicator':
        enhancedPrompt += `\n\nINSTRUCCIONES PARA URGENCIA:
- El usuario necesita una respuesta rápida
- Prioriza la información más crítica
- Ofrece opciones de contacto inmediato
- Sugiere agendar una consulta urgente`
        break

      case 'technical_question':
        enhancedPrompt += `\n\nINSTRUCCIONES PARA PREGUNTA TÉCNICA:
- Proporciona información técnica precisa
- Usa ejemplos y analogías cuando sea útil
- Ofrece recursos adicionales si es necesario
- Sugiere consulta técnica especializada si es complejo`
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