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
import { 
  Activity, 
  Brain, 
  Heart, 
  Hospital, 
  MapPin, 
  Stethoscope, 
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
  Settings
} from "lucide-react"
import { DemoModeToggle } from "@/components/demo-mode-toggle"
import { DemoBanner, DemoIndicator } from "@/components/demo-indicator"
import { ResponsiveContainer, ResponsiveGrid, ResponsiveStack } from "@/components/responsive-layout"
import { DashboardLoading, MedicalDataLoading } from "@/components/loading-states"
import { useDemoStore } from "@/stores/demo-store"
import healthcareData from "./healthcare-data.json"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const { isDemoMode } = useDemoStore()
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Get recent triage data
  const recentTriages = healthcareData.slice(0, 3)
  const urgentCases = healthcareData.filter(item => item.urgency === "High").length
  const completedCases = healthcareData.filter(item => item.status === "Completed").length

  if (isLoading) {
    return (
      <>
        <DemoBanner showScenario />
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <DashboardLoading />
        </div>
      </>
    )
  }

  return (
    <>
      {/* Demo Banner */}
      <DemoBanner showScenario />
      
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">
                Healthcare Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Overview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <DemoIndicator variant="badge" showScenario />
          <span className="text-sm text-muted-foreground">
            Welcome, {user?.name || user?.email || 'User'}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <ResponsiveContainer className="flex-1">
        <ResponsiveStack spacing="lg">
          <ResponsiveGrid cols={{ default: 1, md: 3 }} gap="md">
          {/* Health Metrics Cards */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Active Triages
              </CardTitle>
              <Brain className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {isDemoMode ? healthcareData.filter(item => item.status === "In Progress").length : '0'}
              </div>
              <p className="text-xs text-blue-600">
                +2 from last week
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">
                Urgent Cases
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">
                {isDemoMode ? urgentCases : '0'}
              </div>
              <p className="text-xs text-red-600">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Completed Cases
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {isDemoMode ? completedCases : '0'}
              </div>
              <p className="text-xs text-green-600">
                This month
              </p>
            </CardContent>
          </Card>
          </ResponsiveGrid>

          {/* Quick Actions */}
          <ResponsiveGrid cols={{ default: 1, md: 2, lg: 3 }} gap="md">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Stethoscope className="h-5 w-5" />
                Start AI Triage
              </CardTitle>
              <CardDescription>
                Get instant AI-powered symptom analysis and medical recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                <a href="/triage">
                  <Brain className="mr-2 h-4 w-4" />
                  Analyze Symptoms
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <Hospital className="h-5 w-5" />
                Find Emergency Clinics
              </CardTitle>
              <CardDescription>
                Locate nearby healthcare facilities and emergency services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50" asChild>
                <a href="/clinics">
                  <MapPin className="mr-2 h-4 w-4" />
                  Search Clinics
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Heart className="h-5 w-5" />
                Health Tracking
              </CardTitle>
              <CardDescription>
                Monitor your wellness and track health metrics over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50" asChild>
                <a href="/profile">
                  <Activity className="mr-2 h-4 w-4" />
                  View Health Log
                </a>
              </Button>
            </CardContent>
          </Card>
          </ResponsiveGrid>

          {/* Demo Settings */}
          <div className="w-full">
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Settings className="h-5 w-5" />
                Demo Settings
              </CardTitle>
              <CardDescription>
                Configure demo mode and testing scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DemoModeToggle />
            </CardContent>
          </Card>
          </div>

          {/* Recent Activity */}
          <ResponsiveGrid cols={{ default: 1, md: 2 }} gap="md">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Recent Triage Sessions
              </CardTitle>
              <CardDescription>
                Your latest symptom analyses and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isDemoMode ? (
                recentTriages.map((triage) => (
                  <div key={triage.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{triage.header}</p>
                      <p className="text-xs text-muted-foreground">{triage.date}</p>
                    </div>
                    <Badge 
                      variant={triage.urgency === "High" ? "destructive" : 
                              triage.urgency === "Medium" ? "default" : "secondary"}
                    >
                      {triage.urgency}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Stethoscope className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>No triage sessions yet</p>
                  <p className="text-xs">Start your first symptom analysis</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Community Health
              </CardTitle>
              <CardDescription>
                Health alerts and community updates for your area
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isDemoMode ? (
                <>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Flu Season Alert</p>
                      <p className="text-xs text-muted-foreground">Lagos State Health Advisory</p>
                    </div>
                    <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                      Advisory
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Vaccination Drive</p>
                      <p className="text-xs text-muted-foreground">Free immunization program</p>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-700">
                      Program
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Users className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>No community updates</p>
                  <p className="text-xs">Check back for health alerts</p>
                </div>
              )}
            </CardContent>
          </Card>
          </ResponsiveGrid>

          {/* Demo Information */}
        {isDemoMode && (
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Demo Mode Information
              </CardTitle>
              <CardDescription className="text-yellow-700">
                You are currently using the demonstration version of Triage AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm text-yellow-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>All triage analyses use simulated AI responses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Clinic data shows sample locations in Lagos, Nigeria</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>No real medical data is processed or stored</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Always consult healthcare professionals for real medical advice</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        </ResponsiveStack>
      </ResponsiveContainer>
    </>
  )
}