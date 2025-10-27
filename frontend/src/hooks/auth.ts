import { useState, useEffect } from 'react';
import { User, AuthService, PasswordlessRequestResponse, PasswordlessVerifyResponse } from '../lib/auth';

export enum AuthState {
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error',
}

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  authState: AuthState;
  requestMagicLink: (email: string) => Promise<PasswordlessRequestResponse>;
  verifyMagicLink: (token: string) => Promise<PasswordlessVerifyResponse>;
  requestOTP: (email: string) => Promise<PasswordlessRequestResponse>;
  verifyOTP: (email: string, otp: string) => Promise<PasswordlessVerifyResponse>;
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
        console.log('User data found in localStorage');
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
        // //No localStorage data, check cookie
        // try {
        //   console.log('No localStorage, checking cookie...');
        //   const profile = await AuthService.getProfile();
        //   console.log('Valid cookie found, user authenticated');
        //   setUser(profile);
        //   setAuthState(AuthState.AUTHENTICATED);
        // } catch (error: any) {
        //   console.log('No valid session found');
        //   setAuthState(AuthState.UNAUTHENTICATED);
        //   if (error.response?.status === 401) {
        //     console.log('Unauthorized - no valid cookie');
        //   } else {
        //     console.error('Auth error:', error);
        //     setError('Authentication check failed');
        //     setAuthState(AuthState.ERROR);
        //   }
        // }
      }
    } catch (error) {
      setError('Failed to initialize authentication');
      setAuthState(AuthState.ERROR);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth(); // Initial auth check on mount
  }, []);

  const requestMagicLink = async (email: string): Promise<PasswordlessRequestResponse> => {
    try {
      setError(null);
      setLoading(true);

      const response = await AuthService.requestMagicLink(email);
      console.log('Magic link requested successfully');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to send magic link';
      setError(errorMessage);
      console.error('Magic link request failed:', errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyMagicLink = async (token: string): Promise<PasswordlessVerifyResponse> => {
    try {
      setError(null);
      setLoading(true);
      setAuthState(AuthState.LOADING);

      const response = await AuthService.verifyMagicLink(token);
      setUser(response.user);
      setAuthState(AuthState.AUTHENTICATED);
      console.log(response.isNewUser ? 'Registration successful' : 'Login successful');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Invalid or expired magic link';
      setError(errorMessage);
      setAuthState(AuthState.ERROR);
      console.error('Magic link verification failed:', errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestOTP = async (email: string): Promise<PasswordlessRequestResponse> => {
    try {
      setError(null);
      setLoading(true);

      const response = await AuthService.requestOTP(email);
      console.log('OTP requested successfully');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to send OTP';
      setError(errorMessage);
      console.error('OTP request failed:', errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<PasswordlessVerifyResponse> => {
    try {
      setError(null);
      setLoading(true);
      setAuthState(AuthState.LOADING);

      const response = await AuthService.verifyOTP(email, otp);
      setUser(response.user);
      setAuthState(AuthState.AUTHENTICATED);
      console.log(response.isNewUser ? 'Registration successful' : 'Login successful');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Invalid OTP';
      setError(errorMessage);
      setAuthState(AuthState.ERROR);
      console.error('OTP verification failed:', errorMessage);
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
    requestMagicLink,
    verifyMagicLink,
    requestOTP,
    verifyOTP,
    logout,
    isAuthenticated: authState === AuthState.AUTHENTICATED,
    error,
    refreshAuth,
  };
};
