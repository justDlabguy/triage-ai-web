"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Heart, Stethoscope, Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { registerSchema, type RegisterFormData } from "@/lib/validations"
import { useAuthStore } from "@/stores/auth-store"
import { ErrorHandler, type ApiError } from "@/components/error-handler"
import { ButtonLoading } from "@/components/loading-states"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<ApiError | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const router = useRouter()
    const { register } = useAuthStore()

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            username: "",
            fullName: "",
            phoneNumber: "",
            age: undefined,
            gender: "male" as const,
            location: "",
        },
    })

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            // Include confirmPassword in the data for backend validation
            const registerData = {
                email: data.email,
                password: data.password,
                confirm_password: data.confirmPassword, // Backend expects this field
                username: data.username,
                fullName: data.fullName,
                phoneNumber: data.phoneNumber,
                age: data.age,
                gender: data.gender,
                location: data.location,
            }

            await register(registerData)

            // Registration successful, redirect to login with success message
            router.push('/login?message=Registration successful! Please log in.')
        } catch (err) {
            const apiError: ApiError = {
                message: err instanceof Error ? err.message : "Registration failed. Please try again.",
                status: 400,
                code: 'REGISTRATION_FAILED'
            }
            setError(apiError)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {/* Triage AI Branding Header */}
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-emerald-600">
                    <Heart className="h-8 w-8" />
                    <span>Triage AI</span>
                    <Stethoscope className="h-8 w-8" />
                </div>
                <p className="text-sm text-muted-foreground">
                    AI-Powered Healthcare Triage for Nigeria
                </p>
            </div>

            <Card className="border-emerald-100">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Create Account</CardTitle>
                    <CardDescription className="text-center">
                        Join Triage AI to access personalized healthcare guidance
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4">
                            <ErrorHandler
                                error={error}
                                onDismiss={() => setError(null)}
                                showRetry={false}
                            />
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Personal Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="John Doe"
                                                    disabled={isLoading}
                                                    className="focus:border-emerald-500"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="johndoe"
                                                    disabled={isLoading}
                                                    className="focus:border-emerald-500"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="john@example.com"
                                                disabled={isLoading}
                                                className="focus:border-emerald-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="tel"
                                                placeholder="+234 801 234 5678"
                                                disabled={isLoading}
                                                className="focus:border-emerald-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Demographics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="age"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Age</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="25"
                                                    disabled={isLoading}
                                                    className="focus:border-emerald-500"
                                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                                <FormControl>
                                                    <SelectTrigger className="focus:border-emerald-500">
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Lagos, Nigeria"
                                                    disabled={isLoading}
                                                    className="focus:border-emerald-500"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Password Fields */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Create a strong password"
                                                    disabled={isLoading}
                                                    className="focus:border-emerald-500 pr-10"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    disabled={isLoading}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Confirm your password"
                                                    disabled={isLoading}
                                                    className="focus:border-emerald-500 pr-10"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    disabled={isLoading}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                                disabled={isLoading}
                            >
                                {isLoading ? <ButtonLoading text="Creating Account..." /> : "Create Account"}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p>
                            Already have an account?{" "}
                            <a href="/login" className="text-emerald-600 underline underline-offset-4 hover:text-emerald-700">
                                Sign in here
                            </a>
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Healthcare Context Footer */}
            <div className="text-center text-xs text-muted-foreground space-y-1">
                <p>🏥 Serving Nigerian Healthcare Communities</p>
                <p>⚕️ Your health data is protected with enterprise-grade security</p>
            </div>
        </div>
    )
}