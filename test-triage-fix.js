#!/usr/bin/env node

/**
 * Test script to verify triage functionality works with the backend
 */

const axios = require('axios');

const API_BASE_URL = 'https://healthpal-u9p0.onrender.com/api/v1';

async function testTriageEndpoint() {
  console.log('🧪 Testing Triage Endpoint Fix');
  console.log('================================');
  
  try {
    // Test the existing /triage endpoint with transformed data
    const testData = {
      query: "I have a headache and feel tired. Age: 35, Gender: male. Duration: 1 to 6 hours. Pain level: 4/10",
      user_id: "test_user",
      input_method: "text"
    };
    
    console.log('📤 Sending request to:', `${API_BASE_URL}/triage/triage`);
    console.log('📋 Request data:', JSON.stringify(testData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/triage/triage`, testData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ Response Status:', response.status);
    console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.data && response.data.data.response) {
      console.log('\n🎉 SUCCESS: Triage endpoint is working!');
      console.log('💡 AI Response:', response.data.data.response);
      return true;
    } else {
      console.log('\n⚠️  WARNING: Unexpected response format');
      return false;
    }
    
  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    
    if (error.response) {
      console.log('📊 Status:', error.response.status);
      console.log('📋 Response:', JSON.stringify(error.response.data, null, 2));
    }
    
    return false;
  }
}

async function testHealthEndpoint() {
  console.log('\n🏥 Testing Health Endpoint');
  console.log('==========================');
  
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api/v1', '')}/health`, {
      timeout: 10000
    });
    
    console.log('✅ Health Status:', response.status);
    console.log('📊 Health Data:', JSON.stringify(response.data, null, 2));
    
    return response.status === 200;
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Triage API Tests');
  console.log('============================\n');
  
  // Test health endpoint first
  const healthOk = await testHealthEndpoint();
  
  if (!healthOk) {
    console.log('\n🚨 Health check failed - backend may be down');
    process.exit(1);
  }
  
  // Test triage endpoint
  const triageOk = await testTriageEndpoint();
  
  console.log('\n📋 Test Summary');
  console.log('===============');
  console.log('Health Endpoint:', healthOk ? '✅ PASS' : '❌ FAIL');
  console.log('Triage Endpoint:', triageOk ? '✅ PASS' : '❌ FAIL');
  
  if (healthOk && triageOk) {
    console.log('\n🎉 All tests passed! The triage functionality should work now.');
    console.log('💡 You can now test the frontend triage form.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

// Run the tests
main().catch(console.error);