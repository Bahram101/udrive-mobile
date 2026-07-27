import { useMutation } from "@tanstack/react-query";

import { authService } from "../api/auth.service";
import type { SendOtpPayload } from "../auth.types";

export function useSendOtp() {
  return useMutation({
    mutationFn: (payload: SendOtpPayload) => authService.sendOtp(payload),
  });
}
