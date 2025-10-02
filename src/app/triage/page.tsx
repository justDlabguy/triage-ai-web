"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { TriageForm } from "@/components/triage-form"
import { TriageResults, type TriageResult } from "@/components/triage-results"
import { type TriageFormData, transformTriageFormToApi } from "@/lib/validations"
import { TriageAIService } from "@/lib/triage-ai"
import { ErrorHandler, type ApiError } from "@/components/error-handler"
import { TriageAnalysisLoading } from "@/components/loading-states"
import { Brain, AlertTriangle } from "lucide-react"

export default function TriagePage() {
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [triageResult, setTriageResult] = useState<TriageResult | null>(null)
    const [showForm, setShowForm] = useState(true)
    const [loadingStage, setLoadingStage] = useState("")
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [error, setError] = useState<ApiError | null>(null)

    const handleTriageSubmit = async (data: TriageFormData) => {
        setIsAnalyzing(true)
        setShowForm(false)
        setLoadingStage("Preparing analysis")
        setLoadingProgress(0)
        setError(null)

        try {
            // Transform form data to API format
            const apiData = transformTriageFormToApi(data)

            // Call AI triage service with progress tracking
            const result = await TriageAIService.analyzeTriageWithProgress(
                apiData,
                (stage, progress) => {
                    setLoadingStage(stage)
                    setLoadingProgress(progress)
                }
            )
            setTriageResult(result)

        } catch (error) {
            console.error("Triage analysis failed:", error)
            
            // Convert error to ApiError format
            let apiError: ApiError
            if (error instanceof Error) {
                apiError = {
                    message: error.message,
                    status: 500,
                    code: 'TRIAGE_ANALYSIS_FAILED'
                }
            } else {
                apiError = {
                    message: 'An unexpected error occurred during analysis',
                    status: 500,
                    code: 'UNKNOWN_ERROR'
                }
            }
            
            setError(apiError)
            setShowForm(true)
        } finally {
            setIsAnalyzing(false)
            setLoadingStage("")
            setLoadingProgress(0)
        }
    }

    const handleStartNewTriage = () => {
        setTriageResult(null)
        setShowForm(true)
        setIsAnalyzing(false)
        setLoadingStage("")
        setLoadingProgress(0)
        setError(null)
    }

    const handleRetry = () => {
        setError(null)
        setShowForm(true)
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
                            <BreadcrumbPage>AI Triage</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto max-w-2xl">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Brain className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            AI-Powered Symptom Analysis
                        </h1>
                        <p className="text-gray-600">
                            Get instant medical triage recommendations based on your symptoms
                        </p>
                    </div>

                    {/* Medical Disclaimer */}
                    <Card className="mb-6 border-yellow-200 bg-yellow-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-800">
                                <AlertTriangle className="h-5 w-5" />
                                Important Medical Disclaimer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-yellow-700">
                            <p>
                                This AI triage tool is for informational purposes only and should not replace
                                professional medical advice. Always consult with qualified healthcare providers
                                for proper diagnosis and treatment. In case of emergency, call your local
                                emergency services immediately.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-6">
                            <ErrorHandler
                                error={error}
                                onRetry={handleRetry}
                                onDismiss={() => setError(null)}
                            />
                        </div>
                    )}

                    {/* Triage Form or Results */}
                    {showForm ? (
                        <TriageForm
                            onSubmit={handleTriageSubmit}
                            isLoading={isAnalyzing}
                        />
                    ) : isAnalyzing ? (
                        <Card>
                            <CardContent className="p-6">
                                <TriageAnalysisLoading />
                            </CardContent>
                        </Card>
                    ) : (
                        <TriageResults
                            result={triageResult}
                            isLoading={isAnalyzing}
                            onStartNewTriage={handleStartNewTriage}
                            loadingStage={loadingStage}
                            loadingProgress={loadingProgress}
                        />
                    )}
                </div>
            </div>
        </>
    )
}