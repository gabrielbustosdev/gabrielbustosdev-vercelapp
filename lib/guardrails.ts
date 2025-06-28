// lib/guardrails.ts
export interface GuardrailResult {
    isValid: boolean
    reason?: string
    severity: 'low' | 'medium' | 'high'
    action: 'allow' | 'modify' | 'block'
  }
  
  export interface GuardrailConfig {
    enableContentFiltering: boolean
    enableFactChecking: boolean
    enableToneValidation: boolean
    enableScopeValidation: boolean
    maxResponseLength: number
  }
  
  const defaultConfig: GuardrailConfig = {
    enableContentFiltering: true,
    enableFactChecking: true,
    enableToneValidation: true,
    enableScopeValidation: true,
    maxResponseLength: 1000
  }
  
  // Palabras y frases prohibidas o que requieren cuidado
  const prohibitedContent = [
    'precios exactos sin consulta',
    'garantía 100%',
    'información confidencial',
    'datos de otros clientes',
    'código fuente completo',
    'contraseñas o credenciales'
  ]
  
  const offTopicKeywords = [
    'recetas de cocina',
    'consejos médicos',
    'información legal específica',
    'temas políticos',
    'contenido adulto',
    'servicios de contabilidad',
    'servicios legales'
  ]
  
  // Validar contenido inapropiado
  function validateContent(text: string): GuardrailResult {
    const lowerText = text.toLowerCase()
    
    for (const prohibited of prohibitedContent) {
      if (lowerText.includes(prohibited.toLowerCase())) {
        return {
          isValid: false,
          reason: `Contenido contiene información prohibida: ${prohibited}`,
          severity: 'high',
          action: 'block'
        }
      }
    }
    
    return {
      isValid: true,
      severity: 'low',
      action: 'allow'
    }
  }
  
  // Validar si la respuesta está dentro del alcance de Gabriel Bustos
  function validateScope(text: string, query: string): GuardrailResult {
    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()
    
    // Verificar si es una consulta fuera del tema
    for (const keyword of offTopicKeywords) {
      if (lowerQuery.includes(keyword.toLowerCase()) || lowerText.includes(keyword.toLowerCase())) {
        return {
          isValid: false,
          reason: 'Consulta fuera del alcance de mis servicios de desarrollo web',
          severity: 'medium',
          action: 'modify'
        }
      }
    }
    
    // Verificar si menciona servicios de Gabriel Bustos
    const gabrielBustosKeywords = [
      'desarrollo web', 'landing page', 'next.js', 'react', 'typescript', 
      'inteligencia artificial', 'chatbot', 'automatización', 'plataforma web',
      'rebranding', 'optimización', 'seo', 'responsive', 'frontend', 'backend',
      'supabase', 'vercel', 'tailwind', 'gabriel bustos', 'gabrielbustosdev'
    ]
    
    const hasRelevantContent = gabrielBustosKeywords.some(keyword => 
      lowerText.includes(keyword) || lowerQuery.includes(keyword)
    )
    
    if (!hasRelevantContent && text.length > 100) {
      return {
        isValid: false,
        reason: 'Respuesta no relacionada con servicios de desarrollo web',
        severity: 'medium',
        action: 'modify'
      }
    }
    
    return {
      isValid: true,
      severity: 'low',
      action: 'allow'
    }
  }
  
  // Validar longitud de respuesta
  function validateLength(text: string, maxLength: number): GuardrailResult {
    if (text.length > maxLength) {
      return {
        isValid: false,
        reason: `Respuesta demasiado larga (${text.length} caracteres, máximo ${maxLength})`,
        severity: 'low',
        action: 'modify'
      }
    }
    
    return {
      isValid: true,
      severity: 'low',
      action: 'allow'
    }
  }
  
  // Validar tono profesional
  function validateTone(text: string): GuardrailResult {
    const unprofessionalIndicators = [
      'jajaja', 'lol', 'omg', 'wtf', 'obviamente no sé', 
      'no tengo idea', 'supongo que', 'tal vez funcione'
    ]
    
    const lowerText = text.toLowerCase()
    
    for (const indicator of unprofessionalIndicators) {
      if (lowerText.includes(indicator)) {
        return {
          isValid: false,
          reason: `Tono no profesional detectado: ${indicator}`,
          severity: 'medium',
          action: 'modify'
        }
      }
    }
    
    return {
      isValid: true,
      severity: 'low',
      action: 'allow'
    }
  }
  
  // Función principal de validación
  export function validateResponse(
    response: string, 
    query: string, 
    config: GuardrailConfig = defaultConfig
  ): GuardrailResult[] {
    const results: GuardrailResult[] = []
    
    if (config.enableContentFiltering) {
      results.push(validateContent(response))
    }
    
    if (config.enableScopeValidation) {
      results.push(validateScope(response, query))
    }
    
    if (config.enableToneValidation) {
      results.push(validateTone(response))
    }
    
    results.push(validateLength(response, config.maxResponseLength))
    
    return results
  }
  
  // Obtener la acción más restrictiva
  export function getOverallAction(results: GuardrailResult[]): 'allow' | 'modify' | 'block' {
    if (results.some(r => r.action === 'block')) return 'block'
    if (results.some(r => r.action === 'modify')) return 'modify'
    return 'allow'
  }
  
  // Generar respuesta de fallback cuando se bloquea
  export function generateFallbackResponse(results: GuardrailResult[]): string {
    const blockedReasons = results.filter(r => !r.isValid).map(r => r.reason)
    
    if (blockedReasons.some(r => r?.includes('fuera del alcance'))) {
      return `Lo siento, esa consulta está fuera de mi área de especialización. Soy el asistente de Gabriel Bustos, desarrollador web profesional, y estoy aquí para ayudarte con información sobre nuestros servicios de desarrollo web, landing pages, plataformas con inteligencia artificial, rebranding y optimización de sitios web. ¿Te puedo ayudar con alguno de estos temas?`
    }
    
    return `Lo siento, no puedo proporcionar esa información específica. Como asistente de Gabriel Bustos, puedo ayudarte con consultas sobre nuestros servicios de desarrollo web, procesos de trabajo, o programar una consulta para tu proyecto. ¿En qué más te puedo asistir?`
  }
  
  // Modificar respuesta para cumplir con guardrails
  export function modifyResponse(response: string, results: GuardrailResult[]): string {
    let modifiedResponse = response
    
    // Si es demasiado larga, truncar elegantemente
    const lengthIssue = results.find(r => r.reason?.includes('demasiado larga'))
    if (lengthIssue) {
      const maxLength = 800 // Un poco menos del máximo para permitir cierre elegante
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
    
    return modifiedResponse
  }