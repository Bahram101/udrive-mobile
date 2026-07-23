import { useMutation } from "@tanstack/react-query";

import { useAuth } from "@/providers/AuthProvider";

import { authService } from "../api/auth.service";
import type { RegisterPayload, Role } from "../auth.types";

export function useRegister(role: Extract<Role, "CLIENT" | "DRIVER">) {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      if (role === "CLIENT") {
        await authService.registerClient(payload);
      } else {
        await authService.registerDriver(payload);
      }
      // Register endpointi token qaytarmaydi — shu zahoti login qilib sessiya ochamiz.
      return signIn({ phone: payload.phone });
    },
  });
}
