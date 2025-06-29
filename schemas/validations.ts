import { z } from 'zod'

// Esquemas de validación para clientes
export const ClientBasicInfoSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  website: z.string().url('URL inválida').optional().or(z.literal(''))
})

export const ClientLocationSchema = z.object({
  country: z.string().min(2, 'País requerido'),
  city: z.string().optional(),
  state: z.string().optional(),
  timezone: z.string().optional()
})

export const CompanyInfoSchema = z.object({
  name: z.string().min(2, 'Nombre de empresa requerido'),
  industry: z.string().min(2, 'Industria requerida'),
  size: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  description: z.string().optional(),
  founded: z.number().int().positive().optional(),
  employees: z.number().int().positive().optional()
})

export const ClientProfileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  position: z.string().optional(),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  location: ClientLocationSchema.optional(),
  company: CompanyInfoSchema.optional(),
  contactPreferences: z.object({
    preferredMethod: z.enum(['email', 'phone', 'whatsapp']),
    frequency: z.enum(['immediate', 'daily', 'weekly']),
    language: z.enum(['es', 'en'])
  }),
  projectHistory: z.object({
    previousProjects: z.number().int().min(0),
    budgetRange: z.string().optional(),
    timelinePreference: z.string().optional()
  }).optional(),
  communicationStyle: z.enum(['formal', 'casual', 'technical', 'business']),
  urgency: z.enum(['low', 'medium', 'high', 'urgent']),
  budget: z.object({
    range: z.string().min(1, 'Rango de presupuesto requerido'),
    currency: z.enum(['USD', 'ARS', 'EUR']),
    flexibility: z.enum(['fixed', 'flexible', 'negotiable'])
  }),
  timeline: z.object({
    preference: z.enum(['urgent', 'normal', 'flexible']),
    startDate: z.string().optional(),
    deadline: z.string().optional(),
    description: z.string().optional()
  })
})

// Esquemas de validación para proyectos
export const TechnologySchema = z.object({
  name: z.string().min(1, 'Nombre de tecnología requerido'),
  category: z.enum(['frontend', 'backend', 'database', 'cloud', 'ai', 'devops', 'mobile']),
  version: z.string().optional(),
  experience: z.enum(['beginner', 'intermediate', 'advanced', 'expert'])
})

export const TechnicalRequirementsSchema = z.object({
  technologies: z.array(TechnologySchema).min(1, 'Al menos una tecnología requerida'),
  integrations: z.array(z.string()).optional(),
  thirdPartyServices: z.array(z.string()).optional(),
  performance: z.object({
    loadTime: z.string().optional(),
    concurrentUsers: z.number().int().positive().optional(),
    dataVolume: z.string().optional()
  }).optional(),
  security: z.object({
    authentication: z.boolean(),
    encryption: z.boolean(),
    compliance: z.array(z.string()).optional()
  }).optional(),
  scalability: z.object({
    expectedGrowth: z.string(),
    autoScaling: z.boolean(),
    loadBalancing: z.boolean()
  }).optional()
})

export const ProjectBudgetSchema = z.object({
  total: z.number().positive('Presupuesto debe ser positivo'),
  currency: z.enum(['USD', 'ARS', 'EUR']),
  breakdown: z.object({
    design: z.number().min(0),
    development: z.number().min(0),
    testing: z.number().min(0),
    deployment: z.number().min(0),
    maintenance: z.number().min(0)
  }).optional(),
  paymentSchedule: z.enum(['upfront', 'milestone', 'monthly', 'upon_completion']),
  flexibility: z.enum(['fixed', 'flexible', 'negotiable'])
})

export const ProjectTimelineSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  duration: z.string().min(1, 'Duración requerida'),
  phases: z.array(z.object({
    name: z.string().min(1, 'Nombre de fase requerido'),
    duration: z.string().min(1, 'Duración de fase requerida'),
    deliverables: z.array(z.string()).min(1, 'Al menos un deliverable requerido')
  })).min(1, 'Al menos una fase requerida'),
  milestones: z.array(z.object({
    name: z.string().min(1, 'Nombre de milestone requerido'),
    date: z.string().min(1, 'Fecha de milestone requerida'),
    description: z.string().min(1, 'Descripción de milestone requerida')
  })).optional(),
  dependencies: z.array(z.string()).optional()
})

export const BaseProjectSchema = z.object({
  id: z.string().uuid('ID inválido'),
  title: z.string().min(3, 'Título debe tener al menos 3 caracteres').max(200),
  description: z.string().min(10, 'Descripción debe tener al menos 10 caracteres'),
  category: z.enum(['business', 'ecommerce', 'saas', 'portfolio', 'blog', 'dashboard', 'mobile', 'api', 'ai_ml', 'consulting']),
  serviceType: z.enum(['web_development', 'ai_integration', 'consulting', 'rebranding', 'landing_page', 'ecommerce', 'mobile_app', 'api_development', 'database_design', 'cloud_migration', 'maintenance', 'training']),
  complexity: z.enum(['simple', 'medium', 'complex', 'enterprise']),
  status: z.enum(['inquiry', 'proposal', 'negotiation', 'approved', 'in_progress', 'review', 'completed', 'maintenance', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  budget: ProjectBudgetSchema,
  timeline: ProjectTimelineSchema,
  requirements: z.object({
    technical: TechnicalRequirementsSchema,
    design: z.object({
      style: z.enum(['modern', 'classic', 'minimalist', 'bold', 'corporate', 'creative']),
      colorScheme: z.array(z.string()).optional(),
      branding: z.object({
        logo: z.boolean(),
        brandGuidelines: z.boolean(),
        colorPalette: z.boolean()
      }).optional(),
      responsive: z.boolean(),
      accessibility: z.boolean(),
      animations: z.boolean(),
      customIllustrations: z.boolean().optional()
    }),
    content: z.object({
      pages: z.array(z.string()).min(1, 'Al menos una página requerida'),
      languages: z.array(z.string()).min(1, 'Al menos un idioma requerido'),
      contentManagement: z.boolean(),
      seo: z.boolean(),
      blog: z.boolean().optional(),
      socialMedia: z.boolean().optional(),
      multimedia: z.object({
        images: z.boolean(),
        videos: z.boolean(),
        audio: z.boolean()
      }).optional()
    }),
    functional: z.object({
      userManagement: z.boolean(),
      authentication: z.boolean(),
      paymentProcessing: z.boolean().optional(),
      analytics: z.boolean(),
      notifications: z.boolean(),
      search: z.boolean(),
      filters: z.boolean(),
      exportData: z.boolean().optional(),
      apiAccess: z.boolean().optional(),
      adminPanel: z.boolean()
    }),
    ai: z.object({
      chatbot: z.boolean(),
      recommendationEngine: z.boolean().optional(),
      dataAnalysis: z.boolean().optional(),
      automation: z.boolean().optional(),
      machineLearning: z.boolean().optional(),
      naturalLanguageProcessing: z.boolean().optional(),
      computerVision: z.boolean().optional(),
      predictiveAnalytics: z.boolean().optional()
    }).optional()
  }),
  createdAt: z.date(),
  updatedAt: z.date()
})

// Esquemas de validación para conversaciones
export const MessageMetadataSchema = z.object({
  id: z.string().uuid('ID inválido'),
  timestamp: z.date(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1, 'Contenido requerido'),
  sentiment: z.enum(['positive', 'neutral', 'negative', 'frustrated', 'excited', 'confused']).optional(),
  intent: z.enum(['greeting', 'information_request', 'pricing_inquiry', 'service_inquiry', 'complaint', 'booking', 'support', 'goodbye', 'clarification', 'objection']).optional(),
  confidence: z.number().min(0).max(1).optional(),
  entities: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    budget: z.string().optional(),
    timeline: z.string().optional(),
    projectType: z.string().optional()
  }).optional(),
  keywords: z.array(z.string()).optional(),
  responseTime: z.number().positive().optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().ip().optional(),
  location: z.object({
    country: z.string().optional(),
    city: z.string().optional(),
    timezone: z.string().optional()
  }).optional()
})

export const ConversationAnalysisSchema = z.object({
  overallSentiment: z.enum(['positive', 'neutral', 'negative', 'frustrated', 'excited', 'confused']),
  dominantIntent: z.enum(['greeting', 'information_request', 'pricing_inquiry', 'service_inquiry', 'complaint', 'booking', 'support', 'goodbye', 'clarification', 'objection']),
  keyTopics: z.array(z.string()),
  objections: z.array(z.string()).optional(),
  painPoints: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  urgency: z.enum(['low', 'medium', 'high', 'urgent']),
  qualification: z.enum(['unqualified', 'qualified', 'highly_qualified']),
  leadScore: z.number().min(0).max(100),
  conversionProbability: z.number().min(0).max(1),
  nextBestAction: z.string().optional(),
  followUpRequired: z.boolean(),
  followUpType: z.enum(['email', 'call', 'meeting', 'proposal']).optional(),
  followUpTiming: z.enum(['immediate', 'within_hour', 'within_day', 'within_week']).optional()
})

export const ConversationMetricsSchema = z.object({
  totalMessages: z.number().int().min(0),
  userMessages: z.number().int().min(0),
  assistantMessages: z.number().int().min(0),
  averageResponseTime: z.number().positive(),
  conversationDuration: z.number().positive(),
  messageLength: z.object({
    average: z.number().positive(),
    shortest: z.number().positive(),
    longest: z.number().positive()
  }),
  engagement: z.object({
    clicks: z.number().int().min(0),
    scrolls: z.number().int().min(0),
    timeOnPage: z.number().positive(),
    interactions: z.number().int().min(0)
  }),
  satisfaction: z.object({
    score: z.number().min(1).max(5),
    feedback: z.string().optional()
  }).optional()
})

export const CompleteConversationSchema = z.object({
  id: z.string().uuid('ID inválido'),
  sessionId: z.string().min(1, 'Session ID requerido'),
  type: z.enum(['inquiry', 'consultation', 'support', 'sales', 'onboarding', 'feedback']),
  state: z.enum(['idle', 'greeting', 'collecting_info', 'qualifying_lead', 'presenting_solution', 'addressing_concerns', 'closing', 'follow_up', 'completed', 'abandoned']),
  context: z.object({
    sessionId: z.string(),
    userId: z.string().optional(),
    clientId: z.string().optional(),
    projectId: z.string().optional(),
    referrer: z.string().optional(),
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),
    utmTerm: z.string().optional(),
    utmContent: z.string().optional(),
    deviceInfo: z.object({
      userAgent: z.string(),
      platform: z.string(),
      browser: z.string(),
      screenResolution: z.string().optional(),
      language: z.string()
    }),
    location: z.object({
      country: z.string(),
      city: z.string().optional(),
      timezone: z.string(),
      ipAddress: z.string()
    }).optional(),
    previousInteractions: z.number().int().min(0).optional(),
    lastVisit: z.date().optional(),
    returningUser: z.boolean()
  }),
  messages: z.array(MessageMetadataSchema),
  analysis: ConversationAnalysisSchema,
  metrics: ConversationMetricsSchema,
  flow: z.object({
    currentState: z.enum(['idle', 'greeting', 'collecting_info', 'qualifying_lead', 'presenting_solution', 'addressing_concerns', 'closing', 'follow_up', 'completed', 'abandoned']),
    previousStates: z.array(z.enum(['idle', 'greeting', 'collecting_info', 'qualifying_lead', 'presenting_solution', 'addressing_concerns', 'closing', 'follow_up', 'completed', 'abandoned'])),
    transitions: z.array(z.object({
      from: z.enum(['idle', 'greeting', 'collecting_info', 'qualifying_lead', 'presenting_solution', 'addressing_concerns', 'closing', 'follow_up', 'completed', 'abandoned']),
      to: z.enum(['idle', 'greeting', 'collecting_info', 'qualifying_lead', 'presenting_solution', 'addressing_concerns', 'closing', 'follow_up', 'completed', 'abandoned']),
      trigger: z.string(),
      timestamp: z.date()
    })),
    goals: z.object({
      primary: z.string(),
      secondary: z.array(z.string()).optional()
    }),
    blockers: z.array(z.object({
      type: z.string(),
      description: z.string(),
      resolved: z.boolean()
    })).optional(),
    nextSteps: z.array(z.string())
  }),
  extractedData: z.object({
    client: z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      company: z.string().optional(),
      position: z.string().optional(),
      website: z.string().optional()
    }),
    project: z.object({
      type: z.string().optional(),
      description: z.string().optional(),
      requirements: z.string().optional(),
      budget: z.string().optional(),
      timeline: z.string().optional(),
      urgency: z.string().optional()
    }),
    preferences: z.object({
      communicationMethod: z.string().optional(),
      language: z.string().optional(),
      timezone: z.string().optional()
    }),
    concerns: z.array(z.string()).optional(),
    objections: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    painPoints: z.array(z.string()).optional()
  }),
  tags: z.array(z.string()),
  notes: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  endedAt: z.date().optional()
})

// Esquemas de validación para formularios
export const ContactFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  company: z.string().optional(),
  project: z.enum(['web', 'ai', 'consulting', 'other']).optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(1000)
})

export const ConsultationFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.enum(['Landing Page', 'Plataforma con IA', 'Rebranding', 'Desarrollo Web', 'Consultoría']),
  requirements: z.string().min(10, 'Los requerimientos deben tener al menos 10 caracteres'),
  budget: z.string().min(1, 'Presupuesto requerido'),
  timeline: z.string().min(1, 'Timeline requerido'),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']).default('email'),
  availability: z.string().optional(),
  additionalInfo: z.string().optional()
})

// Esquemas de validación para análisis en tiempo real
export const RealTimeAnalysisSchema = z.object({
  messageId: z.string().uuid('ID de mensaje inválido'),
  sentiment: z.enum(['positive', 'neutral', 'negative', 'frustrated', 'excited', 'confused']),
  intent: z.enum(['greeting', 'information_request', 'pricing_inquiry', 'service_inquiry', 'complaint', 'booking', 'support', 'goodbye', 'clarification', 'objection']),
  confidence: z.number().min(0).max(1),
  entities: z.record(z.any()),
  keywords: z.array(z.string()),
  suggestions: z.array(z.string()),
  nextBestAction: z.string().optional(),
  riskScore: z.number().min(0).max(1).optional(),
  timestamp: z.date()
})

// Función helper para validar datos
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      }
    }
    return { success: false, errors: ['Error de validación desconocido'] }
  }
}

// Función helper para validar datos parciales
export const validatePartialData = (schema: z.ZodObject<any>, data: unknown): { success: true; data: any } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.partial().parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      }
    }
    return { success: false, errors: ['Error de validación desconocido'] }
  }
} 