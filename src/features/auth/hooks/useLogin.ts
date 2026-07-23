import { useMutation } from "@tanstack/react-query";

import { useAuth } from "@/providers/AuthProvider";

import type { LoginPayload } from "../auth.types";

export function useLogin() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const authUser = await signIn(payload);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return authUser;
    },
  });
}
