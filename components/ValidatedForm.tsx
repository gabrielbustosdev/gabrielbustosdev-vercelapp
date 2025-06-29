"use client"

import React from 'react'
import { useFormWithValidation } from '@/hooks/use-form-validation'
import { ContactFormSchema } from '@/schemas/validations'
import { z } from 'zod'

type ContactFormData = z.infer<typeof ContactFormSchema>

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  company: '',
  project: 'web',
  message: ''
}

export default function ValidatedForm() {
  const {
    formData,
    isSubmitting,
    submitError,
    errors,
    fieldErrors,
    handleInputChange,
    handleSubmit,
    resetForm
  } = useFormWithValidation(ContactFormSchema, initialFormData)

  const onSubmit = async (data: ContactFormData) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al enviar el formulario')
    }

    return response.json()
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await handleSubmit(onSubmit)
    
    if (result.success) {
      alert('¡Formulario enviado exitosamente!')
      resetForm()
    } else {
      console.error('Error:', result.error)
    }
  }

  const getFieldError = (field: keyof ContactFormData) => {
    return fieldErrors[field] || errors.find(err => err.field === field)?.message
  }

  const getFieldClassName = (field: keyof ContactFormData) => {
    const hasError = getFieldError(field)
    return `w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
      hasError 
        ? 'border-red-500 focus:ring-red-400' 
        : 'border-white/10 focus:ring-blue-400'
    }`
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">Formulario con Validación</h2>
      
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Nombre completo *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={getFieldClassName('name')}
            placeholder="Tu nombre"
          />
          {getFieldError('name') && (
            <p className="mt-1 text-sm text-red-400">{getFieldError('name')}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={getFieldClassName('email')}
            placeholder="tu@email.com"
          />
          {getFieldError('email') && (
            <p className="mt-1 text-sm text-red-400">{getFieldError('email')}</p>
          )}
        </div>

        {/* Empresa */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
            Empresa (opcional)
          </label>
          <input
            type="text"
            id="company"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className={getFieldClassName('company')}
            placeholder="Tu empresa"
          />
          {getFieldError('company') && (
            <p className="mt-1 text-sm text-red-400">{getFieldError('company')}</p>
          )}
        </div>

        {/* Tipo de proyecto */}
        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-300 mb-2">
            Tipo de proyecto
          </label>
          <select
            id="project"
            value={formData.project}
            onChange={(e) => handleInputChange('project', e.target.value)}
            className={getFieldClassName('project')}
          >
            <option value="">Selecciona una opción</option>
            <option value="web">Desarrollo Web</option>
            <option value="ai">Integración de IA</option>
            <option value="consulting">Consultoría</option>
            <option value="other">Otro</option>
          </select>
          {getFieldError('project') && (
            <p className="mt-1 text-sm text-red-400">{getFieldError('project')}</p>
          )}
        </div>

        {/* Mensaje */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
            Mensaje *
          </label>
          <textarea
            id="message"
            rows={5}
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            className={getFieldClassName('message')}
            placeholder="Cuéntame sobre tu proyecto..."
          />
          {getFieldError('message') && (
            <p className="mt-1 text-sm text-red-400">{getFieldError('message')}</p>
          )}
        </div>

        {/* Error general */}
        {submitError && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 text-center">{submitError}</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-blue-500 to-slate-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-slate-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
          </button>
          
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 font-semibold"
          >
            Limpiar
          </button>
        </div>
      </form>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Debug Info:</h3>
          <pre className="text-xs text-gray-300 overflow-auto">
            {JSON.stringify({ formData, errors, fieldErrors }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
} 