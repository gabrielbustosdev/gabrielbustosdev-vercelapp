This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Chatbot Conversacional – Modo Admin

## Experiencia de Usuario
El chatbot está diseñado para ofrecer una experiencia conversacional natural y fluida. El usuario final solo verá el historial de mensajes y el campo de entrada, sin paneles técnicos ni listas de información faltante.

## Modo Admin (Métricas y Personalización)
Las funcionalidades de métricas, personalización y paneles técnicos siguen activas en segundo plano, pero **solo son visibles en modo admin**.

### ¿Cómo activar el modo admin?
- Mientras el chat está abierto, presiona **Ctrl+M** para mostrar u ocultar los paneles de métricas, personalización, progreso e información faltante.
- Esto permite al administrador o desarrollador acceder a información avanzada sin que el usuario final la vea.

### ¿Qué paneles se ocultan al usuario final?
- Preguntas sugeridas
- Información faltante
- Progreso de información
- Panel de personalización

### ¿Qué ve el usuario final?
- Solo la conversación y el input, como en un chat real.

---

> **Nota:** La lógica de personalización y métricas sigue funcionando y recolectando datos en segundo plano, lista para usarse cuando se requiera.
