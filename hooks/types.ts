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
  // Nuevos campos para el sistema de intenciones
  currentIntent: ConversationIntent | null
  conversationFlow: ConversationFlow | null
  missingInfo: MissingInfoTracker
  followUpQuestions: FollowUpQuestion[]
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
  // Nuevas acciones para el sistema de intenciones
  | { type: 'SET_CURRENT_INTENT'; payload: ConversationIntent }
  | { type: 'SET_CONVERSATION_FLOW'; payload: ConversationFlow }
  | { type: 'UPDATE_MISSING_INFO'; payload: Partial<MissingInfoTracker> }
  | { type: 'ADD_FOLLOW_UP_QUESTION'; payload: FollowUpQuestion }
  | { type: 'REMOVE_FOLLOW_UP_QUESTION'; payload: string }
  | { type: 'CLEAR_FOLLOW_UP_QUESTIONS' }

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
  // Nuevas funciones para el sistema de intenciones
  detectIntent: (message: string) => ConversationIntent
  getConversationFlow: (intent: ConversationIntent) => ConversationFlow | null
  generateFollowUpQuestions: (missingInfo: MissingInfoTracker) => FollowUpQuestion[]
  processUserResponse: (message: string, currentFlow: ConversationFlow) => void
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

// ===== NUEVOS TIPOS PARA EL SISTEMA DE INTENCIONES =====

// Tipos de intenciones de conversación
export type IntentType = 
  | 'greeting'
  | 'service_inquiry'
  | 'project_quote'
  | 'consultation_request'
  | 'technical_question'
  | 'pricing_inquiry'
  | 'portfolio_request'
  | 'general_information'
  | 'complaint'
  | 'goodbye'

// Intención de conversación detectada
export interface ConversationIntent {
  type: IntentType
  confidence: number
  keywords: string[]
  context: Record<string, any>
  timestamp: Date
}

// Estados de un flujo conversacional
export type FlowState = 
  | 'initial'
  | 'collecting_name'
  | 'collecting_email'
  | 'collecting_project_type'
  | 'collecting_requirements'
  | 'collecting_budget'
  | 'collecting_timeline'
  | 'confirming_details'
  | 'suggesting_consultation'
  | 'completed'

// Flujo conversacional
export interface ConversationFlow {
  intent: ConversationIntent
  currentState: FlowState
  requiredInfo: RequiredInfo[]
  collectedInfo: Partial<ConversationData>
  nextSteps: FlowStep[]
  isComplete: boolean
}

// Información requerida para cada flujo
export interface RequiredInfo {
  field: keyof ConversationData
  label: string
  description: string
  isRequired: boolean
  validationRules?: string[]
  followUpQuestions?: string[]
}

// Paso del flujo conversacional
export interface FlowStep {
  id: string
  state: FlowState
  action: 'collect' | 'confirm' | 'suggest' | 'redirect'
  message: string
  validation?: (value: any) => boolean
  nextState?: FlowState
}

// Rastreador de información faltante
export interface MissingInfoTracker {
  name: boolean
  email: boolean
  projectType: boolean
  requirements: boolean
  budget: boolean
  timeline: boolean
}

// Pregunta de seguimiento
export interface FollowUpQuestion {
  id: string
  question: string
  field: keyof ConversationData
  priority: 'high' | 'medium' | 'low'
  context: string
  suggestedResponses?: string[]
}

// Configuración de flujos por tipo de servicio
export interface ServiceFlowConfig {
  serviceType: string
  requiredFields: (keyof ConversationData)[]
  optionalFields: (keyof ConversationData)[]
  flowSteps: FlowStep[]
  followUpQuestions: FollowUpQuestion[]
  completionCriteria: (data: Partial<ConversationData>) => boolean
} 