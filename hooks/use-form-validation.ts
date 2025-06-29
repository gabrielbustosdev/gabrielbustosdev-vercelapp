import { useState, useCallback } from 'react'
import { z } from 'zod'

interface ValidationError {
  field: string
  message: string
}

interface UseFormValidationReturn<T> {
  errors: ValidationError[]
  validateField: (field: keyof T, value: any) => ValidationError | null
  validateForm: (data: T) => { isValid: boolean; errors: ValidationError[] }
  clearErrors: () => void
  setFieldError: (field: keyof T, message: string) => void
}

export function useFormValidation<T extends Record<string, any>>(
  schema: z.ZodSchema<T>
): UseFormValidationReturn<T> {
  const [errors, setErrors] = useState<ValidationError[]>([])

  const validateField = useCallback(
    (field: keyof T, value: any): ValidationError | null => {
      try {
        // Validar el formulario completo y extraer el error del campo específico
        const fullData = { [field]: value } as Partial<T>
        schema.parse(fullData)
        return null
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find(err => err.path[0] === field)
          if (fieldError) {
            return {
              field: field as string,
              message: fieldError.message
            }
          }
        }
        return null
      }
    },
    [schema]
  )

  const validateForm = useCallback(
    (data: T): { isValid: boolean; errors: ValidationError[] } => {
      try {
        schema.parse(data)
        setErrors([])
        return { isValid: true, errors: [] }
      } catch (error) {
        if (error instanceof z.ZodError) {
          const validationErrors: ValidationError[] = error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
          setErrors(validationErrors)
          return { isValid: false, errors: validationErrors }
        }
        return { isValid: false, errors: [] }
      }
    },
    [schema]
  )

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  const setFieldError = useCallback((field: keyof T, message: string) => {
    setErrors(prev => {
      const filtered = prev.filter(err => err.field !== field)
      return [...filtered, { field: field as string, message }]
    })
  }, [])

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    setFieldError
  }
}

// Hook específico para validación en tiempo real
export function useRealTimeValidation<T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  debounceMs: number = 500
) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(false)

  const validateFieldRealTime = useCallback(
    async (field: keyof T, value: any) => {
      setIsValidating(true)
      
      // Simular debounce
      await new Promise(resolve => setTimeout(resolve, debounceMs))
      
      try {
        // Validar el campo usando el esquema completo
        const fieldData = { [field]: value } as Partial<T>
        schema.parse(fieldData)
        
        setFieldErrors(prev => {
          const { [field]: _, ...rest } = prev
          return rest
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find(err => err.path[0] === field)
          if (fieldError) {
            setFieldErrors(prev => ({
              ...prev,
              [field]: fieldError.message
            }))
          }
        }
      } finally {
        setIsValidating(false)
      }
    },
    [schema, debounceMs]
  )

  const clearFieldError = useCallback((field: keyof T) => {
    setFieldErrors(prev => {
      const { [field]: _, ...rest } = prev
      return rest
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setFieldErrors({})
  }, [])

  return {
    fieldErrors,
    isValidating,
    validateFieldRealTime,
    clearFieldError,
    clearAllErrors
  }
}

// Hook para manejo de formularios con validación
export function useFormWithValidation<T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  initialData: T
) {
  const [formData, setFormData] = useState<T>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  const { errors, validateForm, clearErrors } = useFormValidation(schema)
  const { fieldErrors, validateFieldRealTime, clearFieldError } = useRealTimeValidation(schema)

  const handleInputChange = useCallback(
    (field: keyof T, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }))
      clearFieldError(field)
      
      // Validar en tiempo real si hay un valor
      if (value !== undefined && value !== '') {
        validateFieldRealTime(field, value)
      }
    },
    [clearFieldError, validateFieldRealTime]
  )

  const handleSubmit = useCallback(
    async (submitFn: (data: T) => Promise<any>) => {
      setIsSubmitting(true)
      setSubmitError(null)
      clearErrors()

      const validation = validateForm(formData)
      
      if (!validation.isValid) {
        setIsSubmitting(false)
        return { success: false, errors: validation.errors }
      }

      try {
        const result = await submitFn(formData)
        setIsSubmitting(false)
        return { success: true, data: result }
      } catch (error) {
        setIsSubmitting(false)
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        setSubmitError(errorMessage)
        return { success: false, error: errorMessage }
      }
    },
    [formData, validateForm, clearErrors]
  )

  const resetForm = useCallback(() => {
    setFormData(initialData)
    clearErrors()
    setSubmitError(null)
  }, [initialData, clearErrors])

  return {
    formData,
    setFormData,
    isSubmitting,
    submitError,
    errors,
    fieldErrors,
    handleInputChange,
    handleSubmit,
    resetForm,
    validateForm
  }
} 