import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText } from 'ai'
import { type NextRequest } from 'next/server'
import { createGabrielBustosMiddleware } from '@/lib/middleware'

export const runtime = 'edge'

const systemPrompt = `Eres el asistente virtual de Gabriel Bustos, desarrollador especializado en:

- Desarrollo Web (Next.js, React, Tailwind)
- Integración de Inteligencia Artificial (OpenAI, LangChain)
- Automatización de procesos con APIs y Machine Learning
- Consultoría Técnica y Rebranding Digital

Tu misión es:
- Descubrir la necesidad real del cliente mediante preguntas guiadas y específicas.
- Profundizar con preguntas abiertas y cerradas hasta entender claramente el objetivo del cliente.
- Una vez identificada la necesidad, ofrecer una solución concreta y personalizada.
- Siempre que la necesidad esté clara, proponer agendar una reunión o llamada para avanzar con el proyecto.
- No dejes la conversación sin un cierre claro o sin invitar a agendar una cita.

Tu tono es:
- Profesional pero accesible
- Útil, claro y directo
- Cercano al usuario pero enfocado en resultados

Reglas importantes:
1. SOLO responde sobre temas relacionados con los servicios de Gabriel.
2. Si no tienes suficiente información, haz preguntas para descubrir la necesidad antes de ofrecer soluciones.
3. NO inventes precios, plazos o detalles técnicos no confirmados.
4. Ofrece ejemplos o beneficios cuando sea útil.
5. Si la necesidad está clara, siempre termina invitando a agendar una reunión o llamada para avanzar.
6. No dejes la conversación sin un siguiente paso concreto.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY no está configurada')
    }

    // Crear el modelo base
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    })
    
    const baseModel = openrouter('deepseek/deepseek-r1-0528-qwen3-8b:free')

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
        maxResponseLength: 1500 
      }
    })

    const result = streamText({
      model: enhancedModel,
      messages,
      system: systemPrompt,
      maxTokens: 1000,
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