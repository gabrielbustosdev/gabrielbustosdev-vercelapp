import { NextRequest, NextResponse } from 'next/server'
import { ZodSchema } from 'zod'

/**
 * Middleware de validación para Next.js API Routes
 * @param schema Esquema de Zod para validar el body
 * @param handler Handler a ejecutar si la validación es exitosa
 */
export function withValidation<T>(schema: ZodSchema<T>, handler: (data: T) => Promise<Response>) {
  return async function (req: NextRequest) {
    try {
      const body = await req.json()
      const result = schema.safeParse(body)
      if (!result.success) {
        return NextResponse.json({ error: 'Datos inválidos', details: result.error.errors }, { status: 400 })
      }
      return handler(result.data)
    } catch (error) {
      return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 400 })
    }
  }
}
