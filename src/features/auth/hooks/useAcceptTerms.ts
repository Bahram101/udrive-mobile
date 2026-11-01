import { useMutation } from "@tanstack/react-query";

import { withNormalizedError } from "@/lib/api/withNormalizedError";
import { useAuth } from "@/providers/AuthProvider";

import { authService } from "../api/auth.service";

export function useAcceptTerms() {
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: () => withNormalizedError(() => authService.acceptTerms()),
    // Returning the promise makes TanStack Query await it before running a
    // per-call onSuccess — callers that navigate right after must see the
    // refreshed `user.termsAcceptedAt` already in context, or AuthGate
    // would immediately redirect them straight back here.
    onSuccess: () => refreshUser(),
  });
}
