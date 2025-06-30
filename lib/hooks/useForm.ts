import { useState, useCallback, useRef } from 'react'
import { FormSubmitStatus, FormValidationResult } from '@/lib/types/forms'

interface UseFormOptions<T> {
  initialData: T
  onSubmit: (data: T) => Promise<void>
  validate?: (data: T) => FormValidationResult
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useForm<T>({
  initialData,
  onSubmit,
  validate,
  onSuccess,
  onError
}: UseFormOptions<T>) {
  const [formData, setFormData] = useState<T>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<FormSubmitStatus>('idle')
  
  // Usar useRef para mantener una referencia estable del initialData
  const initialDataRef = useRef(initialData)
  initialDataRef.current = initialData

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }, [errors])

  const validateForm = useCallback((): boolean => {
    if (!validate) return true

    const validation = validate(formData)
    setErrors(validation.errors)
    return validation.isValid
  }, [formData, validate])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setStatus('loading')

    try {
      await onSubmit(formData)
      setStatus('success')
      onSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setStatus('error')
      onError?.(errorMessage)
    }
  }, [formData, validateForm, onSubmit, onSuccess, onError])

  const resetForm = useCallback(() => {
    setFormData(initialDataRef.current)
    setErrors({})
    setStatus('idle')
  }, []) // Sin dependencias para evitar bucles infinitos

  const setFieldValue = useCallback((name: keyof T, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }, [])

  return {
    formData,
    errors,
    status,
    handleInputChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    setFormData
  }
} 