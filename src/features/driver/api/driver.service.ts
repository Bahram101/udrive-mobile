import { apiClient } from "@/lib/api/client";

import type {
  DriverStatusResponse,
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
};
