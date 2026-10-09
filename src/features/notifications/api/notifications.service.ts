import { apiClient } from "@/lib/api/client";

export const NotificationsService = {
  async registerPushToken(pushToken: string, role: "driver" | "client" = "driver"): Promise<void> {
    await apiClient.patch(`/${role}/push-token`, { pushToken });
  },
};
