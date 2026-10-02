'use client';
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { api, getToken, setToken, User, ApiError } from './api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { first_name: string; last_name: string; email: string; phone: string; province: string; password: string }) => Promise<{ email: string }>;
  loginWithGoogle: (credential: string) => Promise<User>;
  logout: () => Promise<void>;
  completeProfile: (data: { first_name?: string; last_name?: string; phone: string; province: string }) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then(res => setUser(res.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login({ email, password });
    setToken(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (data: { first_name: string; last_name: string; email: string; phone: string; province: string; password: string }) => {
    const res = await api.register(data);
    return { email: res.email };
  }, []);

  const loginWithGoogle = useCallback(async (credential: string) => {
    const res = await api.loginWithGoogle(credential);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // ignore network errors on logout, still clear local state
    }
    setToken(null);
    setUser(null);
  }, []);

  const completeProfile = useCallback(async (data: { first_name?: string; last_name?: string; phone: string; province: string }) => {
    const res = await api.completeProfile(data);
    setUser(res.user);
  }, []);

  const resendVerification = useCallback(async (email: string) => {
    await api.resendVerification(email);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, completeProfile, resendVerification }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ApiError };
