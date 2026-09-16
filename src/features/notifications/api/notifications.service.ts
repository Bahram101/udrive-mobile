import { apiClient } from "@/lib/api/client";

export const NotificationsService = {
  async registerPushToken(pushToken: string): Promise<void> {
    await apiClient.patch("/driver/push-token", { pushToken });
  },
};
