'use client'

import React, { useState, useEffect } from 'react'
import { ConversationData } from '@/hooks/types'

interface ValidationRule {
  test: (value: string) => boolean
  message: string
  severity: 'error' | 'warning' | 'info'
}

interface RealTimeValidationProps {
  field: keyof ConversationData
  value: string
  onValidationChange: (isValid: boolean, message?: string) => void
  className?: string
}

const VALIDATION_RULES: Record<keyof ConversationData, ValidationRule[]> = {
  name: [
    {
      test: (value) => value.length >= 2,
      message: 'El nombre debe tener al menos 2 caracteres',
      severity: 'error'
    },
    {
      test: (value) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value),
      message: 'El nombre solo debe contener letras',
      severity: 'warning'
    }
  ],
  email: [
    {
      test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Ingresa un email válido',
      severity: 'error'
    }
  ],
  phone: [
    {
      test: (value) => /^[\d\s\-\+\(\)]+$/.test(value),
      message: 'El teléfono solo debe contener números y símbolos',
      severity: 'warning'
    },
    {
      test: (value) => value.replace(/\D/g, '').length >= 7,
      message: 'El teléfono debe tener al menos 7 dígitos',
      severity: 'error'
    }
  ],
  projectType: [
    {
      test: (value) => value.length >= 3,
      message: 'Describe el tipo de proyecto',
      severity: 'error'
    }
  ],
  requirements: [
    {
      test: (value) => value.length >= 10,
      message: 'Los requerimientos deben ser más detallados',
      severity: 'warning'
    }
  ],
  budget: [
    {
      test: (value) => /[\d]/.test(value),
      message: 'Incluye un monto aproximado',
      severity: 'warning'
    }
  ],
  timeline: [
    {
      test: (value) => value.length > 0,
      message: 'Especifica un timeline',
      severity: 'error'
    }
  ],
  companyName: [
    {
      test: (value) => value.length >= 2,
      message: 'El nombre de la empresa debe tener al menos 2 caracteres',
      severity: 'error'
    }
  ],
  location: [
    {
      test: (value) => value.length >= 2,
      message: 'Especifica una ubicación válida',
      severity: 'error'
    }
  ],
  clientName: [
    {
      test: (value) => value.length >= 2,
      message: 'El nombre del cliente debe tener al menos 2 caracteres',
      severity: 'error'
    }
  ],
  clientEmail: [
    {
      test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Ingresa un email válido',
      severity: 'error'
    }
  ],
  clientPhone: [
    {
      test: (value) => /^[\d\s\-\+\(\)]+$/.test(value),
      message: 'El teléfono solo debe contener números y símbolos',
      severity: 'warning'
    }
  ]
}

export const RealTimeValidation: React.FC<RealTimeValidationProps> = ({
  field,
  value,
  onValidationChange,
  className = ''
}) => {
  const [validationMessage, setValidationMessage] = useState<string>('')
  const [severity, setSeverity] = useState<'error' | 'warning' | 'info'>('info')

  useEffect(() => {
    if (!value.trim()) {
      setValidationMessage('')
      onValidationChange(true)
      return
    }

    const rules = VALIDATION_RULES[field] || []
    let currentMessage = ''
    let currentSeverity: 'error' | 'warning' | 'info' = 'info'
    let fieldIsValid = true

    // Ejecutar reglas en orden de prioridad (error > warning > info)
    for (const rule of rules) {
      if (!rule.test(value)) {
        if (rule.severity === 'error') {
          currentMessage = rule.message
          currentSeverity = 'error'
          fieldIsValid = false
          break // Los errores son fatales
        } else if (rule.severity === 'warning' && !currentMessage) {
          currentMessage = rule.message
          currentSeverity = 'warning'
        }
      }
    }

    setValidationMessage(currentMessage)
    setSeverity(currentSeverity)
    onValidationChange(fieldIsValid, currentMessage)
  }, [value, field, onValidationChange])

  if (!validationMessage) {
    return null
  }

  const getSeverityStyles = () => {
    switch (severity) {
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityIcon = () => {
    switch (severity) {
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '💡'
    }
  }

  return (
    <div className={`mt-1 p-2 rounded-md border text-sm ${getSeverityStyles()} ${className}`}>
      <div className="flex items-start space-x-2">
        <span className="text-sm flex-shrink-0">
          {getSeverityIcon()}
        </span>
        <span className="text-sm">
          {validationMessage}
        </span>
      </div>
    </div>
  )
} 