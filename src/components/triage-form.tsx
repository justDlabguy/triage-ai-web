"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { triageFormSchema, type TriageFormData, commonSymptoms, durationOptions } from "@/lib/validations"
import { useDemoStore } from "@/stores/demo-store"
import { DemoIndicator } from "@/components/demo-indicator"
import { ButtonLoading } from "@/components/loading-states"
import { ChevronLeft, ChevronRight, User, Stethoscope, Plus, Heart, AlertTriangle, Thermometer } from "lucide-react"

const TOTAL_STEPS = 5

interface TriageFormProps {
    onSubmit: (data: TriageFormData) => void
    isLoading?: boolean
}

export function TriageForm({ onSubmit, isLoading = false }: TriageFormProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
    
    const { isDemoMode, getCurrentScenario } = useDemoStore()
    const currentScenario = getCurrentScenario()

    const form = useForm({
        resolver: zodResolver(triageFormSchema),
        defaultValues: {
            age: "",
            gender: "male" as const,
            primarySymptom: "",
            symptomDuration: "less_than_1_hour" as const,
            painLevel: "0",
            additionalSymptoms: [],
            hasTemperature: false,
            temperature: "",
            hasChronicConditions: false,
            chronicConditions: "",
            currentMedications: "",
            hasAllergies: false,
            allergies: "",
            hasChestPain: false,
            hasDifficultyBreathing: false,
            hasLossOfConsciousness: false,
            hasSevereHeadache: false,
            hasUncontrolledBleeding: false,
        },
    })

    const { watch, setValue } = form
    const watchedValues = watch()

    // Auto-fill form with demo scenario data
    useEffect(() => {
        if (isDemoMode && currentScenario) {
            // Set primary symptom from scenario
            setValue("primarySymptom", currentScenario.symptoms)
            
            // Set some default values based on scenario urgency
            if (currentScenario.expectedUrgency === 'emergency') {
                setValue("hasChestPain", currentScenario.symptoms.toLowerCase().includes('chest'))
                setValue("hasDifficultyBreathing", currentScenario.symptoms.toLowerCase().includes('breath'))
                setValue("painLevel", "8")
            } else if (currentScenario.expectedUrgency === 'high') {
                setValue("painLevel", "6")
                setValue("hasTemperature", currentScenario.symptoms.toLowerCase().includes('fever'))
                if (currentScenario.symptoms.toLowerCase().includes('fever')) {
                    setValue("temperature", "38.5")
                }
            } else if (currentScenario.expectedUrgency === 'medium') {
                setValue("painLevel", "4")
                setValue("hasTemperature", currentScenario.symptoms.toLowerCase().includes('fever'))
                if (currentScenario.symptoms.toLowerCase().includes('fever')) {
                    setValue("temperature", "37.8")
                }
            } else {
                setValue("painLevel", "2")
            }
            
            // Set some basic demographics for demo
            setValue("age", "35")
            setValue("gender", "male")
        }
    }, [isDemoMode, currentScenario, setValue])

    const nextStep = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSymptomToggle = (symptom: string) => {
        const newSymptoms = selectedSymptoms.includes(symptom)
            ? selectedSymptoms.filter(s => s !== symptom)
            : [...selectedSymptoms, symptom]

        setSelectedSymptoms(newSymptoms)
        setValue("additionalSymptoms", newSymptoms)
    }

    const getStepTitle = (step: number) => {
        switch (step) {
            case 1: return "Basic Information"
            case 2: return "Primary Symptoms"
            case 3: return "Additional Symptoms"
            case 4: return "Medical History"
            case 5: return "Emergency Indicators"
            default: return ""
        }
    }

    const getStepIcon = (step: number) => {
        switch (step) {
            case 1: return <User className="h-5 w-5" />
            case 2: return <Stethoscope className="h-5 w-5" />
            case 3: return <Plus className="h-5 w-5" />
            case 4: return <Heart className="h-5 w-5" />
            case 5: return <AlertTriangle className="h-5 w-5" />
            default: return null
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Age *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter your age"
                                            {...field}
                                            min="1"
                                            max="120"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Your age helps us provide more accurate recommendations
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your gender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="primarySymptom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Primary Symptom *</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe your main symptom in detail (e.g., 'Sharp chest pain that started this morning')"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Be as specific as possible about location, intensity, and characteristics
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="symptomDuration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>How long have you had this symptom? *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select duration" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {durationOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="painLevel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pain Level (0-10)</FormLabel>
                                    <FormControl>
                                        <div className="space-y-2">
                                            <Input
                                                type="range"
                                                min="0"
                                                max="10"
                                                step="1"
                                                {...field}
                                                className="w-full"
                                            />
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>No pain (0)</span>
                                                <span className="font-medium">Current: {field.value}</span>
                                                <span>Worst pain (10)</span>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Rate your pain from 0 (no pain) to 10 (worst possible pain)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-6">
                        <div>
                            <FormLabel>Additional Symptoms</FormLabel>
                            <FormDescription className="mb-4">
                                Select any additional symptoms you&apos;re experiencing
                            </FormDescription>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {commonSymptoms.map((symptom) => (
                                    <div
                                        key={symptom}
                                        className={`p-2 border rounded-lg cursor-pointer transition-colors ${selectedSymptoms.includes(symptom)
                                            ? "bg-blue-50 border-blue-200 text-blue-700"
                                            : "hover:bg-gray-50"
                                            }`}
                                        onClick={() => handleSymptomToggle(symptom)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={selectedSymptoms.includes(symptom)}
                                                onChange={() => handleSymptomToggle(symptom)}
                                            />
                                            <span className="text-sm">{symptom}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {selectedSymptoms.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium mb-2">Selected symptoms:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSymptoms.map((symptom) => (
                                            <Badge key={symptom} variant="secondary">
                                                {symptom}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="hasTemperature"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="flex items-center gap-2">
                                                <Thermometer className="h-4 w-4" />
                                                Do you have a fever or elevated temperature?
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {watchedValues.hasTemperature && (
                                <FormField
                                    control={form.control}
                                    name="temperature"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Temperature (°C)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g., 38.5"
                                                    step="0.1"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Enter your temperature in Celsius
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="hasChronicConditions"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Do you have any chronic medical conditions?
                                        </FormLabel>
                                        <FormDescription>
                                            Such as diabetes, hypertension, heart disease, etc.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {watchedValues.hasChronicConditions && (
                            <FormField
                                control={form.control}
                                name="chronicConditions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chronic Conditions</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="List your chronic conditions"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="currentMedications"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Medications</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="List any medications you're currently taking (optional)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Include prescription drugs, over-the-counter medications, and supplements
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="hasAllergies"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Do you have any known allergies?
                                        </FormLabel>
                                        <FormDescription>
                                            Including drug allergies, food allergies, or environmental allergies
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {watchedValues.hasAllergies && (
                            <FormField
                                control={form.control}
                                name="allergies"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Allergies</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="List your allergies and reactions"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                )

            case 5:
                return (
                    <div className="space-y-6">
                        <Alert className="border-red-200 bg-red-50">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-700">
                                <strong>Emergency Warning Signs:</strong> If you&apos;re experiencing any of these symptoms,
                                consider seeking immediate medical attention or calling emergency services.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="hasChestPain"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border border-red-200 rounded-lg">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-red-700 font-medium">
                                                Severe chest pain or pressure
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="hasDifficultyBreathing"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border border-red-200 rounded-lg">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-red-700 font-medium">
                                                Severe difficulty breathing or shortness of breath
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="hasLossOfConsciousness"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border border-red-200 rounded-lg">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-red-700 font-medium">
                                                Loss of consciousness or fainting
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="hasSevereHeadache"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border border-red-200 rounded-lg">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-red-700 font-medium">
                                                Sudden, severe headache (worst of your life)
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="hasUncontrolledBleeding"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border border-red-200 rounded-lg">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-red-700 font-medium">
                                                Uncontrolled bleeding
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {getStepIcon(currentStep)}
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                {getStepTitle(currentStep)}
                                <DemoIndicator variant="badge" />
                            </CardTitle>
                            <CardDescription>
                                Step {currentStep} of {TOTAL_STEPS}
                                {isDemoMode && currentScenario && (
                                    <span className="ml-2 text-orange-600">
                                        • Using scenario: {currentScenario.name}
                                    </span>
                                )}
                            </CardDescription>
                        </div>
                    </div>
                    <Badge variant="outline">
                        {Math.round((currentStep / TOTAL_STEPS) * 100)}% Complete
                    </Badge>
                </div>
                <Progress value={(currentStep / TOTAL_STEPS) * 100} className="w-full" />
            </CardHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        {renderStep()}
                    </CardContent>

                    <div className="flex justify-between p-6 pt-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>

                        {currentStep < TOTAL_STEPS ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center gap-2"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                            >
                                {isLoading ? (
                                    <ButtonLoading text="Analyzing..." />
                                ) : (
                                    <>
                                        <Stethoscope className="h-4 w-4" />
                                        Start AI Analysis
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </Card>
    )
}