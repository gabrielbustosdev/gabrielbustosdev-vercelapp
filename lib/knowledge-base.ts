// lib/knowledge-base.ts
export interface KnowledgeEntry {
    id: string
    title: string
    content: string
    category: string
    keywords: string[]
    priority: number
  }
  
  export const gabrielBustosKnowledge: KnowledgeEntry[] = [
    {
      id: "services-landing-pages",
      title: "Landing Pages que Convierten",
      content: "Diseño y desarrollo de sitios web modernos pensados para captar clientes y posicionar tu marca de forma efectiva. Incluye diseño profesional y responsive, formulario de contacto funcional con emails automáticos, optimización SEO y velocidad de carga, y despliegue en Vercel listo para producción.",
      category: "servicios",
      keywords: ["landing page", "sitio web", "diseño", "responsive", "seo", "conversión", "vercel", "formulario"],
      priority: 10
    },
    {
      id: "services-ai-platforms",
      title: "Plataformas Web con Inteligencia Artificial",
      content: "Desarrollo de plataformas a medida con funcionalidades inteligentes que potencian tu negocio y reducen tareas repetitivas. Incluye chatbots entrenados con IA generativa, automatización de tareas con OpenAI y otras APIs, análisis inteligente de datos con ML, y backend completo con Supabase o soluciones personalizadas.",
      category: "servicios",
      keywords: ["inteligencia artificial", "chatbot", "automatización", "openai", "machine learning", "supabase", "plataforma"],
      priority: 10
    },
    {
      id: "services-rebranding",
      title: "Rebranding y Optimización Total",
      content: "Renovación completa de sitios web existentes para hacerlos más rápidos, modernos y efectivos. Incluye auditoría técnica y visual del sitio actual, rediseño enfocado en conversión y experiencia de usuario, refactorización del código para mejor rendimiento, y mejoras en accesibilidad, SEO y escalabilidad.",
      category: "servicios",
      keywords: ["rebranding", "optimización", "renovación", "auditoría", "rediseño", "rendimiento", "accesibilidad"],
      priority: 10
    },
    {
      id: "services-web-development",
      title: "Desarrollo Web Profesional",
      content: "Desarrollo de aplicaciones web modernas utilizando tecnologías de vanguardia como Next.js, React, TypeScript y Tailwind CSS. Creamos soluciones escalables, rápidas y mantenibles que se adaptan a las necesidades específicas de cada proyecto.",
      category: "servicios",
      keywords: ["desarrollo web", "next.js", "react", "typescript", "tailwind", "aplicaciones", "escalable"],
      priority: 9
    },
    {
      id: "services-seo-optimization",
      title: "Optimización SEO y Rendimiento",
      content: "Mejora del posicionamiento en buscadores y optimización de la velocidad de carga de sitios web. Implementamos mejores prácticas de SEO técnico, optimización de imágenes, lazy loading, y técnicas avanzadas de caching para mejorar la experiencia del usuario.",
      category: "servicios",
      keywords: ["seo", "optimización", "rendimiento", "velocidad", "posicionamiento", "caching", "lazy loading"],
      priority: 8
    },
    {
      id: "services-responsive-design",
      title: "Diseño Responsive y UX",
      content: "Creación de interfaces de usuario intuitivas y atractivas que funcionan perfectamente en todos los dispositivos. Nos enfocamos en la experiencia del usuario, accesibilidad web y diseño moderno que refleja la identidad de tu marca.",
      category: "servicios",
      keywords: ["responsive", "diseño", "ux", "ui", "accesibilidad", "dispositivos", "interfaz"],
      priority: 8
    },
    {
      id: "company-about",
      title: "Acerca de Gabriel Bustos",
      content: "Gabriel Bustos es un desarrollador web profesional especializado en crear soluciones digitales efectivas que generan resultados reales. Con experiencia en tecnologías modernas como Next.js, React y inteligencia artificial, transformo ideas en plataformas web que impulsan el crecimiento de tu negocio.",
      category: "empresa",
      keywords: ["gabriel bustos", "desarrollador", "web", "profesional", "next.js", "react", "tecnologías"],
      priority: 8
    },
    {
      id: "contact-info",
      title: "Información de Contacto",
      content: "Puedes contactarme a través de mi portafolio web o redes sociales. Ofrezco consultas iniciales gratuitas para evaluar tu proyecto y entender tus necesidades. Mi horario de atención es flexible y me adapto a tu disponibilidad para reuniones.",
      category: "contacto",
      keywords: ["contacto", "consulta gratuita", "portafolio", "redes sociales", "reunión"],
      priority: 7
    },
    {
      id: "pricing-consultation",
      title: "Precios y Consultoría",
      content: "Ofrezco consultas iniciales gratuitas para entender tu proyecto y objetivos. Los precios varían según el alcance y complejidad del proyecto: Landing Pages desde $70.000 ARS, Plataformas con IA desde $150.000 ARS, y Rebranding desde $50.000 ARS. Proporciono cotizaciones detalladas después de la evaluación inicial.",
      category: "precios",
      keywords: ["precios", "consulta gratuita", "cotización", "landing page", "plataforma", "rebranding", "ars"],
      priority: 6
    },
    {
      id: "process-methodology",
      title: "Metodología de Trabajo",
      content: "Sigo una metodología ágil adaptada a cada proyecto. Comenzamos con una reunión inicial para entender tu proyecto y objetivos, seguida de una propuesta personalizada clara. El desarrollo es ágil con entregas regulares y feedback constante, culminando en lanzamiento y soporte post-producción.",
      category: "procesos",
      keywords: ["metodología", "ágil", "reunión inicial", "propuesta", "desarrollo", "entregas", "lanzamiento"],
      priority: 5
    },
    {
      id: "usecase-lead-generation",
      title: "Caso de Uso: Generación de Leads con Landing Page",
      content: "Implementé una landing page para una startup de marketing digital que aumentó la captación de leads en un 40% gracias a formularios optimizados, integración con WhatsApp y automatización de emails. El diseño responsive y la velocidad de carga fueron claves para la conversión.",
      category: "casos de uso",
      keywords: ["landing page", "leads", "formulario", "whatsapp", "automatización", "conversión", "startup", "marketing"],
      priority: 9
    },
    {
      id: "usecase-ai-automation",
      title: "Caso de Uso: Automatización con IA para E-commerce",
      content: "Desarrollé un sistema de chatbot y automatización de respuestas para una tienda online, usando OpenAI y WhatsApp API. El bot resolvía dudas frecuentes, recomendaba productos y gestionaba pedidos, reduciendo el tiempo de atención manual en un 60%.",
      category: "casos de uso",
      keywords: ["chatbot", "e-commerce", "automatización", "openai", "whatsapp", "tienda online", "soporte", "recomendaciones"],
      priority: 9
    },
    {
      id: "project-dashboard-ml",
      title: "Ejemplo: Dashboard de Machine Learning para PyME",
      content: "Proyecto de dashboard interactivo para una PyME industrial, integrando visualización de datos y predicción de demanda con modelos de machine learning. Incluyó autenticación, panel de métricas y reportes automáticos.",
      category: "proyectos",
      keywords: ["dashboard", "machine learning", "pyme", "visualización", "predicción", "autenticación", "reportes"],
      priority: 8
    },
    {
      id: "project-ecommerce-ai",
      title: "Ejemplo: E-commerce con Recomendaciones Inteligentes",
      content: "Desarrollo de tienda online con motor de recomendaciones personalizadas usando IA. Mejoró la tasa de conversión y el ticket promedio. Incluyó integración con pasarelas de pago y panel de administración.",
      category: "proyectos",
      keywords: ["e-commerce", "recomendaciones", "inteligencia artificial", "tienda online", "pagos", "panel administración"],
      priority: 8
    },
    {
      id: "project-smart-management",
      title: "Ejemplo: Sistema de Gestión Inteligente",
      content: "Sistema web para gestión de tareas y recursos en empresas, con módulos de IA para análisis de productividad y alertas automáticas. Usado por equipos remotos y adaptado a distintos rubros.",
      category: "proyectos",
      keywords: ["gestión", "inteligente", "tareas", "recursos", "productividad", "alertas", "empresas", "ia"],
      priority: 8
    }
  ]
  
  // Función para buscar en la base de conocimiento
  export function searchKnowledge(
    query: string,
    limit: number = 3,
    options?: {
      category?: string
      intentType?: string
      serviceType?: string
      requiredKeywords?: string[]
    }
  ): KnowledgeEntry[] {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2)
    const { category, intentType, serviceType, requiredKeywords } = options || {}

    const results = gabrielBustosKnowledge
      .map(entry => {
        let score = 0

        // Filtro por categoría si se especifica
        if (category && entry.category !== category) {
          score -= 5
        }
        // Filtro por tipo de servicio si se especifica
        if (serviceType && !entry.keywords.some(k => k.toLowerCase().includes(serviceType.toLowerCase()))) {
          score -= 3
        }
        // Filtro por intención si se especifica (ejemplo: casos de uso para "project_quote")
        if (intentType && intentType === 'project_quote' && entry.category === 'casos de uso') {
          score += 3
        }
        // Reforzar si contiene keywords requeridas
        if (requiredKeywords && requiredKeywords.length > 0) {
          requiredKeywords.forEach(req => {
            if (entry.keywords.some(k => k.toLowerCase().includes(req.toLowerCase()))) {
              score += 4
            }
          })
        }
        // Buscar en título (peso mayor)
        searchTerms.forEach(term => {
          if (entry.title.toLowerCase().includes(term)) {
            score += 3
          }
        })
        // Buscar en contenido
        searchTerms.forEach(term => {
          if (entry.content.toLowerCase().includes(term)) {
            score += 2
          }
        })
        // Buscar en keywords (peso mayor)
        searchTerms.forEach(term => {
          entry.keywords.forEach(keyword => {
            if (keyword.toLowerCase().includes(term)) {
              score += 4
            }
          })
        })
        // Aplicar prioridad base
        score += entry.priority
        return { ...entry, score }
      })
      .filter(entry => entry.score > entry.priority) // Solo entries con coincidencias
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return results
  }
  
  // Función para obtener contexto relevante dinámico
  export function getRelevantContext(
    query: string,
    options?: {
      category?: string
      intentType?: string
      serviceType?: string
      requiredKeywords?: string[]
      conversationStage?: string
    }
  ): string {
    const relevantEntries = searchKnowledge(query, 4, options)

    if (relevantEntries.length === 0) {
      return ""
    }

    // Si la etapa de la conversación es "collecting_requirements" o "project_quote", priorizar ejemplos y casos de uso
    let contextEntries = relevantEntries
    if (options?.conversationStage === 'collecting_requirements' || options?.intentType === 'project_quote') {
      const extra = gabrielBustosKnowledge.filter(e => e.category === 'casos de uso' || e.category === 'proyectos')
      contextEntries = [...relevantEntries, ...extra].slice(0, 6)
    }

    return contextEntries
      .map(entry => `**${entry.title}**\n${entry.content}`)
      .join('\n\n')
  }