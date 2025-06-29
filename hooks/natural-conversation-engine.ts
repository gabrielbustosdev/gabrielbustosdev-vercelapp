import { ConversationData, ConversationIntent, IntentType } from './types'

export interface NaturalConversationState {
  currentStep: keyof ConversationData | null
  collectedData: Partial<ConversationData>
  requiredFields: (keyof ConversationData)[]
  conversationContext: string[]
  lastUserMessage: string
  isWaitingForConfirmation: boolean
}

export interface NaturalResponse {
  message: string
  nextStep: keyof ConversationData | null
  shouldAskForConfirmation: boolean
  suggestedActions?: string[]
  context?: string
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

  static processUserMessage(
    message: string,
    state: NaturalConversationState,
    intent: ConversationIntent
  ): NaturalResponse {
    const lowerMessage = message.toLowerCase()
    
    // Si el usuario está confirmando información
    if (this.isConfirmationMessage(lowerMessage)) {
      return this.handleConfirmation(state)
    }
    
    // Si el usuario quiere editar algo
    if (this.isEditRequest(lowerMessage)) {
      return this.handleEditRequest(lowerMessage, state)
    }
    
    // Extraer información del mensaje
    const extractedData = this.extractInformationFromMessage(message, state.currentStep)
    
    // Actualizar datos recopilados
    const updatedData = { ...state.collectedData, ...extractedData }
    
    // Determinar el siguiente paso
    const nextStep = this.determineNextStep(updatedData, state.requiredFields)
    
    // Generar respuesta natural
    return this.generateNaturalResponse(
      message,
      updatedData,
      nextStep,
      state.currentStep,
      intent,
      extractedData
    )
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

  private static handleConfirmation(state: NaturalConversationState): NaturalResponse {
    return {
      message: "¡Perfecto! Con toda esta información puedo prepararte una propuesta personalizada. ¿Te gustaría que agende una consulta gratuita para discutir los detalles y darte una cotización formal?",
      nextStep: null,
      shouldAskForConfirmation: true,
      suggestedActions: ['Agendar consulta', 'Ver cotización preliminar', 'Más información']
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
    extractedData: Partial<ConversationData>
  ): NaturalResponse {
    // Si se extrajo información exitosamente
    if (Object.keys(extractedData).length > 0) {
      const field = Object.keys(extractedData)[0] as keyof ConversationData
      const fieldLabel = this.getFieldLabel(field)
      
      return {
        message: `¡Perfecto! He registrado tu ${fieldLabel}. ${this.getNextQuestion(nextStep)}`,
        nextStep,
        shouldAskForConfirmation: false,
        context: `Información ${fieldLabel} registrada`
      }
    }
    
    // Si no se extrajo información pero hay un paso actual
    if (currentStep && !extractedData[currentStep]) {
      return {
        message: this.getRandomQuestion(currentStep),
        nextStep: currentStep,
        shouldAskForConfirmation: false
      }
    }
    
    // Si no hay paso actual, determinar el siguiente
    if (!nextStep) {
      return {
        message: "¡Excelente! Tengo toda la información que necesito. ¿Te gustaría que proceda a preparar una cotización personalizada?",
        nextStep: null,
        shouldAskForConfirmation: true,
        suggestedActions: ['Ver cotización', 'Agendar consulta', 'Más detalles']
      }
    }
    
    // Pregunta por el siguiente campo
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
} 