import { apiClient } from "@/lib/api/client";

import type {
  DriverProfile,
  DriverStatusResponse,
  UpdateDriverProfilePayload,
  UpdateDriverStatusPayload,
  UpdateDriverStatusResponse,
} from "../driver.types";

export const DriverService = {
  async getStatus(): Promise<DriverStatusResponse> {
    const { data } = await apiClient.get<DriverStatusResponse>(
      "/driver/status",
    );
    return data;
  },

  async updateStatus(
    payload: UpdateDriverStatusPayload,
  ): Promise<UpdateDriverStatusResponse> {
    const { data } = await apiClient.patch<UpdateDriverStatusResponse>(
      "/driver/status",
      payload,
    );
    return data;
  },

  async updateLocation(payload: { lat: number; lng: number }) {
    const { data } = await apiClient.patch("/driver/location", payload);
    return data;
  },

  async getProfile(): Promise<DriverProfile> {
    const { data } = await apiClient.get<DriverProfile>("/driver/profile");
    return data;
  },

  async updateProfile(
    payload: UpdateDriverProfilePayload,
  ): Promise<DriverProfile> {
    const { data } = await apiClient.patch<DriverProfile>(
      "/driver/profile",
      payload,
    );
    return data;
  },
};
