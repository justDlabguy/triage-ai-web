"use client"

import React from 'react'
import { AlertTriangle, Wifi, RefreshCw, AlertCircle, XCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: string
}

interface ErrorHandlerProps {
  error: ApiError | Error | string | null
  onRetry?: () => void
  onDismiss?: () => void
  variant?: 'inline' | 'dialog' | 'toast'
  showRetry?: boolean
  className?: string
}

export function ErrorHandler({ 
  error, 
  onRetry, 
  onDismiss,
  variant = 'inline',
  showRetry = true,
  className 
}: ErrorHandlerProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  React.useEffect(() => {
    if (variant === 'dialog' && error) {
      setIsDialogOpen(true)
    }
  }, [error, variant])

  if (!error) return null

  const errorInfo = getErrorInfo(error)

  const handleDismiss = () => {
    setIsDialogOpen(false)
    onDismiss?.()
  }

  const handleRetry = () => {
    setIsDialogOpen(false)
    onRetry?.()
  }

  if (variant === 'dialog') {
    return (
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {errorInfo.icon}
              {errorInfo.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {errorInfo.message}
              {errorInfo.suggestion && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {errorInfo.suggestion}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDismiss}>
              Dismiss
            </AlertDialogCancel>
            {showRetry && onRetry && (
              <AlertDialogAction onClick={handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <Alert variant="destructive" className={className}>
      {errorInfo.icon}
      <AlertTitle>{errorInfo.title}</AlertTitle>
      <AlertDescription>
        <div className="space-y-2">
          <p>{errorInfo.message}</p>
          {errorInfo.suggestion && (
            <p className="text-sm text-muted-foreground">{errorInfo.suggestion}</p>
          )}
          {(showRetry && onRetry) || onDismiss ? (
            <div className="flex gap-2 mt-3">
              {showRetry && onRetry && (
                <Button size="sm" variant="outline" onClick={onRetry}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              )}
              {onDismiss && (
                <Button size="sm" variant="ghost" onClick={onDismiss}>
                  Dismiss
                </Button>
              )}
            </div>
          ) : null}
        </div>
      </AlertDescription>
    </Alert>
  )
}

function getErrorInfo(error: ApiError | Error | string) {
  if (typeof error === 'string') {
    return {
      title: 'Error',
      message: error,
      icon: <AlertCircle className="h-4 w-4" />,
      suggestion: null
    }
  }

  if (error instanceof Error) {
    return {
      title: 'Application Error',
      message: error.message,
      icon: <XCircle className="h-4 w-4" />,
      suggestion: 'Please try refreshing the page or contact support if the problem persists.'
    }
  }

  // Handle API errors
  const apiError = error as ApiError
  const status = apiError.status

  if (!status) {
    return {
      title: 'Connection Error',
      message: apiError.message || 'Unable to connect to the server',
      icon: <Wifi className="h-4 w-4" />,
      suggestion: 'Please check your internet connection and try again.'
    }
  }

  switch (status) {
    case 400:
      return {
        title: 'Invalid Request',
        message: apiError.message || 'The request contains invalid data',
        icon: <AlertTriangle className="h-4 w-4" />,
        suggestion: 'Please check your input and try again.'
      }
    case 401:
      return {
        title: 'Authentication Required',
        message: 'Please log in to continue',
        icon: <AlertCircle className="h-4 w-4" />,
        suggestion: 'Your session may have expired. Please log in again.'
      }
    case 403:
      return {
        title: 'Access Denied',
        message: 'You do not have permission to perform this action',
        icon: <XCircle className="h-4 w-4" />,
        suggestion: 'Contact your administrator if you believe this is an error.'
      }
    case 404:
      return {
        title: 'Not Found',
        message: apiError.message || 'The requested resource was not found',
        icon: <AlertCircle className="h-4 w-4" />,
        suggestion: 'The page or resource you are looking for may have been moved or deleted.'
      }
    case 429:
      return {
        title: 'Too Many Requests',
        message: 'Please wait a moment before trying again',
        icon: <AlertTriangle className="h-4 w-4" />,
        suggestion: 'You have made too many requests. Please wait a few minutes and try again.'
      }
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        title: 'Server Error',
        message: 'Our servers are experiencing issues',
        icon: <XCircle className="h-4 w-4" />,
        suggestion: 'Please try again in a few minutes. If the problem persists, contact support.'
      }
    default:
      return {
        title: 'Unexpected Error',
        message: apiError.message || 'An unexpected error occurred',
        icon: <AlertTriangle className="h-4 w-4" />,
        suggestion: 'Please try again or contact support if the problem persists.'
      }
  }
}

// Specialized error components for common scenarios
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorHandler
      error={{
        message: 'Unable to connect to the server',
        status: 0
      }}
      onRetry={onRetry}
    />
  )
}

export function AuthenticationError({ onLogin }: { onLogin?: () => void }) {
  return (
    <ErrorHandler
      error={{
        message: 'Please log in to continue',
        status: 401
      }}
      onRetry={onLogin}
      showRetry={!!onLogin}
    />
  )
}

export function NotFoundError({ message }: { message?: string }) {
  return (
    <ErrorHandler
      error={{
        message: message || 'The page you are looking for was not found',
        status: 404
      }}
      showRetry={false}
    />
  )
}

export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorHandler
      error={{
        message: 'Our servers are experiencing issues',
        status: 500
      }}
      onRetry={onRetry}
    />
  )
}

export default ErrorHandler