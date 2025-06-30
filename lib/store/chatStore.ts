import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  ChatState, 
  ConversationContext, 
  ChatMessage,
  EvolutiveContext,
  ContextEntry,
  IntentAnalysis 
} from '@/lib/types/chat'

interface ChatStore extends ChatState {
  // Actions
  openChat: () => void
  closeChat: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Conversation management
  startNewConversation: (sessionId: string) => void
  addMessage: (message: ChatMessage) => void
  updateConversationContext: (updates: Partial<ConversationContext>) => void
  saveConversation: () => void
  loadConversation: (sessionId: string) => void
  
  // Context evolution
  addContextEntry: (entry: ContextEntry) => void
  updateEvolutiveContext: () => void
  getEvolutiveContext: () => EvolutiveContext | null
  
  // Intent analysis
  updateIntentAnalysis: (analysis: IntentAnalysis) => void
  
  // Settings
  updateSettings: (settings: Partial<ChatState['settings']>) => void
  
  // Utilities
  clearConversation: () => void
  exportConversation: (sessionId: string) => string
}

const initialState: ChatState = {
  isOpen: false,
  isLoading: false,
  error: null,
  currentConversation: null,
  conversationHistory: [],
  settings: {
    enableContextExtraction: true,
    maxContextLength: 2000,
    enableConversationMemory: true
  }
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Basic actions
      openChat: () => set({ isOpen: true }),
      closeChat: () => set({ isOpen: false }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),

      // Conversation management
      startNewConversation: (sessionId: string) => {
        const newConversation: ConversationContext = {
          sessionId,
          messages: [],
          extractedData: {
            interests: [],
            painPoints: [],
            technicalLevel: 'beginner'
          },
          conversationSummary: '',
          lastActivity: new Date(),
          metadata: {
            source: 'chat'
          }
        }
        
        set({
          currentConversation: newConversation,
          error: null
        })
      },

      addMessage: (message: ChatMessage) => {
        const { currentConversation } = get()
        if (!currentConversation) return

        const updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, message],
          lastActivity: new Date()
        }

        set({ currentConversation: updatedConversation })
      },

      updateConversationContext: (updates: Partial<ConversationContext>) => {
        const { currentConversation } = get()
        if (!currentConversation) return

        const updatedConversation = {
          ...currentConversation,
          ...updates,
          lastActivity: new Date()
        }

        set({ currentConversation: updatedConversation })
      },

      saveConversation: () => {
        const { currentConversation, conversationHistory } = get()
        if (!currentConversation) return

        const existingIndex = conversationHistory.findIndex(
          (conv: ConversationContext) => conv.sessionId === currentConversation.sessionId
        )

        let updatedHistory = [...conversationHistory]
        
        if (existingIndex >= 0) {
          updatedHistory[existingIndex] = currentConversation
        } else {
          updatedHistory.push(currentConversation)
        }

        // Mantener solo las últimas 10 conversaciones
        if (updatedHistory.length > 10) {
          updatedHistory = updatedHistory.slice(-10)
        }

        set({ conversationHistory: updatedHistory })
      },

      loadConversation: (sessionId: string) => {
        const { conversationHistory } = get()
        const conversation = conversationHistory.find((conv: ConversationContext) => conv.sessionId === sessionId)
        
        if (conversation) {
          set({ currentConversation: conversation })
        }
      },

      // Context evolution
      addContextEntry: (entry: ContextEntry) => {
        const { currentConversation } = get()
        if (!currentConversation) return

        // Aquí implementarías la lógica para agregar entradas al contexto evolutivo
        // Por ahora, actualizamos los datos extraídos
        const updatedData = {
          ...currentConversation.extractedData,
          [entry.type]: entry.content
        }

        get().updateConversationContext({
          extractedData: updatedData
        })
      },

      updateEvolutiveContext: () => {
        // Implementar actualización del contexto evolutivo
        // Esto podría incluir persistencia en localStorage o base de datos
      },

      getEvolutiveContext: () => {
        // Implementar obtención del contexto evolutivo
        return null
      },

      // Intent analysis
      updateIntentAnalysis: (analysis: IntentAnalysis) => {
        const { currentConversation } = get()
        if (!currentConversation) return

        // Actualizar el último mensaje con el análisis de intención
        const messages = [...currentConversation.messages]
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1]
          lastMessage.metadata = {
            ...lastMessage.metadata,
            intent: analysis.primaryIntent,
            confidence: analysis.confidence
          }
        }

        get().updateConversationContext({ messages })
      },

      // Settings
      updateSettings: (newSettings: Partial<ChatState['settings']>) => {
        const { settings } = get()
        set({
          settings: { ...settings, ...newSettings }
        })
      },

      // Utilities
      clearConversation: () => {
        set({
          currentConversation: null,
          error: null
        })
      },

      exportConversation: (sessionId: string) => {
        const { conversationHistory } = get()
        const conversation = conversationHistory.find((conv: ConversationContext) => conv.sessionId === sessionId)
        
        if (!conversation) return ''
        
        return JSON.stringify(conversation, null, 2)
      }
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        conversationHistory: state.conversationHistory,
        settings: state.settings
      })
    }
  )
) 