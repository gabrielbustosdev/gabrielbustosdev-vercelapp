"use client"

import { useState, useEffect } from "react"
import { Send, CheckCircle } from "lucide-react"
import { ChatConsultationFormData, BaseModalProps } from "@/lib/types/forms"
import { useForm } from "@/lib/hooks/useForm"
import { validateForm, VALIDATION_CONFIGS } from "@/lib/services/validation"
import Modal from "@/components/ui/Modal"
import FormField from "@/components/ui/FormField"

interface ChatConsultationModalProps extends BaseModalProps {
  conversationData?: {
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
  const [conversationSummary, setConversationSummary] = useState("")

  const initialFormData: ChatConsultationFormData = {
    name: "",
    email: "",
    company: "",
    phone: "",
    projectType: "",
    budget: "",
    timeline: "",
    requirements: "",
    preferredContactMethod: "email"
  }

  const handleSubmit = async (data: ChatConsultationFormData) => {
    const response = await fetch("/api/chat-consultation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        conversationSummary
      }),
    })

    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error || "Error al enviar la consulta")
    }
  }

  const handleSuccess = () => {
    setTimeout(() => {
      onClose()
    }, 3000)
  }

  const {
    formData,
    errors,
    status,
    handleInputChange,
    handleSubmit: submitForm,
    resetForm,
    setFieldValue
  } = useForm<ChatConsultationFormData>({
    initialData: initialFormData,
    onSubmit: handleSubmit,
    validate: (data) => validateForm(data as unknown as Record<string, string>, VALIDATION_CONFIGS.chatConsultation),
    onSuccess: handleSuccess,
    onError: (error) => console.error('Form error:', error)
  })

  // Actualizar formulario con datos de la conversación cuando se abre
  useEffect(() => {
    if (isOpen && conversationData) {
      const updates: Partial<ChatConsultationFormData> = {}
      
      if (conversationData.projectType) {
        updates.projectType = conversationData.projectType
      }
      if (conversationData.budget) {
        updates.budget = conversationData.budget
      }
      if (conversationData.timeline) {
        updates.timeline = conversationData.timeline
      }
      if (conversationData.requirements) {
        updates.requirements = conversationData.requirements
      }

      // Actualizar solo los campos que tienen datos
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          setFieldValue(key as keyof ChatConsultationFormData, value)
        }
      })

      // Generar resumen de la conversación
      const summaryParts = []
      if (conversationData.projectType) {
        summaryParts.push(`Tipo de proyecto: ${conversationData.projectType}`)
      }
      if (conversationData.budget) {
        summaryParts.push(`Presupuesto: ${conversationData.budget}`)
      }
      if (conversationData.timeline) {
        summaryParts.push(`Timeline: ${conversationData.timeline}`)
      }
      if (conversationData.requirements) {
        summaryParts.push(`Requerimientos: ${conversationData.requirements}`)
      }

      if (summaryParts.length > 0) {
        setConversationSummary(summaryParts.join('. '))
      }
    }
  }, [isOpen, conversationData, setFieldValue])

  // Resetear formulario solo cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      // Usar setTimeout para evitar el bucle infinito
      const timer = setTimeout(() => {
        resetForm()
        setConversationSummary("")
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen, resetForm])

  const formFields = [
    {
      name: "name",
      label: "Nombre completo",
      type: "text" as const,
      required: true,
      placeholder: "Tu nombre"
    },
    {
      name: "email",
      label: "Email",
      type: "email" as const,
      required: true,
      placeholder: "tu@email.com"
    },
    {
      name: "company",
      label: "Empresa",
      type: "text" as const,
      placeholder: "Tu empresa"
    },
    {
      name: "phone",
      label: "Teléfono",
      type: "tel" as const,
      placeholder: "+1 234 567 8900"
    },
    {
      name: "projectType",
      label: "Tipo de proyecto",
      type: "select" as const,
      required: true,
      options: [
        { value: "landing-page", label: "Landing Page" },
        { value: "ai-platform", label: "Plataforma con IA" },
        { value: "rebranding", label: "Rebranding" },
        { value: "web-development", label: "Desarrollo Web" },
        { value: "consulting", label: "Consultoría" }
      ]
    },
    {
      name: "budget",
      label: "Presupuesto aproximado",
      type: "select" as const,
      required: true,
      options: [
        { value: "under-50k", label: "Menos de $50.000 ARS" },
        { value: "50k-100k", label: "$50.000 - $100.000 ARS" },
        { value: "100k-200k", label: "$100.000 - $200.000 ARS" },
        { value: "200k-500k", label: "$200.000 - $500.000 ARS" },
        { value: "over-500k", label: "Más de $500.000 ARS" }
      ]
    },
    {
      name: "timeline",
      label: "Timeline del proyecto",
      type: "select" as const,
      required: true,
      options: [
        { value: "urgent", label: "Urgente (1-2 semanas)" },
        { value: "normal", label: "Normal (1-2 meses)" },
        { value: "flexible", label: "Flexible (3+ meses)" }
      ]
    },
    {
      name: "preferredContactMethod",
      label: "Método de contacto preferido",
      type: "select" as const,
      required: true,
      options: [
        { value: "email", label: "Email" },
        { value: "whatsapp", label: "WhatsApp" },
        { value: "phone", label: "Llamada telefónica" }
      ]
    },
    {
      name: "requirements",
      label: "Requerimientos del proyecto",
      type: "textarea" as const,
      placeholder: "Describe los requerimientos específicos de tu proyecto..."
    }
  ]

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agendar Consulta Gratuita"
    >
      {/* Success State */}
      {status === 'success' && (
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
      {status !== 'success' && (
        <form onSubmit={submitForm} className="space-y-6">
          
          {/* Resumen de la conversación */}
          {conversationSummary && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <h3 className="text-blue-300 font-semibold mb-2">📋 Información extraída de la conversación:</h3>
              <p className="text-blue-200 text-sm leading-relaxed">{conversationSummary}</p>
            </div>
          )}
          
          {/* Campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.slice(0, 4).map((field) => (
              <FormField
                key={field.name}
                config={field}
                value={formData[field.name as keyof ChatConsultationFormData] || ""}
                onChange={handleInputChange}
                error={errors[field.name]}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.slice(4, 6).map((field) => (
              <FormField
                key={field.name}
                config={field}
                value={formData[field.name as keyof ChatConsultationFormData] || ""}
                onChange={handleInputChange}
                error={errors[field.name]}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.slice(6, 8).map((field) => (
              <FormField
                key={field.name}
                config={field}
                value={formData[field.name as keyof ChatConsultationFormData] || ""}
                onChange={handleInputChange}
                error={errors[field.name]}
              />
            ))}
          </div>

          <FormField
            config={formFields[8]}
            value={formData.requirements}
            onChange={handleInputChange}
            error={errors.requirements}
          />

          {/* Botón de envío */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-slate-600 hover:from-blue-600 hover:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
            >
              {status === 'loading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

          {/* Error message */}
          {status === 'error' && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-300 text-sm">
                Error al enviar la consulta. Por favor, inténtalo de nuevo.
              </p>
            </div>
          )}
        </form>
      )}
    </Modal>
  )
} 