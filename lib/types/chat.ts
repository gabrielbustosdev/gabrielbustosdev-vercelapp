// lib/types/chat.ts
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

export interface ConversationContext {
  sessionId: string
  userId?: string
  messages: ChatMessage[]
  extractedData: {
    interests: string[]
    painPoints: string[]
    technicalLevel: 'beginner' | 'intermediate' | 'advanced'
    projectType?: string
    budget?: string
    timeline?: string
    requirements?: string
  }
  conversationSummary: string
  lastActivity: Date
  metadata: Record<string, unknown>
}

export interface ChatState {
  isOpen: boolean
  isLoading: boolean
  error: string | null
  currentConversation: ConversationContext | null
  conversationHistory: ConversationContext[]
  settings: {
    enableContextExtraction: boolean
    maxContextLength: number
    enableConversationMemory: boolean
  }
}

export interface ChatAction {
  type: string
  payload?: unknown
}

export type ChatReducer = (state: ChatState, action: ChatAction) => ChatState

// Tipos para el sistema de contexto evolutivo
export interface ContextEntry {
  id?: string
  type: 'user_info' | 'project_info' | 'technical_info' | 'business_context'
  content: string
  confidence: number
  timestamp: Date
  source?: 'explicit' | 'extracted' | 'inferred'
  relevance?: number
}

export interface EvolutiveContext {
  sessionId: string
  entries: ContextEntry[]
  summary: string
  lastUpdated: Date
  version: number
}

// Tipos para análisis de intención
export interface IntentAnalysis {
  primaryIntent: string
  confidence: number
  entities: {
    projectType?: string
    budget?: string
    timeline?: string
    urgency?: 'low' | 'medium' | 'high'
    technicalLevel?: 'beginner' | 'intermediate' | 'advanced'
  }
  suggestedActions: string[]
  nextBestQuestions: string[]
} 