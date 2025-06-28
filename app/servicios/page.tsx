import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Servicios - Gabriel Bustos",
  description: "Servicios de desarrollo full stack y soluciones de inteligencia artificial para empresas",
}

export default function ServiciosPage() {
  const services = [
    {
      title: "Desarrollo Web Full Stack",
      description: "Aplicaciones web completas con Next.js, React y tecnologías modernas",
      features: ["Desarrollo frontend y backend", "Bases de datos optimizadas", "APIs RESTful", "Responsive design"],
      price: "Desde $2,500",
      popular: false,
    },
    {
      title: "Integración de IA",
      description: "Implementación de agentes de IA y chatbots inteligentes en tu plataforma",
      features: ["Chatbots personalizados", "Análisis de datos con ML", "Automatización de procesos", "APIs de IA"],
      price: "Desde $3,500",
      popular: true,
    },
    {
      title: "Consultoría Técnica",
      description: "Asesoramiento especializado en arquitectura de software y estrategia tecnológica",
      features: ["Auditoría de código", "Arquitectura de sistemas", "Optimización de rendimiento", "Mentoring técnico"],
      price: "Desde $150/hora",
      popular: false,
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Mis{" "}
            <span className="bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent">Servicios</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Soluciones tecnológicas personalizadas para impulsar tu negocio al siguiente nivel
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative bg-white/5 backdrop-blur-sm rounded-xl border p-8 hover:bg-white/10 transition-all duration-300 ${
                service.popular ? "border-blue-400/50 ring-2 ring-blue-400/20" : "border-white/10"
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-slate-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Más Popular
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
              <p className="text-gray-300 mb-6">{service.description}</p>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="text-3xl font-bold text-white mb-6">{service.price}</div>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                  service.popular
                    ? "bg-gradient-to-r from-blue-500 to-slate-600 text-white hover:from-blue-600 hover:to-slate-700"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                Solicitar Cotización
              </button>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Mi Proceso de Trabajo</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consulta", desc: "Analizamos tus necesidades y objetivos" },
              { step: "02", title: "Propuesta", desc: "Desarrollo una solución personalizada" },
              { step: "03", title: "Desarrollo", desc: "Implemento la solución con actualizaciones regulares" },
              { step: "04", title: "Entrega", desc: "Despliegue y soporte post-lanzamiento" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-slate-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
