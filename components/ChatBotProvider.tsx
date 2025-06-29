"use client"

import React, { ReactNode } from "react"
import ChatBot from "./Chatbot"
import { useChatbotLogic, ChatbotContext } from "../hooks/use-chatbot"

interface ChatBotProviderProps {
  children: ReactNode
}

export default function ChatBotProvider({ children }: ChatBotProviderProps) {
  const chatbotLogic = useChatbotLogic()

  return (
    <ChatbotContext.Provider value={chatbotLogic}>
      {children}
      <ChatBot 
        isOpen={chatbotLogic.state.isOpen} 
        onOpen={chatbotLogic.openChat} 
        onClose={chatbotLogic.closeChat} 
      />
    </ChatbotContext.Provider>
  )
} 