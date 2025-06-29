// Interfaces para tipos de proyectos y servicios

// Tipos de servicios disponibles
export type ServiceType = 
  | 'web_development'
  | 'ai_integration'
  | 'consulting'
  | 'rebranding'
  | 'landing_page'
  | 'ecommerce'
  | 'mobile_app'
  | 'api_development'
  | 'database_design'
  | 'cloud_migration'
  | 'maintenance'
  | 'training'

// Categorías de proyectos
export type ProjectCategory = 
  | 'business'
  | 'ecommerce'
  | 'saas'
  | 'portfolio'
  | 'blog'
  | 'dashboard'
  | 'mobile'
  | 'api'
  | 'ai_ml'
  | 'consulting'

// Complejidad del proyecto
export type ProjectComplexity = 'simple' | 'medium' | 'complex' | 'enterprise'

// Estado del proyecto
export type ProjectStatus = 
  | 'inquiry'
  | 'proposal'
  | 'negotiation'
  | 'approved'
  | 'in_progress'
  | 'review'
  | 'completed'
  | 'maintenance'
  | 'cancelled'

// Tecnologías disponibles
export interface Technology {
  name: string
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'ai' | 'devops' | 'mobile'
  version?: string
  experience: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

// Requerimientos técnicos
export interface TechnicalRequirements {
  technologies: Technology[]
  integrations?: string[]
  thirdPartyServices?: string[]
  performance?: {
    loadTime?: string
    concurrentUsers?: number
    dataVolume?: string
  }
  security?: {
    authentication: boolean
    encryption: boolean
    compliance?: string[]
  }
  scalability?: {
    expectedGrowth: string
    autoScaling: boolean
    loadBalancing: boolean
  }
}

// Requerimientos de diseño
export interface DesignRequirements {
  style: 'modern' | 'classic' | 'minimalist' | 'bold' | 'corporate' | 'creative'
  colorScheme?: string[]
  branding?: {
    logo: boolean
    brandGuidelines: boolean
    colorPalette: boolean
  }
  responsive: boolean
  accessibility: boolean
  animations: boolean
  customIllustrations?: boolean
}

// Requerimientos de contenido
export interface ContentRequirements {
  pages: string[]
  languages: string[]
  contentManagement: boolean
  seo: boolean
  blog?: boolean
  socialMedia?: boolean
  multimedia?: {
    images: boolean
    videos: boolean
    audio: boolean
  }
}

// Requerimientos de funcionalidad
export interface FunctionalRequirements {
  userManagement: boolean
  authentication: boolean
  paymentProcessing?: boolean
  analytics: boolean
  notifications: boolean
  search: boolean
  filters: boolean
  exportData?: boolean
  apiAccess?: boolean
  adminPanel: boolean
}

// Requerimientos de IA
export interface AIRequirements {
  chatbot: boolean
  recommendationEngine?: boolean
  dataAnalysis?: boolean
  automation?: boolean
  machineLearning?: boolean
  naturalLanguageProcessing?: boolean
  computerVision?: boolean
  predictiveAnalytics?: boolean
}

// Presupuesto del proyecto
export interface ProjectBudget {
  total: number
  currency: 'USD' | 'ARS' | 'EUR'
  breakdown?: {
    design: number
    development: number
    testing: number
    deployment: number
    maintenance: number
  }
  paymentSchedule: 'upfront' | 'milestone' | 'monthly' | 'upon_completion'
  flexibility: 'fixed' | 'flexible' | 'negotiable'
}

// Cronograma del proyecto
export interface ProjectTimeline {
  startDate?: string
  endDate?: string
  duration: string
  phases: {
    name: string
    duration: string
    deliverables: string[]
  }[]
  milestones: {
    name: string
    date: string
    description: string
  }[]
  dependencies?: string[]
}

// Proyecto base
export interface BaseProject {
  id: string
  title: string
  description: string
  category: ProjectCategory
  serviceType: ServiceType
  complexity: ProjectComplexity
  status: ProjectStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  budget: ProjectBudget
  timeline: ProjectTimeline
  requirements: {
    technical: TechnicalRequirements
    design: DesignRequirements
    content: ContentRequirements
    functional: FunctionalRequirements
    ai?: AIRequirements
  }
  createdAt: Date
  updatedAt: Date
}

// Proyecto de desarrollo web
export interface WebDevelopmentProject extends BaseProject {
  serviceType: 'web_development' | 'landing_page' | 'ecommerce'
  requirements: {
    technical: TechnicalRequirements
    design: DesignRequirements
    content: ContentRequirements
    functional: FunctionalRequirements
    ai?: AIRequirements
  } & {
    seo: boolean
    analytics: boolean
    socialMedia: boolean
    blog?: boolean
    ecommerce?: {
      products: number
      paymentMethods: string[]
      inventory: boolean
      shipping: boolean
    }
  }
}

// Proyecto de integración de IA
export interface AIIntegrationProject extends BaseProject {
  serviceType: 'ai_integration'
  requirements: {
    technical: TechnicalRequirements
    design: DesignRequirements
    content: ContentRequirements
    functional: FunctionalRequirements
    ai: AIRequirements
  } & {
    dataSources: string[]
    trainingData?: boolean
    modelCustomization: boolean
    apiIntegration: boolean
    monitoring: boolean
  }
}

// Proyecto de consultoría
export interface ConsultingProject extends BaseProject {
  serviceType: 'consulting'
  requirements: {
    technical: TechnicalRequirements
    design: DesignRequirements
    content: ContentRequirements
    functional: FunctionalRequirements
    ai?: AIRequirements
  } & {
    auditType: 'technical' | 'business' | 'security' | 'performance' | 'seo'
    deliverables: string[]
    recommendations: boolean
    implementation: boolean
    training: boolean
  }
}

// Proyecto de rebranding
export interface RebrandingProject extends BaseProject {
  serviceType: 'rebranding'
  requirements: {
    technical: TechnicalRequirements
    design: DesignRequirements
    content: ContentRequirements
    functional: FunctionalRequirements
    ai?: AIRequirements
  } & {
    brandElements: {
      logo: boolean
      colorPalette: boolean
      typography: boolean
      imagery: boolean
      voice: boolean
    }
    applications: string[]
    guidelines: boolean
    templates: boolean
  }
}

// Proyecto completo con toda la información
export interface CompleteProject extends BaseProject {
  clientId: string
  team?: {
    projectManager: string
    designers: string[]
    developers: string[]
    qa: string[]
  }
  communication: {
    platform: string
    frequency: string
    updates: boolean
  }
  files?: {
    contracts: string[]
    designs: string[]
    documents: string[]
  }
  notes: string[]
  tags: string[]
}

// Tipos para validación
export type ProjectType = WebDevelopmentProject | AIIntegrationProject | ConsultingProject | RebrandingProject 