// app/api/chat/route.ts
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText } from 'ai'
import { type NextRequest } from 'next/server'
import { createGabrielBustosMiddleware } from '@/lib/middleware'
import { contextEvolutionService } from '@/lib/services/contextEvolution'
import { ConversationContext } from '@/lib/types/chat'

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

**NUEVA INSTRUCCIÓN DE CONSULTORÍA PROACTIVA:**
Después de cada respuesta, analiza la información que ya tienes del usuario y formula la siguiente pregunta relevante para avanzar en la definición del proyecto. No repitas preguntas ya realizadas. Si ya tienes suficiente información, ofrece agendar una consulta o preparar una propuesta personalizada. Tu objetivo es ayudar a Gabriel a obtener toda la información útil para una llamada o propuesta, de forma natural y conversacional. Haz preguntas específicas y contextuales (por ejemplo: ¿Necesitas que la plataforma gestione stock? ¿Solo atención al cliente? ¿Qué productos principales quieres vender? ¿Tienes experiencia previa vendiendo online?).

DETECCIÓN DE INTERÉS EN CONSULTA:
- Si el usuario dice "quiero agendar", "me interesa", "quiero consultar", "agenda una consulta", "quiero trabajar contigo", "necesito un proyecto", responde con:
  "¡Perfecto! He detectado tu interés en trabajar juntos. Voy a abrir automáticamente el formulario de consulta gratuita con la información que hemos conversado. Solo necesitas completar algunos detalles adicionales y me pondré en contacto contigo dentro de las próximas 24 horas. [AUTO_OPEN_CONSULTATION]"

- Si el usuario pregunta por precios específicos o detalles de proyectos, sugiere agendar una consulta personalizada.`

export async function POST(req: NextRequest) {
  try {
    const { messages, conversationContext } = await req.json()

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY no está configurada')
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

    // Generar prompt mejorado con contexto evolutivo
    let enhancedSystemPrompt = baseSystemPrompt
    
    if (conversationContext) {
      const context = conversationContext as ConversationContext
      
      // Obtener contexto evolutivo si existe
      const evolutiveContext = contextEvolutionService.getContext(context.sessionId)
      
      if (evolutiveContext && evolutiveContext.entries.length > 0) {
        enhancedSystemPrompt = contextEvolutionService.generateEnhancedPrompt(
          '', // userMessage - no necesario aquí
          context,
          baseSystemPrompt
        )
      }
    }

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