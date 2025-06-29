'use client'

import React from 'react'
import { ConversationData } from '@/hooks/types'

interface ConfirmationDialogProps {
  collectedData: Partial<ConversationData>
  isOpen: boolean
  onConfirm: () => void
  onEdit: () => void
  onCancel: () => void
  title?: string
  confirmText?: string
  editText?: string
  cancelText?: string
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

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  collectedData,
  isOpen,
  onConfirm,
  onEdit,
  onCancel,
  title = 'Confirmar información',
  confirmText = 'Confirmar y continuar',
  editText = 'Editar información',
  cancelText = 'Cancelar'
}) => {
  if (!isOpen) return null

  const filledFields = Object.entries(collectedData).filter(([, value]) => 
    value && String(value).trim().length > 0
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
              <p className="text-sm text-gray-500">
                Revisa la información antes de continuar
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {filledFields.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-500">
                No hay información para confirmar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Por favor, confirma que la siguiente información es correcta:
              </p>
              
              <div className="space-y-3">
                {filledFields.map(([field, value]) => {
                  const fieldKey = field as keyof ConversationData
                  const displayValue = String(value).length > 100 
                    ? `${String(value).substring(0, 100)}...` 
                    : String(value)
                  
                  return (
                    <div 
                      key={field}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-lg flex-shrink-0">
                        {FIELD_ICONS[fieldKey]}
                      </span>
                      
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-700 block">
                          {FIELD_LABELS[fieldKey]}
                        </span>
                        <p className="text-sm text-gray-600 mt-1 break-words">
                          {displayValue}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              {cancelText}
            </button>
            
            {filledFields.length > 0 && (
              <button
                onClick={onEdit}
                className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                {editText}
              </button>
            )}
            
            <button
              onClick={onConfirm}
              disabled={filledFields.length === 0}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 