# CHANGELOG

## Etapa 1 - Persistencia de la conversación

### [Fecha: 2025-07-01]

---

### Resumen de Cambios

1. **Persistencia de Conversación en el Frontend**
   - Se amplió el `ChatContext` para almacenar mensajes de chat, con métodos para agregar y limpiar mensajes.
   - Se definió el tipo `ChatMessage` para estandarizar los mensajes.

2. **Integración en el Chatbot**
   - El componente `Chatbot.tsx` ahora guarda cada mensaje relevante en el contexto global.
   - Se muestra en consola la lista de mensajes persistidos para fines de desarrollo.
   - No se modifica la UI, manteniendo la experiencia minimalista para el usuario.

3. **Buenas Prácticas**
   - Solo se guardan mensajes de roles `user` y `assistant`.
   - El mensaje de bienvenida no se guarda en el historial persistente.
   - El sistema es fácilmente extensible para futuras mejoras (persistencia en backend, generación de resumen, etc.).

---

### Añadido
- Se amplió el `ChatContext` para almacenar el historial de mensajes del chat, incluyendo métodos para agregar y limpiar mensajes.
- Se definió el tipo `ChatMessage` para estandarizar la estructura de los mensajes.
- Se expusieron los métodos y el array de mensajes en el contexto global para su uso en toda la aplicación.

### Integración en el Chatbot
- El componente `Chatbot.tsx` ahora persiste los mensajes relevantes (usuario y asistente) en el contexto global.
- Se implementó un sistema robusto para evitar duplicados y bucles:
  - Solo se persiste el **último mensaje** del usuario si su contenido y rol no existen ya en el contexto.
  - Solo se persiste el **último mensaje** del asistente cuando el estado es `'ready'` y su contenido y rol no existen ya en el contexto.
  - No se usan los ids de `useChat` para deduplicar, solo el contenido y el rol.
- Se mantiene la UI minimalista, mostrando el historial persistido únicamente en la consola para fines de desarrollo.

### Correcciones
- Se corrigieron problemas de duplicación y bucles infinitos en la persistencia de mensajes.
- Se evitó la persistencia de mensajes incompletos o en streaming.

### Notas
- Esta etapa sienta las bases para futuras mejoras como la generación de resúmenes, persistencia en backend y extracción de insights de la conversación. 