import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <RegisterForm />
      </div>
    </div>
  )
}

export const metadata = {
  title: "Register - Triage AI",
  description: "Create your Triage AI account for personalized healthcare guidance",
}