import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      email, 
      company, 
      phone, 
      projectType, 
      budget, 
      timeline, 
      requirements, 
      conversationSummary,
      preferredContactMethod 
    } = body

    // Validación básica
    if (!name || !email || !projectType) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 })
    }

    // Email para ti (admin) - Consulta generada por chat
    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: `Nueva Consulta desde Chat - ${name} - ${projectType}`,
      html: createChatConsultationEmailTemplate({
        name,
        email,
        company,
        phone,
        projectType,
        budget,
        timeline,
        requirements,
        conversationSummary,
        preferredContactMethod
      }),
    })

    // Email de confirmación para el cliente
    await sendEmail({
      to: email,
      subject: "Consulta Recibida - Gabriel Bustos",
      html: createChatClientConfirmationTemplate({
        name,
        projectType,
        requirements
      }),
    })

    return NextResponse.json({ 
      message: "Consulta generada exitosamente",
      success: true 
    }, { status: 200 })
  } catch (error) {
    console.error("Error al generar consulta desde chat:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

function createChatConsultationEmailTemplate(data: {
  name: string
  email: string
  company?: string
  phone?: string
  projectType: string
  budget?: string
  timeline?: string
  requirements?: string
  conversationSummary?: string
  preferredContactMethod?: string
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #64748b 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">¡Nueva Consulta desde Chat!</h1>
        <p style="color: #e2e8f0; margin: 10px 0 0 0;">Generada automáticamente por el asistente IA</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #1e293b; margin-top: 0;">Información del Cliente</h2>
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 5px 0; color: #374151;"><strong>Nombre:</strong> ${data.name}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #3b82f6;">${data.email}</a></p>
          ${data.company ? `<p style="margin: 5px 0; color: #374151;"><strong>Empresa:</strong> ${data.company}</p>` : ''}
          ${data.phone ? `<p style="margin: 5px 0; color: #374151;"><strong>Teléfono:</strong> ${data.phone}</p>` : ''}
        </div>

        <h3 style="color: #1e293b;">Detalles del Proyecto</h3>
        <div style="margin-bottom: 20px;">
          <p style="margin: 5px 0; color: #374151;"><strong>Tipo de Proyecto:</strong> ${data.projectType}</p>
          ${data.budget ? `<p style="margin: 5px 0; color: #374151;"><strong>Presupuesto:</strong> ${data.budget}</p>` : ''}
          ${data.timeline ? `<p style="margin: 5px 0; color: #374151;"><strong>Timeline:</strong> ${data.timeline}</p>` : ''}
          ${data.preferredContactMethod ? `<p style="margin: 5px 0; color: #374151;"><strong>Método de Contacto Preferido:</strong> ${data.preferredContactMethod}</p>` : ''}
        </div>

        ${data.requirements ? `
        <h3 style="color: #1e293b;">Requerimientos Específicos</h3>
        <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; color: #374151; line-height: 1.6;">${data.requirements}</p>
        </div>
        ` : ''}

        ${data.conversationSummary ? `
        <h3 style="color: #1e293b;">Resumen de la Conversación</h3>
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e; line-height: 1.6; font-style: italic;">${data.conversationSummary}</p>
        </div>
        ` : ''}

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #1e293b;"><strong>Acciones Sugeridas:</strong></p>
          <ul style="color: #374151; margin: 10px 0;">
            <li>Contactar al cliente dentro de las próximas 24 horas</li>
            <li>Preparar propuesta personalizada basada en los requerimientos</li>
            <li>Agendar reunión de consultoría si es necesario</li>
          </ul>
        </div>
      </div>
    </div>
  `
}

function createChatClientConfirmationTemplate(data: {
  name: string
  projectType: string
  requirements?: string
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #64748b 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">¡Consulta Recibida!</h1>
        <p style="color: #e2e8f0; margin: 10px 0 0 0;">Gabriel Bustos - Desarrollador Full Stack</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 18px; color: #1e293b;">Hola <strong>${data.name}</strong>,</p>
        
        <p style="line-height: 1.6; color: #374151;">He recibido tu consulta sobre <strong>${data.projectType}</strong> y me pondré en contacto contigo <strong>dentro de las próximas 24 horas</strong>.</p>
        
        ${data.requirements ? `
        <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #374151; line-height: 1.6;"><strong>Requerimientos registrados:</strong><br>${data.requirements}</p>
        </div>
        ` : ''}
        
        <p style="line-height: 1.6; color: #374151;">Mientras tanto, puedes revisar mi <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portafolio" style="color: #3b82f6;">portafolio</a> para conocer más sobre mis proyectos y servicios.</p>
        
        <p style="line-height: 1.6; color: #374151;">¡Gracias por tu interés en trabajar juntos!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #1e293b;"><strong>Gabriel Bustos</strong></p>
          <p style="margin: 5px 0; color: #64748b;">Desarrollador Full Stack & Especialista en IA</p>
        </div>
      </div>
    </div>
  `
} 