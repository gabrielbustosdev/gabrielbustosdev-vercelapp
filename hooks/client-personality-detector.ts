import { ConversationData, ChatMessage } from './types'

export interface ClientPersonality {
  type: 'executive' | 'entrepreneur' | 'developer' | 'marketer' | 'consultant' | 'general'
  confidence: number
  characteristics: {
    technicalLevel: 'beginner' | 'intermediate' | 'advanced'
    urgencyLevel: 'low' | 'medium' | 'high'
    budgetSensitivity: 'low' | 'medium' | 'high'
    decisionMakingStyle: 'analytical' | 'intuitive' | 'collaborative'
    communicationStyle: 'formal' | 'casual' | 'technical'
  }
  preferences: {
    detailLevel: 'high' | 'medium' | 'low'
    examplesNeeded: boolean
    technicalExplanations: boolean
    timelineFocus: boolean
    budgetFocus: boolean
  }
}

export interface ServiceContext {
  serviceType: string
  complexity: 'simple' | 'medium' | 'complex'
  timeline: 'urgent' | 'standard' | 'flexible'
  budget: 'low' | 'medium' | 'high'
  technicalRequirements: string[]
  businessGoals: string[]
}

export interface ConversationMemory {
  keyTopics: string[]
  decisions: string[]
  concerns: string[]
  preferences: string[]
  timeline: Date[]
  budgetMentions: string[]
  technicalQuestions: string[]
}

export class ClientPersonalityDetector {
  private static readonly PERSONALITY_INDICATORS = {
    executive: {
      keywords: ['ceo', 'director', 'gerente', 'presidente', 'vp', 'c-level', 'ejecutivo', 'estrategia', 'roi', 'kpi'],
      patterns: ['resultados', 'impacto', 'negocio', 'estrategia', 'liderazgo'],
      technicalLevel: 'beginner' as const,
      urgencyLevel: 'high' as const,
      budgetSensitivity: 'medium' as const,
      decisionMakingStyle: 'analytical' as const,
      communicationStyle: 'formal' as const
    },
    entrepreneur: {
      keywords: ['startup', 'emprendedor', 'fundador', 'co-founder', 'mi empresa', 'mi negocio', 'pitch', 'investor'],
      patterns: ['crecer', 'escalar', 'mercado', 'competencia', 'innovación'],
      technicalLevel: 'intermediate' as const,
      urgencyLevel: 'high' as const,
      budgetSensitivity: 'high' as const,
      decisionMakingStyle: 'intuitive' as const,
      communicationStyle: 'casual' as const
    },
    developer: {
      keywords: ['desarrollador', 'programador', 'coder', 'tech lead', 'senior', 'junior', 'stack', 'framework', 'api'],
      patterns: ['código', 'arquitectura', 'performance', 'scalability', 'best practices'],
      technicalLevel: 'advanced' as const,
      urgencyLevel: 'medium' as const,
      budgetSensitivity: 'low' as const,
      decisionMakingStyle: 'analytical' as const,
      communicationStyle: 'technical' as const
    },
    marketer: {
      keywords: ['marketing', 'campaña', 'lead', 'conversión', 'seo', 'sem', 'social media', 'branding', 'audiencia'],
      patterns: ['conversión', 'engagement', 'brand', 'audience', 'campaign'],
      technicalLevel: 'beginner' as const,
      urgencyLevel: 'medium' as const,
      budgetSensitivity: 'high' as const,
      decisionMakingStyle: 'collaborative' as const,
      communicationStyle: 'casual' as const
    },
    consultant: {
      keywords: ['consultor', 'asesor', 'freelancer', 'independiente', 'cliente', 'proyecto', 'asesoría'],
      patterns: ['cliente', 'proyecto', 'asesoría', 'recomendación', 'experiencia'],
      technicalLevel: 'intermediate' as const,
      urgencyLevel: 'low' as const,
      budgetSensitivity: 'medium' as const,
      decisionMakingStyle: 'collaborative' as const,
      communicationStyle: 'formal' as const
    },
    general: {
      keywords: ['proyecto', 'ayuda', 'servicio', 'información'],
      patterns: ['ayuda', 'información', 'servicio', 'proyecto'],
      technicalLevel: 'beginner' as const,
      urgencyLevel: 'medium' as const,
      budgetSensitivity: 'medium' as const,
      decisionMakingStyle: 'collaborative' as const,
      communicationStyle: 'casual' as const
    }
  }

  static detectPersonality(messages: ChatMessage[], conversationData: Partial<ConversationData>): ClientPersonality {
    const allText = messages
      .filter(m => m.role === 'user')
      .map(m => m.content.toLowerCase())
      .join(' ')

    const scores: Record<string, number> = {}
    
    // Calcular puntuaciones para cada tipo de personalidad
    for (const [type, indicators] of Object.entries(this.PERSONALITY_INDICATORS)) {
      let score = 0
      
      // Puntuación por palabras clave
      for (const keyword of indicators.keywords) {
        if (allText.includes(keyword)) {
          score += 2
        }
      }
      
      // Puntuación por patrones
      for (const pattern of indicators.patterns) {
        if (allText.includes(pattern)) {
          score += 1
        }
      }
      
      scores[type] = score
    }

    // Determinar el tipo con mayor puntuación
    let bestType = 'general'
    let bestScore = 0

    for (const [type, score] of Object.entries(scores)) {
      if (score > bestScore) {
        bestScore = score
        bestType = type
      }
    }

    // Si no hay indicadores claros, usar 'general'
    if (bestScore === 0) {
      bestType = 'general'
    }

    const personalityType = bestType as keyof typeof this.PERSONALITY_INDICATORS
    const indicators = this.PERSONALITY_INDICATORS[personalityType] || this.PERSONALITY_INDICATORS.general

    return {
      type: personalityType,
      confidence: Math.min(bestScore / 5, 1),
      characteristics: {
        technicalLevel: indicators.technicalLevel,
        urgencyLevel: indicators.urgencyLevel,
        budgetSensitivity: indicators.budgetSensitivity,
        decisionMakingStyle: indicators.decisionMakingStyle,
        communicationStyle: indicators.communicationStyle
      },
      preferences: this.generatePreferences(personalityType, allText, conversationData)
    }
  }

  private static generatePreferences(
    personalityType: string, 
    text: string, 
    conversationData: Partial<ConversationData>
  ): ClientPersonality['preferences'] {
    const preferences: ClientPersonality['preferences'] = {
      detailLevel: 'medium',
      examplesNeeded: true,
      technicalExplanations: false,
      timelineFocus: false,
      budgetFocus: false
    }

    // Ajustar según el tipo de personalidad
    switch (personalityType) {
      case 'executive':
        preferences.detailLevel = 'low' as typeof preferences.detailLevel
        preferences.examplesNeeded = false
        preferences.timelineFocus = true
        preferences.budgetFocus = true
        break
      case 'entrepreneur':
        preferences.detailLevel = 'medium' as typeof preferences.detailLevel
        preferences.examplesNeeded = true
        preferences.timelineFocus = true
        preferences.budgetFocus = true
        break
      case 'developer':
        preferences.detailLevel = 'high' as typeof preferences.detailLevel
        preferences.examplesNeeded = false
        preferences.technicalExplanations = true
        preferences.timelineFocus = false
        break
      case 'marketer':
        preferences.detailLevel = 'medium' as typeof preferences.detailLevel
        preferences.examplesNeeded = true
        preferences.timelineFocus = true
        preferences.budgetFocus = true
        break
      case 'consultant':
        preferences.detailLevel = 'high' as typeof preferences.detailLevel
        preferences.examplesNeeded = true
        preferences.timelineFocus = false
        preferences.budgetFocus = false
        break
      case 'general':
        preferences.detailLevel = 'medium' as typeof preferences.detailLevel
        preferences.examplesNeeded = true
        preferences.timelineFocus = false
        preferences.budgetFocus = false
        break
    }

    // Ajustar según el contenido de la conversación
    if (text.includes('ejemplo') || text.includes('muestra')) {
      preferences.examplesNeeded = true
    }
    if (text.includes('técnico') || text.includes('tecnología')) {
      preferences.technicalExplanations = true
    }
    if (text.includes('tiempo') || text.includes('fecha') || text.includes('urgente')) {
      preferences.timelineFocus = true
    }
    if (text.includes('presupuesto') || text.includes('costo') || text.includes('precio')) {
      preferences.budgetFocus = true
    }

    return preferences
  }

  static detectServiceContext(messages: ChatMessage[]): ServiceContext {
    const allText = messages
      .filter(m => m.role === 'user')
      .map(m => m.content.toLowerCase())
      .join(' ')

    // Detectar tipo de servicio
    let serviceType = 'general'
    if (allText.includes('landing page') || allText.includes('landing')) {
      serviceType = 'landing_page'
    } else if (allText.includes('ecommerce') || allText.includes('tienda')) {
      serviceType = 'ecommerce'
    } else if (allText.includes('ia') || allText.includes('inteligencia artificial')) {
      serviceType = 'ai_platform'
    } else if (allText.includes('dashboard') || allText.includes('panel')) {
      serviceType = 'dashboard'
    } else if (allText.includes('api') || allText.includes('backend')) {
      serviceType = 'api_development'
    }

    // Detectar complejidad
    let complexity: 'simple' | 'medium' | 'complex' = 'medium'
    if (allText.includes('simple') || allText.includes('básico')) {
      complexity = 'simple'
    } else if (allText.includes('complejo') || allText.includes('avanzado') || allText.includes('ai')) {
      complexity = 'complex'
    }

    // Detectar timeline
    let timeline: 'urgent' | 'standard' | 'flexible' = 'standard'
    if (allText.includes('urgente') || allText.includes('rápido') || allText.includes('inmediato')) {
      timeline = 'urgent'
    } else if (allText.includes('flexible') || allText.includes('sin prisa')) {
      timeline = 'flexible'
    }

    // Detectar presupuesto
    let budget: 'low' | 'medium' | 'high' = 'medium'
    if (allText.includes('bajo') || allText.includes('económico') || allText.includes('barato')) {
      budget = 'low'
    } else if (allText.includes('alto') || allText.includes('premium') || allText.includes('enterprise')) {
      budget = 'high'
    }

    return {
      serviceType,
      complexity,
      timeline,
      budget,
      technicalRequirements: this.extractTechnicalRequirements(allText),
      businessGoals: this.extractBusinessGoals(allText)
    }
  }

  private static extractTechnicalRequirements(text: string): string[] {
    const requirements: string[] = []
    
    const techKeywords = [
      'react', 'angular', 'vue', 'node', 'python', 'php', 'java', 'database',
      'api', 'mobile', 'responsive', 'seo', 'analytics', 'payment', 'auth'
    ]

    for (const keyword of techKeywords) {
      if (text.includes(keyword)) {
        requirements.push(keyword)
      }
    }

    return requirements
  }

  private static extractBusinessGoals(text: string): string[] {
    const goals: string[] = []
    
    const goalKeywords = [
      'vender', 'conversión', 'leads', 'branding', 'automation', 'efficiency',
      'growth', 'scalability', 'user experience', 'customer satisfaction'
    ]

    for (const keyword of goalKeywords) {
      if (text.includes(keyword)) {
        goals.push(keyword)
      }
    }

    return goals
  }

  static buildConversationMemory(messages: ChatMessage[]): ConversationMemory {
    const userMessages = messages.filter(m => m.role === 'user')
    
    const memory: ConversationMemory = {
      keyTopics: [],
      decisions: [],
      concerns: [],
      preferences: [],
      timeline: [],
      budgetMentions: [],
      technicalQuestions: []
    }

    for (const message of userMessages) {
      const text = message.content.toLowerCase()
      
      // Extraer temas clave
      if (text.includes('proyecto') || text.includes('servicio')) {
        memory.keyTopics.push('project_interest')
      }
      if (text.includes('precio') || text.includes('costo')) {
        memory.keyTopics.push('pricing_concern')
        memory.budgetMentions.push(message.content)
      }
      if (text.includes('tiempo') || text.includes('fecha')) {
        memory.keyTopics.push('timeline_concern')
        memory.timeline.push(new Date())
      }

      // Extraer decisiones
      if (text.includes('sí') || text.includes('perfecto') || text.includes('correcto')) {
        memory.decisions.push('positive_response')
      }
      if (text.includes('no') || text.includes('no estoy seguro')) {
        memory.decisions.push('negative_response')
      }

      // Extraer preocupaciones
      if (text.includes('preocupado') || text.includes('duda') || text.includes('problema')) {
        memory.concerns.push('general_concern')
      }

      // Extraer preferencias
      if (text.includes('me gusta') || text.includes('prefiero')) {
        memory.preferences.push('preference_expressed')
      }

      // Extraer preguntas técnicas
      if (text.includes('cómo') || text.includes('qué') || text.includes('cuál')) {
        memory.technicalQuestions.push(message.content)
      }
    }

    return memory
  }
} 