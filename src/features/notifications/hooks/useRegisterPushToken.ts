import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

import { NotificationsService } from "../api/notifications.service";

const isUnsupportedInExpoGo =
  Constants.appOwnership === "expo" && Platform.OS === "android";

export function useRegisterPushToken() {
  const router = useRouter();

  useEffect(() => {
    if (isUnsupportedInExpoGo) return;

    let isMounted = true;
    let subscription: { remove: () => void } | undefined;

    try {
      const Notifications =
        require("expo-notifications") as typeof import("expo-notifications");

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      async function register() {
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("orders", {
            name: "Заказы",
            importance: Notifications.AndroidImportance.MAX,
            sound: "alarm.wav",
            vibrationPattern: [0, 250, 250, 250],
          });
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

        NotificationsService.registerPushToken(pushToken).catch(() => {});
      }

      register();

      subscription = Notifications.addNotificationResponseReceivedListener(
        () => {
          router.push("/(driver)/home");
        },
      );
    } catch {
      // Notifications unsupported in this runtime (e.g. Expo Go) — ignore.
    }

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [router]);
}
