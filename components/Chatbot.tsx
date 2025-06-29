"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Bot, User, Send, Loader2, AlertCircle, Shield, Brain } from "lucide-react"
import ChatConsultationModal from "./ChatConsultationModal"
import GuardrailsDisplay from "./GuardrailsDisplay"
import { ConversationProgress } from "./ConversationProgress"
import { InformationSummary } from "./InformationSummary"
import { ConfirmationDialog } from "./ConfirmationDialog"
import { PersonalizationDisplay } from "./PersonalizationDisplay"
import { useChatbot } from "../hooks/use-chatbot-unified"
import { usePersonalization } from "../hooks/use-personalization"
import { ConversationIntent, ConversationFlow, MissingInfoTracker, FollowUpQuestion, ConversationData } from "../hooks/types"
import { NaturalConversationEngine } from "../hooks/natural-conversation-engine"

interface ChatBotProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
  currentIntent?: ConversationIntent | null
  conversationFlow?: ConversationFlow | null
  missingInfo?: MissingInfoTracker
  followUpQuestions?: FollowUpQuestion[]
  onFollowUpQuestionClick?: (question: FollowUpQuestion) => void
}

export default function ChatBot({ 
  isOpen, 
  onClose, 
  onOpen,
  currentIntent,
  conversationFlow,
  missingInfo,
  followUpQuestions = [],
  onFollowUpQuestionClick
}: ChatBotProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showGuardrails, setShowGuardrails] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showPersonalization, setShowPersonalization] = useState(false)
  const [pendingConsultation, setPendingConsultation] = useState(false)
  
  const {
    state,
    input,
    handleInputChange,
    handleSubmit,
    showConsultationModal,
    hideConsultationModal,
    clearMessages,
    updateConversationData,
    updateNaturalConversation,
    setConfirmationState
  } = useChatbot()

  // Hook de personalización
  const {
    clientPersonality,
    serviceContext,
    conversationMemory,
    currentTone,
    analyzeConversation,
    resetPersonalization
  } = usePersonalization()

  const { messages, loading, modals, conversationData, naturalConversation } = state
  const { isLoading, error } = loading
  const { showConsultationModal: isModalOpen } = modals

  // Modo admin para mostrar paneles ocultos (Ctrl+M)
  const [isAdminMode, setIsAdminMode] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Analizar conversación para personalización cuando cambian los mensajes
  useEffect(() => {
    if (messages.length > 1) {
      analyzeConversation(messages, conversationData)
    }
  }, [messages, conversationData, analyzeConversation])

  // Efecto para manejar teclas de acceso rápido
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'm') {
        setIsAdminMode((prev: boolean) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cuando el modelo indique que es momento de agendar, mostrar el resumen antes de abrir el modal
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.content.includes('[AUTO_OPEN_CONSULTATION]')) {
        setShowSummary(true);
        setPendingConsultation(true);
      }
    }
  }, [messages]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!input.trim()) return

    // Crear intención por defecto si no existe
    const defaultIntent: ConversationIntent = {
      type: 'general_information',
      confidence: 0.5,
      keywords: [],
      context: {},
      timestamp: new Date()
    }

    // Procesar con motor de conversación natural SOLO para extraer datos y determinar contexto
    const naturalResponse = NaturalConversationEngine.processUserMessage(
      input,
      naturalConversation,
      defaultIntent,
      clientPersonality,
      serviceContext,
      conversationMemory
    )

    // Actualizar estado natural correctamente con datos extraídos (en segundo plano)
    updateNaturalConversation({
      currentStep: naturalResponse.nextStep,
      collectedData: naturalResponse.extractedData || {},
      lastUserMessage: input,
      isWaitingForConfirmation: false,
      consultationStage: naturalResponse.context === 'discovery' ? 'discovery' :
                        naturalResponse.context === 'technical_analysis' ? 'technical_analysis' :
                        naturalResponse.context === 'value_proposal' ? 'value_proposal' : 'idle'
    })

    // Actualizar datos de conversación si hay información extraída (en segundo plano)
    if (naturalResponse.extractedData && Object.keys(naturalResponse.extractedData).length > 0) {
      updateConversationData(naturalResponse.extractedData)
    }

    // Verificar si debe abrirse el modal de consulta automáticamente (en segundo plano)
    if (naturalResponse.message.includes('[AUTO_OPEN_CONSULTATION]')) {
      setTimeout(() => {
        showConsultationModal()
      }, 1000)
    }

    // SIEMPRE usar AI SDK para la respuesta al usuario (unificar interfaz)
    handleSubmit(e)
  }

  const handleConfirmInformation = () => {
    setConfirmationState({ isWaitingForConfirmation: false })
    showConsultationModal()
  }

  const handleConfirmSummary = (data: Partial<ConversationData>) => {
    updateConversationData(data);
    setShowSummary(false);
    setPendingConsultation(false);
    updateNaturalConversation({ consultationStage: 'agendado' });
    showConsultationModal();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderMessage = (message: { role: string; content: string; id: string }) => {
    const isUser = message.role === "user"
    const content = message.content.replace('[AUTO_OPEN_CONSULTATION]', '')

    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser 
              ? "bg-blue-500" 
              : "bg-gradient-to-r from-slate-600 to-zinc-600"
          }`}>
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>
          <div className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? "bg-blue-500 text-white" 
              : "bg-white/10 text-gray-100 border border-white/10"
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-line">{content}</p>
            <p className={`text-xs mt-2 ${isUser ? "text-blue-100" : "text-gray-400"}`}>
              {formatTime(new Date())}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderFollowUpQuestions = () => {
    if (!followUpQuestions || followUpQuestions.length === 0) return null

    return (
      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-300 mb-2">Preguntas sugeridas:</h4>
        <div className="space-y-2">
          {followUpQuestions.map((question) => (
            <button
              key={question.id}
              onClick={() => onFollowUpQuestionClick?.(question)}
              className="block w-full text-left p-2 text-sm text-gray-200 hover:bg-blue-500/20 rounded transition-colors duration-200"
            >
              {question.question}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderConversationFlow = () => {
    if (!conversationFlow || !missingInfo) return null

    const missingFields = Object.entries(missingInfo)
      .filter(([, isMissing]) => isMissing)
      .map(([field]) => field)

    if (missingFields.length === 0) return null

    return (
      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <h4 className="text-sm font-medium text-yellow-300 mb-2">Información faltante:</h4>
        <div className="text-xs text-yellow-200">
          {missingFields.map((field) => (
            <div key={field} className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              <span className="capitalize">{field}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const handleClearChat = () => {
    clearMessages()
    updateNaturalConversation({
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
    })
    setShowProgress(false)
    setShowSummary(false)
    setConfirmationState({ isWaitingForConfirmation: false })
    resetPersonalization()
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onOpen}
          className="group relative bg-gradient-to-r from-blue-500 to-slate-600 hover:from-blue-600 hover:to-slate-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse"
          aria-label="Abrir chat con IA"
        >
          <Bot className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Habla con mi IA
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
        <div className="absolute inset-4 md:inset-8 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-slate-600/10">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-slate-600 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold">Asistente IA de Gabriel</h3>
                <p className="text-gray-400 text-sm">En línea</p>
                {currentIntent && (
                  <p className="text-xs text-blue-300">
                    Intención: {currentIntent.type} ({Math.round(currentIntent.confidence * 100)}%)
                  </p>
                )}
                {clientPersonality && (
                  <p className="text-xs text-purple-300">
                    Tono: {currentTone} | Cliente: {clientPersonality.type}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPersonalization(!showPersonalization)}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                title="Mostrar personalización"
              >
                <Brain className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowGuardrails(!showGuardrails)}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                title="Mostrar guardrails"
              >
                <Shield className="w-5 h-5" />
              </button>
              <button
                onClick={handleClearChat}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                title="Limpiar chat"
              >
                <AlertCircle className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                title="Cerrar chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Panel lateral con información */}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col">
              {/* Área de mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    {renderMessage(message)}
                  </div>
                ))}
                
                {isAdminMode && renderFollowUpQuestions()}
                {isAdminMode && renderConversationFlow()}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2 bg-white/10 rounded-2xl px-4 py-3">
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                      <span className="text-sm text-gray-400">Pensando...</span>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-red-400">Error: {error}</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input y validación */}
              <div className="p-4 border-t border-white/10">
                <form onSubmit={onSubmit} className="space-y-2">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Escribe tu mensaje..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Panel lateral derecho */}
            {isAdminMode && (
              <div className="w-80 bg-slate-800/50 border-l border-white/10 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {/* Indicador de etapa actual */}
                  <div className="p-3 rounded bg-blue-900/40 border border-blue-500/20 mb-2">
                    <span className="text-xs text-blue-300 font-semibold">Etapa actual:</span>
                    <span className="ml-2 text-sm text-white font-bold">
                      {(() => {
                        switch (naturalConversation.consultationStage) {
                          case 'discovery': return 'Descubrimiento';
                          case 'technical_analysis': return 'Análisis técnico';
                          case 'value_proposal': return 'Propuesta de valor';
                          case 'idle': return 'Inicio';
                          default: return naturalConversation.consultationStage;
                        }
                      })()}
                    </span>
                  </div>
                  {/* Resto del panel admin */}
                  <PersonalizationDisplay
                    personality={clientPersonality}
                    serviceContext={serviceContext}
                    conversationMemory={conversationMemory}
                    isVisible={showPersonalization}
                    onToggle={() => setShowPersonalization(!showPersonalization)}
                  />
                  {showProgress && (
                    <ConversationProgress
                      collectedData={naturalConversation.collectedData}
                      requiredFields={naturalConversation.requiredFields}
                    />
                  )}
                  {showSummary && (
                    <InformationSummary
                      collectedData={naturalConversation.collectedData}
                      onConfirm={handleConfirmSummary}
                      isEditable={true}
                    />
                  )}
                  {showGuardrails && <GuardrailsDisplay />}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ConfirmationDialog
        collectedData={naturalConversation.collectedData}
        isOpen={state.confirmation.isWaitingForConfirmation}
        onConfirm={handleConfirmInformation}
        onEdit={() => setConfirmationState({ isWaitingForConfirmation: false })}
        onCancel={() => setConfirmationState({ isWaitingForConfirmation: false })}
        title="Confirmar información recopilada"
        confirmText="Agendar consulta"
        editText="Editar información"
        cancelText="Cancelar"
      />

      {/* Modal de consulta solo si no hay resumen pendiente */}
      <ChatConsultationModal
        isOpen={isModalOpen && !pendingConsultation}
        onClose={hideConsultationModal}
        conversationData={conversationData}
      />
    </>
  )
}