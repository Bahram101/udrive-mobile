import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authService } from "@/features/auth/api/auth.service";
import type { AuthUser, LoginPayload } from "@/features/auth/auth.types";
import { setUnauthorizedHandler } from "@/lib/api/client";
import { userStorage } from "@/lib/storage/asyncStorage";
import { onboardingStorage } from "@/lib/storage/onboardingStorage";
import { tokenStorage } from "@/lib/storage/secureStore";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasOnboarded: boolean;
  signIn: (payload: LoginPayload) => Promise<AuthUser>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  console.log("user2", JSON.stringify(user, null, 2));

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void signOut();
    });
    void restoreSession();
  }, []);

  async function restoreSession() {
    const [accessToken, storedUser, storedHasOnboarded] = await Promise.all([
      tokenStorage.getAccessToken(),
      userStorage.getUser(),
      onboardingStorage.getHasOnboarded(),
      onboardingStorage.clearHasOnboarded(),
    ]);
    if (accessToken && storedUser) {
      setUser(storedUser);
    }
    setHasOnboarded(storedHasOnboarded);
    setIsLoading(false);
  }

  async function signIn(payload: LoginPayload) {
    const {
      accessToken,
      refreshToken,
      user: authUser,
    } = await authService.login(payload);
    await Promise.all([
      tokenStorage.setTokens(accessToken, refreshToken),
      userStorage.setUser(authUser),
      onboardingStorage.setHasOnboarded(),
    ]);
    setUser(authUser);
    setHasOnboarded(true);
    return authUser;
  }

  async function signOut() {
    await Promise.all([tokenStorage.clearTokens(), userStorage.clearUser()]);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        hasOnboarded,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
