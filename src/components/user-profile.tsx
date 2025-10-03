"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { User, Mail, Phone, MapPin, Calendar, Shield, Eye, EyeOff } from "lucide-react"

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
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/stores/auth-store"
import { apiClient } from "@/lib/api"
import { ErrorHandler, type ApiError } from "@/components/error-handler"
import { ButtonLoading } from "@/components/loading-states"

// Profile update schema
const profileUpdateSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string()
    .min(10, "Please enter a valid phone number")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
  age: z.number()
    .min(13, "You must be at least 13 years old")
    .max(120, "Please enter a valid age")
    .optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  location: z.string().min(2, "Please enter your location"),
})

// Password change schema
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ProfileUpdateData = z.infer<typeof profileUpdateSchema>
type PasswordChangeData = z.infer<typeof passwordChangeSchema>

export function UserProfile({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [passwordError, setPasswordError] = useState<ApiError | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { user, setUser } = useAuthStore()

  const profileForm = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      username: "",
      fullName: "",
      phoneNumber: "",
      age: undefined,
      gender: "male",
      location: "",
    },
  })

  const passwordForm = useForm<PasswordChangeData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Load user data when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return

      try {
        const userData = await apiClient.get<{
          username?: string;
          full_name?: string;
          phone_number?: string;
          age?: number;
          gender?: string;
          location?: string;
        }>('/auth/me')

        profileForm.reset({
          username: userData.username || "",
          fullName: userData.full_name || "",
          phoneNumber: userData.phone_number || "",
          age: userData.age || undefined,
          gender: (userData.gender as "male" | "female" | "other" | "prefer_not_to_say") || "male",
          location: userData.location || "",
        })

        // Note: We don't update the user in store here since userData doesn't match AuthUser interface
      } catch (error) {
        console.error('Failed to load user data:', error)
      }
    }

    loadUserData()
  }, [user, profileForm, setUser])

  const onProfileSubmit = async (data: ProfileUpdateData) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      await apiClient.put<{
        username?: string;
        full_name?: string;
        phone_number?: string;
        age?: number;
        gender?: string;
        location?: string;
      }>('/auth/me', {
        username: data.username,
        full_name: data.fullName,
        phone_number: data.phoneNumber,
        age: data.age,
        gender: data.gender,
        location: data.location,
      })

      // Note: We don't update the user in store here since updatedUser doesn't match AuthUser interface
      setSuccessMessage("Profile updated successfully!")
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : "Failed to update profile. Please try again.",
        status: 400,
        code: 'PROFILE_UPDATE_FAILED'
      }
      setError(apiError)
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordChangeData) => {
    setIsPasswordLoading(true)
    setPasswordError(null)
    setSuccessMessage(null)

    try {
      await apiClient.post('/auth/change-password', {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      })

      passwordForm.reset()
      setSuccessMessage("Password changed successfully!")
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : "Failed to change password. Please try again.",
        status: 400,
        code: 'PASSWORD_CHANGE_FAILED'
      }
      setPasswordError(apiError)
    } finally {
      setIsPasswordLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Success Message */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and preferences
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

          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
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
                  control={profileForm.control}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </label>
                  <Input
                    value={user.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <FormField
                  control={profileForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </FormLabel>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={profileForm.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Age
                      </FormLabel>
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
                  control={profileForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
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
                  control={profileForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </FormLabel>
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

              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? <ButtonLoading text="Updating..." /> : "Update Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          {passwordError && (
            <div className="mb-4">
              <ErrorHandler
                error={passwordError}
                onDismiss={() => setPasswordError(null)}
                showRetry={false}
              />
            </div>
          )}

          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter your current password"
                          disabled={isPasswordLoading}
                          className="focus:border-emerald-500 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          disabled={isPasswordLoading}
                        >
                          {showCurrentPassword ? (
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
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                          disabled={isPasswordLoading}
                          className="focus:border-emerald-500 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          disabled={isPasswordLoading}
                        >
                          {showNewPassword ? (
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
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your new password"
                          disabled={isPasswordLoading}
                          className="focus:border-emerald-500 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isPasswordLoading}
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
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={isPasswordLoading}
              >
                {isPasswordLoading ? <ButtonLoading text="Changing Password..." /> : "Change Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}