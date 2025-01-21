import { useEffect, useCallback } from 'react'
import { errorLogger } from '@/utils/error-logger'

interface UseErrorLoggerProps {
  componentName: string
  onError?: (error: Error) => void
}

export function useErrorLogger({ componentName, onError }: UseErrorLoggerProps) {
  const handleError = useCallback((error: Error) => {
    errorLogger.error(`Error in ${componentName}:`, error)
    onError?.(error)
  }, [componentName, onError])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const errorListener = (event: ErrorEvent) => {
      handleError(event.error || new Error(event.message))
    }

    const rejectionListener = (event: PromiseRejectionEvent) => {
      handleError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)))
    }

    window.addEventListener('error', errorListener)
    window.addEventListener('unhandledrejection', rejectionListener)

    return () => {
      window.removeEventListener('error', errorListener)
      window.removeEventListener('unhandledrejection', rejectionListener)
    }
  }, [handleError])

  return {
    logError: handleError,
    logWarning: (message: string, error?: Error) => {
      errorLogger.warn(`Warning in ${componentName}: ${message}`, error)
    },
    logInfo: (message: string) => {
      errorLogger.info(`Info from ${componentName}: ${message}`)
    },
    logDebug: (message: string) => {
      errorLogger.debug(`Debug from ${componentName}: ${message}`)
    }
  }
}
