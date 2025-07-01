"use client"
import React, { createContext, useContext, useState, ReactNode } from "react";

// Definimos la interfaz del contexto
interface ChatContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  // Aquí puedes agregar más propiedades en el futuro
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen((prev) => !prev);

  return (
    <ChatContext.Provider value={{ isOpen, openChat, closeChat, toggleChat }}>
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