import { useState, useEffect } from 'react';
import { User, AuthService } from '../lib/auth';

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      try {
        const token = AuthService.getToken();
        if (token) {
          const userData = AuthService.getUser();
          if (userData) {
            setUser(userData);
          } else {
            // Token exists but no user data, fetch from API
            const profile = await AuthService.getProfile();
            setUser(profile);
          }
        }
      } catch (error) {
        // Token is invalid, clear it
        AuthService.removeToken();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await AuthService.login(email, password);
      setUser(response.user);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await AuthService.register(email, name, password);
      setUser(response.user);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    AuthService.logout();
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    error
  };
};
