import { apiClient } from "@/lib/api/client";

import type {
  UpdateDriverStatusPayload,
  UpdateDriverStatusResponse,
} from "../driver.types";

export const DriverService = {
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
