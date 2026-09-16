import Constants from "expo-constants";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

import { NotificationsService } from "../api/notifications.service";

// Show the alert/sound even while the driver has the app open in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Registers this device for push notifications and sends the token to the
// backend, so a new order can reach the driver even when the app is closed
// or backgrounded. Driver-only: only meaningful for the driver role.
export function useRegisterPushToken() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function register() {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("orders", {
          name: "Заказы",
          importance: Notifications.AndroidImportance.MAX,
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

    const subscription = Notifications.addNotificationResponseReceivedListener(
      () => {
        router.push("/(driver)/home");
      },
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [router]);
}
