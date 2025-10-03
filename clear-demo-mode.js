// Script to clear demo mode from localStorage
// Run this in the browser console to reset demo mode

console.log('🧹 CLEARING DEMO MODE SETTINGS');
console.log('==============================');

// Clear demo mode from localStorage
if (typeof localStorage !== 'undefined') {
    // Check current demo settings
    const currentSettings = localStorage.getItem('demo-storage');
    console.log('Current demo settings:', currentSettings);
    
    // Clear demo storage
    localStorage.removeItem('demo-storage');
    console.log('✅ Demo storage cleared');
    
    // Set explicit settings to ensure demo mode is off
    const newSettings = {
        state: {
            isDemoMode: false,
            currentScenario: null,
            showDemoIndicators: false,
            useMockData: false
        },
        version: 0
    };
    
    localStorage.setItem('demo-storage', JSON.stringify(newSettings));
    console.log('✅ Demo mode explicitly disabled');
    console.log('New settings:', JSON.stringify(newSettings, null, 2));
    
    // Reload the page to apply changes
    console.log('🔄 Reloading page to apply changes...');
    window.location.reload();
} else {
    console.log('❌ localStorage not available');
}