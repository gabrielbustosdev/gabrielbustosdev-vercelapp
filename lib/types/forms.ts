// lib/types/forms.ts

// Tipos base para formularios
export interface BaseFormData {
  name: string
  email: string
  company: string
  phone: string
}

export interface ContactFormData extends BaseFormData {
  project: string
  message: string
}

export interface ConsultationFormData extends BaseFormData {
  projectType: string
  preferredDate: string
  preferredTime: string
  message: string
}

export interface QuoteFormData extends BaseFormData {
  budget: string
  timeline: string
  message: string
  service?: {
    title: string
    description: string
    price: string
  }
}

export interface ChatConsultationFormData extends BaseFormData {
  projectType: string
  budget: string
  timeline: string
  requirements: string
  preferredContactMethod: string
  conversationSummary?: string
}

// Tipos para props de modales
export interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface QuoteModalProps extends BaseModalProps {
  selectedService?: {
    title: string
    description: string
    price: string
  }
}

// Estados de envío de formularios
export type FormSubmitStatus = 'idle' | 'loading' | 'success' | 'error'

// Configuración de campos de formulario
export interface FormFieldConfig {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'date' | 'time'
  required?: boolean
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  validation?: {
    pattern?: RegExp
    minLength?: number
    maxLength?: number
  }
}

// Tipos para validación
export interface FormValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

// Tipos para respuestas de API
export interface FormSubmitResponse {
  success: boolean
  message: string
  error?: string
}

// Tipo genérico para formularios que extiende Record<string, string>
export type FormDataRecord = Record<string, string> 