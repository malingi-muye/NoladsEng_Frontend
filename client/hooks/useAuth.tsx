import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_at?: string;
}

interface SessionData {
  id: string;
  expires_at: string;
}

interface AuthContextType {
  user: User | null;
  session: SessionData | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  verifySession: () => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  getActiveSessions: () => Promise<any[]>;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verify session with server
  const verifySession = async (): Promise<boolean> => {
    const sessionToken = localStorage.getItem('sessionToken');
    
    if (!sessionToken) {
      return false;
    }

    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setUser({
          id: result.data.user.id,
          email: result.data.user.email,
          first_name: result.data.user.name.split(' ')[0],
          last_name: result.data.user.name.split(' ')[1] || '',
          role: result.data.user.role,
          is_active: true,
        });
        setSession(result.data.session);
        return true;
      } else {
        // Session invalid, clear storage
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('user');
        return false;
      }
    } catch (error) {
      console.error('Session verification error:', error);
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
      return false;
    }
  };

  // Check if admin is already logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');
    if (token && adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        setUser({
          id: 1,
          email: parsedAdmin.email,
          first_name: parsedAdmin.name?.split(' ')[0] || '',
          last_name: parsedAdmin.name?.split(' ')[1] || '',
          role: 'admin',
          is_active: true,
        });
      } catch (error) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const clearError = () => setError(null);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (result.success && result.token) {
        // Store JWT as adminToken
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('admin', JSON.stringify(result.admin));
        setUser({
          id: 1,
          email: result.admin.email,
          first_name: result.admin.name.split(' ')[0],
          last_name: result.admin.name.split(' ')[1] || '',
          role: 'admin',
          is_active: true,
        });
        setSession(null);
        setIsLoading(false);
        return { success: true };
      } else {
        const errorMsg = result.error || 'Login failed';
        setError(errorMsg);
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = 'Network error. Please try again.';
      setError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  const logoutAll = async (): Promise<void> => {
    const sessionToken = localStorage.getItem('sessionToken');
    
    try {
      if (sessionToken) {
        await fetch('/api/auth/logout-all', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
      setUser(null);
      setSession(null);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const sessionToken = localStorage.getItem('sessionToken');
    
    if (!sessionToken) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const result = await response.json();

      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Password change failed' };
      }
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Request failed' };
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const result = await response.json();

      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Password reset failed' };
      }
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const getActiveSessions = async (): Promise<any[]> => {
    const sessionToken = localStorage.getItem('sessionToken');
    
    if (!sessionToken) {
      return [];
    }

    try {
      const response = await fetch('/api/auth/sessions', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        return result.data || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Get sessions error:', error);
      return [];
    }
  };

  const logout = async (): Promise<void> => {
    // For single admin, just clear local storage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setUser(null);
    setSession(null);
  };

  const value: AuthContextType = {
    user,
    session,
    login,
    logout,
    logoutAll,
    verifySession,
    changePassword,
    requestPasswordReset,
    resetPassword,
    getActiveSessions,
    isLoading,
    isAuthenticated: !!user,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
