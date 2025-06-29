# Chatbot Hooks - Documentación

## Descripción

Esta carpeta contiene la nueva arquitectura del chatbot reestructurada con hooks personalizados y useReducer para un mejor manejo del estado.

## Estructura de Archivos

### `types.ts`
Define todas las interfaces y tipos TypeScript para el chatbot:

- **ChatMessage**: Estructura de los mensajes del chat
- **ConversationData**: Datos extraídos de la conversación
- **ConversationState**: Estados de la conversación
- **ChatbotState**: Estado principal del chatbot
- **ChatbotAction**: Acciones para useReducer
- **ChatbotContextType**: Tipo del contexto del chatbot

### `chatbot-reducer.ts`
Contiene el reducer principal que maneja todas las acciones del chatbot:

- **initialState**: Estado inicial del chatbot
- **chatbotReducer**: Función reducer que procesa las acciones
- **updateConversationData**: Función auxiliar para actualizar datos de conversación

### `use-chatbot.ts`
Hook principal que combina useReducer con el AI SDK:

- **useChatbotLogic**: Hook que integra useReducer con useChat del AI SDK
- **useChatbot**: Hook personalizado para usar el contexto del chatbot
- **ChatbotContext**: Contexto de React para el estado global

### `index.ts`
Archivo de índice que exporta todos los hooks y tipos.

## Características Principales

### 1. Estado Centralizado con useReducer
- Manejo predecible del estado
- Acciones tipadas con TypeScript
- Fácil debugging y testing

### 2. Análisis Inteligente de Mensajes
- Extracción automática de datos de conversación
- Detección de oportunidades de consulta
- Apertura automática del modal de consulta

### 3. Integración con AI SDK
- Sincronización automática con useChat
- Manejo de errores centralizado
- Estado de carga unificado

### 4. Tipos TypeScript Completos
- Interfaces bien definidas
- Autocompletado en el IDE
- Detección temprana de errores

## Uso

### En Componentes
```tsx
import { useChatbot } from '@/hooks/use-chatbot'

function MyComponent() {
  const { state, openChat, closeChat } = useChatbot()
  const { isOpen, messages, conversationData } = state
  
  return (
    <button onClick={openChat}>
      Abrir Chat
    </button>
  )
}
```

### En el Provider
```tsx
import { useChatbotLogic, ChatbotContext } from '@/hooks/use-chatbot'

function ChatBotProvider({ children }) {
  const chatbotLogic = useChatbotLogic()
  
  return (
    <ChatbotContext.Provider value={chatbotLogic}>
      {children}
      <ChatBot />
    </ChatbotContext.Provider>
  )
}
```

## Estados de Conversación

- **idle**: Estado inicial
- **greeting**: Saludo inicial
- **collecting_info**: Recolectando información
- **suggesting_consultation**: Sugiriendo consulta
- **consultation_modal_open**: Modal de consulta abierto
- **completed**: Conversación completada

## Acciones Disponibles

- `OPEN_CHAT`: Abrir el chat
- `CLOSE_CHAT`: Cerrar el chat
- `ADD_MESSAGE`: Agregar mensaje
- `SET_MESSAGES`: Establecer mensajes
- `UPDATE_CONVERSATION_DATA`: Actualizar datos de conversación
- `SET_CONVERSATION_STATE`: Cambiar estado de conversación
- `SET_LOADING`: Establecer estado de carga
- `SET_ERROR`: Establecer error
- `SHOW_CONSULTATION_MODAL`: Mostrar modal de consulta
- `HIDE_CONSULTATION_MODAL`: Ocultar modal de consulta
- `RESET_CHAT`: Reiniciar chat
- `CLEAR_MESSAGES`: Limpiar mensajes

## Migración desde la Versión Anterior

1. Reemplazar `useChat` por `useChatbot`
2. Actualizar referencias a `isChatOpen` por `state.isOpen`
3. Usar las nuevas funciones del contexto
4. Actualizar imports en todos los componentes

## Beneficios de la Nueva Arquitectura

- **Mantenibilidad**: Código más organizado y fácil de mantener
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Performance**: Mejor optimización con useReducer
- **Type Safety**: Tipos TypeScript completos
- **Testing**: Fácil testing de acciones y reducers
- **Debugging**: Mejor trazabilidad del estado 