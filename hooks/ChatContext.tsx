"use client"
import React, { createContext, useContext, useState, ReactNode } from "react";

// Definimos la estructura de un mensaje de chat
export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

// Definimos la interfaz del contexto
interface ChatContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  messages: ChatMessage[];
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen((prev) => !prev);

  // Agrega un mensaje al historial
  const addMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setMessages((prev) => [
      ...prev,
      {
        ...msg,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      },
    ]);
  };

  // Limpia el historial de mensajes
  const clearMessages = () => setMessages([]);

  return (
    <ChatContext.Provider value={{ isOpen, openChat, closeChat, toggleChat, messages, addMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook para consumir el contexto
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext debe usarse dentro de un ChatProvider");
  }
  return context;
}; 