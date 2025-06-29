import { 
  ClientPersonality, 
  ServiceContext, 
  ConversationMemory, 
  ConversationIntent,
  ConversationData 
} from './types'
import { ClientPersonalityDetector } from './client-personality-detector'

export interface PersonalizedResponse {
  message: string
  tone: 'formal' | 'casual' | 'technical' | 'empathetic' | 'enthusiastic'
  detailLevel: 'high' | 'medium' | 'low'
  includeExamples: boolean
  includeTechnicalDetails: boolean
  focusAreas: string[]
  suggestedActions: string[]
}

export interface ResponseTemplate {
  template: string
  placeholders: string[]
  conditions: {
    personalityType?: string[]
    serviceType?: string[]
    technicalLevel?: string[]
    urgencyLevel?: string[]
  }
}

export class PersonalizedResponseEngine {
  private static readonly TONE_ADAPTATIONS = {
    executive: {
      tone: 'formal' as const,
      detailLevel: 'low' as const,
      focusAreas: ['roi', 'timeline', 'business_impact', 'strategic_value'],
      language: ['estrategia', 'resultados', 'impacto', 'negocio', 'kpi', 'roi'],
      consultativeApproach: 'business_impact'
    },
    entrepreneur: {
      tone: 'enthusiastic' as const,
      detailLevel: 'medium' as const,
      focusAreas: ['growth', 'scalability', 'market_opportunity', 'competitive_advantage'],
      language: ['crecer', 'escalar', 'oportunidad', 'innovación', 'mercado', 'competencia'],
      consultativeApproach: 'growth_opportunity'
    },
    developer: {
      tone: 'technical' as const,
      detailLevel: 'high' as const,
      focusAreas: ['architecture', 'performance', 'best_practices', 'technical_excellence'],
      language: ['arquitectura', 'performance', 'escalabilidad', 'código', 'tecnología', 'stack'],
      consultativeApproach: 'technical_excellence'
    },
    marketer: {
      tone: 'casual' as const,
      detailLevel: 'medium' as const,
      focusAreas: ['conversion', 'user_experience', 'branding', 'customer_journey'],
      language: ['conversión', 'experiencia', 'marca', 'audiencia', 'engagement', 'leads'],
      consultativeApproach: 'conversion_optimization'
    },
    consultant: {
      tone: 'formal' as const,
      detailLevel: 'high' as const,
      focusAreas: ['strategy', 'process', 'recommendations', 'best_practices'],
      language: ['estrategia', 'proceso', 'recomendación', 'experiencia', 'metodología'],
      consultativeApproach: 'strategic_consulting'
    },
    general: {
      tone: 'casual' as const,
      detailLevel: 'medium' as const,
      focusAreas: ['value', 'quality', 'service', 'solutions'],
      language: ['valor', 'calidad', 'servicio', 'solución', 'beneficio'],
      consultativeApproach: 'value_proposition'
    }
  }

  private static readonly SERVICE_TEMPLATES = {
    landing_page: {
      templates: [
        "Perfecto para tu {project_type}. Una landing page optimizada puede aumentar tus conversiones hasta un {conversion_improvement}%. ¿Te gustaría que te explique el proceso de diseño y desarrollo?",
        "¡Excelente elección! Las landing pages son fundamentales para {business_goal}. Te ayudo a crear una que convierta visitantes en clientes.",
        "Una landing page profesional puede transformar tu {business_goal}. ¿Qué funcionalidades específicas necesitas?"
      ],
      focusAreas: ['conversion', 'design', 'user_experience'],
      examples: ['formularios de contacto', 'testimonios', 'llamadas a la acción']
    },
    ai_platform: {
      templates: [
        "¡Fascinante proyecto! La IA puede revolucionar tu {business_goal}. ¿Qué tipo de inteligencia artificial tienes en mente?",
        "Las plataformas con IA son muy potentes para {business_goal}. Te ayudo a diseñar una solución personalizada.",
        "La IA puede automatizar y optimizar tu {business_goal}. ¿Tienes datos disponibles para entrenar el modelo?"
      ],
      focusAreas: ['automation', 'efficiency', 'innovation'],
      examples: ['procesamiento de lenguaje', 'análisis predictivo', 'recomendaciones']
    },
    ecommerce: {
      templates: [
        "¡Perfecto! Un e-commerce puede expandir tu negocio significativamente. ¿Qué productos planeas vender?",
        "Las tiendas online son excelentes para {business_goal}. Te ayudo a crear una experiencia de compra excepcional.",
        "Un e-commerce profesional puede aumentar tus ventas. ¿Tienes preferencias sobre la plataforma?"
      ],
      focusAreas: ['sales', 'user_experience', 'payment_integration'],
      examples: ['catálogo de productos', 'carrito de compras', 'pasarelas de pago']
    },
    dashboard: {
      templates: [
        "Los dashboards son esenciales para {business_goal}. ¿Qué métricas necesitas visualizar?",
        "¡Excelente! Un dashboard puede transformar tus datos en insights accionables. ¿Qué KPIs son importantes para ti?",
        "Los dashboards mejoran la toma de decisiones. ¿Qué tipo de datos necesitas monitorear?"
      ],
      focusAreas: ['analytics', 'data_visualization', 'insights'],
      examples: ['gráficos interactivos', 'reportes automáticos', 'alertas en tiempo real']
    }
  }

  static generatePersonalizedResponse(
    intent: ConversationIntent,
    personality: ClientPersonality,
    serviceContext: ServiceContext,
    memory: ConversationMemory,
    conversationData: Partial<ConversationData>
  ): PersonalizedResponse {
    const adaptation = this.TONE_ADAPTATIONS[personality.type]
    const serviceTemplate = this.SERVICE_TEMPLATES[serviceContext.serviceType as keyof typeof this.SERVICE_TEMPLATES]

    // Generar mensaje base según la intención
    let baseMessage = this.getBaseMessage(intent, personality, serviceContext)
    
    // Personalizar según el tipo de cliente
    baseMessage = this.adaptMessageForPersonality(baseMessage, personality, adaptation)
    
    // Agregar contexto del servicio
    if (serviceTemplate) {
      baseMessage = this.addServiceContext(baseMessage, serviceTemplate, serviceContext, conversationData)
    }
    
    // Agregar memoria de conversación
    baseMessage = this.addConversationMemory(baseMessage, memory, personality)
    
    // Generar acciones sugeridas
    const suggestedActions = this.generateSuggestedActions(intent, personality, serviceContext, memory)

    return {
      message: baseMessage,
      tone: adaptation.tone,
      detailLevel: personality.preferences.detailLevel,
      includeExamples: personality.preferences.examplesNeeded,
      includeTechnicalDetails: personality.preferences.technicalExplanations,
      focusAreas: adaptation.focusAreas,
      suggestedActions
    }
  }

  private static getBaseMessage(
    intent: ConversationIntent, 
    personality: ClientPersonality, 
    serviceContext: ServiceContext
  ): string {
    const templates = {
      greeting: {
        executive: "Buenos días. Soy Gabriel Bustos, consultor senior en desarrollo web. ¿Qué desafío de negocio está enfrentando que podamos resolver con tecnología?",
        entrepreneur: "¡Hola! Soy Gabriel Bustos, especialista en soluciones digitales para startups. ¿Qué oportunidad de mercado quieres aprovechar con tu proyecto?",
        developer: "¡Hola! Soy Gabriel Bustos, arquitecto de soluciones web. ¿Qué desafío técnico necesitas resolver en tu proyecto?",
        marketer: "¡Hola! Soy Gabriel Bustos, especialista en experiencias digitales que convierten. ¿Qué objetivo de conversión quieres alcanzar?",
        consultant: "Buenos días. Soy Gabriel Bustos, consultor en transformación digital. ¿Para qué cliente o proyecto necesitas esta solución?",
        general: "¡Hola! Soy Gabriel Bustos, consultor en desarrollo web. ¿Qué problema de negocio quieres resolver con tecnología?"
      },
      project_inquiry: {
        executive: "Entiendo su interés en el proyecto. Para brindarle la mejor propuesta estratégica, necesito analizar el impacto de negocio y los KPIs que quiere mejorar.",
        entrepreneur: "¡Genial! Cuéntame más sobre tu proyecto. ¿Qué problema de mercado quieres resolver o qué ventaja competitiva quieres desarrollar?",
        developer: "Perfecto. ¿Qué tipo de desarrollo necesitas? ¿Tienes algún stack tecnológico en mente o prefieres que analicemos las mejores opciones?",
        marketer: "¡Excelente! ¿Qué objetivo de marketing quieres alcanzar con este proyecto? ¿Qué métricas de conversión necesitas mejorar?",
        consultant: "Entiendo. ¿Para qué cliente o proyecto específico necesitas esta solución? ¿Qué tipo de asesoría técnica requieren?",
        general: "¡Perfecto! Cuéntame más sobre tu proyecto. ¿Qué problema de negocio quieres resolver o qué oportunidad quieres aprovechar?"
      },
      budget_discussion: {
        executive: "Entiendo su preocupación por el presupuesto. Le ayudo a evaluar el ROI de la inversión y el impacto estratégico en su negocio.",
        entrepreneur: "El presupuesto es clave para startups. Te ayudo a encontrar la mejor relación costo-beneficio y optimizar la inversión para el crecimiento.",
        developer: "El presupuesto varía según la complejidad técnica y escalabilidad requerida. ¿Qué funcionalidades específicas necesitas y cómo planeas escalar?",
        marketer: "El presupuesto debe alinearse con tus objetivos de conversión y ROI de marketing. ¿Qué métricas quieres mejorar y cuál es el valor de cada conversión?",
        consultant: "El presupuesto depende del alcance del proyecto y la complejidad técnica. ¿Qué servicios específicos necesitas y para qué tipo de cliente?",
        general: "El presupuesto varía según el valor de negocio del proyecto. ¿Podrías contarme más sobre el problema que quieres resolver y su impacto en tu negocio?"
      },
      technical_question: {
        executive: "Desde una perspectiva estratégica, la tecnología debe alinearse con sus objetivos de negocio. ¿Qué resultado específico necesita lograr?",
        entrepreneur: "La tecnología debe ser escalable y adaptable a tu crecimiento. ¿Cómo planeas que evolucione tu negocio en los próximos meses?",
        developer: "La arquitectura técnica debe ser robusta y mantenible. ¿Qué requisitos de performance y escalabilidad tienes en mente?",
        marketer: "La tecnología debe optimizar la experiencia del usuario y las conversiones. ¿Qué tipo de interacciones quieres facilitar?",
        consultant: "La solución técnica debe ser flexible y reutilizable. ¿Qué tipo de proyectos similares has manejado antes?",
        general: "La tecnología debe resolver tu problema de manera eficiente. ¿Qué funcionalidades específicas necesitas para lograr tu objetivo?"
      }
    }

    const intentTemplates = templates[intent.type as keyof typeof templates]
    if (intentTemplates) {
      return intentTemplates[personality.type] || intentTemplates.general
    }

    return "¡Gracias por contactarme! ¿En qué puedo ayudarte a resolver tu desafío de negocio?"
  }

  private static adaptMessageForPersonality(
    message: string, 
    personality: ClientPersonality, 
    adaptation: any
  ): string {
    let adaptedMessage = message

    // Adaptar lenguaje según el tipo de personalidad
    if (personality.characteristics.communicationStyle === 'formal') {
      adaptedMessage = adaptedMessage.replace(/tú/g, 'usted')
      adaptedMessage = adaptedMessage.replace(/tu/g, 'su')
    }

    // Agregar enfoque en áreas específicas
    if (adaptation.focusAreas.includes('roi') && personality.type === 'executive') {
      adaptedMessage += " El ROI de este proyecto puede ser significativo para su negocio."
    }

    if (adaptation.focusAreas.includes('growth') && personality.type === 'entrepreneur') {
      adaptedMessage += " Este proyecto puede ayudarte a escalar tu negocio rápidamente."
    }

    if (adaptation.focusAreas.includes('performance') && personality.type === 'developer') {
      adaptedMessage += " La arquitectura estará optimizada para rendimiento y escalabilidad."
    }

    return adaptedMessage
  }

  private static addServiceContext(
    message: string, 
    serviceTemplate: any, 
    serviceContext: ServiceContext,
    conversationData: Partial<ConversationData>
  ): string {
    const template = serviceTemplate.templates[Math.floor(Math.random() * serviceTemplate.templates.length)]
    
    // Reemplazar placeholders
    let contextualizedMessage = template
      .replace('{project_type}', conversationData.projectType || 'proyecto')
      .replace('{business_goal}', serviceContext.businessGoals[0] || 'objetivo de negocio')
      .replace('{conversion_improvement}', '40%')

    return contextualizedMessage
  }

  private static addConversationMemory(
    message: string, 
    memory: ConversationMemory, 
    personality: ClientPersonality
  ): string {
    let enhancedMessage = message

    // Referenciar preocupaciones previas
    if (memory.concerns.includes('general_concern')) {
      enhancedMessage += " Entiendo tus preocupaciones y te ayudo a resolverlas paso a paso."
    }

    // Referenciar preferencias expresadas
    if (memory.preferences.includes('preference_expressed')) {
      enhancedMessage += " Tomaré en cuenta tus preferencias para personalizar la solución."
    }

    // Referenciar timeline si es importante
    if (memory.timeline.length > 0 && personality.preferences.timelineFocus) {
      enhancedMessage += " Entiendo que el tiempo es importante para ti."
    }

    // Referenciar presupuesto si es sensible
    if (memory.budgetMentions.length > 0 && personality.preferences.budgetFocus) {
      enhancedMessage += " Te ayudo a optimizar el presupuesto para obtener el mejor valor."
    }

    return enhancedMessage
  }

  private static generateSuggestedActions(
    intent: ConversationIntent,
    personality: ClientPersonality,
    serviceContext: ServiceContext,
    memory: ConversationMemory
  ): string[] {
    const actions: string[] = []

    // Acciones según el tipo de personalidad
    switch (personality.type) {
      case 'executive':
        actions.push('Ver propuesta ejecutiva', 'Agendar reunión estratégica', 'Análisis de ROI')
        break
      case 'entrepreneur':
        actions.push('Ver casos de éxito', 'Agendar consulta gratuita', 'Evaluación de mercado')
        break
      case 'developer':
        actions.push('Revisar arquitectura técnica', 'Ver documentación', 'Análisis de stack')
        break
      case 'marketer':
        actions.push('Ver estrategia de conversión', 'Análisis de audiencia', 'Plan de marketing')
        break
      case 'consultant':
        actions.push('Ver propuesta detallada', 'Análisis de requerimientos', 'Plan de implementación')
        break
      default:
        actions.push('Agendar consulta', 'Ver portafolio', 'Más información')
    }

    // Acciones según el contexto del servicio
    if (serviceContext.serviceType === 'ai_platform') {
      actions.push('Evaluación de viabilidad técnica')
    }
    if (serviceContext.timeline === 'urgent') {
      actions.push('Plan de implementación rápida')
    }
    if (serviceContext.budget === 'low') {
      actions.push('Opciones escalables')
    }

    return actions.slice(0, 3) // Máximo 3 acciones
  }

  static generateFollowUpQuestion(
    personality: ClientPersonality,
    serviceContext: ServiceContext,
    memory: ConversationMemory,
    currentField: string
  ): string {
    const questions = {
      name: {
        executive: "¿Cuál es su nombre completo?",
        entrepreneur: "¿Cómo te llamas?",
        developer: "¿Cuál es tu nombre?",
        marketer: "¿Cuál es tu nombre?",
        consultant: "¿Cuál es su nombre?",
        general: "¿Podrías contarme tu nombre?"
      },
      email: {
        executive: "¿Cuál es su dirección de email corporativa?",
        entrepreneur: "¿Cuál es tu email para enviarte la propuesta?",
        developer: "¿Cuál es tu email?",
        marketer: "¿Cuál es tu email?",
        consultant: "¿Cuál es su email?",
        general: "¿Cuál es tu email?"
      },
      projectType: {
        executive: "¿Qué tipo de proyecto estratégico tiene en mente?",
        entrepreneur: "¿Qué proyecto quieres desarrollar para hacer crecer tu negocio?",
        developer: "¿Qué tipo de desarrollo necesitas?",
        marketer: "¿Qué proyecto de marketing quieres implementar?",
        consultant: "¿Para qué tipo de proyecto necesitas la solución?",
        general: "¿Qué tipo de proyecto tienes en mente?"
      }
    }

    const fieldQuestions = questions[currentField as keyof typeof questions]
    if (fieldQuestions) {
      return fieldQuestions[personality.type] || fieldQuestions.general
    }

    return "¿Podrías contarme más sobre eso?"
  }
} 