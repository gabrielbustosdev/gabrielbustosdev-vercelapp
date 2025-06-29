"use client"

import React, { ReactNode } from "react"
import ChatBot from "./Chatbot"
import { useChatbotLogic, ChatbotContext } from "../hooks/use-chatbot"
import { FollowUpQuestion } from "../hooks/types"

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
        currentIntent={chatbotLogic.state.currentIntent}
        conversationFlow={chatbotLogic.state.conversationFlow}
        missingInfo={chatbotLogic.state.missingInfo}
        followUpQuestions={chatbotLogic.state.followUpQuestions}
        onFollowUpQuestionClick={(question: FollowUpQuestion) => {
          console.log('Follow-up question clicked:', question)
        }}
      />
    </ChatbotContext.Provider>
  )
} 