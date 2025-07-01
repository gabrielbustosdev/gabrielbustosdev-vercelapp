import { z } from 'zod'

// --- Tipos y Schemas ---

// Contacto
export const ContactFormSchema = z.object({
  type: z.literal('contact'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  company: z.string().optional(),
  project: z.enum(['web', 'ai', 'consulting', 'other']).optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(1000)
})
export type ContactForm = z.infer<typeof ContactFormSchema>

// Cotización
export const QuoteFormSchema = z.object({
  type: z.literal('quote'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(1000),
  service: z.object({
    title: z.string(),
    description: z.string(),
    price: z.string()
  }).optional()
})
export type QuoteForm = z.infer<typeof QuoteFormSchema>

// Consulta
export const ConsultationFormSchema = z.object({
  type: z.literal('consultation'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().min(2, 'Tipo de proyecto requerido'),
  preferredDate: z.string().min(1, 'Fecha preferida requerida'),
  preferredTime: z.string().min(1, 'Hora preferida requerida'),
  message: z.string().optional(),
  summary: z.string().optional(),
})
export type ConsultationForm = z.infer<typeof ConsultationFormSchema>

// --- Unión de todos los formularios ---
export const UnifiedFormSchema = z.discriminatedUnion('type', [
  ContactFormSchema,
  QuoteFormSchema,
  ConsultationFormSchema
])
export type UnifiedForm = z.infer<typeof UnifiedFormSchema> 