// Test the frontend triage functionality
const axios = require('axios');

async function testFrontendTriage() {
    console.log('🧪 TESTING FRONTEND TRIAGE INTEGRATION');
    console.log('=====================================');
    
    // Use the same configuration as the frontend
    const baseURL = 'https://healthpal-u9p0.onrender.com/api/v1';
    
    try {
        // Simulate the frontend's triage request
        console.log('🔍 Testing frontend triage flow...');
        
        // This simulates what the frontend TriageAIService.analyzeTriage() does
        const formData = {
            primarySymptom: "I have a severe headache and feel dizzy",
            age: "35",
            gender: "male",
            symptomDuration: "less_than_1_day",
            painLevel: "7",
            additionalSymptoms: ["dizziness"],
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
            hasSevereHeadache: true,
            hasUncontrolledBleeding: false
        };
        
        // Transform to backend format (like the frontend does)
        const symptomParts = [formData.primarySymptom];
        symptomParts.push(`Age: ${formData.age}, Gender: ${formData.gender}`);
        symptomParts.push(`Duration: ${formData.symptomDuration.replace('_', ' ')}`);
        symptomParts.push(`Pain level: ${formData.painLevel}/10`);
        
        if (formData.additionalSymptoms && formData.additionalSymptoms.length > 0) {
            symptomParts.push(`Additional symptoms: ${formData.additionalSymptoms.join(', ')}`);
        }
        
        const emergencySymptoms = [];
        if (formData.hasChestPain) emergencySymptoms.push("chest pain");
        if (formData.hasDifficultyBreathing) emergencySymptoms.push("difficulty breathing");
        if (formData.hasLossOfConsciousness) emergencySymptoms.push("loss of consciousness");
        if (formData.hasSevereHeadache) emergencySymptoms.push("severe headache");
        if (formData.hasUncontrolledBleeding) emergencySymptoms.push("uncontrolled bleeding");
        
        if (emergencySymptoms.length > 0) {
            symptomParts.push(`Emergency symptoms: ${emergencySymptoms.join(', ')}`);
        }
        
        const comprehensiveQuery = symptomParts.join('. ');
        
        console.log('📝 Comprehensive query:', comprehensiveQuery);
        
        // Make the API call
        const response = await axios.post(`${baseURL}/triage/triage`, {
            query: comprehensiveQuery,
            user_id: 'anonymous_user',
            input_method: 'text'
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000
        });
        
        console.log('✅ Frontend triage integration - SUCCESS');
        console.log('Status:', response.status);
        console.log('Response structure:', {
            success: response.data.success,
            message: response.data.message,
            hasData: !!response.data.data,
            dataKeys: response.data.data ? Object.keys(response.data.data) : []
        });
        
        // Check if response has expected structure
        const data = response.data.data;
        if (data && data.response && data.confidence !== undefined) {
            console.log('✅ Response structure is valid for frontend');
            console.log('📊 Analysis preview:', data.response.substring(0, 200) + '...');
            console.log('🎯 Confidence:', data.confidence);
            console.log('💡 Recommendations:', data.recommendations);
        } else {
            console.log('⚠️  Response structure may need adjustment for frontend');
        }
        
    } catch (error) {
        console.log('❌ Frontend triage integration - FAILED');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
}

// Run the test
testFrontendTriage().catch(console.error);