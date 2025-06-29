// lib/middleware.ts
import { 
    type LanguageModelV1, 
    type LanguageModelV1Middleware,
    wrapLanguageModel
  } from 'ai'
  import { 
    validateResponse, 
    getOverallAction, 
    generateFallbackResponse, 
    modifyResponse, 
    type GuardrailConfig, 
    type GuardrailResult,
    type ConversationMetrics,
    updateConversationMetrics,
    shouldRedirectToConsultation,
    getGuardrailSummary
  } from './guardrails'
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
  
  // Store para logging (en producción usar una base de datos)
  const logStore: LogEntry[] = []
  
  // Store para métricas de conversación (en producción usar una base de datos)
  const conversationMetricsStore: Map<string, ConversationMetrics> = new Map()
  
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
  
  // Función para obtener o crear métricas de conversación
  function getConversationMetrics(sessionId: string): ConversationMetrics {
    if (!conversationMetricsStore.has(sessionId)) {
      conversationMetricsStore.set(sessionId, {
        messageCount: 0,
        conversationDuration: 0,
        offTopicCount: 0,
        qualityScore: 1.0,
        lastOnTopicTime: Date.now(),
        recoveryAttempts: 0
      })
    }
    return conversationMetricsStore.get(sessionId)!
  }
  
  // Función para extraer mensajes de la conversación
  function extractMessages(prompt: unknown[]): Array<{ role: 'user' | 'assistant' | 'system'; content: string; id: string; timestamp: Date }> {
    const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string; id: string; timestamp: Date }> = []
    
    for (const item of prompt) {
      const message = item as { role?: string; content?: unknown }
      if (message.role && message.content) {
        let content = ''
        if (typeof message.content === 'string') {
          content = message.content
        } else if (Array.isArray(message.content)) {
          const textPart = message.content.find((part: unknown) => 
            typeof part === 'object' && part !== null && 'type' in part && part.type === 'text'
          ) as { text?: string } | undefined
          content = textPart?.text || ''
        }
        
        // Validar que el role sea válido
        if (message.role === 'user' || message.role === 'assistant' || message.role === 'system') {
          messages.push({ 
            role: message.role, 
            content,
            id: `msg-${messages.length}`,
            timestamp: new Date()
          })
        }
      }
    }
    
    return messages
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
  
  // Middleware de Guardrails Expandido
  const guardrailMiddleware: LanguageModelV1Middleware = {
    wrapGenerate: async ({ doGenerate, params }) => {
      const result = await doGenerate()
      
      if (!result.text) {
        return result
      }
      
      const query = getLastUserMessageText(params.prompt as unknown[])
      const messages = extractMessages(params.prompt as unknown[])
      
      // Generar un ID de sesión simple (en producción usar un ID real)
      const sessionId = 'default-session'
      const metrics = getConversationMetrics(sessionId)
      
      // Actualizar métricas con el nuevo mensaje
      const updatedMetrics = updateConversationMetrics(
        messages,
        metrics,
        { role: 'user', content: query, id: 'current', timestamp: new Date() }
      )
      
      // Verificar si debería redirigir a consulta
      if (shouldRedirectToConsultation(updatedMetrics)) {
        const redirectResponse = `Hemos estado conversando por un tiempo y veo que tienes muchas preguntas. Para brindarte la mejor atención y resolver todas tus dudas de manera más eficiente, te sugiero que agendemos una consulta personalizada donde podamos discutir tu proyecto en detalle. ¿Te gustaría que te ayude a programar una sesión? [AUTO_OPEN_CONSULTATION]`
        
        // Logging
        logInteraction({
          timestamp: new Date().toISOString(),
          query,
          response: redirectResponse,
          action: 'redirect',
          conversationMetrics: updatedMetrics,
          ragContext: getRelevantContext(query) ? 'used' : 'not_used'
        })
        
        return {
          ...result,
          text: redirectResponse,
          finishReason: 'other'
        }
      }
      
      // Configuración de guardrails
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
      
      // Validar respuesta con el nuevo sistema expandido
      const guardrailResults = validateResponse(
        result.text, 
        query, 
        messages,
        updatedMetrics,
        Date.now() - (messages.length * 30000), // Estimación del tiempo de inicio
        guardrailConfig
      )
      
      const overallAction = getOverallAction(guardrailResults)
      const guardrailSummary = getGuardrailSummary(guardrailResults)
      
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
        case 'redirect':
          processedText = `Hemos estado conversando por un tiempo. Para brindarte la mejor atención, te sugiero que agendemos una consulta personalizada donde podamos discutir tu proyecto en detalle. ¿Te gustaría que te ayude a programar una sesión? [AUTO_OPEN_CONSULTATION]`
          blocked = true
          break
        case 'allow':
        default:
          // No changes needed
          break
      }
      
      // Actualizar métricas de recuperación si fue necesario
      if (guardrailResults.some(r => r.category === 'recovery')) {
        updatedMetrics.recoveryAttempts++
      }
      
      // Guardar métricas actualizadas
      conversationMetricsStore.set(sessionId, updatedMetrics)
      
      // Logging expandido
      logInteraction({
        timestamp: new Date().toISOString(),
        query,
        response: processedText,
        action: overallAction,
        guardrailResults: guardrailResults.filter(r => !r.isValid),
        ragContext: getRelevantContext(query) ? 'used' : 'not_used',
        conversationMetrics: updatedMetrics,
        guardrailSummary
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
  
  // Función para logging
  function logInteraction(entry: LogEntry) {
    logStore.push(entry)
    
    // Log detallado para debugging
    console.log('[Guardrails]', {
      action: entry.action,
      query: entry.query.substring(0, 100) + '...',
      responseLength: entry.response.length,
      guardrailResults: entry.guardrailResults?.length || 0,
      metrics: entry.conversationMetrics,
      summary: entry.guardrailSummary
    })
    
    // Limitar el tamaño del log en memoria
    if (logStore.length > 1000) {
      logStore.splice(0, 100)
    }
  }
  
  // Función para obtener estadísticas del middleware
  export function getMiddlewareStats() {
    const totalInteractions = logStore.length
    const actions = logStore.reduce((acc, entry) => {
      acc[entry.action] = (acc[entry.action] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const averageResponseLength = logStore.reduce((acc, entry) => 
      acc + entry.response.length, 0) / totalInteractions || 0
    
    const ragUsage = logStore.filter(entry => entry.ragContext === 'used').length
    
    return {
      totalInteractions,
      actions,
      averageResponseLength: Math.round(averageResponseLength),
      ragUsage,
      ragUsagePercentage: Math.round((ragUsage / totalInteractions) * 100),
      conversationMetrics: Array.from(conversationMetricsStore.values())
    }
  }
  
  // Función para limpiar logs
  export function clearLogs() {
    logStore.length = 0
    conversationMetricsStore.clear()
  }
  
  // Función para obtener métricas de conversación específicas
  export function getConversationMetricsById(sessionId: string): ConversationMetrics | null {
    return conversationMetricsStore.get(sessionId) || null
  }
  
  // Función para obtener resumen de guardrails
  export function getGuardrailsReport(): {
    totalInteractions: number
    blockedResponses: number
    modifiedResponses: number
    redirectedConversations: number
    averageQualityScore: number
    topIssues: Array<{ category: string; count: number }>
  } {
    const totalInteractions = logStore.length
    const blockedResponses = logStore.filter(entry => entry.action === 'block').length
    const modifiedResponses = logStore.filter(entry => entry.action === 'modify').length
    const redirectedConversations = logStore.filter(entry => entry.action === 'redirect').length
    
    // Calcular score de calidad promedio
    const qualityScores = logStore
      .map(entry => entry.conversationMetrics?.qualityScore || 1.0)
      .filter(score => score > 0)
    const averageQualityScore = qualityScores.length > 0 
      ? qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length 
      : 1.0
    
    // Obtener problemas más frecuentes
    const issueCounts: Record<string, number> = {}
    logStore.forEach(entry => {
      entry.guardrailResults?.forEach(result => {
        if (!result.isValid) {
          issueCounts[result.category] = (issueCounts[result.category] || 0) + 1
        }
      })
    })
    
    const topIssues = Object.entries(issueCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    return {
      totalInteractions,
      blockedResponses,
      modifiedResponses,
      redirectedConversations,
      averageQualityScore: Math.round(averageQualityScore * 100) / 100,
      topIssues
    }
  }