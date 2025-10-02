import { apiClient, AuthUser } from './api';
import Cookies from 'js-cookie';

// Auth utility functions
export class AuthUtils {
  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  // Get current user from token
  static getCurrentUser(): Partial<AuthUser> | null {
    return apiClient.getCurrentUser();
  }

  // Login with credentials
  static async login(email: string, password: string): Promise<AuthUser> {
    return apiClient.login({ email, password });
  }

  // Demo login
  static async demoLogin(): Promise<AuthUser> {
    return apiClient.demoLogin();
  }

  // Logout
  static async logout(): Promise<void> {
    await apiClient.logout();
  }

  // Get access token
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return Cookies.get('access_token') || null;
  }

  // Check if token is expired (basic check)
  static isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  // Redirect to login if not authenticated
  static requireAuth(): boolean {
    if (!this.isAuthenticated() || this.isTokenExpired()) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return false;
    }
    return true;
  }

  // Get user role from token (if available)
  static getUserRole(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  }
}

// Export individual functions for convenience
export const {
  isAuthenticated,
  getCurrentUser,
  login,
  demoLogin,
  logout,
  getAccessToken,
  isTokenExpired,
  requireAuth,
  getUserRole,
} = AuthUtils;