"use client"

import { ReactNode } from "react"
import ChatBot from "./Chatbot"
import { useChatStore } from "@/lib/store/chatStore"

interface ChatBotProviderProps {
  children: ReactNode
}

export default function ChatBotProvider({ children }: ChatBotProviderProps) {
  const { isOpen, openChat, closeChat } = useChatStore()

  return (
    <>
      {children}
      <ChatBot 
        isOpen={isOpen} 
        onOpen={openChat} 
        onClose={closeChat} 
      />
    </>
  )
} 