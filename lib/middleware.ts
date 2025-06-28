// lib/middleware.ts
import { 
    type LanguageModelV1, 
    type LanguageModelV1Middleware,
    wrapLanguageModel
  } from 'ai'
  import { validateResponse, getOverallAction, generateFallbackResponse, modifyResponse, type GuardrailConfig, type GuardrailResult } from './guardrails'
  import { getRelevantContext } from './knowledge-base'
  
  interface MiddlewareConfig {
    enableRAG: boolean
    enableGuardrails: boolean
    enableLogging: boolean
    guardrailConfig?: GuardrailConfig
  }
  
  const defaultMiddlewareConfig: MiddlewareConfig = {
    enableRAG: true,
    enableGuardrails: true,
    enableLogging: true
  }
  
  interface LogEntry {
    timestamp: string
    query: string
    response: string
    action: 'allow' | 'modify' | 'block'
    guardrailResults?: GuardrailResult[]
    ragContext?: string
  }
  
  // Store para logging (en producción usar una base de datos)
  const logStore: LogEntry[] = []
  
  // Función auxiliar para extraer el último mensaje del usuario
  function getLastUserMessageText(prompt: unknown[]): string {
    for (let i = prompt.length - 1; i >= 0; i--) {
      const message = prompt[i] as { role?: string; content?: unknown }
      if (message.role === 'user') {
        const content = message.content
        if (typeof content === 'string') {
          return content
        }
        if (Array.isArray(content)) {
          const textPart = content.find((part: unknown) => 
            typeof part === 'object' && part !== null && 'type' in part && part.type === 'text'
          ) as { text?: string } | undefined
          return textPart?.text || ''
        }
      }
    }
    return ''
  }
  
  // Función auxiliar para agregar texto al último mensaje del usuario
  function addToLastUserMessage(params: { prompt: unknown[] }, text: string) {
    const enhancedPrompt = [...params.prompt]
    const lastUserIndex = enhancedPrompt.length - 1
    
    if (lastUserIndex >= 0) {
      const lastMessage = enhancedPrompt[lastUserIndex] as { role?: string; content?: unknown }
      if (lastMessage.role === 'user') {
        const currentContent = lastMessage.content
        
        if (typeof currentContent === 'string') {
          enhancedPrompt[lastUserIndex] = {
            ...lastMessage,
            content: `${currentContent}\n\n${text}`
          }
        } else if (Array.isArray(currentContent)) {
          const textIndex = currentContent.findIndex((part: unknown) => 
            typeof part === 'object' && part !== null && 'type' in part && part.type === 'text'
          )
          if (textIndex >= 0) {
            const newContent = [...currentContent]
            const textPart = newContent[textIndex] as { type: string; text: string }
            newContent[textIndex] = {
              ...textPart,
              text: `${textPart.text}\n\n${text}`
            }
            enhancedPrompt[lastUserIndex] = {
              ...lastMessage,
              content: newContent
            }
          }
        }
      }
    }
    
    return {
      ...params,
      prompt: enhancedPrompt
    }
  }
  
  // Middleware de RAG
  const ragMiddleware: LanguageModelV1Middleware = {
    transformParams: async ({ params }) => {
      const lastUserMessageText = getLastUserMessageText(params.prompt as unknown[])
      
      if (!lastUserMessageText) {
        return params
      }
      
      const relevantContext = getRelevantContext(lastUserMessageText)
      
      if (!relevantContext) {
        return params
      }
      
      const instruction = `CONTEXTO RELEVANTE DE LA BASE DE CONOCIMIENTO:
${relevantContext}

INSTRUCCIONES IMPORTANTES:
- Utiliza ÚNICAMENTE la información del contexto proporcionado arriba para responder sobre servicios específicos de Gabriel Bustos
- Si la pregunta no puede responderse con el contexto disponible, indica que necesitas más información o sugiere contactar directamente
- Mantén las respuestas precisas y basadas en hechos
- No inventes precios, fechas específicas o detalles técnicos no mencionados en el contexto
- Si no tienes información suficiente, sé honesto al respecto y ofrece alternativas de contacto`

      return addToLastUserMessage(params as { prompt: unknown[] }, instruction) as typeof params
    }
  }
  
  // Middleware de Guardrails
  const guardrailMiddleware: LanguageModelV1Middleware = {
    wrapGenerate: async ({ doGenerate, params }) => {
      const result = await doGenerate()
      
      if (!result.text) {
        return result
      }
      
      const query = getLastUserMessageText(params.prompt as unknown[])
      const guardrailResults = validateResponse(result.text, query)
      const overallAction = getOverallAction(guardrailResults)
      
      let processedText = result.text
      let blocked = false
      
      switch (overallAction) {
        case 'block':
          processedText = generateFallbackResponse(guardrailResults)
          blocked = true
          break
        case 'modify':
          processedText = modifyResponse(result.text, guardrailResults)
          break
        case 'allow':
        default:
          // No changes needed
          break
      }
      
      // Logging
      logInteraction({
        timestamp: new Date().toISOString(),
        query,
        response: processedText,
        action: overallAction,
        guardrailResults: guardrailResults.filter(r => !r.isValid),
        ragContext: getRelevantContext(query) ? 'used' : 'not_used'
      })
      
      return {
        ...result,
        text: processedText,
        finishReason: blocked ? 'other' : result.finishReason
      }
    }
  }
  
  // Middleware de Logging
  const loggingMiddleware: LanguageModelV1Middleware = {
    wrapGenerate: async ({ doGenerate, params }) => {
      console.log('[Gabriel Bustos Middleware] doGenerate called')
      console.log(`[Gabriel Bustos Middleware] params: ${JSON.stringify(params, null, 2)}`)
      
      const result = await doGenerate()
      
      console.log('[Gabriel Bustos Middleware] doGenerate finished')
      console.log(`[Gabriel Bustos Middleware] generated text: ${result.text?.substring(0, 100)}...`)
      
      return result
    }
  }
  
  // Función principal para crear el middleware de Gabriel Bustos
  export function createGabrielBustosMiddleware(
    baseModel: LanguageModelV1,
    config: MiddlewareConfig = defaultMiddlewareConfig
  ): LanguageModelV1 {
    const middlewares: LanguageModelV1Middleware[] = []
    
    if (config.enableLogging) {
      middlewares.push(loggingMiddleware)
    }
    
    if (config.enableRAG) {
      middlewares.push(ragMiddleware)
    }
    
    if (config.enableGuardrails) {
      middlewares.push(guardrailMiddleware)
    }
    
    return wrapLanguageModel({
      model: baseModel,
      middleware: middlewares
    })
  }
  
  // Logging de interacciones
  function logInteraction(entry: LogEntry) {
    logStore.push(entry)
    
    // Mantener solo los últimos 1000 logs en memoria
    if (logStore.length > 1000) {
      logStore.shift()
    }
    
    // En desarrollo, log a console
    if (process.env.NODE_ENV === 'development') {
      console.log('[Gabriel Bustos Middleware]', {
        query: entry.query.substring(0, 100),
        action: entry.action,
        hasGuardrailIssues: (entry.guardrailResults?.length || 0) > 0,
        usedRAG: entry.ragContext === 'used'
      })
    }
  }
  
  // Función para obtener estadísticas (útil para monitoring)
  export function getMiddlewareStats() {
    const total = logStore.length
    const blocked = logStore.filter(l => l.action === 'block').length
    const modified = logStore.filter(l => l.action === 'modify').length
    const ragUsed = logStore.filter(l => l.ragContext === 'used').length
    
    return {
      totalInteractions: total,
      blockedResponses: blocked,
      modifiedResponses: modified,
      ragUsageRate: total > 0 ? (ragUsed / total) * 100 : 0,
      recentLogs: logStore.slice(-10) // Últimos 10 logs
    }
  }
  
  // Función para limpiar logs (útil para testing)
  export function clearLogs() {
    logStore.length = 0
  }