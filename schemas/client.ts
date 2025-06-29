// Interfaces para información del cliente

// Información básica del cliente
export interface ClientBasicInfo {
  name: string
  email: string
  phone?: string
  company?: string
  position?: string
  website?: string
}

// Información de contacto extendida
export interface ClientContactInfo extends ClientBasicInfo {
  preferredContactMethod: 'email' | 'phone' | 'whatsapp'
  timezone?: string
  availability?: {
    weekdays: boolean
    weekends: boolean
    preferredHours?: string
  }
  language: 'es' | 'en'
}

// Información de ubicación
export interface ClientLocation {
  country: string
  city?: string
  state?: string
  timezone?: string
}

// Información de la empresa
export interface CompanyInfo {
  name: string
  industry: string
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  website?: string
  description?: string
  founded?: number
  employees?: number
}

// Información completa del cliente
export interface ClientProfile extends Omit<ClientBasicInfo, 'company'> {
  location?: ClientLocation
  company?: CompanyInfo
  contactPreferences: {
    preferredMethod: 'email' | 'phone' | 'whatsapp'
    frequency: 'immediate' | 'daily' | 'weekly'
    language: 'es' | 'en'
  }
  projectHistory?: {
    previousProjects: number
    budgetRange?: string
    timelinePreference?: string
  }
  communicationStyle: 'formal' | 'casual' | 'technical' | 'business'
  urgency: 'low' | 'medium' | 'high' | 'urgent'
  budget: {
    range: string
    currency: 'USD' | 'ARS' | 'EUR'
    flexibility: 'fixed' | 'flexible' | 'negotiable'
  }
  timeline: {
    preference: 'urgent' | 'normal' | 'flexible'
    startDate?: string
    deadline?: string
    description?: string
  }
}

// Información de sesión del cliente
export interface ClientSession {
  sessionId: string
  startTime: Date
  lastActivity: Date
  deviceInfo?: {
    userAgent: string
    platform: string
    screenResolution?: string
  }
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

// Preferencias de comunicación
export interface CommunicationPreferences {
  language: 'es' | 'en'
  tone: 'formal' | 'casual' | 'professional' | 'friendly'
  detailLevel: 'basic' | 'detailed' | 'technical'
  responseTime: 'immediate' | 'within_hour' | 'within_day' | 'flexible'
  followUp: boolean
  newsletter: boolean
  marketing: boolean
}

// Historial de interacciones
export interface InteractionHistory {
  totalInteractions: number
  firstContact: Date
  lastContact: Date
  averageResponseTime?: number
  satisfactionScore?: number
  previousProjects?: string[]
  notes?: string[]
}

// Cliente completo con toda la información
export interface CompleteClient extends ClientProfile {
  session: ClientSession
  communication: CommunicationPreferences
  history: InteractionHistory
  tags: string[]
  status: 'prospect' | 'lead' | 'client' | 'inactive'
  priority: 'low' | 'medium' | 'high' | 'vip'
  createdAt: Date
  updatedAt: Date
}

// Tipos para validación
export type ClientStatus = 'prospect' | 'lead' | 'client' | 'inactive'
export type ClientPriority = 'low' | 'medium' | 'high' | 'vip'
export type ContactMethod = 'email' | 'phone' | 'whatsapp'
export type Language = 'es' | 'en'
export type Currency = 'USD' | 'ARS' | 'EUR'
export type Urgency = 'low' | 'medium' | 'high' | 'urgent'
export type TimelinePreference = 'urgent' | 'normal' | 'flexible'
export type CommunicationTone = 'formal' | 'casual' | 'professional' | 'friendly'
export type DetailLevel = 'basic' | 'detailed' | 'technical'
export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise' 