"use client"

import { motion } from "motion/react"
import Image from "next/image"

export default function Hero() {
  const techStack = [
    {
      name: "Next.js",
      icon: "/tech/NextJs.svg",
    },
    {
      name: "React",
      icon: "/tech/react.svg",
    },
    {
      name: "TypeScript",
      icon: "/tech/typescript.svg",
    },
    {
      name: "Node.js",
      icon: "/tech/nodejs.svg",
    },
    {
      name: "Git",
      icon: "/tech/gitHub.svg",
    },
    {
      name: "Docker",
      icon: "/tech/docker.svg",
    },
    {
      name: "AWS",
      icon: "/tech/AWS.svg",
    },
    {
      name: "MongoDB",
      icon: "/tech/mongodb.svg",
    },
    {
      name: "PostgreSQL",
      icon: "/tech/postgresql.svg",
    },
    {
      name: "Tailwind",
      icon: "/tech/tailwindcss.svg",
    },
    {
      name: "Vercel",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
    },
    {
      name: "GitHub",
      icon: "/tech/gitHub.svg",
    },
  ]

  const aiTools = [
    {
      name: "OpenAI",
      icon: "/tech/OpenAI.svg",
    },
    {
      name: "Python",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    },
    {
      name: "TensorFlow",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    },
    {
      name: "PyTorch",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
    },
    {
      name: "Jupyter",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
    },
    {
      name: "FastAPI",
      icon: "/tech/fastapi.svg",
    },
    {
      name: "Pandas",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
    },
    {
      name: "NumPy",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
    },
    {
      name: "Anaconda",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/anaconda/anaconda-original.svg",
    },
    {
      name: "Keras",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg",
    },
  ]

  // Duplicar arrays para efecto infinito
  const duplicatedTech = [...techStack, ...techStack]
  const duplicatedAI = [...aiTools, ...aiTools]

  return (
    <section id="inicio" className="py-32 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="space-y-8">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Desarrollo{" "}
            <span className="bg-gradient-to-r from-blue-400 via-slate-300 to-zinc-300 bg-clip-text text-transparent">
              Soluciones AI
            </span>
            <br />
            que Transforman Negocios
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Creo sitios web modernos y aplicaciones que integran inteligencia artificial para automatizar procesos,
            mejorar la experiencia del usuario y potenciar el crecimiento de tu negocio.
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">Desarrollo Web</span>
            <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">Inteligencia Artificial</span>
            <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">Automatización</span>
            <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">Chatbots</span>
            <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">APIs Inteligentes</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button className="bg-gradient-to-r from-blue-500 to-slate-600 text-white px-8 py-4 rounded-full hover:from-blue-600 hover:to-slate-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Ver mi Portafolio
            </button>
            <button className="border border-white/20 text-white px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-300 font-semibold text-lg backdrop-blur-sm">
              Agendar Consulta
            </button>
          </div>

          {/* Technology Carousels */}
          <div className="pt-16 space-y-8 overflow-hidden">
            {/* Tech Stack Carousel - Moving Right */}
            <div className="relative">
              <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
              <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-slate-900 to-transparent z-10"></div>

              <motion.div
                className="flex space-x-6"
                animate={{
                  x: [0, -50 * techStack.length],
                }}
                transition={{
                  x: {
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    duration: 35,
                    ease: "linear",
                  },
                }}
              >
                {duplicatedTech.map((tech, index) => (
                  <div
                    key={`${tech.name}-${index}`}
                    className="flex-shrink-0 flex items-center space-x-3 bg-white/30 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10 min-w-[140px]"
                  >
                    {tech.icon.startsWith("http") ? (
                      <Image
                        src={tech.icon || "/placeholder.svg"}
                        alt={tech.name}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                        unoptimized
                      />
                    ) : (
                      <Image
                        src={tech.icon || "/placeholder.svg"}
                        alt={tech.name}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <span className="text-white font-medium text-sm">{tech.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* AI Tools Carousel - Moving Left */}
            <div className="relative">
              <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
              <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-slate-900 to-transparent z-10"></div>

              <motion.div
                className="flex space-x-6"
                animate={{
                  x: [-50 * aiTools.length, 0],
                }}
                transition={{
                  x: {
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    duration: 45,
                    ease: "linear",
                  },
                }}
              >
                {duplicatedAI.map((tool, index) => (
                  <div
                    key={`${tool.name}-${index}`}
                    className="flex-shrink-0 flex items-center space-x-3 bg-blue-500/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-blue-500/20 min-w-[140px]"
                  >
                    {tool.icon.startsWith("http") ? (
                      <Image
                        src={tool.icon || "/placeholder.svg"}
                        alt={tool.name}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                        unoptimized
                      />
                    ) : typeof tool.icon === "string" && tool.icon.startsWith("/") ? (
                      <Image
                        src={tool.icon || "/placeholder.svg"}
                        alt={tool.name}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <span className="text-2xl">{tool.icon}</span>
                    )}
                    <span className="text-blue-300 font-medium text-sm">{tool.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-10 w-32 h-32 bg-slate-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-zinc-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
    </section>
  )
}
