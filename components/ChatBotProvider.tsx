"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import ChatBot from "./Chatbot"

// Contexto para el estado global del chat
interface ChatContextType {
  isChatOpen: boolean
  openChat: () => void
  closeChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Hook personalizado para usar el contexto del chat
export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat debe ser usado dentro de un ChatBotProvider')
  }
  return context
}

interface ChatBotProviderProps {
  children: ReactNode
}

export default function ChatBotProvider({ children }: ChatBotProviderProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const openChat = () => {
    setIsChatOpen(true)
  }

  const closeChat = () => {
    setIsChatOpen(false)
  }

  const contextValue: ChatContextType = {
    isChatOpen,
    openChat,
    closeChat
  }

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
      <ChatBot 
        isOpen={isChatOpen} 
        onOpen={openChat} 
        onClose={closeChat} 
      />
    </ChatContext.Provider>
  )
} 