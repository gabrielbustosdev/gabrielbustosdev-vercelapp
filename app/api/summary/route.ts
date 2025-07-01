import { NextRequest, NextResponse } from 'next/server';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

export const runtime = 'edge';

const systemPrompt = `Eres un asistente experto en análisis de necesidades de clientes para equipos comerciales y de soporte. Tu tarea es leer la conversación entre un usuario y un asistente virtual, y generar un resumen profesional, claro y detallado de la necesidad principal del usuario. El resumen debe:
- Incluir todos los detalles relevantes mencionados por el usuario.
- Ser útil para que un equipo comercial o de soporte pueda entender rápidamente el contexto y la urgencia.
- Ser objetivo, sin inventar información ni agregar opiniones.
- Ser conciso, pero no omitir detalles importantes.
- Si hay información clave faltante, indícalo al final del resumen.
`;

const MODEL = 'deepseek/deepseek-r1-0528-qwen3-8b:free';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Faltan los mensajes.' }, { status: 400 });
    }
    for (const msg of messages) {
      if (typeof msg !== 'object' || !msg.role || !msg.content) {
        return NextResponse.json({ error: 'Formato de mensaje inválido.' }, { status: 400 });
      }
    }

    const apiKey = process.env.OPENROUTER_API_KEY_SUMMARY;
    if (!apiKey) {
      throw new Error('Falta la variable de entorno OPENROUTER_API_KEY_SUMMARY');
    }

    // Crear instancia del modelo con la API key específica
    const openrouter = createOpenRouter({ apiKey });
    const summaryModel = openrouter(MODEL);

    // Construir el prompt de usuario con la conversación
    const conversation = messages.map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`).join('\n');
    const userPrompt = `A continuación tienes una conversación entre un usuario y un asistente virtual. Resume la necesidad principal del usuario, incluyendo todos los detalles relevantes.\n\nConversación:\n${conversation}\n\nResumen:`;

    // Llamar al modelo usando generateText
    const result = await generateText({
      model: summaryModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      maxTokens: 1500,
      temperature: 0.3,
    });

    const summary = result.text || '';
    return NextResponse.json({ summary });
  } catch (error: unknown) {
    let message = 'Error interno';
    if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
      message = (error as { message: string }).message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 