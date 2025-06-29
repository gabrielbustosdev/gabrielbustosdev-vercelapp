import { 
  ConversationIntent, 
  IntentType, 
  ConversationFlow, 
  FlowState, 
  FlowStep, 
  RequiredInfo, 
  FollowUpQuestion, 
  MissingInfoTracker, 
  ConversationData,
  ServiceFlowConfig
} from './types'

// Configuración de palabras clave para detección de intenciones
const INTENT_KEYWORDS: Record<IntentType, string[]> = {
  greeting: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos', 'hey'],
  project_inquiry: ['proyecto', 'desarrollar', 'crear', 'construir', 'implementar', 'hacer'],
  budget_discussion: ['presupuesto', 'costo', 'precio', 'inversión', 'gasto', 'dinero'],
  timeline_discussion: ['tiempo', 'fecha', 'plazo', 'duración', 'cuándo', 'cronograma'],
  service_inquiry: ['servicios', 'qué haces', 'qué ofreces', 'servicios que', 'trabajos que'],
  contact_request: ['contacto', 'contactar', 'hablar', 'comunicar', 'llamar', 'escribir'],
  portfolio_request: ['portafolio', 'trabajos', 'proyectos', 'ejemplos', 'muestras'],
  consultation_request: ['consulta', 'agendar', 'cita', 'reunión', 'hablar', 'contactar'],
  pricing_inquiry: ['precios', 'costos', 'tarifas', 'valores', 'inversión'],
  technical_question: ['técnico', 'tecnología', 'stack', 'framework', 'lenguaje', 'herramienta'],
  general_question: ['pregunta', 'duda', 'información', 'ayuda', 'cómo'],
  goodbye: ['adiós', 'hasta luego', 'chao', 'nos vemos', 'gracias', 'bye'],
  clarification_request: ['aclarar', 'explicar', 'entender', 'comprender', 'detallar'],
  confirmation: ['confirmar', 'sí', 'correcto', 'exacto', 'perfecto', 'ok'],
  objection: ['no', 'pero', 'sin embargo', 'aunque', 'problema', 'dificultad'],
  urgency_indicator: ['urgente', 'rápido', 'inmediato', 'pronto', 'ya', 'ahora'],
  project_quote: ['cotización', 'presupuesto', 'precio', 'costo', 'cuánto cuesta', 'tarifa'],
  general_information: ['información', 'sobre', 'acerca de', 'más info', 'detalles'],
  complaint: ['problema', 'error', 'queja', 'mal', 'no funciona', 'defecto']
}

// Configuración de flujos por tipo de servicio
const SERVICE_FLOWS: Record<string, ServiceFlowConfig> = {
  'Landing Page': {
    serviceType: 'Landing Page',
    requiredFields: ['name', 'email', 'projectType', 'requirements'],
    optionalFields: ['budget', 'timeline'],
    flowSteps: [
      {
        id: 'landing_initial',
        state: 'initial',
        action: 'collect',
        message: 'Perfecto, para crear una landing page necesito algunos detalles. ¿Podrías contarme tu nombre?',
        nextState: 'collecting_name'
      },
      {
        id: 'landing_name',
        state: 'collecting_name',
        action: 'collect',
        message: 'Gracias {name}. Ahora necesito tu email para poder enviarte la cotización.',
        nextState: 'collecting_email'
      },
      {
        id: 'landing_email',
        state: 'collecting_email',
        action: 'collect',
        message: 'Excelente. Ahora cuéntame, ¿qué tipo de landing page necesitas? (ej: para empresa, producto, evento, etc.)',
        nextState: 'collecting_requirements'
      },
      {
        id: 'landing_requirements',
        state: 'collecting_requirements',
        action: 'collect',
        message: 'Perfecto. ¿Tienes algún presupuesto en mente o prefieres que te haga una propuesta?',
        nextState: 'collecting_budget'
      },
      {
        id: 'landing_budget',
        state: 'collecting_budget',
        action: 'suggest',
        message: 'Con toda esta información puedo prepararte una cotización personalizada. ¿Te gustaría agendar una consulta gratuita para discutir los detalles?',
        nextState: 'suggesting_consultation'
      }
    ],
    followUpQuestions: [
      {
        id: 'landing_purpose',
        question: '¿Cuál es el objetivo principal de la landing page?',
        field: 'requirements',
        priority: 'high',
        context: 'landing_page_purpose',
        suggestedResponses: ['Vender un producto', 'Capturar leads', 'Informar sobre un evento', 'Presentar un servicio']
      },
      {
        id: 'landing_design',
        question: '¿Tienes alguna preferencia de diseño o colores corporativos?',
        field: 'requirements',
        priority: 'medium',
        context: 'design_preferences'
      }
    ],
    completionCriteria: (data) => {
      return !!(data.name && data.email && data.requirements)
    }
  },
  'Plataforma con IA': {
    serviceType: 'Plataforma con IA',
    requiredFields: ['name', 'email', 'projectType', 'requirements', 'budget'],
    optionalFields: ['timeline'],
    flowSteps: [
      {
        id: 'ai_initial',
        state: 'initial',
        action: 'collect',
        message: '¡Excelente elección! Las plataformas con IA son muy potentes. ¿Podrías contarme tu nombre?',
        nextState: 'collecting_name'
      },
      {
        id: 'ai_name',
        state: 'collecting_name',
        action: 'collect',
        message: 'Gracias {name}. Para proyectos de IA necesito más detalles. ¿Cuál es tu email?',
        nextState: 'collecting_email'
      },
      {
        id: 'ai_email',
        state: 'collecting_email',
        action: 'collect',
        message: 'Perfecto. Ahora cuéntame específicamente qué funcionalidades de IA necesitas en tu plataforma.',
        nextState: 'collecting_requirements'
      },
      {
        id: 'ai_requirements',
        state: 'collecting_requirements',
        action: 'collect',
        message: 'Los proyectos de IA requieren una inversión significativa. ¿Tienes un presupuesto aproximado en mente?',
        nextState: 'collecting_budget'
      },
      {
        id: 'ai_budget',
        state: 'collecting_budget',
        action: 'suggest',
        message: 'Con estos requerimientos puedo diseñar una solución personalizada. ¿Te gustaría agendar una consulta técnica para evaluar la viabilidad?',
        nextState: 'suggesting_consultation'
      }
    ],
    followUpQuestions: [
      {
        id: 'ai_type',
        question: '¿Qué tipo de IA necesitas? (ej: procesamiento de lenguaje, visión computacional, recomendaciones)',
        field: 'requirements',
        priority: 'high',
        context: 'ai_type',
        suggestedResponses: ['Procesamiento de lenguaje', 'Visión computacional', 'Sistema de recomendaciones', 'Análisis predictivo']
      },
      {
        id: 'ai_data',
        question: '¿Tienes datos disponibles para entrenar el modelo de IA?',
        field: 'requirements',
        priority: 'high',
        context: 'data_availability'
      },
      {
        id: 'ai_integration',
        question: '¿Necesitas integrar la IA con sistemas existentes?',
        field: 'requirements',
        priority: 'medium',
        context: 'system_integration'
      }
    ],
    completionCriteria: (data) => {
      return !!(data.name && data.email && data.requirements && data.budget)
    }
  },
  'Desarrollo Web': {
    serviceType: 'Desarrollo Web',
    requiredFields: ['name', 'email', 'projectType', 'requirements'],
    optionalFields: ['budget', 'timeline'],
    flowSteps: [
      {
        id: 'web_initial',
        state: 'initial',
        action: 'collect',
        message: '¡Genial! El desarrollo web es mi especialidad. ¿Podrías contarme tu nombre?',
        nextState: 'collecting_name'
      },
      {
        id: 'web_name',
        state: 'collecting_name',
        action: 'collect',
        message: 'Gracias {name}. ¿Cuál es tu email para enviarte la cotización?',
        nextState: 'collecting_email'
      },
      {
        id: 'web_email',
        state: 'collecting_email',
        action: 'collect',
        message: 'Perfecto. Ahora cuéntame en detalle qué tipo de aplicación web necesitas desarrollar.',
        nextState: 'collecting_requirements'
      },
      {
        id: 'web_requirements',
        state: 'collecting_requirements',
        action: 'collect',
        message: '¿Tienes algún presupuesto aproximado o prefieres que te haga una propuesta?',
        nextState: 'collecting_budget'
      },
      {
        id: 'web_budget',
        state: 'collecting_budget',
        action: 'suggest',
        message: 'Con esta información puedo prepararte una propuesta técnica detallada. ¿Te gustaría agendar una consulta para discutir la arquitectura?',
        nextState: 'suggesting_consultation'
      }
    ],
    followUpQuestions: [
      {
        id: 'web_type',
        question: '¿Qué tipo de aplicación necesitas? (ej: e-commerce, dashboard, blog, sistema de gestión)',
        field: 'requirements',
        priority: 'high',
        context: 'web_app_type',
        suggestedResponses: ['E-commerce', 'Dashboard', 'Blog', 'Sistema de gestión', 'Red social']
      },
      {
        id: 'web_users',
        question: '¿Cuántos usuarios esperas que tenga la aplicación?',
        field: 'requirements',
        priority: 'medium',
        context: 'user_scale'
      },
      {
        id: 'web_features',
        question: '¿Necesitas funcionalidades específicas como autenticación, pagos, o APIs?',
        field: 'requirements',
        priority: 'medium',
        context: 'specific_features'
      }
    ],
    completionCriteria: (data) => {
      return !!(data.name && data.email && data.requirements)
    }
  }
}

// Motor de detección de intenciones
export class ConversationEngine {
  
  // Detectar la intención del mensaje del usuario
  static detectIntent(message: string): ConversationIntent {
    const lowerMessage = message.toLowerCase()
    const detectedIntents: Array<{ type: IntentType; confidence: number; keywords: string[] }> = []
    
    // Analizar cada tipo de intención
    Object.entries(INTENT_KEYWORDS).forEach(([intentType, keywords]) => {
      const matchedKeywords = keywords.filter(keyword => lowerMessage.includes(keyword))
      if (matchedKeywords.length > 0) {
        const confidence = matchedKeywords.length / keywords.length
        detectedIntents.push({
          type: intentType as IntentType,
          confidence,
          keywords: matchedKeywords
        })
      }
    })
    
    // Si no se detectó ninguna intención específica, clasificar como general_information
    if (detectedIntents.length === 0) {
      return {
        type: 'general_information',
        confidence: 0.1,
        keywords: [],
        context: { originalMessage: message },
        timestamp: new Date()
      }
    }
    
    // Retornar la intención con mayor confianza
    const bestIntent = detectedIntents.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    )
    
    return {
      type: bestIntent.type,
      confidence: bestIntent.confidence,
      keywords: bestIntent.keywords,
      context: { originalMessage: message },
      timestamp: new Date()
    }
  }
  
  // Obtener el flujo conversacional basado en la intención
  static getConversationFlow(intent: ConversationIntent, collectedData: Partial<ConversationData>): ConversationFlow | null {
    // Para intenciones de cotización de proyecto, determinar el tipo de servicio
    if (intent.type === 'project_quote' || intent.type === 'service_inquiry') {
      const projectType = this.detectProjectType(intent.context.originalMessage || '')
      if (projectType && SERVICE_FLOWS[projectType]) {
        return this.createServiceFlow(projectType, collectedData)
      }
    }
    
    // Para otras intenciones, crear flujos genéricos
    return this.createGenericFlow(intent, collectedData)
  }
  
  // Detectar tipo de proyecto basado en el mensaje
  static detectProjectType(message: string): string | null {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('landing') || lowerMessage.includes('página') || lowerMessage.includes('sitio')) {
      return 'Landing Page'
    }
    
    if (lowerMessage.includes('ia') || lowerMessage.includes('ai') || lowerMessage.includes('inteligencia artificial') || 
        lowerMessage.includes('chatbot') || lowerMessage.includes('plataforma')) {
      return 'Plataforma con IA'
    }
    
    if (lowerMessage.includes('web') || lowerMessage.includes('aplicación') || lowerMessage.includes('app') || 
        lowerMessage.includes('desarrollo')) {
      return 'Desarrollo Web'
    }
    
    return null
  }
  
  // Crear flujo para un servicio específico
  static createServiceFlow(serviceType: string, collectedData: Partial<ConversationData>): ConversationFlow {
    const config = SERVICE_FLOWS[serviceType]
    const missingInfo = this.getMissingInfo(collectedData, config.requiredFields)
    
    return {
      intent: {
        type: 'project_quote',
        confidence: 0.9,
        keywords: [serviceType.toLowerCase()],
        context: { serviceType },
        timestamp: new Date()
      },
      currentState: this.getNextState(collectedData, config.requiredFields),
      requiredInfo: this.createRequiredInfo(config.requiredFields),
      collectedInfo: collectedData,
      nextSteps: config.flowSteps,
      isComplete: config.completionCriteria(collectedData)
    }
  }
  
  // Crear flujo genérico para otras intenciones
  static createGenericFlow(intent: ConversationIntent, collectedData: Partial<ConversationData>): ConversationFlow {
    const genericSteps: FlowStep[] = [
      {
        id: 'generic_response',
        state: 'initial',
        action: 'collect',
        message: this.getGenericResponse(intent.type),
        nextState: 'completed'
      }
    ]
    
    return {
      intent,
      currentState: 'initial',
      requiredInfo: [],
      collectedInfo: collectedData,
      nextSteps: genericSteps,
      isComplete: true
    }
  }
  
  // Generar preguntas de seguimiento basadas en información faltante
  static generateFollowUpQuestions(missingInfo: MissingInfoTracker, context: string): FollowUpQuestion[] {
    const questions: FollowUpQuestion[] = []
    
    if (missingInfo.name) {
      questions.push({
        id: 'follow_up_name',
        question: '¿Podrías contarme tu nombre?',
        field: 'name',
        priority: 'high',
        context: 'missing_name'
      })
    }
    
    if (missingInfo.email) {
      questions.push({
        id: 'follow_up_email',
        question: '¿Cuál es tu email para poder contactarte?',
        field: 'email',
        priority: 'high',
        context: 'missing_email'
      })
    }
    
    if (missingInfo.projectType) {
      questions.push({
        id: 'follow_up_project',
        question: '¿Qué tipo de proyecto tienes en mente?',
        field: 'projectType',
        priority: 'high',
        context: 'missing_project_type',
        suggestedResponses: ['Landing Page', 'Plataforma con IA', 'Desarrollo Web', 'Consultoría']
      })
    }
    
    if (missingInfo.requirements) {
      questions.push({
        id: 'follow_up_requirements',
        question: '¿Podrías describir los requerimientos de tu proyecto?',
        field: 'requirements',
        priority: 'medium',
        context: 'missing_requirements'
      })
    }
    
    if (missingInfo.budget) {
      questions.push({
        id: 'follow_up_budget',
        question: '¿Tienes algún presupuesto aproximado?',
        field: 'budget',
        priority: 'medium',
        context: 'missing_budget'
      })
    }
    
    return questions
  }
  
  // Procesar respuesta del usuario y actualizar el flujo
  static processUserResponse(message: string, currentFlow: ConversationFlow): Partial<ConversationData> {
    const extractedData: Partial<ConversationData> = {}
    
    // Extraer información basada en el estado actual del flujo
    switch (currentFlow.currentState) {
      case 'collecting_name':
        const nameMatch = message.match(/(?:me llamo|soy|mi nombre es)\s+([A-Za-zÁáÉéÍíÓóÚúÑñ\s]+)/i)
        if (nameMatch) {
          extractedData.name = nameMatch[1].trim()
        } else if (message.split(' ').length <= 3) {
          extractedData.name = message.trim()
        }
        break
        
      case 'collecting_email':
        const emailMatch = message.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
        if (emailMatch) {
          extractedData.email = emailMatch[0]
        }
        break
        
      case 'collecting_project_type':
        const projectType = this.detectProjectType(message)
        if (projectType) {
          extractedData.projectType = projectType
        }
        break
        
      case 'collecting_requirements':
        if (message.length > 10) {
          extractedData.requirements = message
        }
        break
        
      case 'collecting_budget':
        const budgetMatch = message.match(/(?:presupuesto|budget|inversión)\s*(?:de|es|aproximado)?\s*(\$?\d+(?:\.\d+)?(?:\s*-\s*\$?\d+(?:\.\d+)?)?(?:\s*ars|\s*pesos)?)/i)
        if (budgetMatch) {
          extractedData.budget = budgetMatch[1].trim()
        } else if (message.includes('no sé') || message.includes('no tengo')) {
          extractedData.budget = 'Por definir'
        }
        break
        
      case 'collecting_timeline':
        if (message.includes('urgente')) {
          extractedData.timeline = 'Urgente (1-2 semanas)'
        } else if (message.includes('normal')) {
          extractedData.timeline = 'Normal (1-2 meses)'
        } else if (message.includes('flexible')) {
          extractedData.timeline = 'Flexible (3+ meses)'
        }
        break
    }
    
    return extractedData
  }
  
  // Obtener información faltante
  static getMissingInfo(data: Partial<ConversationData>, requiredFields: (keyof ConversationData)[]): MissingInfoTracker {
    return {
      name: requiredFields.includes('name') && !data.name,
      email: requiredFields.includes('email') && !data.email,
      phone: requiredFields.includes('phone') && !data.phone,
      projectType: requiredFields.includes('projectType') && !data.projectType,
      requirements: requiredFields.includes('requirements') && !data.requirements,
      budget: requiredFields.includes('budget') && !data.budget,
      timeline: requiredFields.includes('timeline') && !data.timeline,
      companyName: requiredFields.includes('companyName') && !data.companyName,
      location: requiredFields.includes('location') && !data.location,
      project_description: false // Campo no usado en ConversationData
    }
  }
  
  // Obtener el siguiente estado del flujo
  static getNextState(data: Partial<ConversationData>, requiredFields: (keyof ConversationData)[]): FlowState {
    if (!data.name && requiredFields.includes('name')) return 'collecting_name'
    if (!data.email && requiredFields.includes('email')) return 'collecting_email'
    if (!data.projectType && requiredFields.includes('projectType')) return 'collecting_project_type'
    if (!data.requirements && requiredFields.includes('requirements')) return 'collecting_requirements'
    if (!data.budget && requiredFields.includes('budget')) return 'collecting_budget'
    if (!data.timeline && requiredFields.includes('timeline')) return 'collecting_timeline'
    return 'suggesting_consultation'
  }
  
  // Crear información requerida
  static createRequiredInfo(requiredFields: (keyof ConversationData)[]): RequiredInfo[] {
    const fieldLabels: Record<keyof ConversationData, { label: string; description: string }> = {
      name: { label: 'Nombre', description: 'Tu nombre completo' },
      email: { label: 'Email', description: 'Tu dirección de email' },
      phone: { label: 'Teléfono', description: 'Tu número de teléfono' },
      projectType: { label: 'Tipo de proyecto', description: 'El tipo de proyecto que necesitas' },
      requirements: { label: 'Requerimientos', description: 'Descripción detallada de lo que necesitas' },
      budget: { label: 'Presupuesto', description: 'Tu presupuesto aproximado' },
      timeline: { label: 'Timeline', description: 'Cuándo necesitas el proyecto' },
      companyName: { label: 'Empresa', description: 'Nombre de tu empresa' },
      location: { label: 'Ubicación', description: 'Tu ubicación' },
      clientName: { label: 'Nombre del cliente', description: 'Nombre del cliente' },
      clientEmail: { label: 'Email del cliente', description: 'Email del cliente' },
      clientPhone: { label: 'Teléfono del cliente', description: 'Teléfono del cliente' }
    }
    
    return requiredFields.map(field => ({
      field,
      label: fieldLabels[field].label,
      description: fieldLabels[field].description,
      isRequired: true
    }))
  }
  
  // Obtener respuesta genérica para intenciones no específicas
  static getGenericResponse(intentType: IntentType): string {
    const responses: Record<IntentType, string> = {
      greeting: '¡Hola! Soy el asistente de Gabriel Bustos. ¿En qué puedo ayudarte hoy?',
      project_inquiry: '¡Perfecto! Para ayudarte con tu proyecto necesito algunos detalles. ¿Qué tienes en mente?',
      budget_discussion: 'Entiendo tu interés en el presupuesto. ¿Podrías contarme más sobre tu proyecto?',
      timeline_discussion: 'El timeline es importante. ¿Cuándo necesitas que esté listo el proyecto?',
      service_inquiry: 'Ofrezco servicios de desarrollo web, integración de IA, consultoría técnica y más. ¿Qué te interesa?',
      contact_request: '¡Claro! Puedes contactarme por email o agendar una consulta. ¿Qué prefieres?',
      portfolio_request: '¡Claro! Puedes ver mi portafolio en la sección de proyectos. ¿Hay algo específico que te interese?',
      consultation_request: '¡Excelente! Puedo ayudarte a agendar una consulta. ¿Qué día te viene mejor?',
      pricing_inquiry: 'Los precios varían según el proyecto. ¿Podrías contarme qué necesitas para darte una idea?',
      technical_question: '¡Me encanta hablar de tecnología! ¿Qué te gustaría saber específicamente?',
      general_question: '¡Con gusto te ayudo! ¿Qué pregunta tienes?',
      goodbye: '¡Ha sido un placer! Si necesitas algo más, no dudes en contactarme. ¡Que tengas un excelente día!',
      clarification_request: 'Por supuesto, ¿qué necesitas que te aclare?',
      confirmation: '¡Perfecto! ¿Hay algo más en lo que pueda ayudarte?',
      objection: 'Entiendo tu preocupación. ¿Podrías contarme más para poder ayudarte mejor?',
      urgency_indicator: 'Entiendo que es urgente. Te ayudo lo más rápido posible. ¿Qué necesitas?',
      project_quote: '¡Perfecto! Para darte una cotización necesito algunos detalles. ¿Qué tipo de proyecto tienes en mente?',
      general_information: '¡Con gusto te ayudo! ¿Qué información necesitas sobre mis servicios?',
      complaint: 'Lamento escuchar eso. ¿Podrías contarme más detalles para poder ayudarte?'
    }
    
    return responses[intentType] || '¡Gracias por contactarme! ¿En qué puedo ayudarte?'
  }
} 