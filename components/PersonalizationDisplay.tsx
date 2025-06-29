'use client'

import React from 'react'
import { ClientPersonality, ServiceContext, ConversationMemory } from '@/hooks/types'

interface PersonalizationDisplayProps {
  personality: ClientPersonality | null
  serviceContext: ServiceContext | null
  conversationMemory: ConversationMemory
  isVisible: boolean
  onToggle: () => void
}

const PERSONALITY_LABELS: Record<string, string> = {
  executive: 'Ejecutivo',
  entrepreneur: 'Emprendedor',
  developer: 'Desarrollador',
  marketer: 'Marketer',
  consultant: 'Consultor',
  general: 'General'
}

const PERSONALITY_ICONS: Record<string, string> = {
  executive: '👔',
  entrepreneur: '🚀',
  developer: '💻',
  marketer: '📈',
  consultant: '📋',
  general: '👤'
}

export const PersonalizationDisplay: React.FC<PersonalizationDisplayProps> = ({
  personality,
  serviceContext,
  conversationMemory,
  isVisible,
  onToggle
}) => {
  if (!isVisible) return null

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">
          Análisis de Personalización
        </h3>
        <button
          onClick={onToggle}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Ocultar
        </button>
      </div>

      <div className="space-y-4">
        {/* Personalidad del Cliente */}
        {personality && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{PERSONALITY_ICONS[personality.type]}</span>
              <span className="text-sm font-medium text-gray-700">
                {PERSONALITY_LABELS[personality.type]}
              </span>
              <span className="text-xs text-gray-500">
                ({Math.round(personality.confidence * 100)}% confianza)
              </span>
            </div>

            {/* Características */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-600">Nivel técnico:</span>
                <span className="ml-1 font-medium capitalize">{personality.characteristics.technicalLevel}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-600">Urgencia:</span>
                <span className="ml-1 font-medium capitalize">{personality.characteristics.urgencyLevel}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-600">Sensibilidad presupuesto:</span>
                <span className="ml-1 font-medium capitalize">{personality.characteristics.budgetSensitivity}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-600">Estilo comunicación:</span>
                <span className="ml-1 font-medium capitalize">{personality.characteristics.communicationStyle}</span>
              </div>
            </div>

            {/* Preferencias */}
            <div className="space-y-1">
              <span className="text-xs text-gray-600">Preferencias:</span>
              <div className="flex flex-wrap gap-1">
                {personality.preferences.examplesNeeded && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Ejemplos</span>
                )}
                {personality.preferences.technicalExplanations && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Detalles técnicos</span>
                )}
                {personality.preferences.timelineFocus && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Timeline</span>
                )}
                {personality.preferences.budgetFocus && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">Presupuesto</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contexto del Servicio */}
        {serviceContext && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">Contexto del Servicio</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-600">Tipo:</span>
                <span className="ml-1 font-medium capitalize">{serviceContext.serviceType.replace('_', ' ')}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-600">Complejidad:</span>
                <span className="ml-1 font-medium capitalize">{serviceContext.complexity}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-600">Timeline:</span>
                <span className="ml-1 font-medium capitalize">{serviceContext.timeline}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-600">Presupuesto:</span>
                <span className="ml-1 font-medium capitalize">{serviceContext.budget}</span>
              </div>
            </div>

            {/* Requerimientos técnicos */}
            {serviceContext.technicalRequirements.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs text-gray-600">Requerimientos técnicos:</span>
                <div className="flex flex-wrap gap-1">
                  {serviceContext.technicalRequirements.map((req, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Objetivos de negocio */}
            {serviceContext.businessGoals.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs text-gray-600">Objetivos de negocio:</span>
                <div className="flex flex-wrap gap-1">
                  {serviceContext.businessGoals.map((goal, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Memoria de Conversación */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-700">Memoria de Conversación</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-600">Temas clave:</span>
              <span className="ml-1 font-medium">{conversationMemory.keyTopics.length}</span>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-600">Decisiones:</span>
              <span className="ml-1 font-medium">{conversationMemory.decisions.length}</span>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-600">Preocupaciones:</span>
              <span className="ml-1 font-medium">{conversationMemory.concerns.length}</span>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-600">Preguntas técnicas:</span>
              <span className="ml-1 font-medium">{conversationMemory.technicalQuestions.length}</span>
            </div>
          </div>

          {/* Timeline y presupuesto */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-600">Menciones timeline:</span>
              <span className="ml-1 font-medium">{conversationMemory.timeline.length}</span>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-600">Menciones presupuesto:</span>
              <span className="ml-1 font-medium">{conversationMemory.budgetMentions.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 