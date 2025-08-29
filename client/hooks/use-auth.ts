import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { User as ApiUser } from '@shared/api';

export interface User extends ApiUser {
  name: string; // Add any additional fields needed
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.auth.verify();
      if (response.success && response.data) {
        setUser({
          ...response.data.user,
          name: response.data.user.first_name + ' ' + response.data.user.last_name
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login(email, password);
      if (response.success && response.data) {
        setUser({
          ...response.data.user,
          name: response.data.user.first_name + ' ' + response.data.user.last_name
        });
        return { success: true };
      }
      throw new Error(response.error || 'Login failed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return { success: false, error: err instanceof Error ? err.message : 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      return { success: false, error: err instanceof Error ? err.message : 'Logout failed' };
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    checkAuth
  };
}
