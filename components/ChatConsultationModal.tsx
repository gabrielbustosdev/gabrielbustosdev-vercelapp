"use client"

import { useState, useEffect } from "react"
import { X, Send, CheckCircle } from "lucide-react"

interface ChatConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  conversationData?: {
    name?: string
    email?: string
    projectType?: string
    requirements?: string
    budget?: string
    timeline?: string
  }
}

export default function ChatConsultationModal({ 
  isOpen, 
  onClose, 
  conversationData = {} 
}: ChatConsultationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectType: "",
    budget: "",
    timeline: "",
    requirements: "",
    preferredContactMethod: "email"
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [conversationSummary, setConversationSummary] = useState("")

  // Actualizar formulario cuando cambian los datos de la conversación
  useEffect(() => {
    if (conversationData) {
      setFormData(prev => ({
        ...prev,
        name: conversationData.name || prev.name,
        email: conversationData.email || prev.email,
        projectType: conversationData.projectType || prev.projectType,
        budget: conversationData.budget || prev.budget,
        timeline: conversationData.timeline || prev.timeline,
        requirements: conversationData.requirements || prev.requirements
      }))
    }
  }, [conversationData])

  // Generar resumen de la conversación cuando se abre el modal
  useEffect(() => {
    if (isOpen && conversationData) {
      generateConversationSummary()
    }
  }, [isOpen, conversationData])

  const generateConversationSummary = () => {
    const summary = []
    
    if (conversationData.name) {
      summary.push(`Cliente: ${conversationData.name}`)
    }
    
    if (conversationData.projectType) {
      summary.push(`Tipo de proyecto: ${conversationData.projectType}`)
    }
    
    if (conversationData.budget) {
      summary.push(`Presupuesto mencionado: ${conversationData.budget}`)
    }
    
    if (conversationData.timeline) {
      summary.push(`Timeline: ${conversationData.timeline}`)
    }
    
    if (conversationData.requirements) {
      summary.push(`Requerimientos: ${conversationData.requirements}`)
    }
    
    if (summary.length > 0) {
      setConversationSummary(summary.join('. ') + '.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/chat-consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          conversationSummary: conversationSummary
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          onClose()
          setIsSuccess(false)
          setFormData({
            name: "",
            email: "",
            company: "",
            phone: "",
            projectType: "",
            budget: "",
            timeline: "",
            requirements: "",
            preferredContactMethod: "email"
          })
          setConversationSummary("")
        }, 3000)
      } else {
        setError(result.error || "Error al enviar la consulta")
      }
    } catch (err) {
      setError("Error de conexión. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-slate-600/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Agendar Consulta Gratuita</h2>
            <p className="text-gray-400 mt-1">Completa los datos para que me ponga en contacto contigo</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success State */}
        {isSuccess && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">¡Consulta Enviada!</h3>
            <p className="text-gray-300">
              He recibido tu consulta y me pondré en contacto contigo dentro de las próximas 24 horas.
            </p>
          </div>
        )}

        {/* Form */}
        {!isSuccess && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Resumen de la conversación */}
            {conversationSummary && (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                <h3 className="text-blue-300 font-semibold mb-2">📋 Información extraída de la conversación:</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{conversationSummary}</p>
              </div>
            )}
            
            {/* Información Personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre * <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Tu nombre completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email * <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Empresa
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Nombre de tu empresa"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="+54 9 11 1234-5678"
                />
              </div>
            </div>

            {/* Detalles del Proyecto */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Proyecto * <span className="text-red-400">*</span>
              </label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="">Selecciona el tipo de proyecto</option>
                <option value="Landing Page">Landing Page que Convierte</option>
                <option value="Plataforma con IA">Plataforma Web con Inteligencia Artificial</option>
                <option value="Rebranding">Rebranding y Optimización Total</option>
                <option value="Desarrollo Web">Desarrollo Web Personalizado</option>
                <option value="Consultoría">Consultoría Técnica</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Presupuesto Aproximado
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="">Selecciona un rango</option>
                  <option value="$50.000 - $100.000 ARS">$50.000 - $100.000 ARS</option>
                  <option value="$100.000 - $200.000 ARS">$100.000 - $200.000 ARS</option>
                  <option value="$200.000 - $500.000 ARS">$200.000 - $500.000 ARS</option>
                  <option value="$500.000+ ARS">$500.000+ ARS</option>
                  <option value="A definir">A definir</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timeline
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="">Selecciona un plazo</option>
                  <option value="Urgente (1-2 semanas)">Urgente (1-2 semanas)</option>
                  <option value="Normal (1-2 meses)">Normal (1-2 meses)</option>
                  <option value="Flexible (3+ meses)">Flexible (3+ meses)</option>
                  <option value="A definir">A definir</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Método de Contacto Preferido
              </label>
              <select
                name="preferredContactMethod"
                value={formData.preferredContactMethod}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="llamada">Llamada telefónica</option>
                <option value="videollamada">Videollamada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Requerimientos Específicos
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                placeholder="Describe tu proyecto, necesidades específicas, funcionalidades requeridas, etc."
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-400 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-white/20 text-white hover:bg-white/10 rounded-xl transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-slate-600 hover:from-blue-600 hover:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Consulta</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
} 