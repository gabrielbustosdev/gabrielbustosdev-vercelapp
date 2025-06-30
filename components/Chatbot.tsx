"use client"

import { useRef, useEffect, useState } from "react"
import { useChat } from "ai/react"
import { Send, X, Bot, User, Sparkles } from "lucide-react"
import { useChatStore } from "@/lib/store/chatStore"
import { useContextEvolution } from "@/lib/hooks/useContextEvolution"
import ChatConsultationModal from "./ChatConsultationModal"

interface ChatBotProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

export default function ChatBot({ isOpen, onClose, onOpen }: ChatBotProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showConsultationModal, setShowConsultationModal] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  // Usar el store centralizado
  const {
    isOpen: isChatOpen,
    isLoading,
    error,
    currentConversation,
    openChat,
    closeChat,
    setLoading,
    setError,
    startNewConversation,
    saveConversation,
    clearConversation
  } = useChatStore()

  // Usar el contexto evolutivo
  const { processMessage, shouldSuggestConsultation } = useContextEvolution()

  // Inicializar conversación cuando se abre el chat
  useEffect(() => {
    if (isOpen && !currentConversation) {
      startNewConversation(sessionId)
    }
  }, [isOpen, currentConversation, startNewConversation, sessionId])

  // Usar el hook useChat del AI SDK con contexto evolutivo
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading: aiLoading, 
    error: aiError, 
    reload
  } = useChat({
    api: "/api/chat",
    body: {
      conversationContext: currentConversation
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "¡Hola! Soy el asistente de IA de Gabriel Bustos. Puedo ayudarte con información sobre servicios de desarrollo web, integración de IA, consultoría técnica y más. ¿En qué puedo ayudarte hoy?",
      },
    ],
    onError: (error) => {
      console.error('Chat error:', error)
      setError(error.message)
    },
    onFinish: (message) => {
      // Analizar el mensaje del asistente para detectar oportunidades de consulta
      analyzeMessageForConsultation(message.content)
      
      // Guardar conversación
      saveConversation()
    }
  })

  // Sincronizar estado del store con el chat
  useEffect(() => {
    if (isOpen !== isChatOpen) {
      if (isOpen) {
        openChat()
      } else {
        closeChat()
      }
    }
  }, [isOpen, isChatOpen, openChat, closeChat])

  // Sincronizar loading state
  useEffect(() => {
    setLoading(aiLoading)
  }, [aiLoading, setLoading])

  // Sincronizar error state
  useEffect(() => {
    if (aiError) {
      setError(aiError.message)
    }
  }, [aiError, setError])

  // Función para analizar mensajes y detectar oportunidades de consulta
  const analyzeMessageForConsultation = (content: string) => {
    const lowerContent = content.toLowerCase()
    
    // Detectar si el asistente sugiere abrir automáticamente la consulta
    if (lowerContent.includes('[auto_open_consultation]')) {
      setTimeout(() => {
        setShowConsultationModal(true)
      }, 1000)
      return
    }
    
    // Verificar si hay suficiente contexto para sugerir consulta
    if (shouldSuggestConsultation()) {
      // Extraer información de la conversación y abrir modal automáticamente
      setTimeout(() => {
        setShowConsultationModal(true)
      }, 2000)
    }
  }

  // Función para manejar el envío de mensajes con contexto evolutivo
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!input.trim()) return

    // Procesar mensaje con contexto evolutivo
    if (currentConversation) {
      processMessage(input)
    }

    // Enviar mensaje al chat
    handleSubmit(e)
  }

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

  const handleClearChat = () => {
    clearConversation()
    window.location.reload()
  }

  const openConsultationModal = () => {
    setShowConsultationModal(true)
  }

  const closeConsultationModal = () => {
    setShowConsultationModal(false)
  }

  // Obtener datos de la conversación para el modal
  const getConversationData = () => {
    if (!currentConversation) return {}
    
    return {
      projectType: currentConversation.extractedData.projectType || "",
      requirements: currentConversation.extractedData.requirements || "",
      budget: currentConversation.extractedData.budget || "",
      timeline: currentConversation.extractedData.timeline || ""
    }
  }

  // No mostrar el widget si el chat ya está abierto
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
          
          {/* Header */}
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
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Indicador de contexto evolutivo */}
              {currentConversation && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 rounded-lg">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-blue-300">IA Contextual</span>
                </div>
              )}
              
              {/* Botón de Consulta */}
              <button
                onClick={openConsultationModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                aria-label="Agendar consulta"
                title="Agendar consulta"
              >
                <Sparkles className="w-5 h-5" />
              </button>
              
              {messages.length > 1 && (
                <button
                  onClick={handleClearChat}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                  aria-label="Limpiar chat"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200" aria-label="Minimizar chat">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200" aria-label="Cerrar chat">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {renderMessage(message)}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-600 to-zinc-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div 
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div 
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error handling */}
            {error && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-red-900/50 border border-red-500 text-red-400 rounded-2xl px-4 py-3">
                    <p className="text-sm">Lo siento, hubo un error. Por favor, inténtalo de nuevo.</p>
                    <button
                      onClick={() => reload()}
                      className="text-red-300 hover:text-red-100 text-xs underline mt-1"
                    >
                      Reintentar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-slate-800/50">
            <form onSubmit={onSubmit} className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Escribe tu mensaje..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-12"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 bg-gradient-to-r from-blue-500 to-slate-600 hover:from-blue-600 hover:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center justify-center"
                aria-label="Enviar mensaje"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de Consulta */}
      <ChatConsultationModal
        isOpen={showConsultationModal}
        onClose={closeConsultationModal}
        conversationData={getConversationData()}
      />
    </>
  )
}