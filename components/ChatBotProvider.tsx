"use client"

import React from 'react'
import ChatBot from './Chatbot'
import { useChatbotLogic, ChatbotContext, ChatbotContextType } from '../hooks/use-chatbot-unified'
import { FollowUpQuestion } from '../hooks/types'

interface ChatBotProviderProps {
  children: React.ReactNode
}

export default function ChatBotProvider({ children }: ChatBotProviderProps) {
  const chatbotLogic = useChatbotLogic()

  return (
    <ChatbotContext.Provider value={chatbotLogic as ChatbotContextType}>
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