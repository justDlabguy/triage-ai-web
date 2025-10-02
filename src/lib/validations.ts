import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const demoCredentials = {
  email: "demo@healthpal.ng",
  password: "demo123",
}

// Registration form validation
export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
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
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    message: "Please select your gender",
  }),
  location: z.string().min(2, "Please enter your location"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type RegisterFormData = z.infer<typeof registerSchema>

// Form input schema (what the form collects)
export const triageFormSchema = z.object({
  // Step 1: Basic Information
  age: z
    .string()
    .min(1, "Age is required")
    .refine((val) => {
      const num = parseInt(val, 10)
      return !isNaN(num) && num >= 1 && num <= 120
    }, {
      message: "Age must be between 1 and 120",
    }),
  gender: z.enum(["male", "female", "other"]),

  // Step 2: Primary Symptoms
  primarySymptom: z
    .string()
    .min(10, "Please describe your main symptom in at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  symptomDuration: z.enum(["less_than_1_hour", "1_to_6_hours", "6_to_24_hours", "1_to_3_days", "more_than_3_days"]),
  painLevel: z
    .string()
    .refine((val) => {
      const num = parseInt(val, 10)
      return !isNaN(num) && num >= 0 && num <= 10
    }, {
      message: "Pain level must be between 0 and 10",
    }),

  // Step 3: Additional Symptoms
  additionalSymptoms: z.array(z.string()).optional(),
  hasTemperature: z.boolean().default(false),
  temperature: z.string().optional(),

  // Step 4: Medical History
  hasChronicConditions: z.boolean().default(false),
  chronicConditions: z.string().optional(),
  currentMedications: z.string().optional(),
  hasAllergies: z.boolean().default(false),
  allergies: z.string().optional(),

  // Step 5: Emergency Indicators
  hasChestPain: z.boolean().default(false),
  hasDifficultyBreathing: z.boolean().default(false),
  hasLossOfConsciousness: z.boolean().default(false),
  hasSevereHeadache: z.boolean().default(false),
  hasUncontrolledBleeding: z.boolean().default(false),
})

// API schema (what gets sent to the backend)
export const triageSchema = z.object({
  age: z.number().min(1).max(120),
  gender: z.enum(["male", "female", "other"]),
  primarySymptom: z.string().min(10).max(500),
  symptomDuration: z.enum(["less_than_1_hour", "1_to_6_hours", "6_to_24_hours", "1_to_3_days", "more_than_3_days"]),
  painLevel: z.number().min(0).max(10),
  additionalSymptoms: z.array(z.string()).optional(),
  hasTemperature: z.boolean(),
  temperature: z.number().optional(),
  hasChronicConditions: z.boolean(),
  chronicConditions: z.string().optional(),
  currentMedications: z.string().optional(),
  hasAllergies: z.boolean(),
  allergies: z.string().optional(),
  hasChestPain: z.boolean(),
  hasDifficultyBreathing: z.boolean(),
  hasLossOfConsciousness: z.boolean(),
  hasSevereHeadache: z.boolean(),
  hasUncontrolledBleeding: z.boolean(),
})

export type TriageFormData = z.infer<typeof triageFormSchema>
export type TriageApiData = z.infer<typeof triageSchema>

// Transform form data to API data
export function transformTriageFormToApi(formData: TriageFormData): TriageApiData {
  return {
    age: parseInt(formData.age, 10),
    gender: formData.gender,
    primarySymptom: formData.primarySymptom,
    symptomDuration: formData.symptomDuration,
    painLevel: parseInt(formData.painLevel, 10),
    additionalSymptoms: formData.additionalSymptoms || [],
    hasTemperature: formData.hasTemperature,
    temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
    hasChronicConditions: formData.hasChronicConditions,
    chronicConditions: formData.chronicConditions,
    currentMedications: formData.currentMedications,
    hasAllergies: formData.hasAllergies,
    allergies: formData.allergies,
    hasChestPain: formData.hasChestPain,
    hasDifficultyBreathing: formData.hasDifficultyBreathing,
    hasLossOfConsciousness: formData.hasLossOfConsciousness,
    hasSevereHeadache: formData.hasSevereHeadache,
    hasUncontrolledBleeding: formData.hasUncontrolledBleeding,
  }
}

// Common symptom options for the form
export const commonSymptoms = [
  "Fever",
  "Headache",
  "Cough",
  "Sore throat",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Abdominal pain",
  "Back pain",
  "Joint pain",
  "Fatigue",
  "Dizziness",
  "Shortness of breath",
  "Chest pain",
  "Skin rash",
]

// Duration options
export const durationOptions = [
  { value: "less_than_1_hour", label: "Less than 1 hour" },
  { value: "1_to_6_hours", label: "1 to 6 hours" },
  { value: "6_to_24_hours", label: "6 to 24 hours" },
  { value: "1_to_3_days", label: "1 to 3 days" },
  { value: "more_than_3_days", label: "More than 3 days" },
] as const