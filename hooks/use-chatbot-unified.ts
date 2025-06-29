import React, { useReducer, useCallback, useContext, createContext, useRef } from 'react'
import { useChat } from 'ai/react'
import { usePersonalization } from './use-personalization'
import { unifiedChatbotReducer, unifiedInitialState } from './chatbot-reducer'
import { ConversationData, ConversationIntent, ChatMessage, UnifiedChatbotState } from './types'
//import { NaturalConversationEngine } from './natural-conversation-engine'

// Tipo para el contexto del chatbot
export interface ChatbotContextType {
  state: UnifiedChatbotState
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  openChat: () => void
  closeChat: () => void
  clearMessages: () => void
  updateConversationData: (data: Partial<ConversationData>) => void
  setCurrentIntent: (intent: ConversationIntent) => void
  updateNaturalConversation: (data: Partial<UnifiedChatbotState['naturalConversation']>) => void
  setModalState: (modal: keyof UnifiedChatbotState['modals'], isOpen: boolean) => void
  setConfirmationState: (data: Partial<UnifiedChatbotState['confirmation']>) => void
  showConsultationModal: () => void
  hideConsultationModal: () => void
  reload: () => void
}

// Crear el contexto del chatbot
const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

// Hook principal que usa el estado unificado
export const useChatbotLogic = () => {
  const [state, dispatch] = useReducer(unifiedChatbotReducer, unifiedInitialState)

  // Hook de personalización
  const personalization = usePersonalization()

  // Configuración del chatbot
  const chatbotConfig = {
    initialMessage: "¡Hola! Soy Gabriel Bustos, consultor senior en desarrollo web. ¿Qué desafío de negocio está enfrentando que podamos resolver con tecnología?",
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

  // Construir contexto dinámico para el AI SDK
  const buildChatContext = () => {
    const collected = state.conversationData || {}
    const requiredFields = ['name', 'email', 'projectType', 'requirements', 'budget', 'timeline']
    const missingFields = requiredFields.filter(f => !(collected as any)[f])
    const etapa = state.naturalConversation?.consultationStage || 'descubrimiento'
    let contexto = `DATOS RECOLECTADOS:\n`;
    Object.entries(collected).forEach(([k, v]) => {
      if (v) contexto += `- ${k}: ${v}\n`;
    })
    contexto += `CAMPOS FALTANTES:\n`;
    missingFields.forEach(f => {
      contexto += `- ${f}\n`;
    })
    contexto += `ETAPA ACTUAL: ${etapa}`;
    return contexto;
  }

  // Usar el hook useChat del AI SDK
  const { 
    messages: aiMessages, 
    input, 
    handleInputChange, 
    handleSubmit: originalHandleSubmit, 
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
      dispatch({ type: 'SET_LOADING', payload: { isLoading: false, error: error.message } })
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

      // REACTIVADO: Abrir modal automáticamente si se detecta la señal
      if (analysis.autoOpenConsultation || message.content.includes('[AUTO_OPEN_CONSULTATION]')) {
        setTimeout(() => {
          dispatch({ type: 'SET_MODAL_STATE', payload: { modal: 'showConsultationModal', isOpen: true } })
        }, 1000)
      }
    },
    // Enviar contexto dinámico en cada request
    body: { context: buildChatContext() }
  })

  // Sobrescribir handleSubmit para actualizar el contexto antes de cada request
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Actualizar el contexto antes de enviar el mensaje
    // (El hook useChat ya enviará el contexto en body)
    originalHandleSubmit(e)
  }

  // Sincronizar los mensajes del AI SDK con el estado unificado - CORREGIDO: Evitar bucle infinito
  const lastAiMessagesRef = useRef<any[]>([])
  React.useEffect(() => {
    const areMessagesEqual = (a: any[], b: any[]) => {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (a[i].id !== b[i].id || a[i].content !== b[i].content || a[i].role !== b[i].role) return false;
      }
      return true;
    };
    
    const validRoles = ['assistant', 'system', 'user'];
    const filteredAiMessages = aiMessages.filter((msg: any) => validRoles.includes(msg.role)) as ChatMessage[];
    
    // Solo actualizar si los mensajes realmente cambiaron y son diferentes a los últimos procesados
    if (
      filteredAiMessages.length > 0 && 
      !areMessagesEqual(filteredAiMessages, lastAiMessagesRef.current) &&
      !areMessagesEqual(filteredAiMessages, state.messages)
    ) {
      dispatch({ type: 'SET_MESSAGES', payload: filteredAiMessages })
      lastAiMessagesRef.current = filteredAiMessages
    }
  }, [aiMessages]) // Remover state.messages de las dependencias

  // Analizar conversación para personalización - SOLO cuando hay mensaje nuevo del usuario y el resultado cambie
  const lastAnalyzedMessageCount = useRef(0)
  const lastPersonalizationResult = useRef<any>(null)
  React.useEffect(() => {
    // Solo analizar si hay mensajes nuevos del usuario y no se está analizando ya
    const userMessages = state.messages.filter(m => m.role === 'user')
    if (
      userMessages.length > lastAnalyzedMessageCount.current &&
      userMessages.length > 0 &&
      !personalization.isAnalyzing
    ) {
      // Guardar el resultado anterior
      const prevResult = lastPersonalizationResult.current
      personalization.analyzeConversation(state.messages, state.conversationData)
      lastAnalyzedMessageCount.current = userMessages.length
      // Guardar el nuevo resultado para comparación futura
      lastPersonalizationResult.current = {
        clientPersonality: personalization.clientPersonality,
        serviceContext: personalization.serviceContext
      }
    }
  }, [state.messages.length, personalization.isAnalyzing])

  // Sincronizar personalización con el estado unificado (con comparación profunda y useRef)
  const lastPersonalityRef = React.useRef<any>(null)
  const lastServiceContextRef = React.useRef<any>(null)
  React.useEffect(() => {
    const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b)
    if (
      personalization.clientPersonality &&
      !isEqual(personalization.clientPersonality, lastPersonalityRef.current)
    ) {
      dispatch({ type: 'SET_CLIENT_PERSONALITY', payload: personalization.clientPersonality })
      lastPersonalityRef.current = personalization.clientPersonality
    }
    if (
      personalization.serviceContext &&
      !isEqual(personalization.serviceContext, lastServiceContextRef.current)
    ) {
      dispatch({ type: 'SET_SERVICE_CONTEXT', payload: personalization.serviceContext })
      lastServiceContextRef.current = personalization.serviceContext
    }
  }, [personalization.clientPersonality, personalization.serviceContext])

  // Acciones del chatbot
  const openChat = useCallback(() => {
    dispatch({ type: 'OPEN_CHAT' })
  }, [])

  const closeChat = useCallback(() => {
    dispatch({ type: 'CLOSE_CHAT' })
  }, [])

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_CHAT' })
    // Reiniciar datos recolectados y etapa
    dispatch({ type: 'UPDATE_CONVERSATION_DATA', payload: {} })
    dispatch({ type: 'UPDATE_NATURAL_CONVERSATION', payload: { consultationStage: 'idle', collectedData: {} } })
  }, [])

  const updateConversationData = useCallback((data: Partial<ConversationData>) => {
    console.log('[Chatbot] Datos extraídos y guardados en collectedData:', data)
    dispatch({ type: 'UPDATE_CONVERSATION_DATA', payload: data })
  }, [])

  const setCurrentIntent = useCallback((intent: ConversationIntent) => {
    dispatch({ type: 'SET_CURRENT_INTENT', payload: intent })
  }, [])

  const updateNaturalConversation = useCallback((data: Partial<typeof state.naturalConversation>) => {
    dispatch({ type: 'UPDATE_NATURAL_CONVERSATION', payload: data })
  }, [])

  const setModalState = useCallback((modal: keyof typeof state.modals, isOpen: boolean) => {
    dispatch({ type: 'SET_MODAL_STATE', payload: { modal, isOpen } })
  }, [])

  const setConfirmationState = useCallback((data: Partial<typeof state.confirmation>) => {
    dispatch({ type: 'SET_CONFIRMATION_STATE', payload: data })
  }, [])

  const showConsultationModal = useCallback(() => {
    dispatch({ type: 'SET_MODAL_STATE', payload: { modal: 'showConsultationModal', isOpen: true } })
  }, [])

  const hideConsultationModal = useCallback(() => {
    dispatch({ type: 'SET_MODAL_STATE', payload: { modal: 'showConsultationModal', isOpen: false } })
  }, [])

  // Función para analizar mensajes y detectar oportunidades de consulta
  const analyzeMessageForConsultation = (
    content: string, 
    allMessages: ChatMessage[]
  ): { hasInterest: boolean; suggestedConsultation: boolean; autoOpenConsultation: boolean; extractedData: Partial<ConversationData> } => {
    const lowerContent = content.toLowerCase()
    
    const analysis = {
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

  // Función para extraer datos de conversación
  const extractConversationData = (messages: ChatMessage[]): Partial<ConversationData> => {
    const extractedData: Partial<ConversationData> = {}
    
    // Extraer información de los mensajes del usuario
    const userMessages = messages.filter(m => m.role === 'user')
    
    for (const message of userMessages) {
      const lowerMessage = message.content.toLowerCase()
      
      // Extraer nombre
      const nameMatch = message.content.match(/(?:me llamo|soy|mi nombre es)\s+([A-Za-zÁáÉéÍíÓóÚúÑñ\s]+)/i)
      if (nameMatch && !extractedData.name) {
        extractedData.name = nameMatch[1].trim()
      }
      
      // Extraer email
      const emailMatch = message.content.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
      if (emailMatch && !extractedData.email) {
        extractedData.email = emailMatch[0]
      }
      
      // Extraer tipo de proyecto
      for (const [keyword, projectType] of Object.entries(chatbotConfig.projectTypeKeywords)) {
        if (lowerMessage.includes(keyword) && !extractedData.projectType) {
          extractedData.projectType = projectType
          break
        }
      }
      
      // Extraer presupuesto
      const budgetMatch = message.content.match(/(?:presupuesto|budget|inversión)\s*(?:de|es|aproximado)?\s*(\$?\d+(?:\.\d+)?(?:\s*-\s*\$?\d+(?:\.\d+)?)?(?:\s*ars|\s*pesos)?)/i)
      if (budgetMatch && !extractedData.budget) {
        extractedData.budget = budgetMatch[1].trim()
      }
    }
    
    return extractedData
  }

  return {
    state,
    input,
    handleInputChange,
    handleSubmit,
    openChat,
    closeChat,
    clearMessages,
    updateConversationData,
    setCurrentIntent,
    updateNaturalConversation,
    setModalState,
    setConfirmationState,
    showConsultationModal,
    hideConsultationModal,
    reload
  }
}

// Hook para usar el contexto del chatbot
export const useChatbot = () => {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    throw new Error('useChatbot debe ser usado dentro de un ChatbotProvider')
  }
  return context
}

// Exportar el contexto para el provider
export { ChatbotContext } 