// lib/guardrails.ts
import { type ChatMessage } from '../hooks/types'

export interface GuardrailResult {
  isValid: boolean
  reason?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  action: 'allow' | 'modify' | 'block' | 'redirect'
  category: 'content' | 'scope' | 'tone' | 'length' | 'time' | 'quality' | 'recovery'
}

export interface GuardrailConfig {
  enableContentFiltering: boolean
  enableFactChecking: boolean
  enableToneValidation: boolean
  enableScopeValidation: boolean
  enableQualityFiltering: boolean
  enableTimeLimits: boolean
  enableConversationRecovery: boolean
  maxResponseLength: number
  maxConversationLength: number
  maxConversationTime: number // en minutos
  qualityThreshold: number // 0-1
  recoveryAttempts: number
}

export interface ConversationMetrics {
  messageCount: number
  conversationDuration: number // en minutos
  offTopicCount: number
  qualityScore: number
  lastOnTopicTime: number // timestamp
  recoveryAttempts: number
}

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
  maxConversationTime: 30,
  qualityThreshold: 0.7,
  recoveryAttempts: 3
}

// ============================================================================
// REGLAS DE CONTENIDO PROHIBIDO
// ============================================================================

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

// ============================================================================
// PALABRAS CLAVE DE SERVICIOS DE GABRIEL BUSTOS
// ============================================================================

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

// ============================================================================
// INDICADORES DE CALIDAD
// ============================================================================

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

const unprofessionalIndicators = [
  'jajaja', 'lol', 'omg', 'wtf', 'obviamente no sé', 
  'no tengo idea', 'supongo que', 'tal vez funcione',
  'no estoy seguro', 'puede ser', 'quizás', 'a lo mejor',
  'no sé exactamente', 'no tengo la información'
]

// ============================================================================
// FRASES DE RECUPERACIÓN DE CONVERSACIÓN
// ============================================================================

const recoveryPhrases = [
  'Volviendo a nuestros servicios de desarrollo web, ¿te gustaría que te explique más sobre...',
  'Para enfocarnos en lo que mejor puedo ayudarte, ¿tienes alguna consulta sobre...',
  'Como especialista en desarrollo web, puedo ayudarte mejor con temas como...',
  'Permíteme recordarte que soy el asistente de Gabriel Bustos, especializado en...',
  'Para brindarte el mejor servicio, ¿podrías contarme más sobre tu proyecto web?'
]

// ============================================================================
// FUNCIONES DE VALIDACIÓN PRINCIPALES
// ============================================================================

// Validar contenido inapropiado
function validateContent(text: string): GuardrailResult {
  const lowerText = text.toLowerCase()
  
  for (const prohibited of prohibitedContent) {
    if (lowerText.includes(prohibited.toLowerCase())) {
      return {
        isValid: false,
        reason: `Contenido contiene información prohibida: ${prohibited}`,
        severity: 'critical',
        action: 'block',
        category: 'content'
      }
    }
  }
  
  return {
    isValid: true,
    severity: 'low',
    action: 'allow',
    category: 'content'
  }
}

// Validar alcance de servicios
function validateScope(text: string, query: string): GuardrailResult {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  
  // Verificar si es una consulta fuera del tema
  for (const keyword of sensitiveTopics) {
    if (lowerQuery.includes(keyword.toLowerCase()) || lowerText.includes(keyword.toLowerCase())) {
      return {
        isValid: false,
        reason: `Consulta fuera del alcance: ${keyword}`,
        severity: 'high',
        action: 'modify',
        category: 'scope'
      }
    }
  }
  
  // Verificar relevancia con servicios de Gabriel Bustos
  const hasRelevantContent = gabrielBustosKeywords.some(keyword => 
    lowerText.includes(keyword) || lowerQuery.includes(keyword)
  )
  
  if (!hasRelevantContent && text.length > 100) {
    return {
      isValid: false,
      reason: 'Respuesta no relacionada con servicios de desarrollo web',
      severity: 'medium',
      action: 'modify',
      category: 'scope'
    }
  }
  
  return {
    isValid: true,
    severity: 'low',
    action: 'allow',
    category: 'scope'
  }
}

// Validar longitud de respuesta
function validateLength(text: string, maxLength: number): GuardrailResult {
  if (text.length > maxLength) {
    return {
      isValid: false,
      reason: `Respuesta demasiado larga (${text.length} caracteres, máximo ${maxLength})`,
      severity: 'low',
      action: 'modify',
      category: 'length'
    }
  }
  
  return {
    isValid: true,
    severity: 'low',
    action: 'allow',
    category: 'length'
  }
}

// Validar tono profesional
function validateTone(text: string): GuardrailResult {
  const lowerText = text.toLowerCase()
  
  for (const indicator of unprofessionalIndicators) {
    if (lowerText.includes(indicator)) {
      return {
        isValid: false,
        reason: `Tono no profesional detectado: ${indicator}`,
        severity: 'medium',
        action: 'modify',
        category: 'tone'
      }
    }
  }
  
  return {
    isValid: true,
    severity: 'low',
    action: 'allow',
    category: 'tone'
  }
}

// Validar calidad de respuesta
function validateQuality(text: string, query: string): GuardrailResult {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  
  let qualityScore = 0
  let totalChecks = 0
  
  // Verificar si responde a la pregunta
  const questionWords = ['qué', 'que', 'cómo', 'como', 'cuándo', 'cuando', 'dónde', 'donde', 'por qué', 'porque']
  const hasQuestion = questionWords.some(word => lowerQuery.includes(word))
  
  if (hasQuestion) {
    totalChecks++
    // Verificar si la respuesta contiene palabras relacionadas con la pregunta
    const queryWords = lowerQuery.split(' ').filter(word => word.length > 3)
    const relevantWords = queryWords.filter(word => lowerText.includes(word))
    if (relevantWords.length > 0) {
      qualityScore += 0.3
    }
  }
  
  // Verificar indicadores de calidad positiva
  totalChecks++
  const positiveCount = qualityIndicators.positive.filter(indicator => 
    lowerText.includes(indicator)
  ).length
  qualityScore += (positiveCount / qualityIndicators.positive.length) * 0.3
  
  // Verificar indicadores de calidad negativa
  totalChecks++
  const negativeCount = qualityIndicators.negative.filter(indicator => 
    lowerText.includes(indicator)
  ).length
  qualityScore -= (negativeCount / qualityIndicators.negative.length) * 0.2
  
  // Verificar estructura y coherencia
  totalChecks++
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
  if (sentences.length >= 2) {
    qualityScore += 0.2
  }
  
  const finalScore = Math.max(0, Math.min(1, qualityScore / totalChecks))
  
  if (finalScore < 0.5) {
    return {
      isValid: false,
      reason: `Calidad de respuesta baja (score: ${finalScore.toFixed(2)})`,
      severity: 'medium',
      action: 'modify',
      category: 'quality'
    }
  }
  
  return {
    isValid: true,
    severity: 'low',
    action: 'allow',
    category: 'quality'
  }
}

// Validar límites de tiempo y longitud de conversación
function validateConversationLimits(
  messages: ChatMessage[], 
  startTime: number,
  config: GuardrailConfig
): GuardrailResult {
  const currentTime = Date.now()
  const conversationDuration = (currentTime - startTime) / (1000 * 60) // en minutos
  
  // Verificar límite de tiempo
  if (conversationDuration > config.maxConversationTime) {
    return {
      isValid: false,
      reason: `Conversación excede el límite de tiempo (${conversationDuration.toFixed(1)} min, máximo ${config.maxConversationTime} min)`,
      severity: 'medium',
      action: 'redirect',
      category: 'time'
    }
  }
  
  // Verificar límite de mensajes
  if (messages.length > config.maxConversationLength) {
    return {
      isValid: false,
      reason: `Conversación excede el límite de mensajes (${messages.length}, máximo ${config.maxConversationLength})`,
      severity: 'medium',
      action: 'redirect',
      category: 'time'
    }
  }
  
  return {
    isValid: true,
    severity: 'low',
    action: 'allow',
    category: 'time'
  }
}

// ============================================================================
// SISTEMA DE RECUPERACIÓN DE CONVERSACIÓN
// ============================================================================

export function analyzeConversationDeviation(
  messages: ChatMessage[],
  metrics: ConversationMetrics
): GuardrailResult | null {
  const recentMessages = messages.slice(-5) // Últimos 5 mensajes
  const currentTime = Date.now()
  
  // Verificar si la conversación se ha desviado del tema
  let offTopicCount = 0
  let lastOnTopicTime = metrics.lastOnTopicTime
  
  for (const message of recentMessages) {
    if (message.role === 'user') {
      const hasRelevantContent = gabrielBustosKeywords.some(keyword => 
        message.content.toLowerCase().includes(keyword)
      )
      
      if (!hasRelevantContent) {
        offTopicCount++
      } else {
        lastOnTopicTime = currentTime
      }
    }
  }
  
  // Si más del 60% de los mensajes recientes están fuera de tema
  if (offTopicCount >= 3 && metrics.recoveryAttempts < 3) {
    return {
      isValid: false,
      reason: 'Conversación desviada del tema principal',
      severity: 'medium',
      action: 'modify',
      category: 'recovery'
    }
  }
  
  // Si han pasado más de 5 minutos sin tocar temas relevantes
  const timeSinceOnTopic = (currentTime - lastOnTopicTime) / (1000 * 60)
  if (timeSinceOnTopic > 5 && metrics.recoveryAttempts < 3) {
    return {
      isValid: false,
      reason: 'Mucho tiempo sin abordar temas relevantes',
      severity: 'medium',
      action: 'modify',
      category: 'recovery'
    }
  }
  
  return null
}

// ============================================================================
// FUNCIÓN PRINCIPAL DE VALIDACIÓN
// ============================================================================

export function validateResponse(
  response: string, 
  query: string, 
  messages: ChatMessage[] = [],
  metrics: ConversationMetrics,
  startTime: number,
  config: GuardrailConfig = defaultConfig
): GuardrailResult[] {
  const results: GuardrailResult[] = []
  
  // Validaciones básicas
  if (config.enableContentFiltering) {
    results.push(validateContent(response))
  }
  
  if (config.enableScopeValidation) {
    results.push(validateScope(response, query))
  }
  
  if (config.enableToneValidation) {
    results.push(validateTone(response))
  }
  
  if (config.enableQualityFiltering) {
    results.push(validateQuality(response, query))
  }
  
  results.push(validateLength(response, config.maxResponseLength))
  
  // Validaciones de conversación
  if (config.enableTimeLimits) {
    results.push(validateConversationLimits(messages, startTime, config))
  }
  
  if (config.enableConversationRecovery) {
    const recoveryResult = analyzeConversationDeviation(messages, metrics)
    if (recoveryResult) {
      results.push(recoveryResult)
    }
  }
  
  return results
}

// ============================================================================
// FUNCIONES DE ACCIÓN
// ============================================================================

// Obtener la acción más restrictiva
export function getOverallAction(results: GuardrailResult[]): 'allow' | 'modify' | 'block' | 'redirect' {
  if (results.some(r => r.action === 'block')) return 'block'
  if (results.some(r => r.action === 'redirect')) return 'redirect'
  if (results.some(r => r.action === 'modify')) return 'modify'
  return 'allow'
}

// Generar respuesta de fallback cuando se bloquea
export function generateFallbackResponse(results: GuardrailResult[]): string {
  const blockedReasons = results.filter(r => !r.isValid).map(r => r.reason)
  
  if (blockedReasons.some(r => r?.includes('fuera del alcance'))) {
    return `Lo siento, esa consulta está fuera de mi área de especialización. Soy el asistente de Gabriel Bustos, desarrollador web profesional, y estoy aquí para ayudarte con información sobre nuestros servicios de desarrollo web, landing pages, plataformas con inteligencia artificial, rebranding y optimización de sitios web. ¿Te puedo ayudar con alguno de estos temas?`
  }
  
  if (blockedReasons.some(r => r?.includes('límite de tiempo'))) {
    return `Hemos estado conversando por un tiempo. Para brindarte la mejor atención, te sugiero que agendemos una consulta personalizada donde podamos discutir tu proyecto en detalle. ¿Te gustaría que te ayude a programar una sesión?`
  }
  
  if (blockedReasons.some(r => r?.includes('Conversación desviada'))) {
    const randomPhrase = recoveryPhrases[Math.floor(Math.random() * recoveryPhrases.length)]
    return `${randomPhrase} desarrollo web, landing pages, integración de IA, o consultoría técnica?`
  }
  
  return `Lo siento, no puedo proporcionar esa información específica. Como asistente de Gabriel Bustos, puedo ayudarte con consultas sobre nuestros servicios de desarrollo web, procesos de trabajo, o programar una consulta para tu proyecto. ¿En qué más te puedo asistir?`
}

// Modificar respuesta para cumplir con guardrails
export function modifyResponse(response: string, results: GuardrailResult[]): string {
  let modifiedResponse = response
  
  // Si es demasiado larga, truncar elegantemente
  const lengthIssue = results.find(r => r.reason?.includes('demasiado larga'))
  if (lengthIssue) {
    const maxLength = 600 // Un poco menos del máximo para permitir cierre elegante
    if (modifiedResponse.length > maxLength) {
      modifiedResponse = modifiedResponse.substring(0, maxLength)
      const lastSentence = modifiedResponse.lastIndexOf('.')
      if (lastSentence > maxLength * 0.7) {
        modifiedResponse = modifiedResponse.substring(0, lastSentence + 1)
      }
      modifiedResponse += '\n\n¿Te gustaría que profundice en algún aspecto específico?'
    }
  }
  
  // Si no está relacionado con servicios de desarrollo web, agregar contexto
  const scopeIssue = results.find(r => r.reason?.includes('no relacionada con servicios'))
  if (scopeIssue) {
    modifiedResponse += '\n\nSi tienes preguntas específicas sobre nuestros servicios de desarrollo web, landing pages, plataformas con inteligencia artificial, rebranding o optimización de sitios web, estaré encantado de ayudarte.'
  }
  
  // Si la calidad es baja, agregar estructura
  const qualityIssue = results.find(r => r.reason?.includes('Calidad de respuesta baja'))
  if (qualityIssue) {
    modifiedResponse += '\n\n¿Podrías ser más específico sobre lo que necesitas? Así podré darte una respuesta más precisa y útil.'
  }
  
  // Si la conversación se ha desviado, intentar recuperarla
  const recoveryIssue = results.find(r => r.category === 'recovery')
  if (recoveryIssue) {
    const randomPhrase = recoveryPhrases[Math.floor(Math.random() * recoveryPhrases.length)]
    modifiedResponse += `\n\n${randomPhrase} nuestros servicios de desarrollo web?`
  }
  
  return modifiedResponse
}

// ============================================================================
// FUNCIONES DE MÉTRICAS Y MONITOREO
// ============================================================================

export function updateConversationMetrics(
  messages: ChatMessage[],
  currentMetrics: ConversationMetrics,
  newMessage: ChatMessage
): ConversationMetrics {
  const updatedMetrics = { ...currentMetrics }
  
  // Incrementar contador de mensajes
  updatedMetrics.messageCount = messages.length
  
  // Verificar si el mensaje está fuera de tema
  if (newMessage.role === 'user') {
    const hasRelevantContent = gabrielBustosKeywords.some(keyword => 
      newMessage.content.toLowerCase().includes(keyword)
    )
    
    if (!hasRelevantContent) {
      updatedMetrics.offTopicCount++
    } else {
      updatedMetrics.lastOnTopicTime = Date.now()
    }
  }
  
  // Calcular duración de conversación
  const startTime = Date.now() - (messages.length * 30000) // Estimación: 30 segundos por mensaje
  updatedMetrics.conversationDuration = (Date.now() - startTime) / (1000 * 60)
  
  return updatedMetrics
}

export function shouldRedirectToConsultation(metrics: ConversationMetrics): boolean {
  return (
    metrics.messageCount > 20 ||
    metrics.conversationDuration > 15 ||
    metrics.offTopicCount > 5 ||
    metrics.recoveryAttempts >= 3
  )
}

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

export function getGuardrailSummary(results: GuardrailResult[]): {
  totalChecks: number
  passedChecks: number
  failedChecks: number
  criticalIssues: number
  recommendations: string[]
} {
  const totalChecks = results.length
  const passedChecks = results.filter(r => r.isValid).length
  const failedChecks = totalChecks - passedChecks
  const criticalIssues = results.filter(r => r.severity === 'critical').length
  
  const recommendations: string[] = []
  
  if (failedChecks > 0) {
    recommendations.push(`Se detectaron ${failedChecks} problemas que requieren atención`)
  }
  
  if (criticalIssues > 0) {
    recommendations.push(`Hay ${criticalIssues} problemas críticos que deben resolverse`)
  }
  
  const qualityScore = passedChecks / totalChecks
  if (qualityScore < 0.8) {
    recommendations.push('La calidad general de la respuesta necesita mejora')
  }
  
  return {
    totalChecks,
    passedChecks,
    failedChecks,
    criticalIssues,
    recommendations
  }
}