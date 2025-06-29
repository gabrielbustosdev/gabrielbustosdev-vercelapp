import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Portafolio - Gabriel Bustos",
  description: "Explora mis proyectos de desarrollo full stack y soluciones de inteligencia artificial",
}

export default function PortafolioPage() {
  const projects = [
    {
      id: 1,
      title: "E-commerce con AI Chatbot",
      description: "Plataforma de comercio electrónico con asistente virtual integrado para atención al cliente 24/7",
      tech: ["Next.js", "OpenAI", "Stripe", "PostgreSQL"],
      status: "Completado",
      image: "/projects/ECommerce-AI.png",
    },
    {
      id: 2,
      title: "Dashboard Analytics con ML",
      description:
        "Dashboard empresarial con predicciones de ventas usando machine learning y visualizaciones interactivas",
      tech: ["React", "Python", "TensorFlow", "D3.js"],
      status: "En desarrollo",
      image: "/projects/Dashboard-ML.png",
    },
    {
      id: 3,
      title: "App de Gestión Inteligente",
      description: "Sistema de gestión empresarial con automatización de procesos mediante IA",
      tech: ["Next.js", "Node.js", "MongoDB", "OpenAI"],
      status: "Completado",
      image: "/projects/smart-management.png",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Mi{" "}
            <span className="bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent">
              Portafolio
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Proyectos que demuestran mi experiencia en desarrollo full stack y soluciones de inteligencia artificial
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-slate-600/20 flex items-center justify-center">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${project.status === "Completado"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                      }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-white mb-4">¿Tienes un proyecto en mente?</h2>
          <p className="text-gray-300 mb-8">Hablemos sobre cómo puedo ayudarte a llevarlo al siguiente nivel</p>
          <Link
            href={"/contacto"}
            className="bg-gradient-to-r from-blue-500 to-slate-600 text-white px-8 py-4 rounded-full hover:from-blue-600 hover:to-slate-700 transition-all duration-300 font-semibold text-lg">
            Iniciar Proyecto
          </Link>
        </div>
      </div>
    </main>
  )
}
