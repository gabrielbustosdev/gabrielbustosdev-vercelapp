'use client'

import React, { useState } from 'react'
import { ConversationData } from '@/hooks/types'

interface InformationSummaryProps {
  collectedData: Partial<ConversationData>
  onConfirm: (data: Partial<ConversationData>) => void
  isEditable?: boolean
}

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateName = (name: string) => name && name.length > 1;

export const InformationSummary: React.FC<InformationSummaryProps> = ({
  collectedData,
  onConfirm,
  isEditable = true,
}) => {
  const [data, setData] = useState(collectedData);
  const [errors, setErrors] = useState<{ [k in keyof ConversationData]?: string }>({});

  const handleChange = (field: keyof ConversationData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleValidate = () => {
    const newErrors: { [k in keyof ConversationData]?: string } = {};
    if (!validateName(data.name || '')) newErrors.name = 'Nombre inválido';
    if (!validateEmail(data.email || '')) newErrors.email = 'Email inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (handleValidate()) {
      onConfirm(data);
    }
  };

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
    <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 max-w-md mx-auto mt-4">
      <h3 className="text-lg font-semibold text-white mb-2">Resumen de datos para agendar consulta</h3>
      <div className="space-y-2">
        <div>
          <label className="block text-sm text-gray-300">Nombre</label>
          <input
            className="w-full px-3 py-2 rounded bg-slate-900 text-white border border-slate-600 focus:outline-none"
            value={data.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={!isEditable}
          />
          {errors.name && <span className="text-xs text-red-400">{errors.name}</span>}
        </div>
        <div>
          <label className="block text-sm text-gray-300">Email</label>
          <input
            className="w-full px-3 py-2 rounded bg-slate-900 text-white border border-slate-600 focus:outline-none"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={!isEditable}
          />
          {errors.email && <span className="text-xs text-red-400">{errors.email}</span>}
        </div>
        {/* Puedes agregar más campos aquí si lo deseas */}
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        {isEditable && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleConfirm}
          >
            Confirmar y agendar consulta
          </button>
        )}
      </div>
    </div>
  )
}

export default InformationSummary 