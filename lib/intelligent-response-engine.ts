import { 
  type NLPResult, 
  type Entity, 
  type Intent, 
  type Sentiment
} from './nlp-processor'
import { type ConversationData, type ResponseTone, type UrgencyLevel } from '../hooks/types'

// ============================================================================
// TIPOS PARA EL MOTOR DE RESPUESTA INTELIGENTE
// ============================================================================

export interface ResponseContext {
  nlpResult: NLPResult
  conversationData: Partial<ConversationData>
  responseTone: ResponseTone
  urgencyLevel: UrgencyLevel
  missingInfo: string[]
  followUpQuestions: string[]
}

export interface ResponseTemplate {
  id: string
  intent: Intent['type']
  tone: ResponseTone
  template: string
  variables: string[]
  conditions?: (context: ResponseContext) => boolean
}

// ============================================================================
// PLANTILLAS DE RESPUESTA INTELIGENTE
// ============================================================================

const RESPONSE_TEMPLATES: ResponseTemplate[] = [
  // Saludos
  {
    id: 'greeting_warm',
    intent: 'greeting',
    tone: 'enthusiastic',
    template: '¡Hola! Me alegra mucho conocerte. Soy el asistente de IA de Gabriel Bustos y estoy aquí para ayudarte con cualquier consulta sobre desarrollo web, integración de IA o consultoría técnica. ¿En qué puedo ayudarte hoy?',
    variables: []
  },
  {
    id: 'greeting_professional',
    intent: 'greeting',
    tone: 'professional',
    template: 'Buenos días. Soy el asistente de IA de Gabriel Bustos. ¿En qué puedo ayudarte con respecto a nuestros servicios de desarrollo y consultoría?',
    variables: []
  },

  // Consultas de proyecto
  {
    id: 'project_inquiry_with_enthusiasm',
    intent: 'project_inquiry',
    tone: 'enthusiastic',
    template: '¡Excelente! Me encanta que estés interesado en un proyecto. Veo que mencionas {project_type}. ¿Podrías contarme más sobre lo que tienes en mente? Me interesa saber: {missing_info}',
    variables: ['project_type', 'missing_info'],
    conditions: (context) => context.nlpResult.sentiment.label === 'positive' || context.nlpResult.sentiment.label === 'very_positive'
  },
  {
    id: 'project_inquiry_professional',
    intent: 'project_inquiry',
    tone: 'professional',
    template: 'Entiendo que estás interesado en {project_type}. Para poder ayudarte mejor, necesito recopilar algunos detalles: {missing_info}',
    variables: ['project_type', 'missing_info']
  },

  // Discusiones de presupuesto
  {
    id: 'budget_discussion_empathetic',
    intent: 'budget_discussion',
    tone: 'empathetic',
    template: 'Entiendo que el presupuesto es una consideración importante. Veo que mencionas {budget}. Te ayudo a encontrar la mejor opción que se ajuste a tus necesidades y presupuesto. ¿Qué funcionalidades son más importantes para ti?',
    variables: ['budget'],
    conditions: (context) => context.nlpResult.sentiment.label === 'negative' || context.nlpResult.sentiment.label === 'very_negative'
  },
  {
    id: 'budget_discussion_professional',
    intent: 'budget_discussion',
    tone: 'professional',
    template: 'Perfecto, veo que tu presupuesto es de {budget}. Con esa inversión podemos crear algo realmente valioso. ¿Te gustaría que te explique las opciones disponibles?',
    variables: ['budget']
  },

  // Consultas de servicios
  {
    id: 'service_inquiry_enthusiastic',
    intent: 'service_inquiry',
    tone: 'enthusiastic',
    template: '¡Me encanta que preguntes! Ofrecemos servicios increíbles: desarrollo web personalizado, integración de IA, consultoría técnica y más. ¿Hay algún área específica que te interese más?',
    variables: []
  },

  // Solicitudes de contacto
  {
    id: 'contact_request_urgent',
    intent: 'contact_request',
    tone: 'professional',
    template: 'Por supuesto, me encantaría ayudarte personalmente. Dado que veo que esto es {urgency_level}, te sugiero que agendemos una consulta lo antes posible. ¿Tienes disponibilidad esta semana?',
    variables: ['urgency_level'],
    conditions: (context) => context.urgencyLevel === 'high'
  },

  // Preguntas técnicas
  {
    id: 'technical_question_detailed',
    intent: 'technical_question',
    tone: 'professional',
    template: 'Excelente pregunta técnica. {technical_answer} ¿Te gustaría que profundicemos en algún aspecto específico?',
    variables: ['technical_answer']
  },

  // Despedidas
  {
    id: 'goodbye_warm',
    intent: 'goodbye',
    tone: 'enthusiastic',
    template: '¡Ha sido un placer ayudarte! Si tienes más preguntas o quieres continuar con tu proyecto, no dudes en volver. ¡Que tengas un excelente día!',
    variables: []
  }
]

// ============================================================================
// CLASE PRINCIPAL DEL MOTOR DE RESPUESTA INTELIGENTE
// ============================================================================

export class IntelligentResponseEngine {
  private static instance: IntelligentResponseEngine

  private constructor() {}

  static getInstance(): IntelligentResponseEngine {
    if (!IntelligentResponseEngine.instance) {
      IntelligentResponseEngine.instance = new IntelligentResponseEngine()
    }
    return IntelligentResponseEngine.instance
  }

  /**
   * Genera una respuesta inteligente basada en el análisis NLP
   */
  generateResponse(context: ResponseContext): string {
    const { nlpResult, responseTone, urgencyLevel, missingInfo } = context

    // Seleccionar la plantilla más apropiada
    const template = this.selectBestTemplate(context)
    
    if (!template) {
      return this.generateFallbackResponse(context)
    }

    // Generar variables para la plantilla
    const variables = this.generateTemplateVariables(template, context)

    // Aplicar la plantilla
    let response = template.template

    // Reemplazar variables en la plantilla
    Object.entries(variables).forEach(([key, value]) => {
      response = response.replace(`{${key}}`, value)
    })

    // Ajustar el tono basado en el sentimiento
    response = this.adjustToneForSentiment(response, nlpResult.sentiment)

    // Agregar preguntas de seguimiento si es necesario
    if (missingInfo.length > 0) {
      response += this.generateFollowUpQuestions(missingInfo, responseTone)
    }

    // Agregar indicadores de urgencia si es necesario
    if (urgencyLevel === 'high') {
      response += this.addUrgencyIndicator(responseTone)
    }

    return response
  }

  /**
   * Selecciona la mejor plantilla basada en el contexto
   */
  private selectBestTemplate(context: ResponseContext): ResponseTemplate | null {
    const { nlpResult, responseTone } = context

    // Filtrar plantillas por intención
    const intentTemplates = RESPONSE_TEMPLATES.filter(
      template => template.intent === nlpResult.intent.type
    )

    if (intentTemplates.length === 0) {
      return null
    }

    // Filtrar por condiciones si existen
    const validTemplates = intentTemplates.filter(template => {
      if (!template.conditions) return true
      return template.conditions(context)
    })

    if (validTemplates.length === 0) {
      return intentTemplates[0] // Usar la primera si no hay condiciones válidas
    }

    // Preferir plantillas que coincidan con el tono actual
    const toneMatch = validTemplates.find(template => template.tone === responseTone)
    if (toneMatch) {
      return toneMatch
    }

    // Si no hay coincidencia de tono, usar la primera válida
    return validTemplates[0]
  }

  /**
   * Genera variables para la plantilla
   */
  private generateTemplateVariables(template: ResponseTemplate, context: ResponseContext): Record<string, string> {
    const { nlpResult, missingInfo } = context
    const variables: Record<string, string> = {}

    template.variables.forEach(variable => {
      switch (variable) {
        case 'project_type':
          variables[variable] = this.extractProjectType(nlpResult.entities)
          break
        case 'budget':
          variables[variable] = this.extractBudget(nlpResult.entities)
          break
        case 'missing_info':
          variables[variable] = this.formatMissingInfo(missingInfo)
          break
        case 'urgency_level':
          variables[variable] = context.urgencyLevel === 'high' ? 'urgente' : 'importante'
          break
        case 'technical_answer':
          variables[variable] = this.generateTechnicalAnswer(nlpResult.intent.type)
          break
        default:
          variables[variable] = this.extractEntityValue(nlpResult.entities, variable)
      }
    })

    return variables
  }

  /**
   * Extrae el tipo de proyecto de las entidades
   */
  private extractProjectType(entities: Entity[]): string {
    const projectEntity = entities.find(e => e.type === 'project_type')
    if (projectEntity) {
      return projectEntity.value
    }
    
    return 'un proyecto'
  }

  /**
   * Extrae el presupuesto de las entidades
   */
  private extractBudget(entities: Entity[]): string {
    const budgetEntity = entities.find(e => e.type === 'budget')
    if (budgetEntity) {
      return budgetEntity.value
    }
    
    return 'un presupuesto que se ajuste a tus necesidades'
  }

  /**
   * Formatea la información faltante
   */
  private formatMissingInfo(missingInfo: string[]): string {
    if (missingInfo.length === 0) {
      return 'todos los detalles necesarios'
    }

    const fieldLabels: Record<string, string> = {
      name: 'tu nombre',
      email: 'tu email',
      phone: 'tu teléfono',
      projectType: 'el tipo de proyecto',
      requirements: 'los requisitos específicos',
      budget: 'el presupuesto',
      timeline: 'el plazo de entrega',
      companyName: 'el nombre de tu empresa',
      location: 'tu ubicación'
    }

    const formattedFields = missingInfo
      .map(field => fieldLabels[field] || field)
      .join(', ')

    return formattedFields
  }

  /**
   * Extrae el valor de una entidad específica
   */
  private extractEntityValue(entities: Entity[], type: string): string {
    const entity = entities.find(e => e.type === type)
    return entity ? entity.value : ''
  }

  /**
   * Genera respuestas técnicas básicas
   */
  private generateTechnicalAnswer(intentType: string): string {
    const technicalAnswers: Record<string, string> = {
      'technical_question': 'Cada tecnología tiene sus ventajas y desventajas. La elección depende de los requisitos específicos de tu proyecto.',
      'pricing_inquiry': 'Los precios varían según la complejidad y alcance del proyecto. Te puedo dar una estimación más precisa conociendo los detalles.',
      'service_inquiry': 'Ofrecemos desarrollo web completo, integración de IA, consultoría técnica y optimización de sistemas existentes.'
    }

    return technicalAnswers[intentType] || 'Te puedo ayudar con información técnica detallada sobre cualquier aspecto de tu proyecto.'
  }

  /**
   * Ajusta el tono basado en el sentimiento
   */
  private adjustToneForSentiment(response: string, sentiment: Sentiment): string {
    if (sentiment.label === 'negative' || sentiment.label === 'very_negative') {
      // Agregar frases empáticas
      const empatheticPhrases = [
        'Entiendo que esto puede ser frustrante. ',
        'Comprendo tu preocupación. ',
        'No te preocupes, te ayudo a resolverlo. '
      ]
      const randomPhrase = empatheticPhrases[Math.floor(Math.random() * empatheticPhrases.length)]
      return randomPhrase + response
    }

    if (sentiment.label === 'positive' || sentiment.label === 'very_positive') {
      // Agregar frases entusiastas
      const enthusiasticPhrases = [
        '¡Me encanta tu entusiasmo! ',
        '¡Excelente actitud! ',
        '¡Perfecto! '
      ]
      const randomPhrase = enthusiasticPhrases[Math.floor(Math.random() * enthusiasticPhrases.length)]
      return randomPhrase + response
    }

    return response
  }

  /**
   * Genera preguntas de seguimiento
   */
  private generateFollowUpQuestions(missingInfo: string[], tone: ResponseTone): string {
    if (missingInfo.length === 0) return ''

    const questions = missingInfo.slice(0, 2).map(field => {
      const questionMap: Record<string, string> = {
        name: '¿Cuál es tu nombre?',
        email: '¿Cuál es tu email de contacto?',
        phone: '¿Tienes un número de teléfono donde pueda contactarte?',
        projectType: '¿Qué tipo de proyecto tienes en mente?',
        requirements: '¿Puedes describir los requisitos específicos?',
        budget: '¿Tienes un presupuesto aproximado en mente?',
        timeline: '¿Cuándo necesitas que esté listo el proyecto?',
        companyName: '¿En qué empresa trabajas?',
        location: '¿En qué ciudad o país te encuentras?'
      }
      return questionMap[field] || `¿Puedes proporcionarme información sobre ${field}?`
    })

    const connector = tone === 'professional' ? 'Por favor, ' : '¿Podrías '
    return `\n\n${connector}${questions.join(' y ')}`
  }

  /**
   * Agrega indicadores de urgencia
   */
  private addUrgencyIndicator(tone: ResponseTone): string {
    const indicators: Record<ResponseTone, string> = {
      professional: '\n\nDado que esto parece urgente, puedo priorizar tu consulta.',
      empathetic: '\n\nEntiendo que esto es urgente. Te ayudo a resolverlo lo antes posible.',
      enthusiastic: '\n\n¡Perfecto! Veo que esto es urgente, así que me enfocaré en ayudarte inmediatamente.',
      casual: '\n\nVeo que esto es urgente. Te ayudo a resolverlo rápido.'
    }

    return indicators[tone]
  }

  /**
   * Genera una respuesta de respaldo
   */
  private generateFallbackResponse(context: ResponseContext): string {
    const { responseTone } = context

    const fallbackResponses: Record<ResponseTone, string> = {
      professional: 'Entiendo tu consulta. ¿Podrías proporcionarme más detalles para poder ayudarte mejor?',
      empathetic: 'Gracias por tu mensaje. Me gustaría entender mejor tu situación para poder ayudarte de la mejor manera.',
      enthusiastic: '¡Gracias por contactarme! Me encantaría ayudarte. ¿Podrías contarme un poco más sobre lo que necesitas?',
      casual: 'Gracias por escribir. ¿Puedes contarme un poco más sobre lo que necesitas?'
    }

    return fallbackResponses[responseTone]
  }

  /**
   * Determina el tono de respuesta óptimo basado en el contexto
   */
  determineOptimalTone(nlpResult: NLPResult, urgencyLevel: UrgencyLevel): ResponseTone {
    const { sentiment } = nlpResult

    // Si hay urgencia, ser profesional
    if (urgencyLevel === 'high') {
      return 'professional'
    }

    // Si el sentimiento es negativo, ser empático
    if (sentiment.label === 'negative' || sentiment.label === 'very_negative') {
      return 'empathetic'
    }

    // Si el sentimiento es positivo, ser entusiasta
    if (sentiment.label === 'positive' || sentiment.label === 'very_positive') {
      return 'enthusiastic'
    }

    // Por defecto, ser profesional
    return 'professional'
  }
}

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Genera una respuesta inteligente
 */
export function generateIntelligentResponse(context: ResponseContext): string {
  const engine = IntelligentResponseEngine.getInstance()
  return engine.generateResponse(context)
}

/**
 * Determina el tono óptimo de respuesta
 */
export function determineOptimalTone(nlpResult: NLPResult, urgencyLevel: UrgencyLevel): ResponseTone {
  const engine = IntelligentResponseEngine.getInstance()
  return engine.determineOptimalTone(nlpResult, urgencyLevel)
} 