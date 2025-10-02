"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { User, Mail, Shield, Settings, LogOut } from "lucide-react"
import { useState } from "react"

export default function ProfilePage() {
    const { user, logout, isDemoMode } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogout = async () => {
        setIsLoading(true)
        setError(null)
        try {
            await logout()
        } catch (error) {
            console.error('Logout failed:', error)
            setError('Failed to logout. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="/dashboard">
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Profile</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto max-w-2xl w-full">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <User className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            User Profile
                        </h1>
                        <p className="text-gray-600">
                            Manage your account settings and health information
                        </p>
                    </div>

                    {/* Profile Information */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-purple-600" />
                                Account Information
                            </CardTitle>
                            <CardDescription>
                                Your basic account details and preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p className="text-sm text-muted-foreground">
                                            {user?.email || 'demo@triageai.com'}
                                        </p>
                                    </div>
                                </div>
                                {isDemoMode && (
                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                        Demo Account
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="font-medium">Name</p>
                                        <p className="text-sm text-muted-foreground">
                                            {user?.name || 'Demo User'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Shield className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="font-medium">Account Type</p>
                                        <p className="text-sm text-muted-foreground">
                                            {isDemoMode ? 'Demo User' : 'Standard User'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5 text-gray-600" />
                                Account Actions
                            </CardTitle>
                            <CardDescription>
                                Manage your account settings and security
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start" disabled>
                                <Settings className="mr-2 h-4 w-4" />
                                Account Settings (Coming Soon)
                            </Button>

                            <Button variant="outline" className="w-full justify-start" disabled>
                                <Shield className="mr-2 h-4 w-4" />
                                Privacy Settings (Coming Soon)
                            </Button>

                            <Separator />

                            <Button
                                variant="destructive"
                                className="w-full justify-start"
                                onClick={handleLogout}
                                disabled={isLoading}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                {isLoading ? 'Signing Out...' : 'Sign Out'}
                            </Button>

                            {error && (
                                <div className="mt-2 text-sm text-red-600">
                                    {error}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Demo Mode Information */}
                    {isDemoMode && (
                        <Card className="mt-6 bg-blue-50 border-blue-200">
                            <CardHeader>
                                <CardTitle className="text-blue-800">Demo Mode</CardTitle>
                                <CardDescription className="text-blue-700">
                                    You are currently using a demonstration account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-blue-700">
                                <p>
                                    This is a demo account for showcasing Triage AI features.
                                    No real personal or medical data is stored. To create a real account,
                                    please contact the Triage AI team.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    )
}