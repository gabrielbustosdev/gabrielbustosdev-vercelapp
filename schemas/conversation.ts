// Interfaces para metadatos de conversación

// Estado de la conversación
export type ConversationState = 
  | 'idle'
  | 'greeting'
  | 'collecting_info'
  | 'qualifying_lead'
  | 'presenting_solution'
  | 'addressing_concerns'
  | 'closing'
  | 'follow_up'
  | 'completed'
  | 'abandoned'

// Tipo de conversación
export type ConversationType = 
  | 'inquiry'
  | 'consultation'
  | 'support'
  | 'sales'
  | 'onboarding'
  | 'feedback'

// Sentimiento del usuario
export type UserSentiment = 
  | 'positive'
  | 'neutral'
  | 'negative'
  | 'frustrated'
  | 'excited'
  | 'confused'

// Intención del usuario
export type UserIntent = 
  | 'greeting'
  | 'information_request'
  | 'pricing_inquiry'
  | 'service_inquiry'
  | 'complaint'
  | 'booking'
  | 'support'
  | 'goodbye'
  | 'clarification'
  | 'objection'

// Metadatos del mensaje
export interface MessageMetadata {
  id: string
  timestamp: Date
  role: 'user' | 'assistant' | 'system'
  content: string
  sentiment?: UserSentiment
  intent?: UserIntent
  confidence?: number
  entities?: {
    name?: string
    email?: string
    phone?: string
    company?: string
    budget?: string
    timeline?: string
    projectType?: string
  }
  keywords?: string[]
  responseTime?: number
  userAgent?: string
  ipAddress?: string
  location?: {
    country?: string
    city?: string
    timezone?: string
  }
}

// Análisis de la conversación
export interface ConversationAnalysis {
  overallSentiment: UserSentiment
  dominantIntent: UserIntent
  keyTopics: string[]
  objections?: string[]
  painPoints?: string[]
  interests?: string[]
  urgency: 'low' | 'medium' | 'high' | 'urgent'
  qualification: 'unqualified' | 'qualified' | 'highly_qualified'
  leadScore: number // 0-100
  conversionProbability: number // 0-1
  nextBestAction?: string
  followUpRequired: boolean
  followUpType?: 'email' | 'call' | 'meeting' | 'proposal'
  followUpTiming?: 'immediate' | 'within_hour' | 'within_day' | 'within_week'
}

// Métricas de la conversación
export interface ConversationMetrics {
  totalMessages: number
  userMessages: number
  assistantMessages: number
  averageResponseTime: number
  conversationDuration: number
  messageLength: {
    average: number
    shortest: number
    longest: number
  }
  engagement: {
    clicks: number
    scrolls: number
    timeOnPage: number
    interactions: number
  }
  satisfaction?: {
    score: number // 1-5
    feedback?: string
  }
}

// Contexto de la conversación
export interface ConversationContext {
  sessionId: string
  userId?: string
  clientId?: string
  projectId?: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  deviceInfo: {
    userAgent: string
    platform: string
    browser: string
    screenResolution?: string
    language: string
  }
  location?: {
    country: string
    city?: string
    timezone: string
    ipAddress: string
  }
  previousInteractions?: number
  lastVisit?: Date
  returningUser: boolean
}

// Flujo de la conversación
export interface ConversationFlow {
  currentState: ConversationState
  previousStates: ConversationState[]
  transitions: {
    from: ConversationState
    to: ConversationState
    trigger: string
    timestamp: Date
  }[]
  goals: {
    primary: string
    secondary?: string[]
  }
  blockers?: {
    type: string
    description: string
    resolved: boolean
  }[]
  nextSteps: string[]
}

// Datos extraídos de la conversación
export interface ExtractedData {
  client: {
    name?: string
    email?: string
    phone?: string
    company?: string
    position?: string
    website?: string
  }
  project: {
    type?: string
    description?: string
    requirements?: string
    budget?: string
    timeline?: string
    urgency?: string
  }
  preferences: {
    communicationMethod?: string
    language?: string
    timezone?: string
  }
  concerns?: string[]
  objections?: string[]
  interests?: string[]
  painPoints?: string[]
}

// Conversación completa
export interface CompleteConversation {
  id: string
  sessionId: string
  type: ConversationType
  state: ConversationState
  context: ConversationContext
  messages: MessageMetadata[]
  analysis: ConversationAnalysis
  metrics: ConversationMetrics
  flow: ConversationFlow
  extractedData: ExtractedData
  tags: string[]
  notes?: string[]
  createdAt: Date
  updatedAt: Date
  endedAt?: Date
}

// Configuración de análisis
export interface AnalysisConfig {
  enabled: boolean
  realTime: boolean
  sentimentAnalysis: boolean
  intentRecognition: boolean
  entityExtraction: boolean
  keywordExtraction: boolean
  leadScoring: boolean
  autoTagging: boolean
  language: 'es' | 'en' | 'auto'
  confidenceThreshold: number // 0-1
}

// Resultados de análisis en tiempo real
export interface RealTimeAnalysis {
  messageId: string
  sentiment: UserSentiment
  intent: UserIntent
  confidence: number
  entities: Record<string, any>
  keywords: string[]
  suggestions: string[]
  nextBestAction?: string
  riskScore?: number
  timestamp: Date
}

// Historial de análisis
export interface AnalysisHistory {
  conversationId: string
  analyses: RealTimeAnalysis[]
  summary: {
    averageSentiment: UserSentiment
    dominantIntent: UserIntent
    totalEntities: number
    keyInsights: string[]
  }
  trends: {
    sentimentTrend: 'improving' | 'stable' | 'declining'
    engagementTrend: 'increasing' | 'stable' | 'decreasing'
    conversionProbability: number
  }
}

// Tipos para validación
export type ConversationStatus = 'active' | 'paused' | 'completed' | 'abandoned'
export type AnalysisType = 'sentiment' | 'intent' | 'entity' | 'keyword' | 'lead_score'
export type EntityType = 'person' | 'organization' | 'location' | 'date' | 'money' | 'project' 