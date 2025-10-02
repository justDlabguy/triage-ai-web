import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';

// Extended request config to include retry flag
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Types for authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

// API Response wrapper
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

// Error response type
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    // Get base URL from environment variables
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
    
    this.client = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for token refresh and error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle 401 errors (unauthorized)
        const extendedRequest = originalRequest as ExtendedAxiosRequestConfig;
        if (error.response?.status === 401 && originalRequest && !extendedRequest._retry) {
          extendedRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        // Transform error to our standard format
        const responseData = error.response?.data as { message?: string; code?: string } | undefined;
        const apiError: ApiError = {
          message: responseData?.message || error.message || 'An unexpected error occurred',
          status: error.response?.status || 500,
          code: responseData?.code,
        };

        return Promise.reject(apiError);
      }
    );
  }

  // Token management methods
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return Cookies.get('access_token') || null;
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return Cookies.get('refresh_token') || null;
  }

  private setTokens(accessToken: string, refreshToken: string) {
    if (typeof window === 'undefined') return;
    
    // Set tokens with secure options
    const cookieOptions = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      expires: 7, // 7 days
    };

    Cookies.set('access_token', accessToken, cookieOptions);
    Cookies.set('refresh_token', refreshToken, cookieOptions);
  }

  private clearTokens() {
    if (typeof window === 'undefined') return;
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  }

  private async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${this.client.defaults.baseURL}/auth/refresh`,
        { refresh_token: refreshToken }
      );

      const { access_token, refresh_token: newRefreshToken } = response.data;
      this.setTokens(access_token, newRefreshToken);
      
      return access_token;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  // Public API methods
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthUser> {
    try {
      const response = await this.post<{
        user: Omit<AuthUser, 'token'>;
        access_token: string;
        refresh_token: string;
      }>('/auth/login', credentials);

      const { user, access_token, refresh_token } = response;
      
      // Store tokens
      this.setTokens(access_token, refresh_token);

      // Return user with token
      return {
        ...user,
        token: access_token,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      await this.post('/auth/logout');
    } catch (error) {
      // Continue with local logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local tokens
      this.clearTokens();
    }
  }

  // Demo login for quick access
  async demoLogin(): Promise<AuthUser> {
    const demoCredentials: LoginRequest = {
      email: 'demo@triageai.com',
      password: 'demo123',
    };
    
    return this.login(demoCredentials);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Get current user info from token (if needed)
  getCurrentUser(): Partial<AuthUser> | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      // Decode JWT token to get user info (basic implementation)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub || payload.user_id,
        email: payload.email,
        name: payload.name,
      };
    } catch (error) {
      console.warn('Failed to decode token:', error);
      return null;
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export the class for testing purposes
export { ApiClient };