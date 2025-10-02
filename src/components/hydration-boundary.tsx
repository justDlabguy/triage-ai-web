"use client"

import { useEffect, useState } from 'react'

interface HydrationBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * HydrationBoundary prevents hydration mismatches by only rendering
 * children after the component has mounted on the client side.
 */
export function HydrationBoundary({ children, fallback }: HydrationBoundaryProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return fallback || null
  }

  return <>{children}</>
}