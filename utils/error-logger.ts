type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: string
  error?: Error
  additionalInfo?: any
}

class ErrorLogger {
  private static instance: ErrorLogger
  private logs: LogEntry[] = []
  private maxLogs: number = 100
  private listeners: ((entry: LogEntry) => void)[] = []

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupGlobalHandlers()
    }
  }

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  private setupGlobalHandlers() {
    // グローバルエラーハンドラー
    window.onerror = (message, source, lineno, colno, error) => {
      this.error('Uncaught error', error || new Error(String(message)), {
        source,
        lineno,
        colno,
      })
    }

    // Promiseエラーハンドラー
    window.onunhandledrejection = (event) => {
      this.error('Unhandled promise rejection', event.reason, {
        type: 'promise',
      })
    }

    // コンソールメソッドのオーバーライド
    const originalConsole = { ...console }
    console.error = (...args) => {
      this.error(args.join(' '))
      originalConsole.error.apply(console, args)
    }
    console.warn = (...args) => {
      this.warn(args.join(' '))
      originalConsole.warn.apply(console, args)
    }
  }

  public log(level: LogLevel, message: string, error?: Error, additionalInfo?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      error,
      additionalInfo,
    }

    this.logs.unshift(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.pop()
    }

    this.notifyListeners(entry)
  }

  public error(message: string, error?: Error, additionalInfo?: any) {
    this.log('error', message, error, additionalInfo)
  }

  public warn(message: string, error?: Error, additionalInfo?: any) {
    this.log('warn', message, error, additionalInfo)
  }

  public info(message: string, additionalInfo?: any) {
    this.log('info', message, undefined, additionalInfo)
  }

  public debug(message: string, additionalInfo?: any) {
    this.log('debug', message, undefined, additionalInfo)
  }

  public getLogs(level?: LogLevel): LogEntry[] {
    return level
      ? this.logs.filter((log) => log.level === level)
      : [...this.logs]
  }

  public clearLogs() {
    this.logs = []
  }

  public addListener(listener: (entry: LogEntry) => void) {
    this.listeners.push(listener)
  }

  public removeListener(listener: (entry: LogEntry) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener)
  }

  private notifyListeners(entry: LogEntry) {
    this.listeners.forEach((listener) => {
      try {
        listener(entry)
      } catch (error) {
        console.error('Error in log listener:', error)
      }
    })
  }

  public getErrorCount(): number {
    return this.logs.filter((log) => log.level === 'error').length
  }

  public getWarningCount(): number {
    return this.logs.filter((log) => log.level === 'warn').length
  }

  public hasErrors(): boolean {
    return this.getErrorCount() > 0
  }

  public hasWarnings(): boolean {
    return this.getWarningCount() > 0
  }

  public getLatestError(): LogEntry | null {
    return this.logs.find((log) => log.level === 'error') || null
  }

  public getLatestWarning(): LogEntry | null {
    return this.logs.find((log) => log.level === 'warn') || null
  }
}

export const errorLogger = ErrorLogger.getInstance()
