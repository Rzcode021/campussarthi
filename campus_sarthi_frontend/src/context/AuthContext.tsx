import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/user';
import { authApi } from '../services/authApi';
import { setApiTokenGetter, setApiLogout } from '../services/api';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function decodeToken(token: string): Record<string, unknown> {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = decodeToken(token) as { exp?: number };
    if (!exp) return false;
    return Date.now() / 1000 > exp;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Restore cached user from localStorage for instant UI
    try {
      const cached = localStorage.getItem('user_data');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem('access_token')
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    navigate('/login');
  }, [navigate]);

  // Wire up api.ts interceptors
  useEffect(() => {
    setApiTokenGetter(() => accessToken);
    setApiLogout(logout);
  }, [accessToken, logout]);

  // On mount: restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    // If token is clearly expired, clear immediately
    if (isTokenExpired(token)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      setAccessToken(null);
      setIsLoading(false);
      return;
    }

    setAccessToken(token);

    // Fetch fresh user data from backend
    authApi.me()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('user_data', JSON.stringify(res.data));
      })
      .catch((err) => {
        // Only clear session on 401 Unauthorized — not on network errors
        if (err?.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_data');
          setAccessToken(null);
          setUser(null);
        }
        // On network error: keep the user logged in using cached data
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const { access, user: userData } = res.data;
    const decoded = decodeToken(access);

    localStorage.setItem('access_token', access);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setAccessToken(access);
    setUser(userData);

    const role = (decoded.role as string) || userData?.role;
    if (role === 'admin' || decoded.is_staff) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user, accessToken, isLoading,
      isAuthenticated: !!user,
      login, logout, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
