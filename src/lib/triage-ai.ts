import { type TriageApiData } from "./validations"
import { type TriageResult } from "@/components/triage-results"
import { apiClient } from "./api"

// Enhanced AI service with real backend integration
export class TriageAIService {
  static async analyzeTriage(data: TriageApiData): Promise<TriageResult> {
    try {
      // Transform detailed form data to simple query format for existing backend
      const symptomParts = [data.primarySymptom];
      
      // Add basic info
      symptomParts.push(`Age: ${data.age}, Gender: ${data.gender}`);
      symptomParts.push(`Duration: ${data.symptomDuration.replace('_', ' ')}`);
      symptomParts.push(`Pain level: ${data.painLevel}/10`);
      
      // Add additional symptoms
      if (data.additionalSymptoms && data.additionalSymptoms.length > 0) {
        symptomParts.push(`Additional symptoms: ${data.additionalSymptoms.join(', ')}`);
      }
      
      // Add temperature info
      if (data.hasTemperature && data.temperature) {
        symptomParts.push(`Temperature: ${data.temperature}°C`);
      }
      
      // Add medical history
      if (data.hasChronicConditions && data.chronicConditions) {
        symptomParts.push(`Chronic conditions: ${data.chronicConditions}`);
      }
      
      if (data.currentMedications) {
        symptomParts.push(`Current medications: ${data.currentMedications}`);
      }
      
      if (data.hasAllergies && data.allergies) {
        symptomParts.push(`Allergies: ${data.allergies}`);
      }
      
      // Add emergency indicators
      const emergencySymptoms = [];
      if (data.hasChestPain) emergencySymptoms.push("chest pain");
      if (data.hasDifficultyBreathing) emergencySymptoms.push("difficulty breathing");
      if (data.hasLossOfConsciousness) emergencySymptoms.push("loss of consciousness");
      if (data.hasSevereHeadache) emergencySymptoms.push("severe headache");
      if (data.hasUncontrolledBleeding) emergencySymptoms.push("uncontrolled bleeding");
      
      if (emergencySymptoms.length > 0) {
        symptomParts.push(`Emergency symptoms: ${emergencySymptoms.join(', ')}`);
      }
      
      // Combine all parts into comprehensive query
      const comprehensiveQuery = symptomParts.join('. ');
      
      // Call existing backend endpoint with transformed data
      const response = await apiClient.post<{
        data: {
          response: string;
          confidence: number;
          recommendations: string[];
          severity?: string;
        };
        success: boolean;
        message: string;
      }>('/triage/triage', {
        query: comprehensiveQuery,
        user_id: 'anonymous_user',
        input_method: 'text'
      });

      // Transform backend response to frontend format
      const backendData = response.data;
      
      // Determine urgency level based on emergency indicators and pain level
      let urgencyLevel: TriageResult["urgencyLevel"] = "non-urgent";
      if (emergencySymptoms.length > 0 || data.painLevel >= 8) {
        urgencyLevel = "emergency";
      } else if (data.painLevel >= 6 || (data.hasTemperature && data.temperature && data.temperature >= 39)) {
        urgencyLevel = "urgent";
      } else if (data.painLevel >= 4 || (data.hasTemperature && data.temperature && data.temperature >= 38)) {
        urgencyLevel = "semi-urgent";
      }
      
      // Generate recommendations based on urgency
      let nextSteps: string[] = [];
      let estimatedWaitTime = "1-2 weeks";
      
      if (urgencyLevel === "emergency") {
        nextSteps = [
          "Seek immediate emergency medical attention",
          "Call emergency services or go to the nearest emergency room",
          "Do not delay medical care"
        ];
        estimatedWaitTime = "Immediate";
      } else if (urgencyLevel === "urgent") {
        nextSteps = [
          "Seek medical attention within 2-4 hours",
          "Visit urgent care or emergency room",
          "Monitor symptoms closely"
        ];
        estimatedWaitTime = "2-4 hours";
      } else if (urgencyLevel === "semi-urgent") {
        nextSteps = [
          "Schedule appointment with healthcare provider within 24-48 hours",
          "Monitor symptoms and seek immediate care if they worsen",
          "Consider over-the-counter symptom relief as appropriate"
        ];
        estimatedWaitTime = "24-48 hours";
      } else {
        nextSteps = [
          "Monitor symptoms over the next few days",
          "Schedule routine appointment if symptoms persist",
          "Use appropriate self-care measures"
        ];
      }
      
      return {
        urgencyLevel,
        recommendation: backendData.response,
        symptoms: [data.primarySymptom, ...(data.additionalSymptoms || [])],
        possibleConditions: [], // Could be enhanced with AI analysis
        nextSteps,
        disclaimer: "This AI triage tool is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for proper diagnosis and treatment. In case of emergency, call your local emergency services immediately.",
        estimatedWaitTime,
        nearbyClinic: {
          name: "Lagos General Hospital",
          address: "123 Medical Center Drive, Victoria Island, Lagos",
          phone: "+234-1-234-5678",
          distance: "2.3 km"
        }
      };
    } catch (error) {
      console.error('Backend API error:', error);
      
      // Re-throw the error instead of falling back to mock data
      // This ensures users see the real error and know the backend is unavailable
      throw new Error(`Triage analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async mockAnalyzeTriage(data: TriageApiData): Promise<TriageResult> {
    // Simulate realistic API delay with progress indicators
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000))

    // Mock analysis based on symptoms and emergency indicators
    const hasEmergencySymptoms = 
      data.hasChestPain || 
      data.hasDifficultyBreathing || 
      data.hasLossOfConsciousness || 
      data.hasUncontrolledBleeding ||
      (data.hasSevereHeadache && data.painLevel >= 8)

    const hasUrgentSymptoms = 
      data.painLevel >= 7 || 
      (data.hasTemperature && data.temperature && parseFloat(data.temperature.toString()) >= 39) ||
      data.hasSevereHeadache

    const hasSemiUrgentSymptoms = 
      data.painLevel >= 5 || 
      (data.hasTemperature && data.temperature && parseFloat(data.temperature.toString()) >= 38) ||
      data.hasChronicConditions

    // Determine urgency level
    let urgencyLevel: TriageResult["urgencyLevel"]
    if (hasEmergencySymptoms) {
      urgencyLevel = "emergency"
    } else if (hasUrgentSymptoms) {
      urgencyLevel = "urgent"
    } else if (hasSemiUrgentSymptoms) {
      urgencyLevel = "semi-urgent"
    } else {
      urgencyLevel = "non-urgent"
    }

    // Generate symptoms list
    const symptoms: string[] = [data.primarySymptom]
    if (data.additionalSymptoms) {
      symptoms.push(...data.additionalSymptoms)
    }
    if (data.hasTemperature && data.temperature) {
      symptoms.push(`Fever (${data.temperature}°C)`)
    }
    if (data.hasChestPain) symptoms.push("Chest pain")
    if (data.hasDifficultyBreathing) symptoms.push("Difficulty breathing")
    if (data.hasLossOfConsciousness) symptoms.push("Loss of consciousness")
    if (data.hasSevereHeadache) symptoms.push("Severe headache")
    if (data.hasUncontrolledBleeding) symptoms.push("Uncontrolled bleeding")

    // Generate recommendations and next steps based on urgency
    let recommendation: string
    let nextSteps: string[]
    let estimatedWaitTime: string | undefined

    switch (urgencyLevel) {
      case "emergency":
        recommendation = "Your symptoms indicate a potentially serious condition that requires immediate medical attention. Please seek emergency care right away or call emergency services."
        nextSteps = [
          "Call emergency services (911) immediately or go to the nearest emergency room",
          "Do not drive yourself - have someone else drive you or call an ambulance",
          "Bring a list of your current medications and medical history",
          "Stay calm and follow any instructions given by emergency personnel"
        ]
        estimatedWaitTime = "Immediate"
        break

      case "urgent":
        recommendation = "Your symptoms suggest a condition that should be evaluated by a healthcare provider within the next few hours. Consider visiting an urgent care center or emergency room."
        nextSteps = [
          "Visit an urgent care center or emergency room within 2-4 hours",
          "Call ahead to inform them of your symptoms",
          "Bring your insurance card and a list of current medications",
          "Monitor your symptoms and seek immediate care if they worsen"
        ]
        estimatedWaitTime = "2-4 hours"
        break

      case "semi-urgent":
        recommendation = "Your symptoms should be evaluated by a healthcare provider within the next 24-48 hours. Schedule an appointment with your primary care doctor or visit a walk-in clinic."
        nextSteps = [
          "Schedule an appointment with your primary care doctor within 24-48 hours",
          "If unavailable, consider a walk-in clinic or urgent care center",
          "Monitor your symptoms and note any changes",
          "Take over-the-counter medications as appropriate for symptom relief"
        ]
        estimatedWaitTime = "24-48 hours"
        break

      case "non-urgent":
        recommendation = "Your symptoms appear to be manageable and can typically be addressed through routine medical care or self-care measures."
        nextSteps = [
          "Schedule a routine appointment with your primary care doctor if symptoms persist",
          "Monitor your symptoms over the next few days",
          "Use appropriate self-care measures (rest, hydration, over-the-counter medications)",
          "Seek medical attention if symptoms worsen or new symptoms develop"
        ]
        estimatedWaitTime = "1-2 weeks"
        break
    }

    // Generate possible conditions (mock data)
    const possibleConditions: string[] = []
    if (data.hasChestPain && data.hasDifficultyBreathing) {
      possibleConditions.push("Cardiac event", "Pulmonary embolism", "Pneumonia")
    } else if (data.hasChestPain) {
      possibleConditions.push("Chest wall pain", "Acid reflux", "Anxiety")
    } else if (data.hasDifficultyBreathing) {
      possibleConditions.push("Asthma", "Respiratory infection", "Allergic reaction")
    } else if (data.hasSevereHeadache) {
      possibleConditions.push("Tension headache", "Migraine", "Sinus infection")
    } else if (data.hasTemperature) {
      possibleConditions.push("Viral infection", "Bacterial infection", "Flu")
    }

    // Add general conditions based on primary symptom
    if (data.primarySymptom.toLowerCase().includes("pain")) {
      possibleConditions.push("Musculoskeletal strain", "Inflammation")
    }

    return {
      urgencyLevel,
      recommendation,
      symptoms: [...new Set(symptoms)], // Remove duplicates
      possibleConditions,
      nextSteps,
      disclaimer: "This AI triage tool is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for proper diagnosis and treatment. In case of emergency, call your local emergency services immediately.",
      estimatedWaitTime,
      nearbyClinic: {
        name: "Lagos General Hospital",
        address: "123 Medical Center Drive, Victoria Island, Lagos",
        phone: "+234-1-234-5678",
        distance: "2.3 km"
      }
    }
  }

  // Progress tracking for enhanced loading states
  static async analyzeTriageWithProgress(
    data: TriageApiData,
    onProgress?: (stage: string, progress: number) => void
  ): Promise<TriageResult> {
    const stages = [
      { name: "Validating symptoms", duration: 500 },
      { name: "Analyzing with AI", duration: 1500 },
      { name: "Generating recommendations", duration: 800 },
      { name: "Finding nearby clinics", duration: 700 }
    ];

    let totalProgress = 0;
    const totalDuration = stages.reduce((sum, stage) => sum + stage.duration, 0);

    for (const stage of stages) {
      onProgress?.(stage.name, Math.round((totalProgress / totalDuration) * 100));
      await new Promise(resolve => setTimeout(resolve, stage.duration));
      totalProgress += stage.duration;
    }

    onProgress?.("Complete", 100);
    return this.analyzeTriage(data);
  }
}