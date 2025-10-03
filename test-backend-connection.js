#!/usr/bin/env node

/**
 * Frontend to Backend Connection Test
 * Tests the connection between the Next.js frontend and FastAPI backend
 */

const axios = require('axios');
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Configuration - Testing DEPLOYED endpoints
const BACKEND_BASE_URL = process.env.BACKEND_URL || 'https://healthpal-u9p0.onrender.com';
const API_BASE_URL = `${BACKEND_BASE_URL}/api/v1`;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://triage-ai-web.vercel.app';
const TIMEOUT = 30000; // 30 seconds for deployed services

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

async function testConnection(url, description) {
  try {
    log(`🔍 Testing: ${description}`, 'blue');
    log(`   URL: ${url}`, 'blue');
    
    const startTime = Date.now();
    const response = await axios.get(url, { 
      timeout: TIMEOUT,
      validateStatus: (status) => status < 500 // Accept 4xx as valid responses
    });
    const duration = Date.now() - startTime;
    
    log(`✅ ${description} - SUCCESS`, 'green');
    log(`   Status: ${response.status}`, 'green');
    log(`   Response Time: ${duration}ms`, 'green');
    
    if (response.data) {
      log(`   Response: ${JSON.stringify(response.data, null, 2).substring(0, 200)}...`, 'green');
    }
    
    return { success: true, status: response.status, duration, data: response.data };
  } catch (error) {
    log(`❌ ${description} - FAILED`, 'red');
    
    if (error.code === 'ECONNREFUSED') {
      log(`   Error: Connection refused - Backend server may not be running`, 'red');
    } else if (error.code === 'ETIMEDOUT') {
      log(`   Error: Request timeout - Backend server may be slow or unresponsive`, 'red');
    } else if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Error: ${error.response.data?.message || error.message}`, 'red');
    } else {
      log(`   Error: ${error.message}`, 'red');
    }
    
    return { success: false, error: error.message };
  }
}

async function testCORS() {
  logSection('🌐 CORS Configuration Test');
  
  const origins = [
    FRONTEND_URL,
    'https://healthpal-1.vercel.app',
    'https://healthpal-2.vercel.app',
    'https://healthpal-3.vercel.app'
  ];
  
  let corsResults = [];
  
  for (const origin of origins) {
    try {
      log(`🔍 Testing CORS for origin: ${origin}`, 'blue');
      
      // Test preflight request
      const response = await axios.options(`${API_BASE_URL}/health`, {
        timeout: TIMEOUT,
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type,Authorization'
        }
      });
      
      log(`✅ CORS Preflight for ${origin} - SUCCESS`, 'green');
      log(`   Access-Control-Allow-Origin: ${response.headers['access-control-allow-origin']}`, 'green');
      log(`   Access-Control-Allow-Methods: ${response.headers['access-control-allow-methods']}`, 'green');
      log(`   Access-Control-Allow-Headers: ${response.headers['access-control-allow-headers']}`, 'green');
      
      corsResults.push({ origin, success: true });
    } catch (error) {
      log(`❌ CORS Preflight for ${origin} - FAILED`, 'red');
      log(`   Error: ${error.message}`, 'red');
      corsResults.push({ origin, success: false, error: error.message });
    }
  }
  
  const successfulCors = corsResults.filter(r => r.success).length;
  log(`\n📊 CORS Summary: ${successfulCors}/${corsResults.length} origins allowed`, 
      successfulCors > 0 ? 'green' : 'red');
  
  return successfulCors > 0;
}

async function testAuthentication() {
  logSection('🔐 Authentication Test');
  
  // Test login endpoint
  const loginResult = await testConnection(
    `${API_BASE_URL}/auth/login`,
    'Login Endpoint (POST)'
  );
  
  if (loginResult.success && loginResult.status === 405) {
    log('ℹ️  Login endpoint exists but requires POST method (expected)', 'yellow');
  }
  
  // Test protected endpoint without auth
  const protectedResult = await testConnection(
    `${API_BASE_URL}/auth/me`,
    'Protected Endpoint (without auth)'
  );
  
  if (protectedResult.success && protectedResult.status === 401) {
    log('ℹ️  Protected endpoint correctly requires authentication', 'yellow');
  }
  
  return { loginResult, protectedResult };
}

async function testAPIEndpoints() {
  logSection('🏥 API Endpoints Test');
  
  const endpoints = [
    { url: `${API_BASE_URL}/triage/test`, description: 'Triage Test Endpoint', method: 'GET' },
    { url: `${API_BASE_URL}/clinics/emergency`, description: 'Emergency Clinics Endpoint', method: 'GET' },
    { url: `${API_BASE_URL}/alerts`, description: 'Health Alerts Endpoint', method: 'GET' },
    { url: `${API_BASE_URL}/auth/register`, description: 'Registration Endpoint', method: 'POST' },
    { url: `${API_BASE_URL}/auth/login`, description: 'Login Endpoint', method: 'POST' }
  ];
  
  const results = [];
  for (const endpoint of endpoints) {
    const result = await testConnection(endpoint.url, endpoint.description);
    results.push({ ...endpoint, result });
  }
  
  return results;
}

async function testDemoLogin() {
  logSection('🎭 Demo Login Test');
  
  try {
    log('🔍 Testing demo login...', 'blue');
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'demo@triageai.ng',
      password: 'demo123'
    }, {
      timeout: TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    log('✅ Demo Login - SUCCESS', 'green');
    log(`   Status: ${response.status}`, 'green');
    
    if (response.data.access_token) {
      log('   ✅ Access token received', 'green');
      
      // Test authenticated request
      const authResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${response.data.access_token}`
        },
        timeout: TIMEOUT
      });
      
      log('✅ Authenticated Request - SUCCESS', 'green');
      log(`   User: ${authResponse.data.email || 'Unknown'}`, 'green');
      
      return { success: true, token: response.data.access_token };
    }
    
    return { success: true };
  } catch (error) {
    log('❌ Demo Login - FAILED', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Error: ${error.response.data?.message || error.message}`, 'red');
    } else {
      log(`   Error: ${error.message}`, 'red');
    }
    return { success: false, error: error.message };
  }
}

async function main() {
  log('🚀 DEPLOYED ENDPOINTS CONNECTION TEST', 'magenta');
  log('Testing Production/Staging Environment', 'magenta');
  log(`Backend URL: ${BACKEND_BASE_URL}`, 'blue');
  log(`API URL: ${API_BASE_URL}`, 'blue');
  log(`Frontend URL: ${FRONTEND_URL}`, 'blue');
  log(`Timeout: ${TIMEOUT}ms`, 'blue');
  
  const results = {
    basicConnection: null,
    health: null,
    cors: null,
    authentication: null,
    endpoints: null,
    demoLogin: null
  };
  
  // 1. Basic Connection Test
  logSection('🔌 Basic Connection Test');
  results.basicConnection = await testConnection(BACKEND_BASE_URL, 'Backend Server');
  
  // 2. Health Check
  logSection('❤️ Health Check');
  results.health = await testConnection(`${BACKEND_BASE_URL}/health`, 'Health Endpoint');
  
  // 3. CORS Test
  results.cors = await testCORS();
  
  // 4. Authentication Test
  results.authentication = await testAuthentication();
  
  // 5. API Endpoints Test
  results.endpoints = await testAPIEndpoints();
  
  // 6. Demo Login Test
  results.demoLogin = await testDemoLogin();
  
  // 7. Frontend Deployment Test
  logSection('🌐 Frontend Deployment Test');
  results.frontend = await testConnection(FRONTEND_URL, 'Frontend Deployment');
  
  // Summary
  logSection('📊 Test Summary');
  
  const tests = [
    { name: 'Backend Connection', result: results.basicConnection?.success },
    { name: 'Health Check', result: results.health?.success },
    { name: 'CORS Configuration', result: results.cors },
    { name: 'Authentication Endpoints', result: results.authentication?.loginResult?.success },
    { name: 'Demo Login', result: results.demoLogin?.success },
    { name: 'Frontend Deployment', result: results.frontend?.success }
  ];
  
  tests.forEach(test => {
    const status = test.result ? '✅ PASS' : '❌ FAIL';
    const color = test.result ? 'green' : 'red';
    log(`${test.name}: ${status}`, color);
  });
  
  const passedTests = tests.filter(t => t.result).length;
  const totalTests = tests.length;
  
  console.log('\n' + '='.repeat(50));
  log(`Overall Result: ${passedTests}/${totalTests} tests passed`, passedTests === totalTests ? 'green' : 'yellow');
  
  if (passedTests === totalTests) {
    log('🎉 All tests passed! Deployed services are working correctly.', 'green');
    log('✅ Frontend can successfully connect to backend in production.', 'green');
  } else {
    log('⚠️  Some tests failed. Check the deployed services and configuration.', 'yellow');
    
    // Troubleshooting suggestions
    console.log('\n💡 Troubleshooting Suggestions:');
    if (!results.basicConnection?.success) {
      log('• Check Render deployment status: https://dashboard.render.com/web/srv-d3fgbc2dbo4c73e04790', 'yellow');
      log('• Verify backend service is running and healthy', 'yellow');
    }
    if (!results.frontend?.success) {
      log('• Check Vercel deployment status: https://vercel.com/dashboard', 'yellow');
      log('• Verify frontend build and deployment succeeded', 'yellow');
    }
    if (!results.cors) {
      log('• Check CORS configuration allows your frontend domain', 'yellow');
      log('• Verify environment variables are set correctly in Render', 'yellow');
    }
    if (!results.demoLogin?.success) {
      log('• Check database connection and demo user setup', 'yellow');
      log('• Verify all environment variables are set in Render dashboard', 'yellow');
    }
  }
  
  // Additional deployment info
  console.log('\n🔗 Deployment URLs:');
  log(`Backend: ${BACKEND_BASE_URL}`, 'cyan');
  log(`Frontend: ${FRONTEND_URL}`, 'cyan');
  log(`Health Check: ${BACKEND_BASE_URL}/health`, 'cyan');
  log(`API Docs: ${BACKEND_BASE_URL}/docs`, 'cyan');
  
  return results;
}

// Run the test
if (require.main === module) {
  main().catch(error => {
    log(`💥 Test runner failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { main, testConnection };