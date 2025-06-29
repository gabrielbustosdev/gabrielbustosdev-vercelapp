"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Bot, User, Send, Loader2, AlertCircle, Calendar } from "lucide-react"
import ChatConsultationModal from "./ChatConsultationModal"
import { useChatbot } from "../hooks/use-chatbot"
import { ConversationIntent, ConversationFlow, MissingInfoTracker, FollowUpQuestion } from "../hooks/types"

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
  
  const {
    state,
    input,
    handleInputChange,
    handleSubmit,
    reload,
    showConsultationModal,
    hideConsultationModal,
    clearMessages
  } = useChatbot()

  const { messages, loading, showConsultationModal: isModalOpen, conversationData } = state
  const { isLoading, error } = loading

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
  }

  const handleOpenConsultationModal = () => {
    showConsultationModal()
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
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleOpenConsultationModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                aria-label="Agendar consulta"
                title="Agendar consulta"
              >
                <Calendar className="w-5 h-5" />
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

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {renderMessage(message)}
              </div>
            ))}

            {renderConversationFlow()}

            {renderFollowUpQuestions()}

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

            {error && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                    <p className="text-sm text-red-300">Error: {error}</p>
                    <button
                      onClick={reload}
                      className="mt-2 text-xs text-red-200 hover:text-red-100 underline"
                    >
                      Reintentar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10">
            <form onSubmit={onSubmit} className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-500 to-slate-600 hover:from-blue-600 hover:to-slate-700 text-white p-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

      <ChatConsultationModal
        isOpen={isModalOpen}
        onClose={hideConsultationModal}
        conversationData={conversationData}
      />
    </>
  )
}