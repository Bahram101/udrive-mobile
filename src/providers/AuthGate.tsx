import { useRouter, useSegments } from "expo-router";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "./AuthProvider";

const PROTECTED_GROUPS = ["(client)", "(driver)"];

export function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inProtectedGroup = PROTECTED_GROUPS.includes(segments[0]);
    if (!isAuthenticated && inProtectedGroup) {
      router.replace("/(auth)/phone");
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return <>{children}</>;
}
