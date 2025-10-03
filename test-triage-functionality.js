const axios = require('axios');

// Test the triage functionality
async function testTriageFunctionality() {
    console.log('🧪 TESTING TRIAGE FUNCTIONALITY');
    console.log('================================');
    
    const baseURL = 'https://healthpal-u9p0.onrender.com/api/v1';
    
    try {
        // Test the triage endpoint
        console.log('🔍 Testing /triage/triage endpoint...');
        
        const triageData = {
            query: "I have a severe headache and feel dizzy. The pain started this morning and is getting worse. I'm 35 years old male.",
            user_id: 'test_user_123',
            input_method: 'text'
        };
        
        const response = await axios.post(`${baseURL}/triage/triage`, triageData, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000
        });
        
        console.log('✅ /triage/triage endpoint - SUCCESS');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.log('❌ /triage/triage endpoint - FAILED');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
        
        // Try the analyze endpoint as fallback
        try {
            console.log('\n🔍 Testing /triage/analyze endpoint...');
            
            const detailedTriageData = {
                primarySymptom: "I have a severe headache and feel dizzy",
                age: 35,
                gender: "male",
                symptomDuration: "less_than_1_day",
                painLevel: 7,
                additionalSymptoms: ["dizziness"],
                hasTemperature: false,
                temperature: null,
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
            
            const analyzeResponse = await axios.post(`${baseURL}/triage/analyze`, detailedTriageData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 30000
            });
            
            console.log('✅ /triage/analyze endpoint - SUCCESS');
            console.log('Status:', analyzeResponse.status);
            console.log('Response:', JSON.stringify(analyzeResponse.data, null, 2));
            
        } catch (analyzeError) {
            console.log('❌ /triage/analyze endpoint - FAILED');
            if (analyzeError.response) {
                console.log('Status:', analyzeError.response.status);
                console.log('Error:', analyzeError.response.data);
            } else {
                console.log('Error:', analyzeError.message);
            }
        }
    }
}

// Run the test
testTriageFunctionality().catch(console.error);