"use client"

import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Clock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type UrgencyLevel = "emergency" | "urgent" | "semi-urgent" | "non-urgent"

interface UrgencyBadgeProps {
    urgencyLevel: UrgencyLevel
    className?: string
    showIcon?: boolean
    size?: "sm" | "md" | "lg"
}

const urgencyStyles = {
    emergency: {
        className: "bg-red-600 text-white hover:bg-red-700 border-red-700 shadow-lg",
        icon: AlertTriangle,
        label: "CRITICAL",
        pulse: true
    },
    urgent: {
        className: "bg-orange-600 text-white hover:bg-orange-700 border-orange-700 shadow-md",
        icon: AlertCircle,
        label: "HIGH",
        pulse: false
    },
    "semi-urgent": {
        className: "bg-yellow-600 text-white hover:bg-yellow-700 border-yellow-700 shadow-md",
        icon: Clock,
        label: "MEDIUM",
        pulse: false
    },
    "non-urgent": {
        className: "bg-green-600 text-white hover:bg-green-700 border-green-700 shadow-md",
        icon: CheckCircle,
        label: "LOW",
        pulse: false
    }
}

const sizeStyles = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2"
}

export function UrgencyBadge({
    urgencyLevel,
    className,
    showIcon = true,
    size = "md"
}: UrgencyBadgeProps) {
    const config = urgencyStyles[urgencyLevel]
    const Icon = config.icon

    return (
        <div className="relative inline-flex">
            <Badge
                className={cn(
                    config.className,
                    sizeStyles[size],
                    "font-bold border-2 transition-all duration-200",
                    className
                )}
            >
                {showIcon && <Icon className={cn("mr-1", size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4")} />}
                {config.label}
            </Badge>
            {config.pulse && (
                <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75"></div>
            )}
        </div>
    )
}