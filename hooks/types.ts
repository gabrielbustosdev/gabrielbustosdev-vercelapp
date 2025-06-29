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
  phone?: string
  projectType: string
  requirements: string
  budget: string
  timeline: string
  companyName?: string
  location?: string
  clientName?: string
  clientEmail?: string
  clientPhone?: string
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

// Tipos para el sistema NLP
export interface NLPEntity {
  type: 'name' | 'email' | 'phone' | 'budget' | 'project_type' | 'timeline' | 'company' | 'location'
  value: string
  confidence: number
  startIndex: number
  endIndex: number
}

export interface NLPSentiment {
  score: number
  label: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive'
  emotions: {
    joy: number
    sadness: number
    anger: number
    fear: number
    surprise: number
  }
}

export type ResponseTone = 'professional' | 'empathetic' | 'enthusiastic' | 'casual'
export type UrgencyLevel = 'low' | 'medium' | 'high'

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
  // Nuevos campos para NLP
  responseTone: ResponseTone
  urgencyLevel: UrgencyLevel
  nlpEntities: NLPEntity[]
  lastSentiment: NLPSentiment | null
  // Campos para personalización
  clientPersonality: ClientPersonality | null
  serviceContext: ServiceContext | null
  currentTone: 'formal' | 'casual' | 'technical' | 'empathetic' | 'enthusiastic'
  conversationMemory: ConversationMemory
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
  // Nuevas acciones para NLP
  | { type: 'SET_RESPONSE_TONE'; payload: ResponseTone }
  | { type: 'SET_URGENCY_LEVEL'; payload: UrgencyLevel }
  | { type: 'SET_NLP_ENTITIES'; payload: NLPEntity[] }
  | { type: 'SET_LAST_SENTIMENT'; payload: NLPSentiment }
  // Acciones para personalización
  | { type: 'UPDATE_PERSONALIZATION'; payload: {
      clientPersonality?: ClientPersonality | null
      serviceContext?: ServiceContext | null
      currentTone?: 'formal' | 'casual' | 'technical' | 'empathetic' | 'enthusiastic'
      conversationMemory?: ConversationMemory
    }}

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

// Tipos de intenciones de conversación (actualizado para ser compatible con NLP)
export type IntentType = 
  | 'greeting'
  | 'project_inquiry'
  | 'budget_discussion'
  | 'timeline_discussion'
  | 'service_inquiry'
  | 'contact_request'
  | 'portfolio_request'
  | 'consultation_request'
  | 'pricing_inquiry'
  | 'technical_question'
  | 'general_question'
  | 'goodbye'
  | 'clarification_request'
  | 'confirmation'
  | 'objection'
  | 'urgency_indicator'
  | 'project_quote'
  | 'general_information'
  | 'complaint'

// Intención de conversación detectada (actualizado para incluir NLP)
export interface ConversationIntent {
  type: IntentType
  confidence: number
  keywords: string[]
  context: Record<string, any>
  timestamp: Date
  entities?: NLPEntity[]
  sentiment?: NLPSentiment
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

// Rastreador de información faltante (actualizado)
export interface MissingInfoTracker {
  name: boolean
  email: boolean
  phone: boolean
  projectType: boolean
  requirements: boolean
  budget: boolean
  timeline: boolean
  companyName: boolean
  location: boolean
  project_description: boolean
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
  // Información de personalización
  personalization: PersonalizationState & PersonalizationActions
}

// ===== NUEVOS TIPOS PARA PERSONALIZACIÓN DINÁMICA =====

// Tipos de personalidad del cliente
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

// Contexto del servicio
export interface ServiceContext {
  serviceType: string
  complexity: 'simple' | 'medium' | 'complex'
  timeline: 'urgent' | 'standard' | 'flexible'
  budget: 'low' | 'medium' | 'high'
  technicalRequirements: string[]
  businessGoals: string[]
}

// Memoria de conversación
export interface ConversationMemory {
  keyTopics: string[]
  decisions: string[]
  concerns: string[]
  preferences: string[]
  timeline: Date[]
  budgetMentions: string[]
  technicalQuestions: string[]
}

// Respuesta personalizada
export interface PersonalizedResponse {
  message: string
  tone: 'formal' | 'casual' | 'technical' | 'empathetic' | 'enthusiastic'
  detailLevel: 'high' | 'medium' | 'low'
  includeExamples: boolean
  includeTechnicalDetails: boolean
  focusAreas: string[]
  suggestedActions: string[]
}

// Estado extendido del chatbot con personalización
export interface ExtendedChatbotState extends ChatbotState {
  clientPersonality: ClientPersonality | null
  serviceContext: ServiceContext | null
  conversationMemory: ConversationMemory
  personalizedResponses: PersonalizedResponse[]
  currentTone: 'formal' | 'casual' | 'technical' | 'empathetic' | 'enthusiastic'
}

// Acciones extendidas para personalización
export type ExtendedChatbotAction = ChatbotAction
  | { type: 'SET_CLIENT_PERSONALITY'; payload: ClientPersonality }
  | { type: 'SET_SERVICE_CONTEXT'; payload: ServiceContext }
  | { type: 'UPDATE_CONVERSATION_MEMORY'; payload: Partial<ConversationMemory> }
  | { type: 'SET_PERSONALIZED_RESPONSE'; payload: PersonalizedResponse }
  | { type: 'SET_CURRENT_TONE'; payload: 'formal' | 'casual' | 'technical' | 'empathetic' | 'enthusiastic' }

// Importar tipos de personalización
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

// Estado unificado del chatbot - Única fuente de verdad
export interface UnifiedChatbotState {
  // Estado básico del chat
  isOpen: boolean
  messages: ChatMessage[]
  loading: LoadingState
  
  // Datos de conversación unificados (elimina duplicación entre conversationData y collectedData)
  conversationData: ConversationData
  
  // Estado de conversación unificado
  conversationState: ConversationState
  
  // Intención actual (sincronizada con personalización)
  currentIntent: ConversationIntent | null
  
  // Flujo de conversación
  conversationFlow: ConversationFlow | null
  
  // Información faltante
  missingInfo: MissingInfoTracker
  
  // Preguntas de seguimiento
  followUpQuestions: FollowUpQuestion[]
  
  // Análisis NLP
  responseTone: ResponseTone
  urgencyLevel: UrgencyLevel
  nlpEntities: NLPEntity[]
  lastSentiment: NLPSentiment | null
  
  // Personalización (sincronizada con currentIntent)
  clientPersonality: ClientPersonality | null
  serviceContext: ServiceContext | null
  currentTone: 'formal' | 'casual' | 'technical' | 'empathetic' | 'enthusiastic'
  conversationMemory: ConversationMemory
  
  // Estado del motor de conversación natural (unificado)
  naturalConversation: {
    currentStep: keyof ConversationData | null
    collectedData: Partial<ConversationData>
    requiredFields: (keyof ConversationData)[]
    conversationContext: string[]
    lastUserMessage: string
    isWaitingForConfirmation: boolean
    consultationStage: ConsultationStage
    businessProblem: string
    kpis: string[]
    competitiveContext: string
    technicalConstraints: string[]
    proposedSolutions: string[]
    roiEstimate: string
    implementationRoadmap: string[]
  }
  
  // Estado de modales unificado (elimina conflicto entre showConsultationModal e isWaitingForConfirmation)
  modals: {
    showConsultationModal: boolean
    showConfirmationDialog: boolean
    showProgress: boolean
    showSummary: boolean
    showGuardrails: boolean
    showPersonalization: boolean
  }
  
  // Estado de confirmación unificado
  confirmation: {
    isWaitingForConfirmation: boolean
    confirmationData: Partial<ConversationData>
    confirmationMessage: string
    suggestedActions: string[]
  }
}

export type ConsultationStage = 'idle' | 'discovery' | 'technical_analysis' | 'value_proposal' | 'agendado';

export interface NaturalConversationState {
  currentStep: keyof ConversationData | null
  collectedData: Partial<ConversationData>
  requiredFields: (keyof ConversationData)[]
  conversationContext: string[]
  lastUserMessage: string
  isWaitingForConfirmation: boolean
  consultationStage: ConsultationStage
  businessProblem: string
  kpis: string[]
  competitiveContext: string
  technicalConstraints: string[]
  proposedSolutions: string[]
  roiEstimate: string
  implementationRoadmap: string[]
} 