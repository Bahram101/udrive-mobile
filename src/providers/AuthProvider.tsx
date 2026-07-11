import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { setUnauthorizedHandler } from '@/lib/api/client';
import { userStorage } from '@/lib/storage/asyncStorage';
import { tokenStorage } from '@/lib/storage/secureStore';
import { authService } from '@/features/auth/api/auth.service';
import type { AuthUser, LoginPayload } from '@/features/auth/auth.types';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void signOut();
    });
    void restoreSession();
  }, []);

  async function restoreSession() {
    const [accessToken, storedUser] = await Promise.all([
      tokenStorage.getAccessToken(),
      userStorage.getUser(),
    ]);
    if (accessToken && storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }

  async function signIn(payload: LoginPayload) {
    const { accessToken, refreshToken, user: authUser } = await authService.login(payload);
    await Promise.all([
      tokenStorage.setTokens(accessToken, refreshToken),
      userStorage.setUser(authUser),
    ]);
    setUser(authUser);
  }

  async function signOut() {
    await Promise.all([tokenStorage.clearTokens(), userStorage.clearUser()]);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
