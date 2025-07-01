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

## Etapa 2 - Generación de resumen en el backend

- Se creó el endpoint `/api/summary` que recibe el historial de mensajes y genera un resumen profesional usando el modelo `deepseek/deepseek-r1-0528-qwen3-8b:free` a través de OpenRouter y el SDK de Vercel AI.
- El resumen es claro, conciso y orientado a equipos comerciales, siguiendo un system prompt optimizado.
- El endpoint es robusto, seguro y cumple con las mejores prácticas de validación y manejo de errores.

---

## Etapa 3 - Botón de respuesta rápida para agendar consulta

- Se implementó una función flexible (`shouldShowScheduleButton`) en `/lib/detect-schedule-intent.ts` para detectar la intención de agendar una reunión/consulta en el mensaje del asistente.
- El botón "Agendar una consulta" aparece solo cuando el asistente invita explícitamente al usuario a agendar.
- El botón se muestra justo debajo del mensaje relevante, manteniendo la UI limpia y contextual.

---

## Etapa 4 - Modal de consulta con resumen automático y formulario conectado

- Se integró el componente `ConsultationModal` con estado local en el `Chatbot`.
- Al hacer clic en el botón de agendar, se solicita el resumen de la conversación a `/api/summary` y se muestra arriba del formulario.
- El resumen solo se solicita al abrir el modal, optimizando recursos y experiencia de usuario.
- El formulario de contacto incluye los campos básicos y, al enviarse, adjunta automáticamente el resumen generado en el payload enviado al backend.
- El flujo es robusto, profesional y preparado para futuras integraciones (por ejemplo, CRM, email, etc.).

---

## Estado final del desarrollo

- El chatbot ahora es capaz de:
  - Persistir la conversación del usuario durante la sesión.
  - Detectar la intención de agendar una consulta y mostrar un botón de acción contextual.
  - Generar un resumen profesional de la necesidad del usuario usando IA en el backend.
  - Mostrar el resumen en un modal junto a un formulario de contacto, y enviar ambos datos al backend.
- Todo el desarrollo sigue buenas prácticas de UX, arquitectura y extensibilidad para futuras mejoras. 