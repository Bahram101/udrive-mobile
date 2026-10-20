import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

import { NotificationsService } from "../api/notifications.service";
import { loadNotifications } from "../lib/safeNotifications";

export function useRegisterPushToken(role: "driver" | "client" = "driver") {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    let subscription: { remove: () => void } | undefined;

    async function setup() {
      const Notifications = await loadNotifications();
      if (!Notifications || !isMounted) return;

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      async function register(
        Notifications: NonNullable<
          Awaited<ReturnType<typeof loadNotifications>>
        >,
      ) {
        if (Platform.OS === "android") {
          if (role === "driver") {
            await Notifications.setNotificationChannelAsync("orders-v2", {
              name: "Заказы",
              importance: Notifications.AndroidImportance.MAX,
              sound: "alarm.wav",
              vibrationPattern: [0, 250, 250, 250],
            });
          } else {
            await Notifications.deleteNotificationChannelAsync("order-status").catch(() => {});
            await Notifications.setNotificationChannelAsync("order-status-v2", {
              name: "Статус заказа",
              importance: Notifications.AndroidImportance.HIGH,
              sound: "arrived.wav",
            });
          }
        }

        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted" || !isMounted) return;

        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        if (!projectId) return;

        const { data: pushToken } = await Notifications.getExpoPushTokenAsync({
          projectId,
        });

        if (!isMounted) return;

        NotificationsService.registerPushToken(pushToken, role).catch((err) => console.warn("Failed to register push token:", err));
      }

      register(Notifications);

      Notifications.setBadgeCountAsync(0).catch((err) => console.warn("Failed to set badge count:", err));

      subscription = Notifications.addNotificationResponseReceivedListener(
        () => {
          if (role === "client") {
            router.push("/(client)/home");
          } else {
            router.push("/(driver)/home");
          }
        },
      );
    }

    setup();

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [router, role]);
}
