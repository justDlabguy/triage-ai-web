"use client"

import { useAuth } from "@/components/auth-provider"
import { UserProfile } from "@/components/user-profile"
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
import { LogOut } from "lucide-react"
import { useState } from "react"

export default function ProfilePage() {
    const { logout, isDemoMode } = useAuth()
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
                <div className="mx-auto max-w-4xl w-full">
                    {/* Demo Mode Information */}
                    {isDemoMode && (
                        <Card className="mb-6 bg-blue-50 border-blue-200">
                            <CardHeader>
                                <CardTitle className="text-blue-800 flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                        Demo Mode
                                    </Badge>
                                    Demo Account Active
                                </CardTitle>
                                <CardDescription className="text-blue-700">
                                    You are currently using a demonstration account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-blue-700">
                                <p>
                                    This is a demo account for showcasing HealthPal features.
                                    No real personal or medical data is stored. To create a real account,
                                    please use the registration form.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* User Profile Component */}
                    <UserProfile />

                    {/* Logout Section */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-red-600">Account Actions</CardTitle>
                            <CardDescription>
                                Manage your session and account security
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="destructive"
                                onClick={handleLogout}
                                disabled={isLoading}
                                className="w-full sm:w-auto"
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
                </div>
            </div>
        </>
    )
}