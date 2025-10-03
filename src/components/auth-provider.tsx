"use client"

import { useEffect, Suspense, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { useDemoStore } from '@/stores/demo-store'
import { HydrationBoundary } from './hydration-boundary'
import { useSessionTimeout } from '@/hooks/use-session-timeout'
import { SessionWarningDialog } from './session-warning-dialog'

interface AuthProviderProps {
  children: React.ReactNode
}

function AuthProviderInner({ children }: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { checkAuth, isAuthenticated, logout } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  
  // Session timeout management
  const {
    extendSession,
    showWarningDialog,
    setShowWarningDialog,
    remainingMinutes
  } = useSessionTimeout({
    warningTime: 5, // Show warning 5 minutes before expiry
    timeoutTime: 30, // Auto logout after 30 minutes of inactivity
    checkInterval: 60, // Check every minute
    showWarning: true
  })

  useEffect(() => {
    setMounted(true)
    
    // Manually trigger hydration for persisted stores
    if (typeof window !== 'undefined') {
      // Trigger hydration for auth store
      useAuthStore.persist.rehydrate()
      // Trigger hydration for demo store  
      useDemoStore.persist.rehydrate()
    }
    
    // Check authentication status on mount
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    // Only handle redirects after component is mounted to avoid hydration issues
    if (!mounted) return
    
    // Handle redirect after login
    if (isAuthenticated && pathname === '/login') {
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      router.replace(redirectTo)
    }
  }, [mounted, isAuthenticated, pathname, searchParams, router])

  // Auto-refresh token every 15 minutes if authenticated
  useEffect(() => {
    if (!isAuthenticated || !mounted) return

    const refreshInterval = setInterval(() => {
      // The API client handles token refresh automatically via interceptors
      // This is just to trigger a check periodically
      checkAuth()
    }, 15 * 60 * 1000) // 15 minutes

    return () => clearInterval(refreshInterval)
  }, [isAuthenticated, checkAuth, mounted])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      
      {/* Session Warning Dialog */}
      <SessionWarningDialog
        open={showWarningDialog}
        onOpenChange={setShowWarningDialog}
        onExtendSession={extendSession}
        onLogout={logout}
        remainingMinutes={remainingMinutes}
      />
    </>
  )
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <HydrationBoundary
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      }
    >
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      }>
        <AuthProviderInner>{children}</AuthProviderInner>
      </Suspense>
    </HydrationBoundary>
  )
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    useEffect(() => {
      if (!mounted || isLoading) return
      
      if (!isAuthenticated) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
      }
    }, [mounted, isAuthenticated, isLoading, router, pathname])

    // Show loading while checking authentication or before mounting
    if (!mounted || isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      )
    }

    // Don't render component if not authenticated
    if (!isAuthenticated) {
      return null
    }

    return <Component {...props} />
  }
}

// Hook for getting authentication status
export function useAuth() {
  const authStore = useAuthStore()
  const demoStore = useDemoStore()

  return {
    ...authStore,
    isDemoMode: demoStore.isDemoMode,
  }
}