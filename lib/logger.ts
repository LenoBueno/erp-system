import { toast } from '@/hooks/use-toast'

type LogLevel = 'info' | 'warn' | 'error'

interface LogOptions {
  context?: string
  showToast?: boolean
  error?: Error | unknown
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatMessage(message: string, context?: string): string {
    return context ? `[${context}] ${message}` : message
  }

  private log(level: LogLevel, message: string, options: LogOptions = {}) {
    const { context, showToast = false, error } = options
    const formattedMessage = this.formatMessage(message, context)

    // Log no console apenas em desenvolvimento
    if (this.isDevelopment) {
      switch (level) {
        case 'info':
          console.log(formattedMessage)
          break
        case 'warn':
          console.warn(formattedMessage)
          break
        case 'error':
          console.error(formattedMessage, error || '')
          break
      }
    }

    // Em produção, poderia enviar para um serviço de monitoramento
    if (level === 'error' && !this.isDevelopment) {
      // TODO: Integrar com serviço de monitoramento de erros
      // Ex: Sentry, LogRocket, etc.
    }

    // Mostrar toast se necessário
    if (showToast) {
      toast({
        title: level === 'error' ? 'Erro' : 'Aviso',
        description: message,
        variant: level === 'error' ? 'destructive' : 'default',
      })
    }
  }

  info(message: string, options?: LogOptions) {
    this.log('info', message, options)
  }

  warn(message: string, options?: LogOptions) {
    this.log('warn', message, options)
  }

  error(message: string, options?: LogOptions) {
    this.log('error', message, options)
  }
}

export const logger = new Logger()