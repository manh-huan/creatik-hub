import apiClient from './api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
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

  static async register(email: string, firstName: string, lastName: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/register', {
      email,
      firstName,
      lastName,
      password
    });

    const { user } = response.data;
    this.setUser(user);

    return response.data;
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', {
      email,
      password
    });

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