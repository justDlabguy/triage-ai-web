"use client"

import { useEffect, useRef, useCallback, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { AuthUtils } from '@/lib/auth'

interface UseSessionTimeoutOptions {
    // Time in minutes before showing warning
    warningTime?: number
    // Time in minutes before auto logout
    timeoutTime?: number
    // Check interval in seconds
    checkInterval?: number
    // Show warning dialog
    showWarning?: boolean
}

export function useSessionTimeout(options: UseSessionTimeoutOptions = {}) {
    const {
        warningTime = 5, // 5 minutes before expiry
        timeoutTime = 30, // 30 minutes total
        checkInterval = 60, // Check every minute
        showWarning = true
    } = options

    const { logout, isAuthenticated } = useAuth()
    const warningShownRef = useRef(false)
    const timeoutIdRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const lastActivityRef = useRef(Date.now())

    // State for warning dialog
    const [showWarningDialog, setShowWarningDialog] = useState(false)
    const [remainingMinutes, setRemainingMinutes] = useState(0)

    // Update last activity time
    const updateActivity = useCallback(() => {
        lastActivityRef.current = Date.now()
        warningShownRef.current = false
        setShowWarningDialog(false)
    }, [])

    // Extend session (refresh activity)
    const extendSession = useCallback(() => {
        updateActivity()
        // Optionally refresh token here if needed
    }, [updateActivity])

    // Check if session should timeout
    const checkTimeout = useCallback(() => {
        if (!isAuthenticated) return

        const now = Date.now()
        const timeSinceActivity = now - lastActivityRef.current
        const timeoutMs = timeoutTime * 60 * 1000
        const warningMs = (timeoutTime - warningTime) * 60 * 1000

        // Check if token is expired
        if (AuthUtils.isTokenExpired()) {
            console.log('Token expired, logging out...')
            logout()
            return
        }

        // Auto logout if timeout reached
        if (timeSinceActivity >= timeoutMs) {
            console.log('Session timeout, logging out...')
            logout()
            return
        }

        // Show warning if approaching timeout
        if (showWarning && timeSinceActivity >= warningMs && !warningShownRef.current) {
            warningShownRef.current = true
            const remaining = Math.ceil((timeoutMs - timeSinceActivity) / (60 * 1000))
            setRemainingMinutes(remaining)
            setShowWarningDialog(true)

            // Show browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Session Expiring', {
                    body: `Your session will expire in ${remaining} minute(s). Click to stay signed in.`,
                    icon: '/favicon.svg',
                    tag: 'session-warning'
                })
            }

            // Show console warning
            console.warn(`Session will expire in ${remaining} minute(s)`)
        }
    }, [isAuthenticated, logout, timeoutTime, warningTime, showWarning])

    // Set up activity listeners
    useEffect(() => {
        if (!isAuthenticated) return

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

        // Add event listeners for user activity
        events.forEach(event => {
            document.addEventListener(event, updateActivity, true)
        })

        // Set up periodic timeout check
        const intervalId = setInterval(checkTimeout, checkInterval * 1000)

        // Initial check
        checkTimeout()

        return () => {
            // Clean up event listeners
            events.forEach(event => {
                document.removeEventListener(event, updateActivity, true)
            })

            // Clear interval
            clearInterval(intervalId)

            // Clear any pending timeout
            const currentTimeoutId = timeoutIdRef.current
            if (currentTimeoutId) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                clearTimeout(currentTimeoutId)
            }
        }
    }, [isAuthenticated, updateActivity, checkTimeout, checkInterval])

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission()
        }
    }, [])

    return {
        updateActivity,
        extendSession,
        checkTimeout,
        lastActivity: lastActivityRef.current,
        showWarningDialog,
        setShowWarningDialog,
        remainingMinutes
    }
}