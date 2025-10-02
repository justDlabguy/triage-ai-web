import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

export const metadata = {
  title: "Login - Triage AI",
  description: "Sign in to your Triage AI healthcare dashboard",
}
