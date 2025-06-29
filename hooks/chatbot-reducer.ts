import { UnifiedChatbotState, ChatbotAction, ConversationData, MissingInfoTracker, ConversationIntent, ClientPersonality, ServiceContext } from './types'

// Estado inicial unificado del chatbot
export const unifiedInitialState: UnifiedChatbotState = {
  isOpen: false,
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content: "¡Hola! Soy Gabriel Bustos, consultor senior en desarrollo web. ¿Qué desafío de negocio está enfrentando que podamos resolver con tecnología?",
      timestamp: new Date()
    }
  ],
  loading: {
    isLoading: false,
    error: null
  },
  conversationData: {
    name: "",
    email: "",
    phone: "",
    projectType: "",
    requirements: "",
    budget: "",
    timeline: "",
    companyName: "",
    location: "",
    clientName: "",
    clientEmail: "",
    clientPhone: ""
  },
  conversationState: 'idle',
  currentIntent: null,
  conversationFlow: null,
  missingInfo: {
    name: true,
    email: true,
    phone: true,
    projectType: true,
    requirements: true,
    budget: true,
    timeline: true,
    companyName: true,
    location: true,
    project_description: true
  },
  followUpQuestions: [],
  responseTone: 'professional',
  urgencyLevel: 'low',
  nlpEntities: [],
  lastSentiment: null,
  clientPersonality: null,
  serviceContext: null,
  currentTone: 'casual',
  conversationMemory: {
    keyTopics: [],
    decisions: [],
    concerns: [],
    preferences: [],
    timeline: [],
    budgetMentions: [],
    technicalQuestions: []
  },
  naturalConversation: {
    currentStep: null,
    collectedData: {},
    requiredFields: ['name', 'email', 'projectType', 'requirements'],
    conversationContext: [],
    lastUserMessage: '',
    isWaitingForConfirmation: false,
    consultationStage: 'idle',
    businessProblem: '',
    kpis: [],
    competitiveContext: '',
    technicalConstraints: [],
    proposedSolutions: [],
    roiEstimate: '',
    implementationRoadmap: []
  },
  modals: {
    showConsultationModal: false,
    showConfirmationDialog: false,
    showProgress: false,
    showSummary: false,
    showGuardrails: false,
    showPersonalization: false
  },
  confirmation: {
    isWaitingForConfirmation: false,
    confirmationData: {},
    confirmationMessage: '',
    suggestedActions: []
  }
}

// Acciones unificadas
export type UnifiedChatbotAction = 
  | { type: 'SET_MESSAGES'; payload: any[] }
  | { type: 'ADD_MESSAGE'; payload: any }
  | { type: 'UPDATE_CONVERSATION_DATA'; payload: Partial<ConversationData> }
  | { type: 'SET_CURRENT_INTENT'; payload: ConversationIntent }
  | { type: 'SET_CLIENT_PERSONALITY'; payload: ClientPersonality }
  | { type: 'SET_SERVICE_CONTEXT'; payload: ServiceContext }
  | { type: 'UPDATE_NATURAL_CONVERSATION'; payload: Partial<UnifiedChatbotState['naturalConversation']> }
  | { type: 'SET_MODAL_STATE'; payload: { modal: keyof UnifiedChatbotState['modals']; isOpen: boolean } }
  | { type: 'SET_CONFIRMATION_STATE'; payload: Partial<UnifiedChatbotState['confirmation']> }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean; error?: string | null } }
  | { type: 'CLEAR_CHAT' }
  | { type: 'OPEN_CHAT' }
  | { type: 'CLOSE_CHAT' }

// Reducer unificado
export const unifiedChatbotReducer = (state: UnifiedChatbotState, action: UnifiedChatbotAction): UnifiedChatbotState => {
  switch (action.type) {
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload
      }
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      }
    
    case 'UPDATE_CONVERSATION_DATA':
      return {
        ...state,
        conversationData: {
          ...state.conversationData,
          ...action.payload
        },
        // Sincronizar con naturalConversation
        naturalConversation: {
          ...state.naturalConversation,
          currentStep: null // Reset step when data is updated
        }
      }
    
    case 'SET_CURRENT_INTENT':
      return {
        ...state,
        currentIntent: action.payload
      }
    
    case 'SET_CLIENT_PERSONALITY':
      return {
        ...state,
        clientPersonality: action.payload,
        // Sincronizar tono con personalidad
        currentTone: action.payload.characteristics.communicationStyle === 'formal' ? 'formal' :
                    action.payload.characteristics.communicationStyle === 'technical' ? 'technical' :
                    action.payload.type === 'entrepreneur' ? 'enthusiastic' : 'casual'
      }
    
    case 'SET_SERVICE_CONTEXT':
      return {
        ...state,
        serviceContext: action.payload
      }
    
    case 'UPDATE_NATURAL_CONVERSATION':
      return {
        ...state,
        naturalConversation: {
          ...state.naturalConversation,
          ...action.payload
        }
      }
    
    case 'SET_MODAL_STATE':
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.modal]: action.payload.isOpen
        }
      }
    
    case 'SET_CONFIRMATION_STATE':
      return {
        ...state,
        confirmation: {
          ...state.confirmation,
          ...action.payload
        }
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          isLoading: action.payload.isLoading,
          error: action.payload.error || null
        }
      }
    
    case 'CLEAR_CHAT':
      return {
        ...unifiedInitialState,
        isOpen: state.isOpen // Mantener estado de apertura
      }
    
    case 'OPEN_CHAT':
      return {
        ...state,
        isOpen: true
      }
    
    case 'CLOSE_CHAT':
      return {
        ...state,
        isOpen: false
      }
    
    default:
      return state
  }
} 