import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { AppState, Linking } from "react-native";

import * as Location from "expo-location";

import { loadNotifications } from "@/features/notifications/lib/safeNotifications";

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

async function isNotificationsGranted(): Promise<boolean> {
  const Notifications = await loadNotifications();
  if (!Notifications) return true;

  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
}

export function useDriverAccessChecklist(): DriverAccessChecklist {
  const [bgLocationBlocked, setBgLocationBlocked] = useState(true);
  const [notifBlocked, setNotifBlocked] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const checkPermissions = useCallback(async () => {
    setIsLoading(true);

    const [bgPerm, notifGranted] = await Promise.all([
      Location.getBackgroundPermissionsAsync(),
      isNotificationsGranted(),
    ]);

    setBgLocationBlocked(
      bgPerm.status !== Location.PermissionStatus.GRANTED,
    );
    setNotifBlocked(!notifGranted);
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

  // Reaching this checklist means the permission was already asked for and
  // denied at least once, so there's nothing left to (re-)request — go
  // straight to Settings instead of re-attempting a native prompt that's
  // likely already exhausted.
  const openSettings = useCallback(async () => {
    Linking.openSettings();
  }, []);

  const items: ChecklistItem[] = [
    {
      id: "bg-location",
      label: "Дайте доступ к геолокации в фоновом режиме",
      blocked: bgLocationBlocked,
      severity: "blocking",
      fix: openSettings,
    },
    {
      id: "notifications",
      label: "Разрешите уведомления о заказах",
      blocked: notifBlocked,
      severity: "degraded",
      fix: openSettings,
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
