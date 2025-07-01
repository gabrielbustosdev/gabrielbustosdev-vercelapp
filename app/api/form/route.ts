import { NextResponse } from "next/server"
import {
  UnifiedFormSchema,
  UnifiedForm
} from "@/schemas/form-schemas"
import {
  sendEmail,
  createContactEmailTemplate,
  createQuoteEmailTemplate,
  createQuoteClientConfirmationTemplate,
  createConsultationEmailTemplate,
  createClientConfirmationTemplate,
  createContactClientConfirmationTemplate
} from "@/lib/email"
import { withValidation } from "@/middleware/form-middleware"

async function handler(data: UnifiedForm) {
  try {
    switch (data.type) {
      case "contact": {
        await sendEmail({
          to: process.env.ADMIN_EMAIL!,
          subject: `Nuevo Mensaje de Contacto - ${data.name}`,
          html: createContactEmailTemplate(data)
        })
        await sendEmail({
          to: data.email,
          subject: "Mensaje Recibido - Gabriel Bustos",
          html: createContactClientConfirmationTemplate({ name: data.name })
        })
        return NextResponse.json({ message: "Mensaje enviado exitosamente" }, { status: 200 })
      }
      case "quote": {
        await sendEmail({
          to: process.env.ADMIN_EMAIL!,
          subject: `Nueva Solicitud de Cotización - ${data.name}`,
          html: createQuoteEmailTemplate(data)
        })
        await sendEmail({
          to: data.email,
          subject: "Solicitud de Cotización Recibida - Gabriel Bustos",
          html: createQuoteClientConfirmationTemplate(data)
        })
        return NextResponse.json({ message: "Cotización solicitada exitosamente" }, { status: 200 })
      }
      case "consultation": {
        await sendEmail({
          to: process.env.ADMIN_EMAIL!,
          subject: `Nueva Consulta Agendada - ${data.name}`,
          html: createConsultationEmailTemplate(data)
        })
        await sendEmail({
          to: data.email,
          subject: "Confirmación de Consulta - Gabriel Bustos",
          html: createClientConfirmationTemplate(data)
        })
        return NextResponse.json({ message: "Consulta agendada exitosamente" }, { status: 200 })
      }
      default:
        return NextResponse.json({ error: "Tipo de formulario no soportado" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error en /api/form:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export const POST = withValidation(UnifiedFormSchema, handler) 