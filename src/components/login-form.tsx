"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Heart, Stethoscope } from "lucide-react"

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
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { loginSchema, type LoginFormData, demoCredentials } from "@/lib/validations"
import { useAuthStore } from "@/stores/auth-store"
import { useDemoStore } from "@/stores/demo-store"
import { ErrorHandler, type ApiError } from "@/components/error-handler"
import { ButtonLoading } from "@/components/loading-states"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const router = useRouter()
  const { login, demoLogin } = useAuthStore()
  const { setDemoMode } = useDemoStore()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await login(data)
      router.push("/dashboard")
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : "Login failed. Please try again.",
        status: 401,
        code: 'LOGIN_FAILED'
      }
      setError(apiError)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fill form with demo credentials
      form.setValue("email", demoCredentials.email)
      form.setValue("password", demoCredentials.password)
      
      // Enable demo mode
      setDemoMode(true)
      
      // Perform demo login
      await demoLogin()
      router.push("/dashboard")
    } catch {
      const apiError: ApiError = {
        message: "Demo login failed. Please try again.",
        status: 500,
        code: 'DEMO_LOGIN_FAILED'
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
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to access your healthcare dashboard
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
                        placeholder="your.email@example.com"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        disabled={isLoading}
                        className="focus:border-emerald-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={isLoading}
                >
                  {isLoading ? <ButtonLoading text="Signing in..." /> : "Sign In"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or try demo
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  {isLoading ? <ButtonLoading text="Loading Demo..." /> : "🚀 Quick Demo Access"}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo credentials: {demoCredentials.email}</p>
            <p className="mt-2">
              Don&apos;t have an account?{" "}
              <a href="#" className="text-emerald-600 underline underline-offset-4 hover:text-emerald-700">
                Contact your healthcare provider
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Healthcare Context Footer */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>🏥 Serving Nigerian Healthcare Communities</p>
        <p>⚕️ This is a demonstration platform for healthcare professionals</p>
      </div>
    </div>
  )
}
