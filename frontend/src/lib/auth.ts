import apiClient from './api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface PasswordlessRequestResponse {
  message: string;
  expiresIn?: number;
}

export interface PasswordlessVerifyResponse {
  message: string;
  user: User;
  isNewUser: boolean;
}

export interface CheckEmailResponse {
  exists: boolean;
  emailVerified: boolean;
}

export class AuthService {
  static removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user_data');
  }

  static setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // ============================================================================
  // EMAIL CHECKING
  // ============================================================================

  /**
   * Check if email exists in the system
   */
  static async checkEmailExists(email: string): Promise<CheckEmailResponse> {
    const response = await apiClient.post<CheckEmailResponse>('/api/v1/auth/check-email', { email });
    return response.data;
  }

  // ============================================================================
  // PASSWORDLESS AUTHENTICATION (Magic Link)
  // ============================================================================

  /**
   * Request magic link for passwordless login/signup
   * The backend will automatically create an account if email doesn't exist
   */
  static async requestMagicLink(email: string): Promise<PasswordlessRequestResponse> {
    const response = await apiClient.post<PasswordlessRequestResponse>('/api/v1/auth/passwordless/request', { email });

    return response.data;
  }

  /**
   * Verify magic link token
   * Completes the login/signup process
   */
  static async verifyMagicLink(token: string): Promise<PasswordlessVerifyResponse> {
    const response = await apiClient.post<PasswordlessVerifyResponse>('/api/v1/auth/passwordless/verify', { token });

    const { user } = response.data;
    this.setUser(user);

    return response.data;
  }

  // ============================================================================
  // PASSWORDLESS AUTHENTICATION (OTP)
  // ============================================================================

  /**
   * Request OTP for passwordless login/signup
   * The backend will automatically create an account if email doesn't exist
   */
  static async requestOTP(email: string): Promise<PasswordlessRequestResponse> {
    const response = await apiClient.post<PasswordlessRequestResponse>('/api/v1/auth/passwordless/otp/request', { email });

    return response.data;
  }

  /**
   * Verify OTP code
   * Completes the login/signup process
   */
  static async verifyOTP(email: string, otp: string): Promise<PasswordlessVerifyResponse> {
    const response = await apiClient.post<PasswordlessVerifyResponse>('/api/v1/auth/passwordless/otp/verify', { email, otp });

    const { user } = response.data;
    this.setUser(user);

    return response.data;
  }

  static async logout(): Promise<void> {
    // Call logout endpoint to clear HttpOnly cookie
    try {
      await apiClient.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }

    this.removeUser();
    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  static async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<{ user: User }>('/api/v1/auth/profile');
      const { user } = response.data;

      // Update localStorage with fresh user data
      this.setUser(user);

      if (process.env.NODE_ENV !== 'production') {
        console.log('Profile fetched and updated in localStorage');
      }

      return user;
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.removeUser();
        if (process.env.NODE_ENV !== 'production') {
          console.log('Cleared stale localStorage due to 401');
        }
      }
      throw error;
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getUser();
  }
}
