'use client'

import React from 'react'
import { ConversationData } from '@/hooks/types'

interface InformationSummaryProps {
  collectedData: Partial<ConversationData>
  onEdit?: (field: keyof ConversationData) => void
  isEditable?: boolean
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

export const InformationSummary: React.FC<InformationSummaryProps> = ({
  collectedData,
  onEdit,
  isEditable = false
}) => {
  const filledFields = Object.entries(collectedData).filter(([, value]) => 
    value && String(value).trim().length > 0
  )

  if (filledFields.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          No se ha recopilado información aún
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">
          Resumen de información
        </h3>
        <span className="text-xs text-gray-500">
          {filledFields.length} campos completados
        </span>
      </div>
      
      <div className="space-y-3">
        {filledFields.map(([field, value]) => {
          const fieldKey = field as keyof ConversationData
          const displayValue = String(value).length > 50 
            ? `${String(value).substring(0, 50)}...` 
            : String(value)
          
          return (
            <div 
              key={field}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="text-lg flex-shrink-0">
                {FIELD_ICONS[fieldKey]}
              </span>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {FIELD_LABELS[fieldKey]}
                  </span>
                  {isEditable && onEdit && (
                    <button
                      onClick={() => onEdit(fieldKey)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1 break-words">
                  {displayValue}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Acciones */}
      {isEditable && onEdit && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <button
            onClick={() => onEdit('name')} // Campo por defecto para editar
            className="w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors duration-200"
          >
            ✏️ Editar información
          </button>
        </div>
      )}
    </div>
  )
} 