import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Demo scenarios for triage
export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  symptoms: string;
  expectedUrgency: 'low' | 'medium' | 'high' | 'emergency';
  location?: {
    latitude: number;
    longitude: number;
    name: string;
  };
}

// Predefined demo scenarios
export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'headache-mild',
    name: 'Mild Headache',
    description: 'Common headache with no severe symptoms',
    symptoms: 'I have a mild headache that started this morning. No fever, no nausea, just a dull ache.',
    expectedUrgency: 'low',
    location: {
      latitude: 6.5244,
      longitude: 3.3792,
      name: 'Lagos, Nigeria'
    }
  },
  {
    id: 'chest-pain',
    name: 'Chest Pain',
    description: 'Chest discomfort requiring immediate attention',
    symptoms: 'I am experiencing sharp chest pain that radiates to my left arm. I feel short of breath and dizzy.',
    expectedUrgency: 'emergency',
    location: {
      latitude: 6.5244,
      longitude: 3.3792,
      name: 'Lagos, Nigeria'
    }
  },
  {
    id: 'fever-cough',
    name: 'Fever and Cough',
    description: 'Flu-like symptoms needing medical attention',
    symptoms: 'I have had a fever of 38.5°C for 2 days with a persistent cough and body aches.',
    expectedUrgency: 'medium',
    location: {
      latitude: 6.5244,
      longitude: 3.3792,
      name: 'Lagos, Nigeria'
    }
  },
  {
    id: 'stomach-ache',
    name: 'Stomach Ache',
    description: 'Digestive discomfort',
    symptoms: 'I have been having stomach cramps and nausea since yesterday evening after eating.',
    expectedUrgency: 'low',
    location: {
      latitude: 6.5244,
      longitude: 3.3792,
      name: 'Lagos, Nigeria'
    }
  }
];

interface DemoState {
  // State
  isDemoMode: boolean;
  currentScenario: string | null;
  showDemoIndicators: boolean;
  useMockData: boolean;

  // Actions
  setDemoMode: (enabled: boolean) => void;
  setCurrentScenario: (scenarioId: string | null) => void;
  toggleDemoIndicators: () => void;
  setUseMockData: (useMock: boolean) => void;
  getCurrentScenario: () => DemoScenario | null;
  resetDemo: () => void;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      // Initial state - respect environment variable
      isDemoMode: process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === 'true' ? false : false,
      currentScenario: null,
      showDemoIndicators: false,
      useMockData: false,

      // Actions
      setDemoMode: (enabled: boolean) => {
        // Prevent enabling demo mode if disabled via environment variable
        const canEnableDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE !== 'false';
        const actualEnabled = canEnableDemo ? enabled : false;
        
        set({ 
          isDemoMode: actualEnabled,
          // Reset scenario when disabling demo mode
          currentScenario: actualEnabled ? get().currentScenario : null,
          // Enable mock data when in demo mode
          useMockData: actualEnabled
        });
      },

      setCurrentScenario: (scenarioId: string | null) => {
        set({ currentScenario: scenarioId });
      },

      toggleDemoIndicators: () => {
        set({ showDemoIndicators: !get().showDemoIndicators });
      },

      setUseMockData: (useMock: boolean) => {
        set({ useMockData: useMock });
      },

      getCurrentScenario: () => {
        const { currentScenario } = get();
        if (!currentScenario) return null;
        
        return DEMO_SCENARIOS.find(scenario => scenario.id === currentScenario) || null;
      },

      resetDemo: () => {
        set({
          isDemoMode: false,
          currentScenario: null,
          useMockData: false
        });
      },
    }),
    {
      name: 'demo-storage',
      storage: createJSONStorage(() => {
        // Ensure localStorage is only accessed on client side
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // Return a no-op storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      // Persist all demo settings
      partialize: (state) => ({
        isDemoMode: state.isDemoMode,
        currentScenario: state.currentScenario,
        showDemoIndicators: state.showDemoIndicators,
        useMockData: state.useMockData
      }),
      // Skip hydration to prevent mismatches
      skipHydration: true,
    }
  )
);

// Convenience hooks for specific demo functionality
export const useDemoMode = () => {
  const isDemoMode = useDemoStore(state => state.isDemoMode);
  const setDemoMode = useDemoStore(state => state.setDemoMode);
  return { isDemoMode, setDemoMode };
};

export const useDemoScenario = () => {
  const currentScenario = useDemoStore(state => state.currentScenario);
  const setCurrentScenario = useDemoStore(state => state.setCurrentScenario);
  const getCurrentScenario = useDemoStore(state => state.getCurrentScenario);
  return { currentScenario, setCurrentScenario, getCurrentScenario };
};

export const useMockData = () => {
  const useMockData = useDemoStore(state => state.useMockData);
  const setUseMockData = useDemoStore(state => state.setUseMockData);
  return { useMockData, setUseMockData };
};