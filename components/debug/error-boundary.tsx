'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="p-4 bg-red-50 text-red-600">
          <h2 className="text-lg font-bold mb-2">エラーが発生しました</h2>
          <details className="whitespace-pre-wrap">
            <summary>詳細を表示</summary>
            <p className="mt-2">{this.state.error?.toString()}</p>
            <p className="mt-2 text-sm">{this.state.errorInfo?.componentStack}</p>
          </details>
        </div>
      )
    }

    return this.props.children
  }
}
