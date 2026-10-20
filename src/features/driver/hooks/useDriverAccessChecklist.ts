import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { AppState, Linking } from "react-native";

import * as Location from "expo-location";

import { loadNotifications } from "@/features/notifications/lib/safeNotifications";

import { requestBackgroundWithPriming } from "../services/locationPermissions";

type ChecklistItem = {
  id: string;
  label: string;
  blocked: boolean;
  /** "blocking" — can't go online without it. "degraded" — can go online, just unreliable. */
  severity: "blocking" | "degraded";
  fix: () => Promise<void>;
};

type DriverAccessChecklist = {
  items: ChecklistItem[];
  hasBlockers: boolean;
  hasHardBlockers: boolean;
  isLoading: boolean;
  refresh: () => void;
};

async function getNotificationStatus(): Promise<{
  granted: boolean;
  canAskAgain: boolean;
}> {
  const Notifications = await loadNotifications();
  if (!Notifications) return { granted: true, canAskAgain: false };

  const { status, canAskAgain } = await Notifications.getPermissionsAsync();
  return { granted: status === "granted", canAskAgain: canAskAgain ?? false };
}

async function requestNotificationPermission(): Promise<void> {
  const Notifications = await loadNotifications();
  if (!Notifications) return;
  await Notifications.requestPermissionsAsync();
}

export function useDriverAccessChecklist(): DriverAccessChecklist {
  const [bgLocationBlocked, setBgLocationBlocked] = useState(true);
  const [notifBlocked, setNotifBlocked] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const checkPermissions = useCallback(async () => {
    setIsLoading(true);

    const [bgPerm, notifPerm] = await Promise.all([
      Location.getBackgroundPermissionsAsync(),
      getNotificationStatus(),
    ]);

    setBgLocationBlocked(
      bgPerm.status !== Location.PermissionStatus.GRANTED,
    );
    setNotifBlocked(!notifPerm.granted);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkPermissions();
    }, [checkPermissions]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        checkPermissions();
      }
    });

    return () => subscription.remove();
  }, [checkPermissions]);

  const fixBgLocation = useCallback(async () => {
    const { canAskAgain } = await Location.getBackgroundPermissionsAsync();
    if (!canAskAgain) {
      Linking.openSettings();
      return;
    }
    await requestBackgroundWithPriming();
    checkPermissions();
  }, [checkPermissions]);

  const fixNotifications = useCallback(async () => {
    const notif = await getNotificationStatus();
    if (!notif.canAskAgain) {
      Linking.openSettings();
      return;
    }
    await requestNotificationPermission();
    checkPermissions();
  }, [checkPermissions]);

  const items: ChecklistItem[] = [
    {
      id: "bg-location",
      label: "Дайте доступ к геолокации в фоновом режиме",
      blocked: bgLocationBlocked,
      severity: "blocking",
      fix: fixBgLocation,
    },
    {
      id: "notifications",
      label: "Разрешите уведомления о заказах",
      blocked: notifBlocked,
      severity: "degraded",
      fix: fixNotifications,
    },
  ];

  return {
    items,
    hasBlockers: items.some((i) => i.blocked),
    hasHardBlockers: items.some(
      (i) => i.blocked && i.severity === "blocking",
    ),
    isLoading,
    refresh: checkPermissions,
  };
}
