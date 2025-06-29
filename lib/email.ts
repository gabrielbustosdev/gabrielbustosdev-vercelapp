import nodemailer from "nodemailer"
import { google } from "googleapis"

const OAuth2 = google.auth.OAuth2

// Crear cliente OAuth2
const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground",
  )

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  })

  try {
    // Obtener access token
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.error("Error obteniendo access token:", err)
          reject(err)
        }
        resolve(token)
      })
    })

    // Crear transporter con OAuth2
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken as string,
      },
    })

    return transporter
  } catch (error) {
    console.error("Error creando transporter:", error)
    throw error
  }
}

// Función para enviar email
export const sendEmail = async (mailOptions: {
  to: string
  subject: string
  html: string
  from?: string
}) => {
  try {
    const transporter = await createTransporter()

    const emailOptions = {
      from: mailOptions.from || process.env.GMAIL_USER,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
    }

    const result = await transporter.sendMail(emailOptions)
    console.log("Email enviado exitosamente:", result.messageId)
    return result
  } catch (error) {
    console.error("Error enviando email:", error)
    throw error
  }
}

// Templates de email
export const createConsultationEmailTemplate = (data: {
  name: string
  email: string
  company?: string
  phone?: string
  projectType: string
  preferredDate: string
  preferredTime: string
  message?: string
}) => {
  const formattedDate = new Date(data.preferredDate).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #64748b 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Nueva Consulta Agendada</h1>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin-top: 0; color: #1e293b;">👤 Información del Cliente</h3>
          <p style="margin: 8px 0;"><strong>Nombre:</strong> ${data.name}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #3b82f6;">${data.email}</a></p>
          ${data.company ? `<p style="margin: 8px 0;"><strong>Empresa:</strong> ${data.company}</p>` : ""}
          ${data.phone ? `<p style="margin: 8px 0;"><strong>Teléfono:</strong> <a href="tel:${data.phone}" style="color: #3b82f6;">${data.phone}</a></p>` : ""}
        </div>

        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="margin-top: 0; color: #1e293b;">📅 Detalles de la Consulta</h3>
          <p style="margin: 8px 0;"><strong>Tipo de Proyecto:</strong> <span style="background: #dbeafe; padding: 4px 8px; border-radius: 4px; color: #1e40af;">${data.projectType}</span></p>
          <p style="margin: 8px 0;"><strong>Fecha Preferida:</strong> ${formattedDate}</p>
          <p style="margin: 8px 0;"><strong>Hora Preferida:</strong> ${data.preferredTime}</p>
        </div>

        ${
          data.message
            ? `
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin-top: 0; color: #1e293b;">💬 Mensaje</h3>
          <p style="line-height: 1.6; color: #374151;">${data.message}</p>
        </div>
        `
            : ""
        }

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">Responde a este email o contacta directamente al cliente para confirmar la consulta.</p>
        </div>
      </div>
    </div>
  `
}

export const createClientConfirmationTemplate = (data: {
  name: string
  preferredDate: string
  preferredTime: string
  projectType: string
}) => {
  const formattedDate = new Date(data.preferredDate).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #64748b 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">¡Consulta Recibida!</h1>
        <p style="color: #e2e8f0; margin: 10px 0 0 0;">Gabriel Bustos - Desarrollador Full Stack</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 18px; color: #1e293b;">Hola <strong>${data.name}</strong>,</p>
        
        <p style="line-height: 1.6; color: #374151;">¡Gracias por tu interés en trabajar conmigo! He recibido tu solicitud de consulta y me pondré en contacto contigo <strong>dentro de las próximas 24 horas</strong> para confirmar los detalles.</p>
        
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin-top: 0; color: #1e293b;">📋 Resumen de tu Consulta</h3>
          <p style="margin: 8px 0;"><strong>📅 Fecha Preferida:</strong> ${formattedDate}</p>
          <p style="margin: 8px 0;"><strong>🕐 Hora Preferida:</strong> ${data.preferredTime}</p>
          <p style="margin: 8px 0;"><strong>🚀 Tipo de Proyecto:</strong> ${data.projectType}</p>
        </div>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
          <h3 style="margin-top: 0; color: #1e293b;">🎯 Mientras tanto...</h3>
          <p style="margin: 8px 0;">• Revisa mi <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portafolio" style="color: #3b82f6; text-decoration: none;">portafolio</a> para conocer proyectos similares</p>
          <p style="margin: 8px 0;">• Prepara cualquier material o referencia que tengas del proyecto</p>
          <p style="margin: 8px 0;">• Piensa en tu presupuesto y timeline ideal</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portafolio" style="background: linear-gradient(135deg, #3b82f6 0%, #64748b 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Ver mi Portafolio</a>
        </div>
        
        <p style="line-height: 1.6; color: #374151;">¡Estoy emocionado de conocer más sobre tu proyecto y cómo puedo ayudarte a llevarlo al siguiente nivel!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #1e293b;"><strong>Gabriel Bustos</strong></p>
          <p style="margin: 5px 0; color: #64748b;">Desarrollador Full Stack & Especialista en IA</p>
          <p style="margin: 5px 0;"><a href="mailto:${process.env.GMAIL_USER}" style="color: #3b82f6;">${process.env.GMAIL_USER}</a></p>
        </div>
      </div>
    </div>
  `
}

export const createContactEmailTemplate = (data: {
  name: string
  email: string
  company?: string
  project?: string
  message: string
}) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #64748b 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Nuevo Mensaje de Contacto</h1>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin-top: 0; color: #1e293b;">👤 Información del Contacto</h3>
          <p style="margin: 8px 0;"><strong>Nombre:</strong> ${data.name}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #3b82f6;">${data.email}</a></p>
          ${data.company ? `<p style="margin: 8px 0;"><strong>Empresa:</strong> ${data.company}</p>` : ""}
          ${data.project ? `<p style="margin: 8px 0;"><strong>Tipo de Proyecto:</strong> <span style="background: #dbeafe; padding: 4px 8px; border-radius: 4px; color: #1e40af;">${data.project}</span></p>` : ""}
        </div>

        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin-top: 0; color: #1e293b;">💬 Mensaje</h3>
          <p style="line-height: 1.6; color: #374151; white-space: pre-wrap;">${data.message}</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">Responde a este email para contactar directamente al cliente.</p>
        </div>
      </div>
    </div>
  `
}

export const createQuoteEmailTemplate = (data: {
  name: string
  email: string
  company?: string
  phone?: string
  budget?: string
  timeline?: string
  message: string
  service?: {
    title: string
    description: string
    price: string
  }
}) => {
  const budgetLabels: { [key: string]: string } = {
    "50k-100k": "$50.000 - $100.000 ARS",
    "100k-200k": "$100.000 - $200.000 ARS",
    "200k-500k": "$200.000 - $500.000 ARS",
    "500k+": "Más de $500.000 ARS",
    "to-discuss": "A discutir",
  }

  const timelineLabels: { [key: string]: string } = {
    "1-2-weeks": "1-2 semanas",
    "1-month": "1 mes",
    "2-3-months": "2-3 meses",
    "3+months": "Más de 3 meses",
    "flexible": "Flexible",
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #64748b 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Nueva Solicitud de Cotización</h1>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin-top: 0; color: #1e293b;">👤 Información del Cliente</h3>
          <p style="margin: 8px 0;"><strong>Nombre:</strong> ${data.name}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #3b82f6;">${data.email}</a></p>
          ${data.company ? `<p style="margin: 8px 0;"><strong>Empresa:</strong> ${data.company}</p>` : ""}
          ${data.phone ? `<p style="margin: 8px 0;"><strong>Teléfono:</strong> <a href="tel:${data.phone}" style="color: #3b82f6;">${data.phone}</a></p>` : ""}
        </div>

        ${data.service ? `
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="margin-top: 0; color: #1e293b;">🎯 Servicio Solicitado</h3>
          <p style="margin: 8px 0;"><strong>Servicio:</strong> <span style="background: #dbeafe; padding: 4px 8px; border-radius: 4px; color: #1e40af;">${data.service.title}</span></p>
          <p style="margin: 8px 0;"><strong>Descripción:</strong> ${data.service.description}</p>
          <p style="margin: 8px 0;"><strong>Precio Base:</strong> <span style="color: #059669; font-weight: bold;">${data.service.price}</span></p>
        </div>
        ` : ""}

        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin-top: 0; color: #1e293b;">💰 Detalles del Proyecto</h3>
          ${data.budget ? `<p style="margin: 8px 0;"><strong>Presupuesto:</strong> <span style="background: #fef3c7; padding: 4px 8px; border-radius: 4px; color: #92400e;">${budgetLabels[data.budget] || data.budget}</span></p>` : ""}
          ${data.timeline ? `<p style="margin: 8px 0;"><strong>Timeline:</strong> <span style="background: #fef3c7; padding: 4px 8px; border-radius: 4px; color: #92400e;">${timelineLabels[data.timeline] || data.timeline}</span></p>` : ""}
        </div>

        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
          <h3 style="margin-top: 0; color: #1e293b;">💬 Detalles del Proyecto</h3>
          <p style="line-height: 1.6; color: #374151; white-space: pre-wrap;">${data.message}</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">Responde a este email para contactar directamente al cliente y enviar la cotización.</p>
        </div>
      </div>
    </div>
  `
}

export const createQuoteClientConfirmationTemplate = (data: {
  name: string
  service?: {
    title: string
    description: string
    price: string
  }
  budget?: string
  timeline?: string
}) => {
  const budgetLabels: { [key: string]: string } = {
    "50k-100k": "$50.000 - $100.000 ARS",
    "100k-200k": "$100.000 - $200.000 ARS",
    "200k-500k": "$200.000 - $500.000 ARS",
    "500k+": "Más de $500.000 ARS",
    "to-discuss": "A discutir",
  }

  const timelineLabels: { [key: string]: string } = {
    "1-2-weeks": "1-2 semanas",
    "1-month": "1 mes",
    "2-3-months": "2-3 meses",
    "3+months": "Más de 3 meses",
    "flexible": "Flexible",
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #64748b 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">¡Cotización Solicitada!</h1>
        <p style="color: #e2e8f0; margin: 10px 0 0 0;">Gabriel Bustos - Desarrollador Full Stack</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 18px; color: #1e293b;">Hola <strong>${data.name}</strong>,</p>
        
        <p style="line-height: 1.6; color: #374151;">¡Gracias por tu interés en mis servicios! He recibido tu solicitud de cotización y me pondré en contacto contigo <strong>dentro de las próximas 24 horas</strong> con una propuesta personalizada.</p>
        
        ${data.service ? `
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin-top: 0; color: #1e293b;">📋 Servicio Solicitado</h3>
          <p style="margin: 8px 0;"><strong>🎯 Servicio:</strong> ${data.service.title}</p>
          <p style="margin: 8px 0;"><strong>📝 Descripción:</strong> ${data.service.description}</p>
          <p style="margin: 8px 0;"><strong>💰 Precio Base:</strong> <span style="color: #059669; font-weight: bold;">${data.service.price}</span></p>
        </div>
        ` : ""}
        
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
          <h3 style="margin-top: 0; color: #1e293b;">📊 Información Proporcionada</h3>
          ${data.budget ? `<p style="margin: 8px 0;"><strong>💰 Presupuesto:</strong> ${budgetLabels[data.budget] || data.budget}</p>` : ""}
          ${data.timeline ? `<p style="margin: 8px 0;"><strong>⏰ Timeline:</strong> ${timelineLabels[data.timeline] || data.timeline}</p>` : ""}
        </div>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
          <h3 style="margin-top: 0; color: #1e293b;">🎯 Mientras tanto...</h3>
          <p style="margin: 8px 0;">• Revisa mi <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portafolio" style="color: #3b82f6; text-decoration: none;">portafolio</a> para conocer proyectos similares</p>
          <p style="margin: 8px 0;">• Prepara cualquier material o referencia que tengas del proyecto</p>
          <p style="margin: 8px 0;">• Piensa en funcionalidades específicas que necesites</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portafolio" style="background: linear-gradient(135deg, #3b82f6 0%, #64748b 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Ver mi Portafolio</a>
        </div>
        
        <p style="line-height: 1.6; color: #374151;">¡Estoy emocionado de trabajar en tu proyecto y crear algo increíble juntos!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #1e293b;"><strong>Gabriel Bustos</strong></p>
          <p style="margin: 5px 0; color: #64748b;">Desarrollador Full Stack & Especialista en IA</p>
          <p style="margin: 5px 0;"><a href="mailto:${process.env.GMAIL_USER}" style="color: #3b82f6;">${process.env.GMAIL_USER}</a></p>
        </div>
      </div>
    </div>
  `
}
