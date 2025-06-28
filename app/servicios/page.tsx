import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios - Gabriel Bustos",
  description: "Desarrollo web profesional con Next.js y soluciones con inteligencia artificial. Creamos sitios efectivos que generan resultados.",
};

export default function ServiciosPage() {
  const services = [
    {
      title: "Landing Page que Convierten",
      description: "Diseño y desarrollo de sitios web modernos pensados para captar clientes y posicionar tu marca de forma efectiva.",
      features: [
        "Diseño profesional y responsive",
        "Formulario de contacto funcional (emails automáticos)",
        "Optimización SEO y velocidad de carga",
        "Despliegue en Vercel listo para producción",
      ],
      price: "Desde $70.000 ARS",
      popular: false,
    },
    {
      title: "Plataformas Web con Inteligencia Artificial",
      description: "Desarrollo de plataformas a medida con funcionalidades inteligentes que potencian tu negocio y reducen tareas repetitivas.",
      features: [
        "Chatbots entrenados con IA generativa",
        "Automatización de tareas con OpenAI y otras APIs",
        "Análisis inteligente de datos con ML",
        "Backend completo con Supabase o soluciones personalizadas",
      ],
      price: "Desde $150.000 ARS",
      popular: true,
    },
    {
      title: "Rebranding y Optimización Total",
      description: "¿Ya tenés un sitio web? Te ayudo a renovarlo por completo: más rápido, más moderno, más efectivo.",
      features: [
        "Auditoría técnica y visual de tu sitio actual",
        "Rediseño enfocado en conversión y experiencia de usuario",
        "Refactorización del código para mejor rendimiento",
        "Mejoras en accesibilidad, SEO y escalabilidad",
      ],
      price: "Desde $50.000 ARS",
      popular: false,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Servicios que <span className="bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent">impulsan tu negocio</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Desarrollo web moderno, funcional y enfocado en resultados. Transformá tu idea en una solución real.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative bg-white/5 backdrop-blur-sm rounded-xl border p-8 transition-all duration-300 flex flex-col justify-between 
        ${service.popular
                  ? "md:scale-105 md:col-span-1 border-blue-400/50 ring-2 ring-blue-400/20 shadow-xl scale-[1.05] md:col-span-1 md:row-span-1"
                  : "border-white/10"
                }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-slate-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Más Popular
                  </span>
                </div>
              )}

              {/* Título */}
              <h3 className="text-2xl font-bold text-white mb-4 text-center">{service.title}</h3>

              {/* Descripción */}
              <p className="text-gray-300 mb-6 text-center">{service.description}</p>

              {/* Features */}
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

              {/* Precio */}
              <div className="text-3xl font-bold text-white mb-6 text-center">{service.price}</div>

              {/* Botón */}
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 
          ${service.popular
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
          <h2 className="text-3xl font-bold text-white mb-12">¿Cómo trabajo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Reunión Inicial", desc: "Entiendo tu proyecto, objetivos y visión." },
              { step: "02", title: "Propuesta Personalizada", desc: "Te presento una solución clara, técnica y comercial." },
              { step: "03", title: "Desarrollo Ágil", desc: "Implemento con entregas regulares y tu feedback constante." },
              { step: "04", title: "Lanzamiento y Soporte", desc: "Publicamos tu sitio y te acompaño después del lanzamiento." },
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
  );
}
