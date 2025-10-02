// Export all stores
export { useAuthStore } from './auth-store';
export { 
  useDemoStore, 
  useDemoMode, 
  useDemoScenario, 
  useMockData,
  DEMO_SCENARIOS,
  type DemoScenario 
} from './demo-store';

// Re-export types
export type { AuthUser, LoginRequest } from '@/lib/api';