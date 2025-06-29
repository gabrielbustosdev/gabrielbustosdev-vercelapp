'use client'

import React, { useState, useEffect } from 'react'
import { getGuardrailsReport, getMiddlewareStats } from '../lib/middleware'

interface GuardrailsDisplayProps {
  isVisible?: boolean
  onClose?: () => void
}

interface GuardrailStats {
  totalInteractions: number
  actions: Record<string, number>
  averageResponseLength: number
  ragUsage: number
  ragUsagePercentage: number
  conversationMetrics: Array<{
    messageCount: number
    conversationDuration: number
    offTopicCount: number
    qualityScore: number
    lastOnTopicTime: number
    recoveryAttempts: number
  }>
}

interface GuardrailReport {
  totalInteractions: number
  blockedResponses: number
  modifiedResponses: number
  redirectedConversations: number
  averageQualityScore: number
  topIssues: Array<{ category: string; count: number }>
}

export default function GuardrailsDisplay({ isVisible = false, onClose }: GuardrailsDisplayProps) {
  const [stats, setStats] = useState<GuardrailStats | null>(null)
  const [report, setReport] = useState<GuardrailReport | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const updateStats = () => {
        setStats(getMiddlewareStats())
        setReport(getGuardrailsReport())
      }

      updateStats()
      const interval = setInterval(updateStats, 5000) // Actualizar cada 5 segundos

      return () => clearInterval(interval)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Guardrails Status
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isExpanded ? '−' : '+'}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Resumen rápido */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats?.totalInteractions || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Interacciones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {report?.averageQualityScore || 1.0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Calidad Promedio</div>
            </div>
          </div>

          {/* Acciones */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Acciones</h4>
            <div className="space-y-1">
              {stats?.actions && Object.entries(stats.actions).map(([action, count]) => (
                <div key={action} className="flex justify-between text-sm">
                  <span className="capitalize text-gray-600 dark:text-gray-400">{action}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detalles expandidos */}
          {isExpanded && (
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              {/* Problemas principales */}
              {report?.topIssues && report.topIssues.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Problemas Principales
                  </h4>
                  <div className="space-y-1">
                    {report.topIssues.map((issue, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {issue.category.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {issue.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Métricas de conversación */}
              {stats?.conversationMetrics && stats.conversationMetrics.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Métricas de Conversación
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Mensajes Totales</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {stats.conversationMetrics.reduce((sum, m) => sum + m.messageCount, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Fuera de Tema</span>
                      <span className="font-medium text-orange-600 dark:text-orange-400">
                        {stats.conversationMetrics.reduce((sum, m) => sum + m.offTopicCount, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Recuperaciones</span>
                      <span className="font-medium text-yellow-600 dark:text-yellow-400">
                        {stats.conversationMetrics.reduce((sum, m) => sum + m.recoveryAttempts, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Uso de RAG */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Base de Conocimiento
                </h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Uso de RAG</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {stats?.ragUsagePercentage || 0}%
                  </span>
                </div>
              </div>

              {/* Longitud promedio de respuesta */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Respuestas
                </h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Longitud Promedio</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stats?.averageResponseLength || 0} chars
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Indicadores de estado */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Activo</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Actualizado: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 