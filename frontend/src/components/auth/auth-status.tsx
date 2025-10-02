'use client';

import { useAuth, AuthState } from '../../hooks/auth';

export default function AuthStatus() {
  const { user, authState, loading, error, refreshAuth } = useAuth();

  const getStatusColor = () => {
    switch (authState) {
      case AuthState.LOADING: return 'text-blue-600';
      case AuthState.AUTHENTICATED: return 'text-green-600';
      case AuthState.UNAUTHENTICATED: return 'text-gray-600';
      case AuthState.ERROR: return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (authState) {
      case AuthState.LOADING: return '⏳';
      case AuthState.AUTHENTICATED: return '✅';
      case AuthState.UNAUTHENTICATED: return '❌';
      case AuthState.ERROR: return '🚨';
      default: return '❓';
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshAuth();
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 border max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">Auth Status</h3>
        <button
          onClick={handleRefresh}
          className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
          disabled={loading}
        >
          {loading ? '⏳' : '🔄'}
        </button>
      </div>

      <div className={`flex items-center gap-2 text-sm ${getStatusColor()}`}>
        <span className="text-lg">{getStatusIcon()}</span>
        <span className="font-medium">{authState.toUpperCase()}</span>
      </div>

      {user && (
        <div className="mt-2 text-xs text-gray-600">
          <div>👤 {user.firstName} {user.lastName}</div>
          <div>📧 {user.email}</div>
        </div>
      )}

      {error && (
        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        <div className="font-medium mb-1">Scenario Guide:</div>
        <div>📱 A: localStorage + cookie ✅</div>
        <div>🍪 B: No localStorage + cookie ✅</div>
        <div>❌ C: No localStorage + no cookie</div>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        <button
          onClick={() => localStorage.removeItem('user_data')}
          className="text-blue-600 hover:underline mr-2"
        >
          Clear localStorage
        </button>
        <button
          onClick={handleRefresh}
          className="text-blue-600 hover:underline"
        >
          Test Auth
        </button>
      </div>
    </div>
  );
}