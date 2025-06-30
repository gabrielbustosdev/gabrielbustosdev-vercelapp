import { FormValidationResult, FormDataRecord } from '@/lib/types/forms'

// Patrones de validación comunes
export const VALIDATION_PATTERNS = {
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  name: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]{2,50}$/,
  company: /^[A-Za-z0-9ÁáÉéÍíÓóÚúÑñ\s\-\.]{2,100}$/
}

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  required: 'Este campo es obligatorio',
  email: 'Ingresa un email válido',
  phone: 'Ingresa un número de teléfono válido',
  name: 'Ingresa un nombre válido (2-50 caracteres)',
  company: 'Ingresa un nombre de empresa válido (2-100 caracteres)',
  minLength: (min: number) => `Mínimo ${min} caracteres`,
  maxLength: (max: number) => `Máximo ${max} caracteres`,
  pattern: 'Formato inválido'
}

// Validadores individuales
export const validators = {
  required: (value: string): string | null => {
    return value.trim() ? null : ERROR_MESSAGES.required
  },

  email: (value: string): string | null => {
    if (!value) return null // Si no es requerido, no validar
    return VALIDATION_PATTERNS.email.test(value) ? null : ERROR_MESSAGES.email
  },

  phone: (value: string): string | null => {
    if (!value) return null
    return VALIDATION_PATTERNS.phone.test(value) ? null : ERROR_MESSAGES.phone
  },

  name: (value: string): string | null => {
    if (!value) return null
    return VALIDATION_PATTERNS.name.test(value) ? null : ERROR_MESSAGES.name
  },

  company: (value: string): string | null => {
    if (!value) return null
    return VALIDATION_PATTERNS.company.test(value) ? null : ERROR_MESSAGES.company
  },

  minLength: (min: number) => (value: string): string | null => {
    if (!value) return null
    return value.length >= min ? null : ERROR_MESSAGES.minLength(min)
  },

  maxLength: (max: number) => (value: string): string | null => {
    if (!value) return null
    return value.length <= max ? null : ERROR_MESSAGES.maxLength(max)
  },

  pattern: (pattern: RegExp, message?: string) => (value: string): string | null => {
    if (!value) return null
    return pattern.test(value) ? null : (message || ERROR_MESSAGES.pattern)
  }
}

// Configuración de validación por campo
export interface FieldValidationConfig {
  required?: boolean
  email?: boolean
  phone?: boolean
  name?: boolean
  company?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  customMessage?: string
}

// Validar un campo específico
export function validateField(
  value: string, 
  config: FieldValidationConfig
): string | null {
  const validatorsToRun = []

  if (config.required) {
    validatorsToRun.push(validators.required)
  }
  if (config.email) {
    validatorsToRun.push(validators.email)
  }
  if (config.phone) {
    validatorsToRun.push(validators.phone)
  }
  if (config.name) {
    validatorsToRun.push(validators.name)
  }
  if (config.company) {
    validatorsToRun.push(validators.company)
  }
  if (config.minLength) {
    validatorsToRun.push(validators.minLength(config.minLength))
  }
  if (config.maxLength) {
    validatorsToRun.push(validators.maxLength(config.maxLength))
  }
  if (config.pattern) {
    validatorsToRun.push(validators.pattern(config.pattern, config.customMessage))
  }

  for (const validator of validatorsToRun) {
    const error = validator(value)
    if (error) return error
  }

  return null
}

// Validar un formulario completo
export function validateForm(
  data: FormDataRecord,
  validationConfig: Record<string, FieldValidationConfig>
): FormValidationResult {
  const errors: Record<string, string> = {}

  for (const [fieldName, config] of Object.entries(validationConfig)) {
    const value = data[fieldName] || ''
    const error = validateField(value, config)
    if (error) {
      errors[fieldName] = error
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Configuraciones de validación predefinidas
export const VALIDATION_CONFIGS = {
  contact: {
    name: { required: true, name: true },
    email: { required: true, email: true },
    company: { company: true },
    phone: { phone: true },
    project: { required: true, minLength: 3 },
    message: { required: true, minLength: 10, maxLength: 1000 }
  },

  consultation: {
    name: { required: true, name: true },
    email: { required: true, email: true },
    company: { company: true },
    phone: { phone: true },
    projectType: { required: true },
    preferredDate: { required: true },
    preferredTime: { required: true },
    message: { minLength: 10, maxLength: 1000 }
  },

  quote: {
    name: { required: true, name: true },
    email: { required: true, email: true },
    company: { company: true },
    phone: { phone: true },
    budget: { required: true },
    timeline: { required: true },
    message: { minLength: 10, maxLength: 1000 }
  },

  chatConsultation: {
    name: { required: true, name: true },
    email: { required: true, email: true },
    company: { company: true },
    phone: { phone: true },
    projectType: { required: true },
    budget: { required: true },
    timeline: { required: true },
    requirements: { minLength: 10, maxLength: 1000 },
    preferredContactMethod: { required: true }
  }
} 