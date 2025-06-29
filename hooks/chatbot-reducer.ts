import { ChatbotState, ChatbotAction, ConversationData } from './types'

// Estado inicial del chatbot
export const initialState: ChatbotState = {
  isOpen: false,
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content: "¡Hola! Soy el asistente de IA de Gabriel Bustos. Puedo ayudarte con información sobre servicios de desarrollo web, integración de IA, consultoría técnica y más. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date()
    }
  ],
  conversationData: {
    name: "",
    email: "",
    projectType: "",
    requirements: "",
    budget: "",
    timeline: ""
  },
  conversationState: 'idle',
  loading: {
    isLoading: false,
    error: null
  },
  showConsultationModal: false
}

// Función para actualizar datos de conversación de forma inmutable
const updateConversationData = (
  currentData: ConversationData, 
  updates: Partial<ConversationData>
): ConversationData => {
  return { ...currentData, ...updates }
}

// Reducer principal del chatbot
export function chatbotReducer(state: ChatbotState, action: ChatbotAction): ChatbotState {
  switch (action.type) {
    case 'OPEN_CHAT':
      return {
        ...state,
        isOpen: true,
        conversationState: state.conversationState === 'idle' ? 'greeting' : state.conversationState
      }

    case 'CLOSE_CHAT':
      return {
        ...state,
        isOpen: false
      }

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, { ...action.payload, timestamp: new Date() }]
      }

    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload
      }

    case 'UPDATE_CONVERSATION_DATA':
      return {
        ...state,
        conversationData: updateConversationData(state.conversationData, action.payload)
      }

    case 'SET_CONVERSATION_STATE':
      return {
        ...state,
        conversationState: action.payload
      }

    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          isLoading: action.payload
        }
      }

    case 'SET_ERROR':
      return {
        ...state,
        loading: {
          ...state.loading,
          error: action.payload
        }
      }

    case 'SHOW_CONSULTATION_MODAL':
      return {
        ...state,
        showConsultationModal: true,
        conversationState: 'consultation_modal_open'
      }

    case 'HIDE_CONSULTATION_MODAL':
      return {
        ...state,
        showConsultationModal: false
      }

    case 'RESET_CHAT':
      return {
        ...initialState,
        isOpen: state.isOpen // Mantener el estado de apertura
      }

    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [initialState.messages[0]], // Mantener solo el mensaje de bienvenida
        conversationData: initialState.conversationData,
        conversationState: 'idle'
      }

    default:
      return state
  }
} 