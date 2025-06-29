'use client'

import React from 'react'
import { ConversationData } from '@/hooks/types'

interface ConversationProgressProps {
  collectedData: Partial<ConversationData>
  requiredFields: (keyof ConversationData)[]
  currentStep?: string
}

const FIELD_LABELS: Record<keyof ConversationData, string> = {
  name: 'Nombre',
  email: 'Email',
  phone: 'Teléfono',
  projectType: 'Tipo de proyecto',
  requirements: 'Requerimientos',
  budget: 'Presupuesto',
  timeline: 'Timeline',
  companyName: 'Empresa',
  location: 'Ubicación',
  clientName: 'Nombre del cliente',
  clientEmail: 'Email del cliente',
  clientPhone: 'Teléfono del cliente'
}

const FIELD_ICONS: Record<keyof ConversationData, string> = {
  name: '👤',
  email: '📧',
  phone: '📞',
  projectType: '💼',
  requirements: '📋',
  budget: '💰',
  timeline: '⏰',
  companyName: '🏢',
  location: '📍',
  clientName: '👥',
  clientEmail: '📨',
  clientPhone: '📱'
}

export const ConversationProgress: React.FC<ConversationProgressProps> = ({
  collectedData,
  requiredFields,
  currentStep
}) => {
  const completedFields = requiredFields.filter(field => 
    collectedData[field] && String(collectedData[field]).trim().length > 0
  )
  
  const progressPercentage = (completedFields.length / requiredFields.length) * 100

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">
          Progreso de información
        </h3>
        <span className="text-xs text-gray-500">
          {completedFields.length} de {requiredFields.length}
        </span>
      </div>
      
      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Campos requeridos */}
      <div className="space-y-2">
        {requiredFields.map((field) => {
          const isCompleted = collectedData[field] && String(collectedData[field]).trim().length > 0
          const isCurrent = currentStep === field
          
          return (
            <div 
              key={field}
              className={`flex items-center space-x-2 p-2 rounded-md transition-all duration-200 ${
                isCurrent 
                  ? 'bg-blue-50 border border-blue-200' 
                  : isCompleted 
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="text-lg">
                {FIELD_ICONS[field]}
              </span>
              <span className={`text-sm font-medium ${
                isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-600'
              }`}>
                {FIELD_LABELS[field]}
              </span>
              <div className="ml-auto">
                {isCompleted ? (
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : isCurrent ? (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                ) : (
                  <div className="w-4 h-4 bg-gray-300 rounded-full" />
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Mensaje de progreso */}
      {progressPercentage === 100 ? (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700 font-medium">
            ✅ Información completa. ¡Listo para continuar!
          </p>
        </div>
      ) : progressPercentage > 50 ? (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            🎯 ¡Excelente progreso! Solo faltan algunos detalles.
          </p>
        </div>
      ) : (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-700">
            📝 Empezando a recopilar información. Te ayudo paso a paso.
          </p>
        </div>
      )}
    </div>
  )
} 