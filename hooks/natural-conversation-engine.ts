import { ConversationData, ConversationIntent, IntentType, ConsultationStage } from './types'
import { PersonalizedResponseEngine } from './personalized-response-engine'
import { ClientPersonality, ServiceContext, ConversationMemory } from './types'

export interface NaturalConversationState {
  currentStep: keyof ConversationData | null
  collectedData: Partial<ConversationData>
  requiredFields: (keyof ConversationData)[]
  conversationContext: string[]
  lastUserMessage: string
  isWaitingForConfirmation: boolean
  consultationStage: ConsultationStage
  businessProblem: string
  kpis: string[]
  competitiveContext: string
  technicalConstraints: string[]
  proposedSolutions: string[]
  roiEstimate: string
  implementationRoadmap: string[]
}

export interface NaturalResponse {
  message: string
  nextStep: keyof ConversationData | null
  shouldAskForConfirmation: boolean
  suggestedActions?: string[]
  context?: string
  extractedData?: Partial<ConversationData>
  shouldUseAI?: boolean
}

export class NaturalConversationEngine {
  private static readonly FIELD_PRIORITY: (keyof ConversationData)[] = [
    'name',
    'email', 
    'projectType',
    'requirements',
    'budget',
    'timeline'
  ]

  private static readonly FIELD_QUESTIONS: Record<keyof ConversationData, string[]> = {
    name: [
      "¿Podrías contarme tu nombre?",
      "¿Cómo te llamas?",
      "Me gustaría saber tu nombre para personalizar mejor la atención."
    ],
    email: [
      "¿Cuál es tu email para poder enviarte la cotización?",
      "Necesito tu email para contactarte con los detalles.",
      "¿Podrías compartir tu dirección de email?"
    ],
    phone: [
      "¿Tienes un número de teléfono donde pueda contactarte?",
      "¿Podrías darme tu teléfono por si necesito aclarar algo?"
    ],
    projectType: [
      "¿Qué tipo de proyecto tienes en mente?",
      "¿Qué clase de desarrollo necesitas?",
      "Cuéntame, ¿qué proyecto quieres desarrollar?"
    ],
    requirements: [
      "¿Podrías describir los requerimientos de tu proyecto?",
      "¿Qué funcionalidades necesitas en tu proyecto?",
      "Cuéntame más sobre lo que necesitas."
    ],
    budget: [
      "¿Tienes algún presupuesto aproximado en mente?",
      "¿Cuál es tu rango de inversión para este proyecto?",
      "¿Podrías darme una idea del presupuesto?"
    ],
    timeline: [
      "¿Cuándo necesitas que esté listo el proyecto?",
      "¿Tienes alguna fecha límite en mente?",
      "¿Cuál es el timeline que manejas?"
    ],
    companyName: [
      "¿Para qué empresa trabajas?",
      "¿Cuál es el nombre de tu empresa?"
    ],
    location: [
      "¿En qué ciudad o país te encuentras?",
      "¿Dónde estás ubicado?"
    ],
    clientName: [
      "¿Cuál es el nombre del cliente?",
      "¿Para quién es el proyecto?"
    ],
    clientEmail: [
      "¿Cuál es el email del cliente?",
      "¿Tienes el email del cliente?"
    ],
    clientPhone: [
      "¿Tienes el teléfono del cliente?",
      "¿Cuál es el número de contacto del cliente?"
    ]
  }

  private static readonly FIELD_VALIDATION: Record<keyof ConversationData, (value: string) => boolean> = {
    name: (value) => value.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value),
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => value.replace(/\D/g, '').length >= 7,
    projectType: (value) => value.length >= 3,
    requirements: (value) => value.length >= 10,
    budget: (value) => value.length > 0,
    timeline: (value) => value.length > 0,
    companyName: (value) => value.length >= 2,
    location: (value) => value.length >= 2,
    clientName: (value) => value.length >= 2,
    clientEmail: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    clientPhone: (value) => value.replace(/\D/g, '').length >= 7
  }

  private static readonly CONSULTATIVE_QUESTIONS = {
    discovery: {
      business_problem: [
        "¿Cuál es el problema de negocio principal que estás tratando de resolver?",
        "¿Qué desafío específico está afectando tu operación actual?",
        "¿Qué resultado de negocio necesitas lograr con esta solución?"
      ],
      kpis: [
        "¿Qué KPIs específicos necesitas mejorar? (ej: conversiones, tiempo de respuesta, costos)",
        "¿Cómo mides actualmente el éxito de tu operación digital?",
        "¿Qué métricas son más importantes para tu equipo ejecutivo?"
      ],
      competitive_context: [
        "¿Cómo se compara tu propuesta con la competencia actual?",
        "¿Qué ventajas competitivas necesitas desarrollar?",
        "¿Qué están haciendo tus competidores que te preocupa?"
      ],
      current_state: [
        "¿Qué soluciones tecnológicas tienes implementadas actualmente?",
        "¿Cuáles son las principales limitaciones de tu infraestructura actual?",
        "¿Qué procesos manuales podrían automatizarse?"
      ]
    },
    technical_analysis: {
      architecture: [
        "¿Qué tipo de arquitectura prefieres? (monolítica, microservicios, serverless)",
        "¿Tienes preferencias tecnológicas específicas?",
        "¿Qué limitaciones de escalabilidad has experimentado?"
      ],
      integration: [
        "¿Con qué sistemas necesitas integrarte?",
        "¿Qué APIs externas utilizas actualmente?",
        "¿Necesitas integración con CRM, ERP u otros sistemas?"
      ],
      security: [
        "¿Qué requisitos de seguridad específicos tienes?",
        "¿Manejas datos sensibles de clientes?",
        "¿Necesitas cumplir con regulaciones específicas?"
      ],
      performance: [
        "¿Cuántos usuarios concurrentes esperas?",
        "¿Qué tiempos de respuesta necesitas?",
        "¿Tienes requisitos específicos de disponibilidad?"
      ]
    },
    value_proposal: {
      roi: [
        "¿Cuál es el valor monetario de resolver este problema para tu negocio?",
        "¿Cuánto tiempo puedes esperar para ver resultados?",
        "¿Qué impacto tendría en tus ingresos mensuales?"
      ],
      timeline: [
        "¿Cuál es tu timeline ideal para implementación?",
        "¿Hay fechas críticas de negocio que debamos considerar?",
        "¿Prefieres implementación por fases o todo de una vez?"
      ],
      resources: [
        "¿Tienes un equipo técnico interno para el proyecto?",
        "¿Qué nivel de participación esperas tener en el desarrollo?",
        "¿Necesitas capacitación para tu equipo?"
      ]
    }
  }

  static processUserMessage(
    message: string,
    state: NaturalConversationState,
    intent: ConversationIntent,
    personality?: ClientPersonality | null,
    serviceContext?: ServiceContext | null,
    memory?: ConversationMemory
  ): NaturalResponse {
    const lowerMessage = message.toLowerCase()
    
    // Determinar la etapa consultiva actual
    const currentStage = this.determineConsultationStage(state, intent, lowerMessage)
    
    // Si el usuario está confirmando información
    if (this.isConfirmationMessage(lowerMessage)) {
      return this.handleConfirmation(state, currentStage)
    }
    
    // Si el usuario quiere editar algo
    if (this.isEditRequest(lowerMessage)) {
      return this.handleEditRequest(lowerMessage, state)
    }
    
    // Procesar según la etapa consultiva
    switch (currentStage) {
      case 'discovery':
        return this.processDiscoveryStage(message, state, intent, personality, serviceContext, memory)
      case 'technical_analysis':
        return this.processTechnicalAnalysisStage(message, state, intent, personality, serviceContext, memory)
      case 'value_proposal':
        return this.processValueProposalStage(message, state, intent, personality, serviceContext, memory)
      default:
        return this.processInitialStage(message, state, intent, personality, serviceContext, memory)
    }
  }

  private static determineConsultationStage(
    state: NaturalConversationState, 
    intent: ConversationIntent, 
    message: string
  ): ConsultationStage {
    // Si ya tenemos una etapa definida, mantenerla
    if (state.consultationStage && state.consultationStage !== 'idle') {
      return state.consultationStage
    }
    // Determinar etapa basada en la intención y contenido del mensaje
    if (intent.type === 'project_inquiry' || message.includes('proyecto') || message.includes('desarrollar')) {
      return 'discovery'
    }
    if (message.includes('técnico') || message.includes('tecnología') || message.includes('arquitectura')) {
      return 'technical_analysis'
    }
    if (message.includes('precio') || message.includes('presupuesto') || message.includes('roi')) {
      return 'value_proposal'
    }
    return 'idle'
  }

  private static isConfirmationMessage(message: string): boolean {
    const confirmKeywords = [
      'sí', 'si', 'correcto', 'exacto', 'perfecto', 'ok', 'okay', 'confirmo',
      'está bien', 'esta bien', 'de acuerdo', 'claro', 'por supuesto'
    ]
    return confirmKeywords.some(keyword => message.includes(keyword))
  }

  private static isEditRequest(message: string): boolean {
    const editKeywords = [
      'cambiar', 'editar', 'modificar', 'corregir', 'no es', 'no es correcto',
      'está mal', 'esta mal', 'error', 'equivocado'
    ]
    return editKeywords.some(keyword => message.includes(keyword))
  }

  private static handleConfirmation(state: NaturalConversationState, currentStage: ConsultationStage): NaturalResponse {
    switch (currentStage) {
      case 'discovery':
        return {
          message: "Excelente. Con esta información del problema de negocio, podemos proceder al análisis técnico. ¿Te gustaría que evaluemos la arquitectura y tecnologías más apropiadas para tu proyecto?",
          nextStep: null,
          shouldAskForConfirmation: false,
          suggestedActions: ['Análisis técnico', 'Evaluar arquitectura', 'Ver tecnologías recomendadas']
        }
      case 'technical_analysis':
        return {
          message: "Perfecto. Con el análisis técnico completo, puedo prepararte una propuesta de valor específica. ¿Te gustaría que calculemos el ROI potencial y el roadmap de implementación?",
          nextStep: null,
          shouldAskForConfirmation: false,
          suggestedActions: ['Calcular ROI', 'Ver roadmap', 'Propuesta de valor']
        }
      case 'value_proposal':
        return {
          message: "¡Excelente! Con toda esta información puedo prepararte una propuesta técnica detallada. Te sugiero agendar una consulta donde podamos discutir la arquitectura, timeline y ROI específico de tu proyecto. [AUTO_OPEN_CONSULTATION]",
          nextStep: null,
          shouldAskForConfirmation: true,
          suggestedActions: ['Agendar consulta técnica', 'Ver propuesta preliminar', 'Más detalles']
        }
      case 'agendado':
        return {
          message: "¡Consulta agendada exitosamente! Te contactaré pronto para avanzar con tu proyecto.",
          nextStep: null,
          shouldAskForConfirmation: false,
          suggestedActions: []
        }
      default:
        return {
          message: "¡Perfecto! Con toda esta información puedo prepararte una propuesta personalizada. ¿Te gustaría que agende una consulta gratuita para discutir los detalles y darte una cotización formal?",
          nextStep: null,
          shouldAskForConfirmation: true,
          suggestedActions: ['Agendar consulta', 'Ver cotización preliminar', 'Más información']
        }
    }
  }

  private static handleEditRequest(message: string, state: NaturalConversationState): NaturalResponse {
    // Detectar qué campo quiere editar
    const fieldToEdit = this.detectFieldToEdit(message)
    
    if (fieldToEdit) {
      return {
        message: `Por supuesto, vamos a corregir tu ${this.getFieldLabel(fieldToEdit)}. ¿Cuál es el valor correcto?`,
        nextStep: fieldToEdit,
        shouldAskForConfirmation: false
      }
    }
    
    return {
      message: "¿Qué información te gustaría corregir? Puedes decirme específicamente qué campo necesitas cambiar.",
      nextStep: null,
      shouldAskForConfirmation: false
    }
  }

  private static detectFieldToEdit(message: string): keyof ConversationData | null {
    const fieldKeywords: Record<keyof ConversationData, string[]> = {
      name: ['nombre', 'name'],
      email: ['email', 'correo', 'e-mail'],
      phone: ['teléfono', 'telefono', 'phone'],
      projectType: ['proyecto', 'tipo', 'proyecto'],
      requirements: ['requerimientos', 'requisitos', 'funcionalidades'],
      budget: ['presupuesto', 'budget', 'precio'],
      timeline: ['timeline', 'tiempo', 'fecha', 'plazo'],
      companyName: ['empresa', 'company'],
      location: ['ubicación', 'ubicacion', 'lugar'],
      clientName: ['cliente', 'client'],
      clientEmail: ['email del cliente', 'correo del cliente'],
      clientPhone: ['teléfono del cliente', 'phone del cliente']
    }

    for (const [field, keywords] of Object.entries(fieldKeywords)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return field as keyof ConversationData
      }
    }
    
    return null
  }

  private static extractInformationFromMessage(
    message: string, 
    currentStep: keyof ConversationData | null
  ): Partial<ConversationData> {
    const extractedData: Partial<ConversationData> = {}
    
    // Extraer nombre
    const nameMatch = message.match(/(?:me llamo|soy|mi nombre es)\s+([A-Za-zÁáÉéÍíÓóÚúÑñ\s]+)/i)
    if (nameMatch) {
      extractedData.name = nameMatch[1].trim()
    }
    
    // Extraer email
    const emailMatch = message.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
    if (emailMatch) {
      extractedData.email = emailMatch[0]
    }
    
    // Extraer teléfono
    const phoneMatch = message.match(/(?:\+?[\d\s\-\(\)]{7,})/)
    if (phoneMatch) {
      extractedData.phone = phoneMatch[0].replace(/\s/g, '')
    }
    
    // Extraer presupuesto
    const budgetMatch = message.match(/(?:presupuesto|budget|inversión)\s*(?:de|es|aproximado)?\s*(\$?\d+(?:\.\d+)?(?:\s*-\s*\$?\d+(?:\.\d+)?)?(?:\s*ars|\s*pesos)?)/i)
    if (budgetMatch) {
      extractedData.budget = budgetMatch[1].trim()
    }
    
    // Si no se extrajo nada específico pero hay un paso actual, intentar extraer basado en el contexto
    if (Object.keys(extractedData).length === 0 && currentStep) {
      const value = message.trim()
      if (this.FIELD_VALIDATION[currentStep](value)) {
        extractedData[currentStep] = value
      }
    }
    
    return extractedData
  }

  private static determineNextStep(
    collectedData: Partial<ConversationData>,
    requiredFields: (keyof ConversationData)[]
  ): keyof ConversationData | null {
    // Usar prioridad de campos si no hay campos requeridos específicos
    const fieldsToCheck = requiredFields.length > 0 ? requiredFields : this.FIELD_PRIORITY
    
    for (const field of fieldsToCheck) {
      if (!collectedData[field] || String(collectedData[field]).trim().length === 0) {
        return field
      }
    }
    
    return null // Todos los campos están completos
  }

  private static generateNaturalResponse(
    userMessage: string,
    collectedData: Partial<ConversationData>,
    nextStep: keyof ConversationData | null,
    currentStep: keyof ConversationData | null,
    intent: ConversationIntent,
    extractedData: Partial<ConversationData>,
    personality?: ClientPersonality | null,
    serviceContext?: ServiceContext | null,
    memory?: ConversationMemory
  ): NaturalResponse {
    // Si se extrajo información exitosamente
    if (Object.keys(extractedData).length > 0) {
      const field = Object.keys(extractedData)[0] as keyof ConversationData
      const fieldLabel = this.getFieldLabel(field)
      
      // Usar respuesta personalizada si está disponible
      if (personality && serviceContext && memory) {
        const personalizedMessage = this.generatePersonalizedResponse(
          intent,
          personality,
          serviceContext,
          memory,
          collectedData
        )
        
        return {
          message: `${personalizedMessage} ${this.getNextQuestion(nextStep)}`,
          nextStep,
          shouldAskForConfirmation: false,
          context: `Información ${fieldLabel} registrada con personalización`
        }
      }
      
      return {
        message: `¡Perfecto! He registrado tu ${fieldLabel}. ${this.getNextQuestion(nextStep)}`,
        nextStep,
        shouldAskForConfirmation: false,
        context: `Información ${fieldLabel} registrada`
      }
    }
    
    // Si no se extrajo información pero hay un paso actual
    if (currentStep && !extractedData[currentStep]) {
      // Usar pregunta personalizada si está disponible
      if (personality && serviceContext && memory) {
        const personalizedQuestion = this.generatePersonalizedFollowUpQuestion(
          currentStep,
          personality,
          serviceContext,
          memory,
          collectedData
        )
        
        return {
          message: personalizedQuestion,
          nextStep: currentStep,
          shouldAskForConfirmation: false
        }
      }
      
      return {
        message: this.getRandomQuestion(currentStep),
        nextStep: currentStep,
        shouldAskForConfirmation: false
      }
    }
    
    // Si no hay paso actual, determinar el siguiente
    if (!nextStep) {
      // Usar respuesta personalizada para confirmación
      if (personality && serviceContext && memory) {
        const personalizedMessage = this.generatePersonalizedResponse(
          intent,
          personality,
          serviceContext,
          memory,
          collectedData
        )
        
        return {
          message: personalizedMessage,
          nextStep: null,
          shouldAskForConfirmation: true,
          suggestedActions: ['Ver cotización', 'Agendar consulta', 'Más detalles']
        }
      }
      
      return {
        message: "¡Excelente! Tengo toda la información que necesito. ¿Te gustaría que proceda a preparar una cotización personalizada?",
        nextStep: null,
        shouldAskForConfirmation: true,
        suggestedActions: ['Ver cotización', 'Agendar consulta', 'Más detalles']
      }
    }
    
    // Pregunta por el siguiente campo con personalización
    if (personality && serviceContext && memory) {
      const personalizedQuestion = this.generatePersonalizedFollowUpQuestion(
        nextStep,
        personality,
        serviceContext,
        memory,
        collectedData
      )
      
      return {
        message: personalizedQuestion,
        nextStep,
        shouldAskForConfirmation: false
      }
    }
    
    return {
      message: this.getRandomQuestion(nextStep),
      nextStep,
      shouldAskForConfirmation: false
    }
  }

  private static getRandomQuestion(field: keyof ConversationData): string {
    const questions = this.FIELD_QUESTIONS[field]
    return questions[Math.floor(Math.random() * questions.length)]
  }

  private static getNextQuestion(nextStep: keyof ConversationData | null): string {
    if (!nextStep) return ""
    return this.getRandomQuestion(nextStep)
  }

  private static getFieldLabel(field: keyof ConversationData): string {
    const labels: Record<keyof ConversationData, string> = {
      name: 'nombre',
      email: 'email',
      phone: 'teléfono',
      projectType: 'tipo de proyecto',
      requirements: 'requerimientos',
      budget: 'presupuesto',
      timeline: 'timeline',
      companyName: 'empresa',
      location: 'ubicación',
      clientName: 'nombre del cliente',
      clientEmail: 'email del cliente',
      clientPhone: 'teléfono del cliente'
    }
    return labels[field] || field
  }

  static shouldShowProgress(state: NaturalConversationState): boolean {
    return Object.keys(state.collectedData).length > 0
  }

  static shouldShowConfirmation(state: NaturalConversationState): boolean {
    const requiredFields = state.requiredFields.length > 0 ? state.requiredFields : this.FIELD_PRIORITY
    return requiredFields.every(field => 
      state.collectedData[field] && String(state.collectedData[field]).trim().length > 0
    )
  }

  static generatePersonalizedFollowUpQuestion(
    currentStep: keyof ConversationData,
    personality: ClientPersonality | null,
    serviceContext: ServiceContext | null,
    memory: ConversationMemory,
    conversationData: Partial<ConversationData>
  ): string {
    if (!personality || !serviceContext) {
      return this.generateDefaultFollowUpQuestion(currentStep)
    }

    return PersonalizedResponseEngine.generateFollowUpQuestion(
      personality,
      serviceContext,
      memory,
      String(currentStep)
    )
  }

  static generatePersonalizedResponse(
    intent: ConversationIntent,
    personality: ClientPersonality | null,
    serviceContext: ServiceContext | null,
    memory: ConversationMemory,
    conversationData: Partial<ConversationData>
  ): string {
    if (!personality || !serviceContext) {
      return this.generateDefaultResponse(intent)
    }

    const personalizedResponse = PersonalizedResponseEngine.generatePersonalizedResponse(
      intent,
      personality,
      serviceContext,
      memory,
      conversationData
    )

    return personalizedResponse.message
  }

  private static generateDefaultFollowUpQuestion(currentStep: keyof ConversationData): string {
    const questions: Record<keyof ConversationData, string> = {
      name: "¿Podrías contarme tu nombre completo?",
      email: "¿Cuál es tu dirección de email?",
      phone: "¿Podrías compartir tu número de teléfono?",
      projectType: "¿Qué tipo de proyecto tienes en mente?",
      requirements: "¿Podrías describir los requerimientos de tu proyecto?",
      budget: "¿Tienes un presupuesto en mente para este proyecto?",
      timeline: "¿Cuándo necesitas que esté listo el proyecto?",
      companyName: "¿Para qué empresa trabajas?",
      location: "¿En qué ubicación te encuentras?",
      clientName: "¿Cuál es el nombre del cliente?",
      clientEmail: "¿Cuál es el email del cliente?",
      clientPhone: "¿Cuál es el teléfono del cliente?"
    }

    return questions[currentStep] || "¿Podrías contarme más sobre eso?"
  }

  private static generateDefaultResponse(intent: ConversationIntent): string {
    const responses: Record<IntentType, string> = {
      greeting: "¡Hola! Soy el asistente de Gabriel Bustos. ¿En qué puedo ayudarte hoy?",
      project_inquiry: "¡Perfecto! Cuéntame más sobre tu proyecto. ¿Qué tienes en mente?",
      budget_discussion: "El presupuesto varía según el proyecto. ¿Podrías contarme más sobre lo que necesitas?",
      timeline_discussion: "Entiendo que el tiempo es importante. ¿Cuándo necesitas que esté listo?",
      service_inquiry: "Ofrezco servicios de desarrollo web, integración de IA, consultoría técnica y más. ¿Qué te interesa?",
      contact_request: "¡Claro! Puedes contactarme por email o agendar una consulta. ¿Qué prefieres?",
      portfolio_request: "¡Claro! Puedes ver mi portafolio en la sección de proyectos. ¿Hay algo específico que te interese?",
      consultation_request: "¡Excelente! Te ayudo a agendar una consulta. Necesito algunos datos primero.",
      pricing_inquiry: "Los precios varían según el proyecto. ¿Podrías contarme qué necesitas para darte una idea?",
      technical_question: "¡Me encanta hablar de tecnología! ¿Qué te gustaría saber específicamente?",
      general_question: "¡Con gusto te ayudo! ¿Qué pregunta tienes?",
      goodbye: "¡Ha sido un placer! Si necesitas algo más, no dudes en contactarme. ¡Que tengas un excelente día!",
      clarification_request: "Por supuesto, ¿qué necesitas que te aclare?",
      confirmation: "¡Perfecto! ¿Hay algo más en lo que pueda ayudarte?",
      objection: "Entiendo tu preocupación. ¿Podrías contarme más para poder ayudarte mejor?",
      urgency_indicator: "Entiendo que es urgente. Te ayudo lo más rápido posible. ¿Qué necesitas?",
      project_quote: "¡Perfecto! Para darte una cotización necesito algunos detalles. ¿Qué tipo de proyecto tienes en mente?",
      general_information: "¡Con gusto te ayudo! ¿Qué información necesitas sobre mis servicios?",
      complaint: "Lamento escuchar eso. ¿Podrías contarme más detalles para poder ayudarte?"
    }

    return responses[intent.type] || "¡Gracias por contactarme! ¿En qué puedo ayudarte?"
  }

  private static shouldUseAI(
    intent: ConversationIntent,
    extractedData: Partial<ConversationData>,
    nextStep: keyof ConversationData | null
  ): boolean {
    // Si hay un nextStep definido, el motor natural puede manejar la recolección de datos
    if (nextStep) {
      return false
    }
    
    // Si se extrajo información, el motor natural puede procesarla
    if (Object.keys(extractedData).length > 0) {
      return false
    }
    
    // Para intenciones complejas o consultivas, usar AI SDK
    if (intent.type === 'project_inquiry' || intent.type === 'consultation_request') {
      return true
    }
    
    // Para recolección de datos simples, usar motor natural
    return false
  }

  private static processDiscoveryStage(
    message: string,
    state: NaturalConversationState,
    intent: ConversationIntent,
    personality?: ClientPersonality | null,
    serviceContext?: ServiceContext | null,
    memory?: ConversationMemory
  ): NaturalResponse {
    // Extraer información del problema de negocio
    const extractedData = this.extractBusinessProblem(message)
    
    // Determinar qué aspecto del descubrimiento abordar
    const discoveryAspect = this.determineDiscoveryAspect(state, message)
    
    // Generar pregunta consultiva específica
    const question = this.getConsultativeQuestion('discovery', discoveryAspect)
    
    return {
      message: question,
      nextStep: null,
      shouldAskForConfirmation: false,
      extractedData,
      shouldUseAI: false,
      context: 'discovery'
    }
  }

  private static processTechnicalAnalysisStage(
    message: string,
    state: NaturalConversationState,
    intent: ConversationIntent,
    personality?: ClientPersonality | null,
    serviceContext?: ServiceContext | null,
    memory?: ConversationMemory
  ): NaturalResponse {
    // Extraer información técnica
    const extractedData = this.extractTechnicalInfo(message)
    
    // Determinar aspecto técnico a analizar
    const technicalAspect = this.determineTechnicalAspect(state, message)
    
    // Generar pregunta técnica específica
    const question = this.getConsultativeQuestion('technical_analysis', technicalAspect)
    
    return {
      message: question,
      nextStep: null,
      shouldAskForConfirmation: false,
      extractedData,
      shouldUseAI: false,
      context: 'technical_analysis'
    }
  }

  private static processValueProposalStage(
    message: string,
    state: NaturalConversationState,
    intent: ConversationIntent,
    personality?: ClientPersonality | null,
    serviceContext?: ServiceContext | null,
    memory?: ConversationMemory
  ): NaturalResponse {
    // Extraer información de valor
    const extractedData = this.extractValueInfo(message)
    
    // Determinar aspecto de valor a abordar
    const valueAspect = this.determineValueAspect(state, message)
    
    // Generar pregunta de valor específica
    const question = this.getConsultativeQuestion('value_proposal', valueAspect)
    
    return {
      message: question,
      nextStep: null,
      shouldAskForConfirmation: false,
      extractedData,
      shouldUseAI: false,
      context: 'value_proposal'
    }
  }

  private static processInitialStage(
    message: string,
    state: NaturalConversationState,
    intent: ConversationIntent,
    personality?: ClientPersonality | null,
    serviceContext?: ServiceContext | null,
    memory?: ConversationMemory
  ): NaturalResponse {
    // Extraer información básica del mensaje
    const extractedData = this.extractInformationFromMessage(message, state.currentStep)
    
    // Actualizar datos recopilados
    const updatedData = { ...state.collectedData, ...extractedData }
    
    // Determinar el siguiente paso
    const nextStep = this.determineNextStep(updatedData, state.requiredFields)
    
    // Generar respuesta natural con personalización
    const response = this.generateNaturalResponse(
      message,
      updatedData,
      nextStep,
      state.currentStep,
      intent,
      extractedData,
      personality,
      serviceContext,
      memory
    )
    
    return {
      ...response,
      extractedData,
      shouldUseAI: this.shouldUseAI(intent, extractedData, nextStep)
    }
  }

  private static determineDiscoveryAspect(state: NaturalConversationState, message: string): string {
    const lowerMessage = message.toLowerCase()
    
    if (!state.businessProblem || lowerMessage.includes('problema') || lowerMessage.includes('desafío')) {
      return 'business_problem'
    }
    
    if (!state.kpis.length || lowerMessage.includes('kpi') || lowerMessage.includes('métrica')) {
      return 'kpis'
    }
    
    if (!state.competitiveContext || lowerMessage.includes('competencia') || lowerMessage.includes('competidor')) {
      return 'competitive_context'
    }
    
    return 'current_state'
  }

  private static determineTechnicalAspect(state: NaturalConversationState, message: string): string {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('arquitectura') || lowerMessage.includes('estructura')) {
      return 'architecture'
    }
    
    if (lowerMessage.includes('integración') || lowerMessage.includes('api')) {
      return 'integration'
    }
    
    if (lowerMessage.includes('seguridad') || lowerMessage.includes('seguro')) {
      return 'security'
    }
    
    return 'performance'
  }

  private static determineValueAspect(state: NaturalConversationState, message: string): string {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('roi') || lowerMessage.includes('retorno')) {
      return 'roi'
    }
    
    if (lowerMessage.includes('timeline') || lowerMessage.includes('tiempo')) {
      return 'timeline'
    }
    
    return 'resources'
  }

  private static getConsultativeQuestion(stage: string, aspect: string): string {
    const questions = this.CONSULTATIVE_QUESTIONS[stage as keyof typeof this.CONSULTATIVE_QUESTIONS]
    const aspectQuestions = questions[aspect as keyof typeof questions] as string[]
    
    if (aspectQuestions && aspectQuestions.length > 0) {
      return aspectQuestions[Math.floor(Math.random() * aspectQuestions.length)]
    }
    
    return "¿Podrías contarme más sobre tu proyecto?"
  }

  private static extractBusinessProblem(message: string): Partial<ConversationData> {
    // Implementar extracción de problema de negocio
    return {}
  }

  private static extractTechnicalInfo(message: string): Partial<ConversationData> {
    // Implementar extracción de información técnica
    return {}
  }

  private static extractValueInfo(message: string): Partial<ConversationData> {
    // Implementar extracción de información de valor
    return {}
  }
} 