"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Bot, User, Send, Loader2, AlertCircle, Shield, Brain } from "lucide-react"
import ChatConsultationModal from "./ChatConsultationModal"
import GuardrailsDisplay from "./GuardrailsDisplay"
import { ConversationProgress } from "./ConversationProgress"
import { InformationSummary } from "./InformationSummary"
import { RealTimeValidation } from "./RealTimeValidation"
import { ConfirmationDialog } from "./ConfirmationDialog"
import { PersonalizationDisplay } from "./PersonalizationDisplay"
import { useChatbot } from "../hooks/use-chatbot"
import { usePersonalization } from "../hooks/use-personalization"
import { ConversationIntent, ConversationFlow, MissingInfoTracker, FollowUpQuestion, ConversationData } from "../hooks/types"
import { NaturalConversationEngine, NaturalConversationState } from "../hooks/natural-conversation-engine"

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
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showPersonalization, setShowPersonalization] = useState(false)
  const [currentStep, setCurrentStep] = useState<keyof ConversationData | null>(null)
  
  const {
    state,
    input,
    handleInputChange,
    handleSubmit,
    showConsultationModal,
    hideConsultationModal,
    clearMessages,
    updateConversationData
  } = useChatbot()

  // Hook de personalización
  const {
    clientPersonality,
    serviceContext,
    conversationMemory,
    currentTone,
    isAnalyzing,
    analyzeConversation,
    resetPersonalization
  } = usePersonalization()

  const { messages, loading, showConsultationModal: isModalOpen, conversationData } = state
  const { isLoading, error } = loading

  // Estado del motor de conversación natural
  const [naturalState, setNaturalState] = useState<NaturalConversationState>({
    currentStep: null,
    collectedData: {},
    requiredFields: ['name', 'email', 'projectType', 'requirements'],
    conversationContext: [],
    lastUserMessage: '',
    isWaitingForConfirmation: false
  })

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

  // Actualizar estado natural cuando cambian los datos de conversación
  useEffect(() => {
    setNaturalState(prev => ({
      ...prev,
      collectedData: conversationData
    }))
  }, [conversationData])

  // Analizar conversación para personalización cuando hay suficientes mensajes
  useEffect(() => {
    if (messages.length >= 2 && !isAnalyzing) {
      analyzeConversation(messages, conversationData)
    }
  }, [messages, conversationData, analyzeConversation, isAnalyzing])

  // Mostrar progreso cuando hay datos recopilados
  useEffect(() => {
    setShowProgress(NaturalConversationEngine.shouldShowProgress(naturalState))
    setShowSummary(Object.keys(naturalState.collectedData).length > 0)
  }, [naturalState])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'm') {
        setIsAdminMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!input.trim()) return

    // Procesar con motor de conversación natural si hay una intención
    if (currentIntent) {
      const naturalResponse = NaturalConversationEngine.processUserMessage(
        input,
        naturalState,
        currentIntent
      )

      // Actualizar estado natural
      setNaturalState(prev => ({
        ...prev,
        currentStep: naturalResponse.nextStep,
        collectedData: { ...prev.collectedData },
        lastUserMessage: input,
        isWaitingForConfirmation: naturalResponse.shouldAskForConfirmation
      }))

      // Si hay información extraída, actualizar datos de conversación
      if (naturalResponse.context) {
        updateConversationData(naturalResponse.context as Partial<ConversationData>)
      }

      // Mostrar confirmación si es necesario
      if (naturalResponse.shouldAskForConfirmation) {
        setShowConfirmation(true)
      }
    }

    handleSubmit(e)
  }

  const handleEditField = (field: keyof ConversationData) => {
    setCurrentStep(field)
    setShowConfirmation(false)
    // Enfocar el input para que el usuario pueda editar
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleConfirmInformation = () => {
    setShowConfirmation(false)
    showConsultationModal()
  }

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
    setNaturalState({
      currentStep: null,
      collectedData: {},
      requiredFields: ['name', 'email', 'projectType', 'requirements'],
      conversationContext: [],
      lastUserMessage: '',
      isWaitingForConfirmation: false
    })
    setShowProgress(false)
    setShowSummary(false)
    setShowConfirmation(false)
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
                      placeholder={currentStep ? `Ingresa tu ${String(currentStep)}...` : "Escribe tu mensaje..."}
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
                  
                  {/* Validación en tiempo real */}
                  {currentStep && (
                    <RealTimeValidation
                      field={currentStep}
                      value={input}
                      onValidationChange={() => {}}
                    />
                  )}
                </form>
              </div>
            </div>

            {/* Panel lateral derecho */}
            {isAdminMode && (
              <div className="w-80 bg-slate-800/50 border-l border-white/10 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <PersonalizationDisplay
                    personality={clientPersonality}
                    serviceContext={serviceContext}
                    conversationMemory={conversationMemory}
                    isVisible={showPersonalization}
                    onToggle={() => setShowPersonalization(!showPersonalization)}
                  />
                  {showProgress && (
                    <ConversationProgress
                      collectedData={naturalState.collectedData}
                      requiredFields={naturalState.requiredFields}
                      currentStep={currentStep || undefined}
                    />
                  )}
                  {showSummary && (
                    <InformationSummary
                      collectedData={naturalState.collectedData}
                      onEdit={handleEditField}
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
        collectedData={naturalState.collectedData}
        isOpen={showConfirmation}
        onConfirm={handleConfirmInformation}
        onEdit={() => setShowConfirmation(false)}
        onCancel={() => setShowConfirmation(false)}
        title="Confirmar información recopilada"
        confirmText="Agendar consulta"
        editText="Editar información"
        cancelText="Cancelar"
      />

      {/* Modal de consulta */}
      <ChatConsultationModal
        isOpen={isModalOpen}
        onClose={hideConsultationModal}
        conversationData={conversationData}
      />
    </>
  )
}