import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthUser, LoginRequest, apiClient } from '@/lib/api';

interface AuthState {
  // State
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => void;
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await apiClient.login(credentials);
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error: unknown) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
            user: null,
            isAuthenticated: false
          });
          throw error;
        }
      },

      demoLogin: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await apiClient.demoLogin();
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error: unknown) {
          set({ 
            error: error instanceof Error ? error.message : 'Demo login failed',
            isLoading: false,
            user: null,
            isAuthenticated: false
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await apiClient.logout();
        } catch (error) {
          // Continue with logout even if API call fails
          console.warn('Logout API call failed:', error);
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        const isAuth = apiClient.isAuthenticated();
        const currentUser = apiClient.getCurrentUser();
        
        if (isAuth && currentUser) {
          set({ 
            isAuthenticated: true,
            user: currentUser as AuthUser
          });
        } else {
          set({ 
            isAuthenticated: false,
            user: null
          });
        }
      },

      setUser: (user: AuthUser | null) => {
        set({ 
          user,
          isAuthenticated: !!user
        });
      },
    }),
    {
      name: 'auth-storage',
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
      // Only persist user data, not loading states
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      // Skip hydration to prevent mismatches
      skipHydration: true,
    }
  )
);