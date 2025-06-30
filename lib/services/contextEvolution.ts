import { 
  EvolutiveContext, 
  ContextEntry, 
  ConversationContext
} from '@/lib/types/chat'

export class ContextEvolutionService {
  private static instance: ContextEvolutionService
  private contextStore: Map<string, EvolutiveContext> = new Map()

  static getInstance(): ContextEvolutionService {
    if (!ContextEvolutionService.instance) {
      ContextEvolutionService.instance = new ContextEvolutionService()
    }
    return ContextEvolutionService.instance
  }

  /**
   * Analiza un mensaje del usuario y extrae información relevante
   */
  analyzeUserMessage(message: string) {
    const entries: ContextEntry[] = []
    const lowerMessage = message.toLowerCase()

    // Extraer información personal
    const nameMatch = message.match(/(?:me llamo|soy|mi nombre es)\s+([A-Za-zÁáÉéÍíÓóÚúÑñ\s]+)/i)
    if (nameMatch) {
      entries.push({
        type: 'user_info',
        content: `name: ${nameMatch[1].trim()}`,
        confidence: 0.9,
        timestamp: new Date()
      })
    }

    // Extraer email
    const emailMatch = message.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
    if (emailMatch) {
      entries.push({
        type: 'user_info',
        content: `email: ${emailMatch[0]}`,
        confidence: 0.95,
        timestamp: new Date()
      })
    }

    // Extraer tipo de proyecto
    const projectTypes = [
      'landing page', 'sitio web', 'aplicación web', 'ecommerce', 'plataforma',
      'inteligencia artificial', 'chatbot', 'automación', 'api', 'base de datos'
    ]
    
    for (const projectType of projectTypes) {
      if (lowerMessage.includes(projectType)) {
        entries.push({
          type: 'project_info',
          content: `projectType: ${projectType}`,
          confidence: 0.8,
          timestamp: new Date()
        })
        break
      }
    }

    // Extraer presupuesto
    const budgetMatch = message.match(/(?:presupuesto|budget|inversión)\s*(?:de\s*)?(\$?\d+(?:\.\d+)?(?:\s*k|\s*mil)?)/i)
    if (budgetMatch) {
      entries.push({
        type: 'project_info',
        content: `budget: ${budgetMatch[1]}`,
        confidence: 0.85,
        timestamp: new Date()
      })
    }

    // Extraer timeline
    const timelineMatch = message.match(/(?:timeline|plazo|tiempo|fecha)\s*(?:de\s*)?(\d+\s*(?:semanas?|meses?|días?))/i)
    if (timelineMatch) {
      entries.push({
        type: 'project_info',
        content: `timeline: ${timelineMatch[1]}`,
        confidence: 0.8,
        timestamp: new Date()
      })
    }

    // Extraer requerimientos técnicos
    const techTerms = [
      'react', 'next.js', 'node.js', 'typescript', 'javascript', 'python',
      'postgresql', 'mongodb', 'aws', 'docker', 'kubernetes', 'api'
    ]
    
    const foundTech = techTerms.filter(tech => lowerMessage.includes(tech))
    if (foundTech.length > 0) {
      entries.push({
        type: 'technical_info',
        content: `technologies: ${foundTech.join(', ')}`,
        confidence: 0.9,
        timestamp: new Date()
      })
    }

    return entries
  }

  /**
   * Actualiza el contexto evolutivo con nuevas entradas
   */
  updateContext(sessionId: string, entries: ContextEntry[]): EvolutiveContext {
    const existingContext = this.contextStore.get(sessionId) || this.createNewContext(sessionId)
    
    // Agregar nuevas entradas
    const updatedEntries = [...existingContext.entries]
    
    entries.forEach(newEntry => {
      // Verificar si ya existe una entrada similar
      const existingIndex = updatedEntries.findIndex(entry => 
        entry.type === newEntry.type && 
        this.calculateSimilarity(entry.content, newEntry.content) > 0.7
      )
      
      if (existingIndex >= 0) {
        // Actualizar entrada existente con nueva información
        const existing = updatedEntries[existingIndex]
        updatedEntries[existingIndex] = {
          ...existing,
          content: this.mergeContent(existing.content, newEntry.content),
          confidence: Math.max(existing.confidence, newEntry.confidence),
          relevance: Math.max(existing.relevance ?? 0, newEntry.relevance ?? 0),
          timestamp: new Date()
        }
      } else {
        // Agregar nueva entrada
        updatedEntries.push(newEntry)
      }
    })

    // Limpiar entradas obsoletas (más de 24 horas)
    const filteredEntries = updatedEntries.filter(entry => 
      Date.now() - entry.timestamp.getTime() < 24 * 60 * 60 * 1000
    )

    const updatedContext: EvolutiveContext = {
      ...existingContext,
      entries: filteredEntries,
      summary: this.generateContextSummary(filteredEntries),
      lastUpdated: new Date(),
      version: existingContext.version + 1
    }

    this.contextStore.set(sessionId, updatedContext)
    return updatedContext
  }

  /**
   * Obtiene el contexto evolutivo para una sesión
   */
  getContext(sessionId: string): EvolutiveContext | null {
    return this.contextStore.get(sessionId) || null
  }

  /**
   * Genera un prompt mejorado basado en el contexto evolutivo
   */
  generateEnhancedPrompt(
    userMessage: string, 
    conversation: ConversationContext,
    basePrompt: string
  ): string {
    const context = this.getContext(conversation.sessionId)
    if (!context || context.entries.length === 0) {
      return basePrompt
    }

    const contextSummary = this.generateContextSummary(context.entries)
    const userProfile = this.generateUserProfile(context.entries)
    const conversationInsights = this.generateConversationInsights(conversation)

    return `${basePrompt}

CONTEXTO EVOLUTIVO DE LA CONVERSACIÓN:
${contextSummary}

PERFIL DEL USUARIO:
${userProfile}

INSIGHTS DE LA CONVERSACIÓN:
${conversationInsights}

INSTRUCCIONES ESPECÍFICAS:
- Utiliza el contexto evolutivo para personalizar tus respuestas
- Adapta tu nivel técnico según el perfil del usuario
- Menciona información específica que hayas aprendido sobre el usuario
- Sugiere soluciones basadas en los puntos de dolor identificados
- Mantén consistencia con información previa mencionada`
  }

  /**
   * Analiza la intención del usuario
   */
  analyzeIntent(message: string) {
    const lowerMessage = message.toLowerCase()
    
    // Detectar intenciones principales
    if (lowerMessage.includes('cotización') || lowerMessage.includes('precio') || lowerMessage.includes('costo')) {
      return {
        primaryIntent: 'quote_request',
        confidence: 0.9,
        entities: {},
        suggestedActions: ['provide_quote', 'ask_budget'],
        nextBestQuestions: ['¿Cuál es tu presupuesto aproximado?', '¿Cuándo necesitas el proyecto?']
      }
    }
    
    if (lowerMessage.includes('consulta') || lowerMessage.includes('reunión') || lowerMessage.includes('agendar')) {
      return {
        primaryIntent: 'consultation_request',
        confidence: 0.85,
        entities: {},
        suggestedActions: ['schedule_consultation', 'ask_availability'],
        nextBestQuestions: ['¿Qué día te resulta mejor?', '¿Prefieres videollamada o llamada?']
      }
    }
    
    if (lowerMessage.includes('portafolio') || lowerMessage.includes('proyectos') || lowerMessage.includes('trabajos')) {
      return {
        primaryIntent: 'portfolio_inquiry',
        confidence: 0.8,
        entities: {},
        suggestedActions: ['show_portfolio', 'describe_experience'],
        nextBestQuestions: ['¿Qué tipo de proyectos te interesan más?', '¿Tienes alguna tecnología específica en mente?']
      }
    }
    
    if (lowerMessage.includes('servicios') || lowerMessage.includes('qué haces') || lowerMessage.includes('ofreces')) {
      return {
        primaryIntent: 'services_inquiry',
        confidence: 0.8,
        entities: {},
        suggestedActions: ['list_services', 'explain_expertise'],
        nextBestQuestions: ['¿En qué área te gustaría que me enfoque?', '¿Tienes algún proyecto específico en mente?']
      }
    }
    
    return {
      primaryIntent: 'general_inquiry',
      confidence: 0.6,
      entities: {},
      suggestedActions: ['provide_general_info', 'ask_clarification'],
      nextBestQuestions: ['¿En qué puedo ayudarte específicamente?', '¿Tienes algún proyecto en mente?']
    }
  }

  // Métodos privados auxiliares
  private createNewContext(sessionId: string): EvolutiveContext {
    return {
      sessionId,
      entries: [],
      summary: '',
      lastUpdated: new Date(),
      version: 1
    }
  }

  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/)
    const words2 = text2.toLowerCase().split(/\s+/)
    const intersection = words1.filter(word => words2.includes(word))
    const union = [...new Set([...words1, ...words2])]
    return intersection.length / union.length
  }

  private mergeContent(content1: string, content2: string): string {
    // Lógica simple para combinar contenido
    return `${content1}; ${content2}`
  }

  private generateContextSummary(entries: ContextEntry[]): string {
    const summaries = entries
      .sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0))
      .slice(0, 5)
      .map(entry => entry.content)
    
    return summaries.join('. ')
  }

  private generateUserProfile(entries: ContextEntry[]): string {
    const userInfo = entries.filter(entry => entry.type === 'user_info')
    return userInfo.map(entry => entry.content).join('. ')
  }

  private generateConversationInsights(conversation: ConversationContext): string {
    const insights = []
    
    if (conversation.extractedData.projectType) {
      insights.push(`Interés en: ${conversation.extractedData.projectType}`)
    }
    
    if (conversation.extractedData.budget) {
      insights.push(`Presupuesto mencionado: ${conversation.extractedData.budget}`)
    }
    
    if (conversation.extractedData.timeline) {
      insights.push(`Timeline: ${conversation.extractedData.timeline}`)
    }

    return insights.join('. ')
  }
}

export const contextEvolutionService = ContextEvolutionService.getInstance() 