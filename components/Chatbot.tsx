"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatBotProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

export default function ChatBot({ isOpen, onClose, onOpen }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "¡Hola! Soy el asistente de IA de Gabriel Bustos. Puedo ayudarte con información sobre servicios de desarrollo web, integración de IA, consultoría técnica y más. ¿En qué puedo ayudarte hoy?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simular delay de respuesta de IA
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const lowerMessage = userMessage.toLowerCase()

    // Respuestas contextuales basadas en palabras clave
    if (lowerMessage.includes("precio") || lowerMessage.includes("costo") || lowerMessage.includes("cotización")) {
      return "Los precios varían según el proyecto. Para desarrollo web full stack desde $2,500, integración de IA desde $3,500, y consultoría desde $150/hora. ¿Te gustaría agendar una consulta gratuita para discutir tu proyecto específico?"
    }

    if (
      lowerMessage.includes("servicio") ||
      lowerMessage.includes("qué haces") ||
      lowerMessage.includes("especialidad")
    ) {
      return "Gabriel se especializa en:\n\n🚀 Desarrollo Web Full Stack (Next.js, React, Node.js)\n🤖 Integración de IA y Chatbots\n💡 Consultoría Técnica\n⚡ Automatización de Procesos\n\n¿Hay algún servicio específico que te interese?"
    }

    if (
      lowerMessage.includes("ia") ||
      lowerMessage.includes("inteligencia artificial") ||
      lowerMessage.includes("chatbot")
    ) {
      return "¡Excelente pregunta! Gabriel tiene amplia experiencia en:\n\n• Desarrollo de chatbots personalizados\n• Integración con OpenAI, Claude, y otros LLMs\n• Automatización de procesos con IA\n• Análisis de datos con Machine Learning\n• APIs inteligentes\n\n¿Tienes un proyecto de IA en mente?"
    }

    if (
      lowerMessage.includes("experiencia") ||
      lowerMessage.includes("portfolio") ||
      lowerMessage.includes("proyectos")
    ) {
      return "Gabriel tiene experiencia desarrollando:\n\n📱 E-commerce con AI Chatbot integrado\n📊 Dashboards con predicciones ML\n🏢 Sistemas de gestión empresarial\n🤖 Asistentes virtuales personalizados\n\nPuedes ver más detalles en la sección de Portafolio. ¿Te interesa algún tipo de proyecto similar?"
    }

    if (lowerMessage.includes("contacto") || lowerMessage.includes("reunión") || lowerMessage.includes("consulta")) {
      return "¡Perfecto! Puedes contactar a Gabriel de varias formas:\n\n📧 Email: gabriel@example.com\n📅 Agendar consulta gratuita\n💬 Continuar chateando aquí\n\n¿Prefieres agendar una videollamada o enviar un email con los detalles de tu proyecto?"
    }

    if (lowerMessage.includes("tiempo") || lowerMessage.includes("cuánto tarda") || lowerMessage.includes("duración")) {
      return "Los tiempos de desarrollo dependen del proyecto:\n\n⚡ Landing pages: 1-2 semanas\n🌐 Aplicaciones web: 4-8 semanas\n🤖 Integración de IA: 2-4 semanas\n🏢 Sistemas complejos: 8-16 semanas\n\nSiempre con entregas incrementales y comunicación constante. ¿Qué tipo de proyecto tienes en mente?"
    }

    if (
      lowerMessage.includes("tecnología") ||
      lowerMessage.includes("stack") ||
      lowerMessage.includes("herramientas")
    ) {
      return "Gabriel trabaja con tecnologías modernas:\n\n🎯 Frontend: Next.js, React, TypeScript, Tailwind\n⚙️ Backend: Node.js, Python, PostgreSQL, MongoDB\n🤖 IA: OpenAI, LangChain, TensorFlow, PyTorch\n☁️ Cloud: AWS, Vercel, Docker\n\n¿Hay alguna tecnología específica que necesites para tu proyecto?"
    }

    if (lowerMessage.includes("hola") || lowerMessage.includes("hi") || lowerMessage.includes("buenos")) {
      return "¡Hola! 👋 Es un placer conocerte. Soy el asistente de IA de Gabriel Bustos, especialista en desarrollo web y soluciones de inteligencia artificial. \n\n¿En qué puedo ayudarte hoy? Puedo contarte sobre servicios, proyectos anteriores, precios, o cualquier duda técnica que tengas."
    }

    if (lowerMessage.includes("gracias") || lowerMessage.includes("thank")) {
      return "¡De nada! 😊 Estoy aquí para ayudarte. Si tienes más preguntas sobre desarrollo web, IA, o quieres conocer más sobre los servicios de Gabriel, no dudes en preguntar. \n\n¿Hay algo más en lo que pueda asistirte?"
    }

    // Respuesta por defecto
    return "Como especialista en desarrollo web y IA, Gabriel puede ayudarte con una amplia gama de proyectos tecnológicos. \n\n¿Podrías contarme más detalles sobre lo que necesitas? Por ejemplo:\n• ¿Es un proyecto web, móvil o de IA?\n• ¿Tienes un presupuesto en mente?\n• ¿Cuáles son tus objetivos principales?\n\nAsí podré darte información más específica."
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      const aiResponse = await generateAIResponse(inputMessage)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Lo siento, hubo un error procesando tu mensaje. Por favor intenta nuevamente o contacta directamente a gabriel@example.com",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Widget flotante cuando está cerrado
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onOpen}
          className="group relative bg-gradient-to-r from-blue-500 to-slate-600 hover:from-blue-600 hover:to-slate-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse"
          aria-label="Abrir chat con IA"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>

          {/* Indicador de disponibilidad */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Habla con mi IA
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      </div>
    )
  }

  // Chat completo cuando está abierto
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-4 md:inset-8 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-slate-600/10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-slate-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"></div>
            </div>
            <div>
              <h3 className="text-white font-semibold">Asistente IA de Gabriel</h3>
              <p className="text-gray-400 text-sm">En línea</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
              aria-label="Minimizar chat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
              aria-label="Cerrar chat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user" ? "bg-blue-500" : "bg-gradient-to-r from-slate-600 to-zinc-600"
                  }`}
                >
                  {message.role === "user" ? (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>

                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-gray-100 border border-white/10"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-gray-400"}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-600 to-zinc-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-12"
                disabled={isTyping}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="p-3 bg-gradient-to-r from-blue-500 to-slate-600 hover:from-blue-600 hover:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200"
              aria-label="Enviar mensaje"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setInputMessage("¿Cuáles son tus servicios?")}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-300 transition-colors duration-200"
            >
              Servicios
            </button>
            <button
              onClick={() => setInputMessage("¿Cuánto cuesta un proyecto web?")}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-300 transition-colors duration-200"
            >
              Precios
            </button>
            <button
              onClick={() => setInputMessage("Quiero agendar una consulta")}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-300 transition-colors duration-200"
            >
              Consulta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
