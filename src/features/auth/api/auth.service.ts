import { apiClient } from "@/lib/api/client";

import type {
  MeResponse,
  SendOtpPayload,
  SendOtpResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "../auth.types";

export const authService = {
  async sendOtp(payload: SendOtpPayload): Promise<SendOtpResponse> {
    const { data } = await apiClient.post<SendOtpResponse>(
      "/auth/send-otp",
      payload,
    );
    return data;
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
    const { data } = await apiClient.post<VerifyOtpResponse>(
      "/auth/verify-otp",
      payload,
    );
    return data;
  },

  async getMe(): Promise<MeResponse> {
    const { data } = await apiClient.get<MeResponse>("/auth/me");
    return data;
  },
};
