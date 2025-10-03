import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, User, Bell, Shield, Palette } from "lucide-react"

export const metadata = {
    title: "Settings - HealthPal",
    description: "Manage your HealthPal account settings and preferences",
}

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Profile Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profile Settings
                            </CardTitle>
                            <CardDescription>
                                Update your personal information and profile details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                                    <p className="text-gray-600">Demo User</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <p className="text-gray-600">demo@healthpal.com</p>
                                </div>
                                <Button variant="outline" className="w-full">
                                    Edit Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notifications
                            </CardTitle>
                            <CardDescription>
                                Configure how you receive notifications and alerts
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Emergency Alerts</span>
                                    <Button variant="outline" size="sm">Enabled</Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Health Reminders</span>
                                    <Button variant="outline" size="sm">Enabled</Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Email Updates</span>
                                    <Button variant="outline" size="sm">Disabled</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy & Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Privacy & Security
                            </CardTitle>
                            <CardDescription>
                                Manage your privacy settings and account security
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Two-Factor Authentication</span>
                                    <Button variant="outline" size="sm">Setup</Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Data Sharing</span>
                                    <Button variant="outline" size="sm">Manage</Button>
                                </div>
                                <Button variant="outline" className="w-full">
                                    Change Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appearance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5" />
                                Appearance
                            </CardTitle>
                            <CardDescription>
                                Customize the look and feel of your dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Theme</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Button variant="outline" size="sm">Light</Button>
                                        <Button variant="outline" size="sm">Dark</Button>
                                        <Button variant="outline" size="sm">Auto</Button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Language</label>
                                    <Button variant="outline" className="w-full justify-start">
                                        English (Nigeria)
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Demo Notice */}
                <Card className="mt-6 border-orange-200 bg-orange-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-700">
                            <Settings className="h-5 w-5" />
                            Demo Mode
                        </CardTitle>
                        <CardDescription className="text-orange-600">
                            This is a demonstration version. Settings changes are not persisted.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}