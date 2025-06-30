// lib/types/index.ts
export * from './chat'
export * from './forms'

// Tipos globales de la aplicación
export interface AppConfig {
  name: string
  version: string
  environment: 'development' | 'production' | 'test'
  features: {
    chat: boolean
    contextEvolution: boolean
    suggestions: boolean
    analytics: boolean
  }
}

export interface UserSession {
  id: string
  timestamp: Date
  userAgent: string
  referrer?: string
  source: 'direct' | 'search' | 'social' | 'referral'
}

export interface AnalyticsEvent {
  type: string
  timestamp: Date
  sessionId: string
  data: Record<string, unknown>
}

// Tipos para validación
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Tipos para configuración de servicios
export interface ServiceConfig {
  name: string
  enabled: boolean
  config: Record<string, unknown>
}

// Tipos para manejo de errores
export interface AppError {
  code: string
  message: string
  details?: unknown
  timestamp: Date
  stack?: string
}

// Tipos para logging
export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  timestamp: Date
  context?: Record<string, unknown>
  sessionId?: string
}

// Tipos para componentes UI
export interface UIComponentProps {
  className?: string
  children?: React.ReactNode
}

// Tipos para configuración de tema
export interface ThemeConfig {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  border: string
}

// Tipos para configuración de API
export interface APIConfig {
  baseUrl: string
  timeout: number
  retries: number
  headers: Record<string, string>
} 