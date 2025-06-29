import React, { useReducer, useCallback, useContext, createContext, useEffect } from 'react'
import { useChat } from 'ai/react'
import { 
  ChatbotState, 
  ChatbotAction, 
  ChatbotContextType, 
  ChatMessage, 
  ConversationData,
  MessageAnalysis,
  ConversationIntent,
  ConversationFlow,
  MissingInfoTracker,
  FollowUpQuestion
} from './types'
import { chatbotReducer, initialState } from './chatbot-reducer'
import { ConversationEngine } from './conversation-engine'
import { 
  processMessage, 
  validateNLPResult, 
  type NLPResult, 
  type Entity, 
  type Intent, 
  type Sentiment, 
  type InformationCompleteness 
} from '../lib/nlp-processor'

// Crear el contexto del chatbot
const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

// Hook personalizado para usar el contexto del chatbot
export const useChatbot = () => {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    throw new Error('useChatbot debe ser usado dentro de un ChatbotProvider')
  }
  return context
}

// Hook principal que combina useReducer con useChat de AI SDK
export const useChatbotLogic = () => {
  const [state, dispatch] = useReducer(chatbotReducer, initialState)

  // Configuración del chatbot
  const chatbotConfig = {
    initialMessage: "¡Hola! Soy el asistente de IA de Gabriel Bustos. Puedo ayudarte con información sobre servicios de desarrollo web, integración de IA, consultoría técnica y más. ¿En qué puedo ayudarte hoy?",
    autoOpenKeywords: ['[auto_open_consultation]'],
    consultationKeywords: ['agendar', 'consulta', 'contactar', 'interesado', 'me gustaría', 'quiero', 'necesito', 'proyecto'],
    projectTypeKeywords: {
      'landing page': 'Landing Page',
      'sitio web': 'Landing Page',
      'página web': 'Landing Page',
      'plataforma': 'Plataforma con IA',
      'inteligencia artificial': 'Plataforma con IA',
      'chatbot': 'Plataforma con IA',
      'ia': 'Plataforma con IA',
      'ai': 'Plataforma con IA',
      'rebranding': 'Rebranding',
      'renovar': 'Rebranding',
      'optimizar': 'Rebranding',
      'desarrollo web': 'Desarrollo Web',
      'aplicación': 'Desarrollo Web',
      'app': 'Desarrollo Web',
      'consultoría': 'Consultoría'
    }
  }

  // Usar el hook useChat del AI SDK
  const { 
    messages: aiMessages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading, 
    error, 
    reload 
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: chatbotConfig.initialMessage,
      },
    ],
    onError: (error) => {
      console.error('Chat error:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
    },
    onFinish: (message) => {
      // Analizar el mensaje del asistente para detectar oportunidades de consulta
      const analysis = analyzeMessageForConsultation(message.content, state.messages)
      
      // Actualizar datos de conversación si se extrajo información
      if (Object.keys(analysis.extractedData).length > 0) {
        dispatch({ 
          type: 'UPDATE_CONVERSATION_DATA', 
          payload: analysis.extractedData 
        })
      }

      // Abrir modal automáticamente si se detecta la señal
      if (analysis.autoOpenConsultation) {
        setTimeout(() => {
          dispatch({ type: 'SHOW_CONSULTATION_MODAL' })
        }, 1000)
      }
    }
  })

  // ===== NUEVAS FUNCIONES DEL SISTEMA DE INTENCIONES =====

  // Detectar intención del mensaje del usuario
  const detectIntent = useCallback((message: string): ConversationIntent => {
    return ConversationEngine.detectIntent(message)
  }, [])

  // Obtener flujo conversacional basado en la intención
  const getConversationFlow = useCallback((intent: ConversationIntent): ConversationFlow | null => {
    return ConversationEngine.getConversationFlow(intent, state.conversationData)
  }, [state.conversationData])

  // Generar preguntas de seguimiento
  const generateFollowUpQuestions = useCallback((missingInfo: MissingInfoTracker): FollowUpQuestion[] => {
    return ConversationEngine.generateFollowUpQuestions(missingInfo, state.currentIntent?.type || 'general_information')
  }, [state.currentIntent])

  // Procesar respuesta del usuario
  const processUserResponse = useCallback((message: string, currentFlow: ConversationFlow) => {
    const extractedData = ConversationEngine.processUserResponse(message, currentFlow)
    
    if (Object.keys(extractedData).length > 0) {
      dispatch({ 
        type: 'UPDATE_CONVERSATION_DATA', 
        payload: extractedData 
      })
      
      // Actualizar información faltante
      const updatedMissingInfo: Partial<MissingInfoTracker> = {}
      Object.entries(extractedData).forEach(([key, value]) => {
        if (value) {
          updatedMissingInfo[key as keyof MissingInfoTracker] = false
        }
      })
      
      if (Object.keys(updatedMissingInfo).length > 0) {
        dispatch({ 
          type: 'UPDATE_MISSING_INFO', 
          payload: updatedMissingInfo 
        })
      }
    }
  }, [])

  // Función para manejar el envío de mensajes con detección de intenciones
  const handleSubmitWithIntent = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!input.trim()) return
    
    try {
      // Procesar el mensaje con NLP
      const nlpResult = await processMessage(input)
      
      // Validar el resultado NLP
      const validatedResult = validateNLPResult(nlpResult)
      
      // Extraer información del procesamiento NLP
      const extractedData: Partial<ConversationData> = {}
      
      // Mapear entidades extraídas a datos de conversación
      validatedResult.entities.forEach(entity => {
        switch (entity.type) {
          case 'name':
            extractedData.clientName = entity.value
            break
          case 'email':
            extractedData.clientEmail = entity.value
            break
          case 'phone':
            extractedData.clientPhone = entity.value
            break
          case 'budget':
            extractedData.budget = entity.value
            break
          case 'timeline':
            extractedData.timeline = entity.value
            break
          case 'company':
            extractedData.companyName = entity.value
            break
          case 'location':
            extractedData.location = entity.value
            break
          case 'project_type':
            extractedData.projectType = entity.value
            break
        }
      })
      
      // Actualizar datos de conversación con información extraída
      if (Object.keys(extractedData).length > 0) {
        dispatch({ 
          type: 'UPDATE_CONVERSATION_DATA', 
          payload: extractedData 
        })
      }
      
      // Actualizar información faltante basada en el análisis de completitud
      if (!validatedResult.completeness.isComplete) {
        const missingInfo: Partial<MissingInfoTracker> = {}
        validatedResult.completeness.missingFields.forEach(field => {
          missingInfo[field] = true
        })
        
        if (Object.keys(missingInfo).length > 0) {
          dispatch({ 
            type: 'UPDATE_MISSING_INFO', 
            payload: missingInfo 
          })
        }
      }
      
      // Detectar intención usando NLP en lugar del motor de conversación
      const intent: ConversationIntent = {
        type: validatedResult.intent.type,
        confidence: validatedResult.intent.confidence,
        entities: validatedResult.entities,
        sentiment: validatedResult.sentiment,
        timestamp: new Date().toISOString()
      }
      
      dispatch({ type: 'SET_CURRENT_INTENT', payload: intent })
      
      // Obtener flujo conversacional basado en la intención NLP
      const flow = getConversationFlow(intent)
      if (flow) {
        dispatch({ type: 'SET_CONVERSATION_FLOW', payload: flow })
        
        // Procesar respuesta del usuario si hay un flujo activo
        if (state.conversationFlow) {
          processUserResponse(input, state.conversationFlow)
        }
      }
      
      // Generar preguntas de seguimiento si es necesario
      if (state.missingInfo) {
        const followUpQuestions = generateFollowUpQuestions(state.missingInfo)
        if (followUpQuestions.length > 0) {
          // Limpiar preguntas anteriores
          dispatch({ type: 'CLEAR_FOLLOW_UP_QUESTIONS' })
          
          // Agregar nuevas preguntas
          followUpQuestions.forEach(question => {
            dispatch({ type: 'ADD_FOLLOW_UP_QUESTION', payload: question })
          })
        }
      }
      
      // Ajustar el tono de respuesta basado en el sentimiento
      if (validatedResult.sentiment.label === 'negative' || validatedResult.sentiment.label === 'very_negative') {
        dispatch({ type: 'SET_RESPONSE_TONE', payload: 'empathetic' })
      } else if (validatedResult.sentiment.label === 'positive' || validatedResult.sentiment.label === 'very_positive') {
        dispatch({ type: 'SET_RESPONSE_TONE', payload: 'enthusiastic' })
      } else {
        dispatch({ type: 'SET_RESPONSE_TONE', payload: 'professional' })
      }
      
      // Detectar urgencia
      if (validatedResult.intent.type === 'urgency_indicator' || 
          validatedResult.sentiment.emotions.fear > 0.5) {
        dispatch({ type: 'SET_URGENCY_LEVEL', payload: 'high' })
      }
      
    } catch (error) {
      console.error('Error procesando mensaje con NLP:', error)
      // Fallback al procesamiento original si NLP falla
    }
    
    // Continuar con el flujo normal del AI SDK
    handleSubmit(e)
  }, [input, getConversationFlow, processUserResponse, state.conversationFlow, state.missingInfo, generateFollowUpQuestions, handleSubmit])

  // Función para analizar mensajes y detectar oportunidades de consulta
  const analyzeMessageForConsultation = (
    content: string, 
    allMessages: ChatMessage[]
  ): MessageAnalysis => {
    const lowerContent = content.toLowerCase()
    
    const analysis: MessageAnalysis = {
      hasInterest: false,
      suggestedConsultation: false,
      autoOpenConsultation: false,
      extractedData: {}
    }
    
    // Detectar si el asistente sugiere abrir automáticamente la consulta
    if (chatbotConfig.autoOpenKeywords.some(keyword => lowerContent.includes(keyword))) {
      analysis.autoOpenConsultation = true
      analysis.extractedData = extractConversationData(allMessages)
      return analysis
    }
    
    // Detectar si el usuario mostró interés en servicios
    analysis.hasInterest = chatbotConfig.consultationKeywords.some(keyword => 
      lowerContent.includes(keyword)
    )
    
    // Detectar si el asistente sugirió agendar consulta
    analysis.suggestedConsultation = ['agendar', 'consulta', 'contactar'].some(keyword => 
      lowerContent.includes(keyword)
    )
    
    if (analysis.hasInterest || analysis.suggestedConsultation) {
      analysis.extractedData = extractConversationData(allMessages)
    }
    
    return analysis
  }

  // Función para extraer datos de la conversación
  const extractConversationData = (messages: ChatMessage[]): Partial<ConversationData> => {
    const userMessages = messages.filter(m => m.role === 'user')
    const assistantMessages = messages.filter(m => m.role === 'assistant')
    
    const extractedData: Partial<ConversationData> = {}

    // Analizar todos los mensajes del usuario para extraer información
    userMessages.forEach(message => {
      const content = message.content.toLowerCase()
      
      // Extraer nombre
      const nameMatch = content.match(/(?:me llamo|soy|mi nombre es)\s+([A-Za-zÁáÉéÍíÓóÚúÑñ\s]+)/i)
      if (nameMatch && !extractedData.name) {
        extractedData.name = nameMatch[1].trim()
      }
      
      // Extraer email
      const emailMatch = content.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
      if (emailMatch && !extractedData.email) {
        extractedData.email = emailMatch[0]
      }
      
      // Extraer tipo de proyecto
      for (const [keyword, projectType] of Object.entries(chatbotConfig.projectTypeKeywords)) {
        if (content.includes(keyword) && !extractedData.projectType) {
          extractedData.projectType = projectType
          break
        }
      }
      
      // Extraer presupuesto
      const budgetMatch = content.match(/(?:presupuesto|budget|inversión)\s*(?:de|es|aproximado)?\s*(\$?\d+(?:\.\d+)?(?:\s*-\s*\$?\d+(?:\.\d+)?)?(?:\s*ars|\s*pesos)?)/i)
      if (budgetMatch && !extractedData.budget) {
        extractedData.budget = budgetMatch[1].trim()
      }
      
      // Extraer timeline
      const timelineMatch = content.match(/(?:timeline|plazo|tiempo|urgente|normal|flexible)/i)
      if (timelineMatch && !extractedData.timeline) {
        if (content.includes('urgente')) {
          extractedData.timeline = 'Urgente (1-2 semanas)'
        } else if (content.includes('normal')) {
          extractedData.timeline = 'Normal (1-2 meses)'
        } else if (content.includes('flexible')) {
          extractedData.timeline = 'Flexible (3+ meses)'
        }
      }
      
      // Extraer requerimientos (último mensaje largo del usuario)
      if (content.length > 30 && !extractedData.requirements) {
        extractedData.requirements = message.content
      }
    })

    // Analizar respuestas del asistente para complementar información
    assistantMessages.forEach(message => {
      const content = message.content.toLowerCase()
      
      // Si el asistente mencionó un tipo de proyecto específico
      if (!extractedData.projectType) {
        for (const [keyword, projectType] of Object.entries(chatbotConfig.projectTypeKeywords)) {
          if (content.includes(keyword)) {
            extractedData.projectType = projectType
            break
          }
        }
      }
    })

    return extractedData
  }

  // Funciones del contexto
  const openChat = useCallback(() => {
    dispatch({ type: 'OPEN_CHAT' })
  }, [])

  const closeChat = useCallback(() => {
    dispatch({ type: 'CLOSE_CHAT' })
  }, [])

  const addMessage = useCallback((message: ChatMessage) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message })
  }, [])

  const updateConversationData = useCallback((data: Partial<ConversationData>) => {
    dispatch({ type: 'UPDATE_CONVERSATION_DATA', payload: data })
  }, [])

  const showConsultationModal = useCallback(() => {
    dispatch({ type: 'SHOW_CONSULTATION_MODAL' })
  }, [])

  const hideConsultationModal = useCallback(() => {
    dispatch({ type: 'HIDE_CONSULTATION_MODAL' })
  }, [])

  const resetChat = useCallback(() => {
    dispatch({ type: 'RESET_CHAT' })
  }, [])

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' })
  }, [])

  // Crear el valor del contexto
  const contextValue: ChatbotContextType = {
    state,
    dispatch,
    openChat,
    closeChat,
    addMessage,
    updateConversationData,
    showConsultationModal,
    hideConsultationModal,
    resetChat,
    clearMessages,
    // Funciones del AI SDK
    input,
    handleInputChange,
    handleSubmit: handleSubmitWithIntent, // Usar la versión con detección de intenciones
    reload,
    // Funciones de análisis
    analyzeMessageForConsultation,
    extractConversationData,
    // Nuevas funciones del sistema de intenciones
    detectIntent,
    getConversationFlow,
    generateFollowUpQuestions,
    processUserResponse
  }

  return contextValue
}

// Hook para usar el contexto del chatbot
export const useChatbotContext = () => {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    throw new Error('useChatbotContext debe ser usado dentro de un ChatbotProvider')
  }
  return context
}

// Exportar el contexto para el provider
export { ChatbotContext } 