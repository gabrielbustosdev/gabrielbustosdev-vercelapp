import { NextRequest, NextResponse } from 'next/server';

// Utilidad para obtener la API key específica para resúmenes
const OPENROUTER_API_KEY_SUMMARY = process.env.OPENROUTER_API_KEY_SUMMARY;

if (!OPENROUTER_API_KEY_SUMMARY) {
  throw new Error('Falta la variable de entorno OPENROUTER_API_KEY_SUMMARY');
}

// Utilidad para llamar a la API de OpenRouter
async function getSummaryFromOpenRouter(messages: { role: string; content: string }[]) {
  const prompt = `A continuación tienes una conversación entre un usuario y un asistente virtual. Resume de forma profesional y detallada la necesidad principal del usuario, incluyendo todos los detalles relevantes mencionados. El resumen debe ser claro, conciso y útil para un equipo comercial o de soporte.

Conversación:
${messages.map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`).join('\n')}

Resumen:`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY_SUMMARY}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-3.5-turbo', // Puedes cambiar el modelo si lo deseas
      messages: [
        { role: 'system', content: 'Eres un asistente que resume necesidades de clientes para equipos comerciales.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error('Error al llamar a OpenRouter');
  }
  const data = await response.json();
  const summary = data.choices?.[0]?.message?.content || '';
  return summary;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Faltan los mensajes.' }, { status: 400 });
    }
    // Validar estructura básica de los mensajes
    for (const msg of messages) {
      if (typeof msg !== 'object' || !msg.role || !msg.content) {
        return NextResponse.json({ error: 'Formato de mensaje inválido.' }, { status: 400 });
      }
    }
    const summary = await getSummaryFromOpenRouter(messages);
    return NextResponse.json({ summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
} 