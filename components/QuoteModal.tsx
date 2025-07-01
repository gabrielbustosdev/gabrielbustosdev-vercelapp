"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import type { QuoteForm } from "@/schemas/form-schemas"
import { QuoteFormSchema } from "@/schemas/form-schemas"
import type { ZodIssue } from "zod"

interface QuoteModalProps {
  isOpen: boolean
  onClose: () => void
  selectedService?: {
    title: string
    description: string
    price: string
  }
}

export default function QuoteModal({ isOpen, onClose, selectedService }: QuoteModalProps) {
  const [formData, setFormData] = useState<QuoteForm>({
    type: "quote",
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
    service: undefined,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteForm, string>>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrors({})

    // Validación básica en frontend para UX
    const result = QuoteFormSchema.safeParse({ ...formData, service: selectedService })
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof QuoteForm, string>> = {}
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof QuoteForm
        if (!fieldErrors[field]) fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, service: selectedService }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({
          type: "quote",
          name: "",
          email: "",
          company: "",
          phone: "",
          message: "",
          service: undefined,
        })
        setTimeout(() => {
          onClose()
          setSubmitStatus("idle")
        }, 2000)
      } else {
        // Manejar errores de validación del backend
        const data = await response.json()
        if (data.details && Array.isArray(data.details)) {
          const fieldErrors: Partial<Record<keyof QuoteForm, string>> = {}
          data.details.forEach((err: ZodIssue) => {
            const field = err.path[0] as keyof QuoteForm
            if (!fieldErrors[field]) fieldErrors[field] = err.message
          })
          setErrors(fieldErrors)
        }
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Solicitar Cotización
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Service Info */}
            {selectedService && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">{selectedService.title}</h3>
                <p className="text-gray-300 text-sm mb-2">{selectedService.description}</p>
                <p className="text-blue-400 font-semibold">{selectedService.price}</p>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Tu empresa"
                  />
                  {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="+1 234 567 8900"
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>



              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Cuéntame sobre tu proyecto *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                  placeholder="Describe tu idea, qué necesitas que haga tu aplicación o sitio web, y cualquier característica especial que tengas en mente..."
                />
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
              </div>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-400 text-center">¡Solicitud enviada exitosamente! Te contactaré dentro de las próximas 24 horas para discutir tu proyecto.</p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400 text-center">
                    Hubo un error al enviar la solicitud. Por favor, intenta nuevamente.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-slate-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-slate-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Enviando..." : "Solicitar Cotización"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 