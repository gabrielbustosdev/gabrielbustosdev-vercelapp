import { useState, useEffect, useCallback } from 'react'
import { 
  ClientPersonality, 
  ServiceContext, 
  ConversationMemory, 
  PersonalizedResponse,
  ChatMessage,
  ConversationData,
  ConversationIntent
} from './types'
import { ClientPersonalityDetector } from './client-personality-detector'
import { PersonalizedResponseEngine } from './personalized-response-engine'

export interface PersonalizationState {
  clientPersonality: ClientPersonality | null
  serviceContext: ServiceContext | null
  conversationMemory: ConversationMemory
  currentTone: 'formal' | 'casual' | 'technical' | 'empathetic' | 'enthusiastic'
  isAnalyzing: boolean
}

export interface PersonalizationActions {
  analyzeConversation: (messages: ChatMessage[], conversationData: Partial<ConversationData>) => void
  generatePersonalizedResponse: (
    intent: ConversationIntent,
    conversationData: Partial<ConversationData>
  ) => PersonalizedResponse
  updateMemory: (newMemory: Partial<ConversationMemory>) => void
  resetPersonalization: () => void
}

export const usePersonalization = (): PersonalizationState & PersonalizationActions => {
  const [state, setState] = useState<PersonalizationState>({
    clientPersonality: null,
    serviceContext: null,
    conversationMemory: {
      keyTopics: [],
      decisions: [],
      concerns: [],
      preferences: [],
      timeline: [],
      budgetMentions: [],
      technicalQuestions: []
    },
    currentTone: 'casual',
    isAnalyzing: false
  })

  const analyzeConversation = useCallback((
    messages: ChatMessage[], 
    conversationData: Partial<ConversationData>
  ) => {
    setState(prev => ({ ...prev, isAnalyzing: true }))

    try {
      // Detectar personalidad del cliente
      const personality = ClientPersonalityDetector.detectPersonality(messages, conversationData)
      
      // Detectar contexto del servicio
      const serviceContext = ClientPersonalityDetector.detectServiceContext(messages)
      
      // Construir memoria de conversación
      const conversationMemory = ClientPersonalityDetector.buildConversationMemory(messages)
      
      // Determinar tono actual
      const currentTone = personality.characteristics.communicationStyle === 'formal' ? 'formal' :
                         personality.characteristics.communicationStyle === 'technical' ? 'technical' :
                         personality.type === 'entrepreneur' ? 'enthusiastic' :
                         personality.type === 'executive' ? 'formal' : 'casual'

      setState(prev => ({
        ...prev,
        clientPersonality: personality,
        serviceContext,
        conversationMemory,
        currentTone,
        isAnalyzing: false
      }))

      console.log('[Personalization] Analysis complete:', {
        personality: personality.type,
        confidence: personality.confidence,
        serviceType: serviceContext.serviceType,
        tone: currentTone
      })

    } catch (error) {
      console.error('[Personalization] Analysis failed:', error)
      setState(prev => ({ ...prev, isAnalyzing: false }))
    }
  }, [])

  const generatePersonalizedResponse = useCallback((
    intent: ConversationIntent,
    conversationData: Partial<ConversationData>
  ): PersonalizedResponse => {
    if (!state.clientPersonality || !state.serviceContext) {
      // Fallback a respuesta genérica
      return {
        message: "¡Gracias por contactarme! ¿En qué puedo ayudarte?",
        tone: 'casual',
        detailLevel: 'medium',
        includeExamples: true,
        includeTechnicalDetails: false,
        focusAreas: ['value', 'quality'],
        suggestedActions: ['Agendar consulta', 'Ver portafolio', 'Más información']
      }
    }

    return PersonalizedResponseEngine.generatePersonalizedResponse(
      intent,
      state.clientPersonality,
      state.serviceContext,
      state.conversationMemory,
      conversationData
    )
  }, [state.clientPersonality, state.serviceContext, state.conversationMemory])

  const updateMemory = useCallback((newMemory: Partial<ConversationMemory>) => {
    setState(prev => ({
      ...prev,
      conversationMemory: {
        ...prev.conversationMemory,
        ...newMemory
      }
    }))
  }, [])

  const resetPersonalization = useCallback(() => {
    setState({
      clientPersonality: null,
      serviceContext: null,
      conversationMemory: {
        keyTopics: [],
        decisions: [],
        concerns: [],
        preferences: [],
        timeline: [],
        budgetMentions: [],
        technicalQuestions: []
      },
      currentTone: 'casual',
      isAnalyzing: false
    })
  }, [])

  return {
    ...state,
    analyzeConversation,
    generatePersonalizedResponse,
    updateMemory,
    resetPersonalization
  }
}

// Hook para obtener información de personalización en tiempo real
export const usePersonalizationInfo = () => {
  const [personality, setPersonality] = useState<ClientPersonality | null>(null)
  const [serviceContext, setServiceContext] = useState<ServiceContext | null>(null)
  const [tone, setTone] = useState<'formal' | 'casual' | 'technical' | 'empathetic' | 'enthusiastic'>('casual')

  const updatePersonality = useCallback((newPersonality: ClientPersonality) => {
    setPersonality(newPersonality)
    setTone(newPersonality.characteristics.communicationStyle === 'formal' ? 'formal' :
           newPersonality.characteristics.communicationStyle === 'technical' ? 'technical' :
           newPersonality.type === 'entrepreneur' ? 'enthusiastic' : 'casual')
  }, [])

  const updateServiceContext = useCallback((newContext: ServiceContext) => {
    setServiceContext(newContext)
  }, [])

  return {
    personality,
    serviceContext,
    tone,
    updatePersonality,
    updateServiceContext
  }
} 