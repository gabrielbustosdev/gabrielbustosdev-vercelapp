// Tipos para mensajes del chat
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
}

// Tipos para datos de conversación extraídos
export interface ConversationData {
  name: string
  email: string
  projectType: string
  requirements: string
  budget: string
  timeline: string
}

// Estados de conversación
export type ConversationState = 
  | 'idle'
  | 'greeting'
  | 'collecting_info'
  | 'suggesting_consultation'
  | 'consultation_modal_open'
  | 'completed'

// Estados de carga y error
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

// Estado principal del chatbot
export interface ChatbotState {
  isOpen: boolean
  messages: ChatMessage[]
  conversationData: ConversationData
  conversationState: ConversationState
  loading: LoadingState
  showConsultationModal: boolean
}

// Acciones para useReducer
export type ChatbotAction =
  | { type: 'OPEN_CHAT' }
  | { type: 'CLOSE_CHAT' }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'UPDATE_CONVERSATION_DATA'; payload: Partial<ConversationData> }
  | { type: 'SET_CONVERSATION_STATE'; payload: ConversationState }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SHOW_CONSULTATION_MODAL' }
  | { type: 'HIDE_CONSULTATION_MODAL' }
  | { type: 'RESET_CHAT' }
  | { type: 'CLEAR_MESSAGES' }

// Tipos para el contexto
export interface ChatbotContextType {
  state: ChatbotState
  dispatch: React.Dispatch<ChatbotAction>
  openChat: () => void
  closeChat: () => void
  addMessage: (message: ChatMessage) => void
  updateConversationData: (data: Partial<ConversationData>) => void
  showConsultationModal: () => void
  hideConsultationModal: () => void
  resetChat: () => void
  clearMessages: () => void
  // Funciones del AI SDK
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  reload: () => void
  // Funciones de análisis
  analyzeMessageForConsultation: (content: string, allMessages: ChatMessage[]) => MessageAnalysis
  extractConversationData: (messages: ChatMessage[]) => Partial<ConversationData>
}

// Tipos para análisis de mensajes
export interface MessageAnalysis {
  hasInterest: boolean
  suggestedConsultation: boolean
  autoOpenConsultation: boolean
  extractedData: Partial<ConversationData>
}

// Tipos para configuración del chatbot
export interface ChatbotConfig {
  initialMessage: string
  autoOpenKeywords: string[]
  consultationKeywords: string[]
  projectTypeKeywords: Record<string, string>
} 