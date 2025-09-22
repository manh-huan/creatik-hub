import apiClient from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export class AuthService {
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  static removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
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

  static async register(email: string, name: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', {
      email,
      name,
      password
    });

    const { user, token } = response.data;
    this.setToken(token);
    this.setUser(user);

    return response.data;
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', {
      email,
      password
    });

    const { user, token } = response.data;
    this.setToken(token);
    this.setUser(user);

    return response.data;
  }

  static async logout(): Promise<void> {
    this.removeToken();
    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  static async getProfile(): Promise<User> {
    const response = await apiClient.get<{ user: User }>('/api/auth/profile');
    const { user } = response.data;
    this.setUser(user);
    return user;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}