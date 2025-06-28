import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, createContactEmailTemplate } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, project, message } = body

    // Validación básica
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 })
    }

    // Email para ti (admin)
    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: `Nuevo Mensaje de Contacto - ${name}`,
      html: createContactEmailTemplate({
        name,
        email,
        company,
        project,
        message,
      }),
    })

    // Email de confirmación para el cliente
    await sendEmail({
      to: email,
      subject: "Mensaje Recibido - Gabriel Bustos",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #64748b 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">¡Gracias por contactarme!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0;">Gabriel Bustos - Desarrollador Full Stack</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; color: #1e293b;">Hola <strong>${name}</strong>,</p>
            
            <p style="line-height: 1.6; color: #374151;">He recibido tu mensaje y me pondré en contacto contigo <strong>dentro de las próximas 24 horas</strong>.</p>
            
            <p style="line-height: 1.6; color: #374151;">Mientras tanto, puedes revisar mi <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portafolio" style="color: #3b82f6;">portafolio</a> para conocer más sobre mis proyectos.</p>
            
            <p style="line-height: 1.6; color: #374151;">¡Gracias por tu interés!</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #1e293b;"><strong>Gabriel Bustos</strong></p>
              <p style="margin: 5px 0; color: #64748b;">Desarrollador Full Stack & Especialista en IA</p>
            </div>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ message: "Mensaje enviado exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("Error al enviar mensaje:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
