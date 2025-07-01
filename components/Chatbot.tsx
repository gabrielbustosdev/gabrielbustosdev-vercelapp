"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Bot, User, Send, Loader2, AlertCircle, Calendar } from "lucide-react"

interface ChatBotProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Usar el hook useChat del AI SDK
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading, 
    error, 
    reload
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "¡Hola! Soy el asistente de IA de Gabriel Bustos. Puedo ayudarte con información sobre servicios de desarrollo web, integración de IA, consultoría técnica y más. ¿En qué puedo ayudarte hoy?",
      },
    ],
    onError: (error) => {
      console.error('Chat error:', error)
    },
    onFinish: (message) => {
      // Analizar el mensaje del asistente para detectar oportunidades de consulta
      analyzeMessageForConsultation(message.content)
    }
  })

  // Función para analizar mensajes y detectar oportunidades de consulta
  const analyzeMessageForConsultation = (content: string) => {
    const lowerContent = content.toLowerCase()
    
    // Detectar si el asistente sugiere abrir automáticamente la consulta
    if (lowerContent.includes('[auto_open_consultation]')) {
      // Extraer información de la conversación y abrir modal automáticamente
      extractConversationData()
      setTimeout(() => {
        // Pequeño delay para que el usuario vea la respuesta
      }, 1000)
      return
    }
    
    // Detectar si el usuario mostró interés en servicios
    const hasInterest = lowerContent.includes('interesado') || 
                       lowerContent.includes('me gustaría') || 
                       lowerContent.includes('quiero') ||
                       lowerContent.includes('necesito') ||
                       lowerContent.includes('proyecto')
    
    // Detectar si el asistente sugirió agendar consulta
    const suggestedConsultation = lowerContent.includes('agendar') || 
                                 lowerContent.includes('consulta') || 
                                 lowerContent.includes('contactar')
    
    if (hasInterest || suggestedConsultation) {
      // Extraer información de la conversación
      extractConversationData()
    }
  }

  // Función para extraer datos de la conversación
  const extractConversationData = () => {
    const userMessages = messages.filter(m => m.role === 'user')
    const assistantMessages = messages.filter(m => m.role === 'assistant')
    
    const extractedData = {
      name: "",
      email: "",
      projectType: "",
      requirements: ""
    }

    // Analizar todos los mensajes del usuario para extraer información
    userMessages.forEach(message => {
      const content = message.content.toLowerCase()
      
      // Extraer nombre
      const nameMatch = content.match(/(?:me llamo|soy|mi nombre es)\s+([A-Za-zÁáÉéÍíÓóÚúÑñ\s]+)/i)
      if (nameMatch && !extractedData.name) {
        extractedData.name = nameMatch[1].trim()
      }
      
      // Extraer email
      const emailMatch = content.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
      if (emailMatch && !extractedData.email) {
        extractedData.email = emailMatch[0]
      }
      
      // Extraer tipo de proyecto
      const projectKeywords = {
        'landing page': 'Landing Page',
        'sitio web': 'Landing Page',
        'página web': 'Landing Page',
        'plataforma': 'Plataforma con IA',
        'inteligencia artificial': 'Plataforma con IA',
        'chatbot': 'Plataforma con IA',
        'ia': 'Plataforma con IA',
        'ai': 'Plataforma con IA',
        'rebranding': 'Rebranding',
        'renovar': 'Rebranding',
        'optimizar': 'Rebranding',
        'desarrollo web': 'Desarrollo Web',
        'aplicación': 'Desarrollo Web',
        'app': 'Desarrollo Web',
        'consultoría': 'Consultoría'
      }
      
      for (const [keyword, projectType] of Object.entries(projectKeywords)) {
        if (content.includes(keyword) && !extractedData.projectType) {
          extractedData.projectType = projectType
          break
        }
      }
      

      
      // Extraer requerimientos (último mensaje largo del usuario)
      if (content.length > 30 && !extractedData.requirements) {
        extractedData.requirements = message.content
      }
    })

    // Analizar respuestas del asistente para complementar información
    assistantMessages.forEach(message => {
      const content = message.content.toLowerCase()
      
      // Si el asistente mencionó un tipo de proyecto específico
      if (!extractedData.projectType) {
        const projectKeywords = {
          'landing page': 'Landing Page',
          'plataforma con ia': 'Plataforma con IA',
          'rebranding': 'Rebranding',
          'desarrollo web': 'Desarrollo Web',
          'consultoría': 'Consultoría'
        }
        
        for (const [keyword, projectType] of Object.entries(projectKeywords)) {
          if (content.includes(keyword)) {
            extractedData.projectType = projectType
            break
          }
        }
      }
    })
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(e)
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

  const clearChat = () => {
    // Recargar la página para reiniciar el chat
    window.location.reload()
  }

  const openConsultationModal = () => {
    extractConversationData()
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
              {/* Botón de Consulta */}
              <button
                onClick={openConsultationModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                aria-label="Agendar consulta"
                title="Agendar consulta"
              >
                <Calendar className="w-5 h-5" />
              </button>
              
              {messages.length > 1 && (
                <button
                  onClick={clearChat}
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
                    <AlertCircle className="w-4 h-4 text-white" />
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
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

    </>
  )
}