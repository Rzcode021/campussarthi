import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem('access_token')
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('access_token');
    navigate('/login');
  }, [navigate]);

  // Wire up api.ts interceptors
  useEffect(() => {
    setApiTokenGetter(() => accessToken);
    setApiLogout(logout);
  }, [accessToken, logout]);

  // On mount: restore session
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    setAccessToken(token);
    authApi.me()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('access_token');
        setAccessToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const { access, user: userData } = res.data;
    const decoded = decodeToken(access);

    localStorage.setItem('access_token', access);
    setAccessToken(access);
    setUser(userData);

    const role = (decoded.role as string) || userData.role;
    if (role === 'admin' || decoded.is_staff) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const updateUser = (updatedUser: User) => setUser(updatedUser);

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
