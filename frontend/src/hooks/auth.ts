import { useState, useEffect } from 'react';
import { User, AuthService } from '../lib/auth';

export enum AuthState {
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error'
}

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, firstName: string, lastName: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
  refreshAuth: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOADING);
  const [error, setError] = useState<string | null>(null);

  // Refresh authentication state
  const refreshAuth = async () => {
    try {
      setLoading(true);
      setAuthState(AuthState.LOADING);
      setError(null);

      //Check localStorage first (instant auth)
      const userData = AuthService.getUser();
      if (userData) {
        console.log('📱 User data found in localStorage');
        setUser(userData);
        setAuthState(AuthState.AUTHENTICATED);

        // Background validation of cookie
        try {
          await AuthService.getProfile();
          console.log('Cookie validation successful');
        } catch (error) {
          console.log('Cookie expired, clearing local data');
          AuthService.removeUser();
          setUser(null);
          setAuthState(AuthState.UNAUTHENTICATED);
        }
      } else {
        //No localStorage data, check cookie
        try {
          console.log('No localStorage, checking cookie...');
          const profile = await AuthService.getProfile();
          console.log('Valid cookie found, user authenticated');
          setUser(profile);
          setAuthState(AuthState.AUTHENTICATED);
        } catch (error: any) {
          console.log('No valid session found');
          setAuthState(AuthState.UNAUTHENTICATED);

          if (error.response?.status === 401) {
            console.log('Unauthorized - no valid cookie');
          } else {
            console.error('Auth error:', error);
            setError('Authentication check failed');
            setAuthState(AuthState.ERROR);
          }
        }
      }
    } catch (error) {
      console.error('🚨 Auth initialization error:', error);
      setError('Failed to initialize authentication');
      setAuthState(AuthState.ERROR);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth(); // Initial auth check on mount
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      setAuthState(AuthState.LOADING);

      const response = await AuthService.login(email, password);
      setUser(response.user);
      setAuthState(AuthState.AUTHENTICATED);
      console.log('Login successful');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      setError(errorMessage);
      setAuthState(AuthState.ERROR);
      console.error('Login failed:', errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, firstName: string, lastName: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      setAuthState(AuthState.LOADING);

      const response = await AuthService.register(email, firstName, lastName, password);
      setUser(response.user);
      setAuthState(AuthState.AUTHENTICATED);
      console.log('Registration successful');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      setAuthState(AuthState.ERROR);
      console.error('Registration failed:', errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      setUser(null);
      setAuthState(AuthState.UNAUTHENTICATED);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if server logout fails
      setUser(null);
      setAuthState(AuthState.UNAUTHENTICATED);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    authState,
    login,
    register,
    logout,
    isAuthenticated: authState === AuthState.AUTHENTICATED,
    error,
    refreshAuth
  };
};
