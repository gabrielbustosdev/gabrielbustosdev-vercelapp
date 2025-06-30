import { LogEntry, AppError } from '@/lib/types'

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableRemote: boolean
  remoteEndpoint?: string
  sessionId?: string
}

class Logger {
  private config: LoggerConfig
  private logs: LogEntry[] = []
  private maxLogs = 1000

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableRemote: false,
      ...config
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel)
    const currentLevelIndex = levels.indexOf(this.config.level)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex >= currentLevelIndex
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date(),
      context,
      sessionId: this.config.sessionId
    }
  }

  private addToLogs(entry: LogEntry) {
    this.logs.push(entry)
    
    // Mantener solo los últimos logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
  }

  private logToConsole(entry: LogEntry) {
    if (!this.config.enableConsole) return

    const timestamp = entry.timestamp.toISOString()
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.context || '')
        break
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.context || '')
        break
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.context || '')
        break
      case LogLevel.ERROR:
        console.error(prefix, entry.message, entry.context || '')
        break
    }
  }

  private async logToRemote(entry: LogEntry) {
    if (!this.config.enableRemote || !this.config.remoteEndpoint) return

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      })
    } catch (error) {
      // Fallback to console if remote logging fails
      console.error('Failed to log to remote:', error)
    }
  }

  private async log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog(level)) return

    const entry = this.createLogEntry(level, message, context)
    
    this.addToLogs(entry)
    this.logToConsole(entry)
    
    if (this.config.enableRemote) {
      await this.logToRemote(entry)
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    return this.log(LogLevel.DEBUG, message, context)
  }

  /**
   * Log de información general
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context)
  }

  /**
   * Log de advertencias
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context)
  }

  /**
   * Log de errores
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, { ...context, error: error?.message, stack: error?.stack })
  }

  errorWithError(error: AppError | Error, context?: Record<string, unknown>) {
    const message = error instanceof Error ? error.message : error.message
    const errorContext = {
      ...context,
      stack: error instanceof Error ? error.stack : error.stack,
      code: error instanceof Error ? 'UNKNOWN_ERROR' : error.code
    }
    
    return this.log(LogLevel.ERROR, message, errorContext)
  }

  /**
   * Log específico para chat
   */
  chat(message: string, sessionId?: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, `[CHAT] ${message}`, { ...context, sessionId })
  }

  /**
   * Log específico para contexto evolutivo
   */
  context(message: string, sessionId?: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, `[CONTEXT] ${message}`, { ...context, sessionId })
  }

  /**
   * Log de performance
   */
  performance(operation: string, duration: number, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, `[PERF] ${operation} took ${duration}ms`, context)
  }

  /**
   * Log de métricas
   */
  metrics(name: string, value: number, tags?: Record<string, string>): void {
    this.log(LogLevel.INFO, `[METRIC] ${name}: ${value}`, { tags })
  }

  /**
   * Log de eventos de usuario
   */
  userEvent(event: string, userId?: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, `[USER] ${event}`, { ...context, userId })
  }

  /**
   * Log de errores de API
   */
  apiError(endpoint: string, status: number, error: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, `[API] ${endpoint} returned ${status}`, { ...context, error })
  }

  /**
   * Log de validación
   */
  validation(field: string, value: unknown, rule: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, `[VALIDATION] ${field} failed ${rule}`, { ...context, value })
  }

  // Métodos para obtener logs
  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filteredLogs = this.logs
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level)
    }
    
    if (limit) {
      filteredLogs = filteredLogs.slice(-limit)
    }
    
    return filteredLogs
  }

  getLogsBySession(sessionId: string): LogEntry[] {
    return this.logs.filter(log => log.sessionId === sessionId)
  }

  clearLogs() {
    this.logs = []
  }

  // Métodos de configuración
  setConfig(config: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...config }
  }

  setSessionId(sessionId: string) {
    this.config.sessionId = sessionId
  }
}

// Instancia global del logger
export const logger = new Logger({
  level: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: true,
  enableRemote: process.env.NODE_ENV === 'production'
})

// Exportar tipos
export type { LoggerConfig } 