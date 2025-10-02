"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { UrgencyBadge } from "@/components/urgency-badge"
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Stethoscope,
  Brain,
  Heart,
  Activity,
  Zap,
  Search,
  AlertCircle,
  Shield,
  PhoneCall
} from "lucide-react"

export interface TriageResult {
  urgencyLevel: "emergency" | "urgent" | "semi-urgent" | "non-urgent"
  recommendation: string
  symptoms: string[]
  possibleConditions: string[]
  nextSteps: string[]
  disclaimer: string
  estimatedWaitTime?: string
  nearbyClinic?: {
    name: string
    address: string
    phone: string
    distance: string
  }
}

interface TriageResultsProps {
  result: TriageResult | null
  isLoading: boolean
  onStartNewTriage: () => void
  loadingStage?: string
  loadingProgress?: number
}

// Healthcare-specific color coding following medical triage standards
const urgencyConfig = {
  emergency: {
    color: "destructive" as const,
    icon: AlertTriangle,
    title: "🚨 EMERGENCY - Seek Immediate Care",
    description: "Call 911 or go to the nearest emergency room immediately",
    bgColor: "bg-red-50 border-red-500 border-2",
    iconColor: "text-red-700",
    iconBg: "bg-red-200",
    badgeColor: "bg-red-600 text-white hover:bg-red-700",
    priority: "CRITICAL"
  },
  urgent: {
    color: "destructive" as const,
    icon: AlertCircle,
    title: "⚠️ URGENT - Seek Care Within Hours",
    description: "Contact healthcare provider or urgent care within 2-4 hours",
    bgColor: "bg-orange-50 border-orange-400 border-2",
    iconColor: "text-orange-700",
    iconBg: "bg-orange-200",
    badgeColor: "bg-orange-600 text-white hover:bg-orange-700",
    priority: "HIGH"
  },
  "semi-urgent": {
    color: "secondary" as const,
    icon: Clock,
    title: "⏰ SEMI-URGENT - Schedule Appointment",
    description: "Schedule appointment within 24-48 hours",
    bgColor: "bg-yellow-50 border-yellow-400 border-2",
    iconColor: "text-yellow-700",
    iconBg: "bg-yellow-200",
    badgeColor: "bg-yellow-600 text-white hover:bg-yellow-700",
    priority: "MEDIUM"
  },
  "non-urgent": {
    color: "outline" as const,
    icon: CheckCircle,
    title: "✅ NON-URGENT - Monitor Symptoms",
    description: "Monitor symptoms and schedule routine care if needed",
    bgColor: "bg-green-50 border-green-400 border-2",
    iconColor: "text-green-700",
    iconBg: "bg-green-200",
    badgeColor: "bg-green-600 text-white hover:bg-green-700",
    priority: "LOW"
  }
}

export function TriageResults({ 
  result, 
  isLoading, 
  onStartNewTriage, 
  loadingStage = "Analyzing symptoms", 
  loadingProgress = 0 
}: TriageResultsProps) {
  
  // Enhanced loading state with animated healthcare icons
  if (isLoading) {
    const getLoadingIcon = () => {
      if (loadingStage.includes("Validating")) return Activity;
      if (loadingStage.includes("Analyzing")) return Brain;
      if (loadingStage.includes("Generating")) return Zap;
      if (loadingStage.includes("Finding")) return Search;
      return Brain;
    };

    const LoadingIcon = getLoadingIcon();

    return (
      <Card className="w-full border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 bg-blue-100 rounded-full animate-pulse">
                <LoadingIcon className="h-8 w-8 text-blue-600" />
              </div>
              {/* Animated pulse ring */}
              <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-75"></div>
            </div>
            <div className="flex-1">
              <CardTitle className="text-blue-900">AI Medical Analysis in Progress</CardTitle>
              <CardDescription className="text-blue-700">
                {loadingStage}...
              </CardDescription>
              {/* Progress bar */}
              <div className="mt-3 space-y-2">
                <Progress value={loadingProgress} className="h-2" />
                <div className="flex justify-between text-xs text-blue-600">
                  <span>{loadingStage}</span>
                  <span>{loadingProgress}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enhanced loading skeleton with healthcare context */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-6 w-full rounded-full" />
                <Skeleton className="h-6 w-3/4 rounded-full" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            {/* AI thinking indicator */}
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-blue-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm font-medium">AI is thinking</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!result) {
    return null
  }

  const urgency = urgencyConfig[result.urgencyLevel]
  const UrgencyIcon = urgency.icon

  return (
    <div className="space-y-6">
      {/* Emergency Contact Information - Prominent for Critical Cases */}
      {(result.urgencyLevel === "emergency" || result.urgencyLevel === "urgent") && (
        <Alert variant="destructive" className="border-red-600 bg-red-50">
          <PhoneCall className="h-5 w-5" />
          <AlertTitle className="text-red-800 font-bold">Emergency Contacts</AlertTitle>
          <AlertDescription className="text-red-700">
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-2 font-semibold">
                <Phone className="h-4 w-4" />
                <span>Emergency Services: 911</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Poison Control: 1-800-222-1222</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Crisis Hotline: 988</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Urgency Level with Enhanced Healthcare Color Coding */}
      <Card className={`w-full ${urgency.bgColor} shadow-lg`}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-full ${urgency.iconBg} relative shadow-md`}>
              <UrgencyIcon className={`h-8 w-8 ${urgency.iconColor}`} />
              {/* Enhanced pulse animation for emergency cases */}
              {result.urgencyLevel === "emergency" && (
                <>
                  <div className="absolute inset-0 rounded-full border-3 border-red-500 animate-ping opacity-75"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-pulse opacity-50"></div>
                </>
              )}
              {result.urgencyLevel === "urgent" && (
                <div className="absolute inset-0 rounded-full border-2 border-orange-400 animate-pulse opacity-75"></div>
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                {urgency.title}
                <UrgencyBadge urgencyLevel={result.urgencyLevel} size="lg" />
              </CardTitle>
              <CardDescription className="text-base mt-2 font-medium">
                {urgency.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-white/70 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-800 leading-relaxed font-medium">{result.recommendation}</p>
            </div>
            {result.estimatedWaitTime && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Clock className="h-6 w-6 text-blue-600" />
                <div>
                  <span className="font-semibold text-blue-800 block">Recommended Timeframe</span>
                  <span className="text-blue-700">{result.estimatedWaitTime}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Symptoms Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Symptoms Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-2">Reported Symptoms:</h4>
              <div className="flex flex-wrap gap-2">
                {result.symptoms.map((symptom, index) => (
                  <Badge key={index} variant="outline">{symptom}</Badge>
                ))}
              </div>
            </div>
            
            {result.possibleConditions.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Possible Conditions to Consider:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {result.possibleConditions.map((condition, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Recommended Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="text-sm text-gray-700 space-y-2">
            {result.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Nearby Clinic */}
      {result.nearbyClinic && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Recommended Healthcare Provider
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">{result.nearbyClinic.name}</h4>
                <p className="text-sm text-gray-600">{result.nearbyClinic.address}</p>
                <p className="text-sm text-gray-600">Distance: {result.nearbyClinic.distance}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <a 
                  href={`tel:${result.nearbyClinic.phone}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {result.nearbyClinic.phone}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Medical Disclaimer with Warning Variant */}
      <Alert variant="destructive" className="border-amber-500 bg-amber-50">
        <Shield className="h-5 w-5 text-amber-600" />
        <AlertTitle className="text-amber-800 font-bold">Important Medical Disclaimer</AlertTitle>
        <AlertDescription className="text-amber-700 space-y-2">
          <p className="font-medium">{result.disclaimer}</p>
          <div className="text-sm space-y-1 mt-3 p-3 bg-amber-100 rounded border-l-4 border-amber-400">
            <p><strong>⚠️ This AI analysis is for informational purposes only and should not replace professional medical advice.</strong></p>
            <p>• Always consult with a qualified healthcare provider for medical concerns</p>
            <p>• In case of emergency, call 911 or go to the nearest emergency room immediately</p>
            <p>• This tool does not provide medical diagnoses or treatment recommendations</p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Additional Emergency Information for Critical Cases */}
      {(result.urgencyLevel === "emergency" || result.urgencyLevel === "urgent") && (
        <Alert variant="destructive" className="bg-red-100 border-red-400">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800 font-bold">Immediate Action Required</AlertTitle>
          <AlertDescription className="text-red-700">
            <div className="space-y-2">
              <p className="font-semibold">If you are experiencing a medical emergency:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Call 911 immediately</li>
                <li>Do not drive yourself to the hospital</li>
                <li>Stay on the line with emergency services</li>
                <li>Have someone stay with you if possible</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={onStartNewTriage} variant="outline" className="flex-1">
          Start New Triage
        </Button>
        <Button variant="default" className="flex-1">
          Find Healthcare Providers
        </Button>
      </div>
    </div>
  )
}