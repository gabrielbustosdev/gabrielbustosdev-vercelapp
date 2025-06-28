"use client"

import { useState } from "react"
import ChatBot from "./Chatbot"

export default function ChatBotProvider() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <ChatBot 
      isOpen={isChatOpen} 
      onOpen={() => setIsChatOpen(true)} 
      onClose={() => setIsChatOpen(false)} 
    />
  )
} 