"use client"

import { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Clock, RefreshCw } from "lucide-react"

interface SessionWarningDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExtendSession: () => void
  onLogout: () => void
  remainingMinutes: number
}

export function SessionWarningDialog({
  open,
  onOpenChange,
  onExtendSession,
  onLogout,
  remainingMinutes: initialMinutes
}: SessionWarningDialogProps) {
  const [remainingMinutes, setRemainingMinutes] = useState(initialMinutes)

  // Countdown timer
  useEffect(() => {
    if (!open) return

    setRemainingMinutes(initialMinutes)
    
    const interval = setInterval(() => {
      setRemainingMinutes(prev => {
        if (prev <= 1) {
          // Auto logout when time runs out
          onLogout()
          return 0
        }
        return prev - 1
      })
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [open, initialMinutes, onLogout])

  const handleExtendSession = () => {
    onExtendSession()
    onOpenChange(false)
  }

  const handleLogout = () => {
    onLogout()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" />
            Session Expiring Soon
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire in{' '}
            <span className="font-semibold text-amber-600">
              {remainingMinutes} minute{remainingMinutes !== 1 ? 's' : ''}
            </span>{' '}
            due to inactivity. Would you like to extend your session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleLogout}>
            Sign Out Now
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleExtendSession}
            className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Stay Signed In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}