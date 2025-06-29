import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, createQuoteEmailTemplate, createQuoteClientConfirmationTemplate } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, phone, budget, timeline, message, service } = body

    // Validación básica
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 })
    }

    // Email para ti (admin)
    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: `Nueva Solicitud de Cotización - ${name}`,
      html: createQuoteEmailTemplate({
        name,
        email,
        company,
        phone,
        budget,
        timeline,
        message,
        service,
      }),
    })

    // Email de confirmación para el cliente
    await sendEmail({
      to: email,
      subject: "Solicitud de Cotización Recibida - Gabriel Bustos",
      html: createQuoteClientConfirmationTemplate({
        name,
        service,
        budget,
        timeline,
      }),
    })

    return NextResponse.json({ message: "Cotización solicitada exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("Error al enviar cotización:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
} 