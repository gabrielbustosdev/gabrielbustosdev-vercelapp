import { useCallback, useMemo } from 'react'
import { contextEvolutionService } from '@/lib/services/contextEvolution'
import { useChatStore } from '@/lib/store/chatStore'
import { 
  ContextEntry, 
  IntentAnalysis
} from '@/lib/types/chat'

export const useContextEvolution = () => {
  const { 
    currentConversation, 
    addContextEntry, 
    updateIntentAnalysis
  } = useChatStore()

  // Memoizar el sessionId para evitar recreaciones
  const sessionId = useMemo(() => currentConversation?.sessionId, [currentConversation?.sessionId])

  /**
   * Analiza un mensaje del usuario y extrae contexto
   */
  const analyzeMessage = useCallback((message: string): ContextEntry[] => {
    if (!currentConversation) return []
    
    return contextEvolutionService.analyzeUserMessage(message)
  }, [currentConversation])

  /**
   * Actualiza el contexto con nuevas entradas
   */
  const updateContext = useCallback((entries: ContextEntry[]) => {
    if (!currentConversation || !sessionId) return

    // Actualizar el contexto evolutivo
    contextEvolutionService.updateContext(sessionId, entries)
    
    // Actualizar el store local
    entries.forEach(entry => addContextEntry(entry))
  }, [currentConversation, sessionId, addContextEntry])

  /**
   * Analiza la intención del usuario
   */
  const analyzeIntent = useCallback((message: string): IntentAnalysis => {
    if (!currentConversation) {
      return {
        primaryIntent: 'general_inquiry',
        confidence: 0,
        entities: {},
        suggestedActions: [],
        nextBestQuestions: []
      }
    }
    
    return contextEvolutionService.analyzeIntent(message)
  }, [currentConversation])

  /**
   * Procesa un mensaje completo (análisis + actualización de contexto)
   */
  const processMessage = useCallback((message: string) => {
    if (!currentConversation) return

    // Analizar el mensaje
    const contextEntries = analyzeMessage(message)
    const intentAnalysis = analyzeIntent(message)

    // Actualizar contexto
    updateContext(contextEntries)
    updateIntentAnalysis(intentAnalysis)

    return {
      contextEntries,
      intentAnalysis
    }
  }, [currentConversation, analyzeMessage, analyzeIntent, updateContext, updateIntentAnalysis])

  /**
   * Genera un prompt mejorado con contexto evolutivo
   */
  const generateEnhancedPrompt = useCallback((basePrompt: string): string => {
    if (!currentConversation) return basePrompt

    return contextEvolutionService.generateEnhancedPrompt(
      '', // userMessage - no necesario para el prompt base
      currentConversation,
      basePrompt
    )
  }, [currentConversation])

  /**
   * Obtiene el resumen del contexto actual
   */
  const getContextSummary = useCallback(() => {
    if (!currentConversation || !sessionId) return ''

    const context = contextEvolutionService.getContext(sessionId)
    return context?.summary || ''
  }, [currentConversation, sessionId])

  /**
   * Obtiene el perfil del usuario basado en el contexto
   */
  const getUserProfile = useCallback(() => {
    if (!currentConversation || !sessionId) return {}

    const context = contextEvolutionService.getContext(sessionId)
    if (!context) return {}

    const userInfo = context.entries.filter(entry => entry.type === 'user_info')
    const profile: Record<string, string> = {}

    userInfo.forEach(entry => {
      const [key, value] = entry.content.split(': ')
      if (key && value) {
        profile[key.toLowerCase()] = value
      }
    })

    return profile
  }, [currentConversation, sessionId])

  /**
   * Verifica si hay suficiente contexto para sugerir una consulta
   */
  const shouldSuggestConsultation = useCallback(() => {
    if (!currentConversation) return false

    const { extractedData } = currentConversation
    const hasProjectType = !!extractedData.projectType
    const hasRequirements = !!extractedData.requirements
    const hasBudget = !!extractedData.budget
    const hasTimeline = !!extractedData.timeline

    // Sugerir consulta si hay al menos 3 de 4 elementos clave
    const keyElements = [hasProjectType, hasRequirements, hasBudget, hasTimeline]
    return keyElements.filter(Boolean).length >= 3
  }, [currentConversation])

  /**
   * Obtiene estadísticas del contexto
   */
  const getContextStats = useCallback(() => {
    if (!currentConversation || !sessionId) return null

    const context = contextEvolutionService.getContext(sessionId)
    if (!context) return null

    const stats = {
      totalEntries: context.entries.length,
      entriesByType: context.entries.reduce((acc, entry) => {
        acc[entry.type] = (acc[entry.type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      averageConfidence: context.entries.reduce((sum, entry) => sum + entry.confidence, 0) / context.entries.length,
      lastUpdated: context.lastUpdated,
      version: context.version
    }

    return stats
  }, [currentConversation, sessionId])

  // Memoizar valores computados
  const contextSummary = useMemo(() => getContextSummary(), [getContextSummary])
  const userProfile = useMemo(() => getUserProfile(), [getUserProfile])
  const shouldConsultation = useMemo(() => shouldSuggestConsultation(), [shouldSuggestConsultation])
  const contextStats = useMemo(() => getContextStats(), [getContextStats])

  return {
    // Funciones principales
    analyzeMessage,
    updateContext,
    analyzeIntent,
    processMessage,
    generateEnhancedPrompt,
    
    // Funciones de consulta
    getContextSummary: () => contextSummary,
    getUserProfile: () => userProfile,
    shouldSuggestConsultation: () => shouldConsultation,
    getContextStats: () => contextStats,
    
    // Estado actual
    hasContext: !!currentConversation && contextSummary.length > 0,
    contextVersion: contextStats?.version || 0
  }
} 