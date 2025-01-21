import { useEffect, useState } from 'react'
import { errorCollector } from '@/utils/error-collector'

export function useErrorMonitor(componentName: string) {
  const [errors, setErrors] = useState<any[]>([])

  useEffect(() => {
    const handleErrors = (newErrors: any[]) => {
      const componentErrors = newErrors.filter(error => 
        error.componentName === componentName
      )
      setErrors(componentErrors)
    }

    // エラーコレクターにリスナーを追加
    errorCollector.addListener(handleErrors)

    // 初期エラーを設定
    handleErrors(errorCollector.getErrors())

    // クリーンアップ
    return () => {
      errorCollector.removeListener(handleErrors)
    }
  }, [componentName])

  const addError = (error: Error | string, additionalInfo?: any) => {
    const errorEntry = {
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      componentName,
      additionalInfo
    }
    errorCollector.addError(errorEntry)
  }

  return {
    errors,
    addError,
    clearErrors: errorCollector.clearErrors.bind(errorCollector),
    hasErrors: errors.length > 0
  }
}
