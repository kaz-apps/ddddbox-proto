type ErrorEntry = {
  timestamp: string
  message: string
  stack?: string
  componentName?: string
  additionalInfo?: any
}

class ErrorCollector {
  private static instance: ErrorCollector
  private errors: ErrorEntry[] = []
  private listeners: ((errors: ErrorEntry[]) => void)[] = []

  private constructor() {
    if (typeof window !== 'undefined') {
      // グローバルエラーハンドラー
      window.onerror = (message, source, lineno, colno, error) => {
        this.addError({
          message: message.toString(),
          stack: error?.stack,
          timestamp: new Date().toISOString(),
          additionalInfo: { source, lineno, colno }
        })
      }

      // Promiseエラーハンドラー
      window.onunhandledrejection = (event) => {
        this.addError({
          message: event.reason?.message || 'Unhandled Promise rejection',
          stack: event.reason?.stack,
          timestamp: new Date().toISOString(),
          additionalInfo: { type: 'unhandledrejection' }
        })
      }

      // コンソールエラーのインターセプト
      const originalConsoleError = console.error
      console.error = (...args) => {
        try {
          this.addError({
            message: args.map(arg => {
              if (arg === null || arg === undefined) return String(arg)
              if (arg instanceof Error) return arg.message
              if (typeof arg === 'object') return JSON.stringify(arg)
              return String(arg)
            }).join(' '),
            timestamp: new Date().toISOString(),
            additionalInfo: { type: 'console.error', args: args.map(arg => {
              try {
                return arg instanceof Error ? { message: arg.message, stack: arg.stack } : arg
              } catch (e) {
                return String(arg)
              }
            })}
          })
        } catch (e) {
          // エラー収集自体のエラーを防ぐ
          originalConsoleError('Error collector failed:', e)
        }
        originalConsoleError.apply(console, args)
      }
    }
  }

  public static getInstance(): ErrorCollector {
    if (!ErrorCollector.instance) {
      ErrorCollector.instance = new ErrorCollector()
    }
    return ErrorCollector.instance
  }

  public addError(error: ErrorEntry) {
    this.errors.push(error)
    this.notifyListeners()
  }

  public getErrors(): ErrorEntry[] {
    return [...this.errors]
  }

  public clearErrors() {
    this.errors = []
    this.notifyListeners()
  }

  public addListener(listener: (errors: ErrorEntry[]) => void) {
    this.listeners.push(listener)
  }

  public removeListener(listener: (errors: ErrorEntry[]) => void) {
    this.listeners = this.listeners.filter(l => l !== listener)
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getErrors()))
  }

  public getLatestError(): ErrorEntry | null {
    return this.errors[this.errors.length - 1] || null
  }

  public hasErrors(): boolean {
    return this.errors.length > 0
  }

  public getErrorsByComponent(componentName: string): ErrorEntry[] {
    return this.errors.filter(error => error.componentName === componentName)
  }
}

export const errorCollector = ErrorCollector.getInstance()
