import { useMutation } from "@tanstack/react-query";

import { useAuth } from "@/providers/AuthProvider";

import type { VerifyOtpPayload } from "../auth.types";

export function useVerifyOtp() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => signIn(payload),
  });
}
