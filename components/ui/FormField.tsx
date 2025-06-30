"use client"

import { FormFieldConfig } from '@/lib/types/forms'

interface FormFieldProps {
  config: FormFieldConfig
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  error?: string
  className?: string
}

export default function FormField({ config, value, onChange, error, className = "" }: FormFieldProps) {
  const baseInputClasses = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
  const errorClasses = error ? "border-red-500 focus:ring-red-400" : ""
  const inputClasses = `${baseInputClasses} ${errorClasses} ${className}`

  const renderField = () => {
    switch (config.type) {
      case 'textarea':
        return (
          <textarea
            name={config.name}
            value={value}
            onChange={onChange}
            required={config.required}
            placeholder={config.placeholder}
            className={`${inputClasses} resize-none`}
            rows={4}
          />
        )

      case 'select':
        return (
          <select
            name={config.name}
            value={value}
            onChange={onChange}
            required={config.required}
            className={`${inputClasses} [&>option]:bg-slate-800 [&>option]:text-white`}
          >
            <option value="">{config.placeholder || 'Selecciona una opción'}</option>
            {config.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'date':
      case 'time':
        return (
          <input
            type={config.type}
            name={config.name}
            value={value}
            onChange={onChange}
            required={config.required}
            className={inputClasses}
          />
        )

      default:
        return (
          <input
            type={config.type}
            name={config.name}
            value={value}
            onChange={onChange}
            required={config.required}
            placeholder={config.placeholder}
            className={inputClasses}
          />
        )
    }
  }

  return (
    <div>
      <label htmlFor={config.name} className="block text-sm font-medium text-gray-300 mb-2">
        {config.label}
        {config.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {renderField()}
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  )
} 