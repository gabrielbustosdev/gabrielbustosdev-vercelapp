'use client'

import React from 'react'
import { type NLPResult, type Entity, type Sentiment } from '@/lib/nlp-processor'

interface NLPAnalysisDisplayProps {
  nlpResult: NLPResult | null
  isVisible?: boolean
  onClose?: () => void
}

export const NLPAnalysisDisplay: React.FC<NLPAnalysisDisplayProps> = ({
  nlpResult,
  isVisible = false,
  onClose
}) => {
  if (!isVisible || !nlpResult) return null

  const getSentimentColor = (label: Sentiment['label']) => {
    switch (label) {
      case 'very_positive': return 'text-green-600'
      case 'positive': return 'text-green-500'
      case 'neutral': return 'text-gray-500'
      case 'negative': return 'text-orange-500'
      case 'very_negative': return 'text-red-600'
      default: return 'text-gray-500'
    }
  }

  const getIntentColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getEntityTypeColor = (type: Entity['type']) => {
    const colors: Record<Entity['type'], string> = {
      name: 'bg-blue-100 text-blue-800',
      email: 'bg-green-100 text-green-800',
      phone: 'bg-purple-100 text-purple-800',
      budget: 'bg-yellow-100 text-yellow-800',
      project_type: 'bg-indigo-100 text-indigo-800',
      timeline: 'bg-pink-100 text-pink-800',
      company: 'bg-gray-100 text-gray-800',
      location: 'bg-orange-100 text-orange-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="fixed bottom-20 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Análisis NLP</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Intención */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Intención Detectada</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 capitalize">
              {nlpResult.intent.type.replace('_', ' ')}
            </span>
            <span className={`text-sm font-medium ${getIntentColor(nlpResult.intent.confidence)}`}>
              {Math.round(nlpResult.intent.confidence * 100)}%
            </span>
          </div>
        </div>

        {/* Sentimiento */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Análisis de Sentimiento</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sentimiento:</span>
              <span className={`text-sm font-medium capitalize ${getSentimentColor(nlpResult.sentiment.label)}`}>
                {nlpResult.sentiment.label.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Score:</span>
              <span className="text-sm font-medium text-gray-800">
                {nlpResult.sentiment.score.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Emociones */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Emociones Detectadas</h4>
          <div className="space-y-1">
            {Object.entries(nlpResult.sentiment.emotions).map(([emotion, score]) => (
              <div key={emotion} className="flex items-center justify-between">
                <span className="text-xs text-gray-600 capitalize">{emotion}:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${score * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-8">
                    {Math.round(score * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Entidades Extraídas */}
        {nlpResult.entities.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Entidades Extraídas ({nlpResult.entities.length})
            </h4>
            <div className="space-y-2">
              {nlpResult.entities.map((entity, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getEntityTypeColor(entity.type)}`}>
                      {entity.type}
                    </span>
                    <span className="text-sm text-gray-800 truncate max-w-32">
                      {entity.value}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {Math.round(entity.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completitud de Información */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Completitud de Información</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Estado:</span>
              <span className={`text-sm font-medium ${
                nlpResult.completeness.isComplete ? 'text-green-600' : 'text-orange-600'
              }`}>
                {nlpResult.completeness.isComplete ? 'Completo' : 'Incompleto'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Score:</span>
              <span className="text-sm font-medium text-gray-800">
                {Math.round(nlpResult.completeness.completenessScore * 100)}%
              </span>
            </div>
            {nlpResult.completeness.missingFields.length > 0 && (
              <div>
                <span className="text-xs text-gray-600">Campos faltantes:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {nlpResult.completeness.missingFields.map((field, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Texto Procesado */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Texto Procesado</h4>
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            {nlpResult.processedText}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NLPAnalysisDisplay 