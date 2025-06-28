import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, createConsultationEmailTemplate, createClientConfirmationTemplate } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, phone, projectType, preferredDate, preferredTime, message } = body

    // Validación básica
    if (!name || !email || !projectType || !preferredDate || !preferredTime) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 })
    }

    // Email para ti (admin)
    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: `Nueva Consulta Agendada - ${name}`,
      html: createConsultationEmailTemplate({
        name,
        email,
        company,
        phone,
        projectType,
        preferredDate,
        preferredTime,
        message,
      }),
    })

    // Email de confirmación para el cliente
    await sendEmail({
      to: email,
      subject: "Confirmación de Consulta - Gabriel Bustos",
      html: createClientConfirmationTemplate({
        name,
        preferredDate,
        preferredTime,
        projectType,
      }),
    })

    return NextResponse.json({ message: "Consulta agendada exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("Error al agendar consulta:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
