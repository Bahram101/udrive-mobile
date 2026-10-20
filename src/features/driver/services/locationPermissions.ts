import * as Location from "expo-location";
import { Alert, Linking } from "react-native";

import { locationPermissionPrefs } from "./locationPermissionPrefs";

/** Wraps Alert.alert in a promise that resolves when the user taps a button. */
export function showAlert(
  title: string,
  message: string,
  buttons: { text: string; onPress?: () => void }[],
): Promise<void> {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      buttons.map((btn) => ({
        text: btn.text,
        onPress: () => {
          btn.onPress?.();
          resolve();
        },
      })),
    );
  });
}

export async function requestBackgroundWithPriming(): Promise<Location.PermissionStatus> {
  const current = await Location.getBackgroundPermissionsAsync();

  if (current.status === Location.PermissionStatus.GRANTED) {
    return current.status;
  }

  if (!current.canAskAgain) {
    return current.status;
  }

  const alreadyExplained = await locationPermissionPrefs.wasExplained();
  if (!alreadyExplained) {
    await showAlert(
      "Нужен доступ к геолокации «Всегда»",
      "Чтобы вы получали заказы, даже когда телефон заблокирован или приложение свёрнуто.",
      [{ text: "Продолжить" }],
    );
    await locationPermissionPrefs.markExplained();
  }

  const result = await Location.requestBackgroundPermissionsAsync();
  return result.status;
}

export async function showDenialNoticeOnce(): Promise<void> {
  const alreadyShown = await locationPermissionPrefs.wasDenialNoticeShown();
  if (!alreadyShown) {
    await showAlert(
      "Нужен доступ «Всегда»",
      "Без доступа к геолокации в фоновом режиме вы не сможете выйти на линию — ваши координаты должны передаваться, даже когда приложение закрыто.",
      [
        { text: "Открыть настройки", onPress: () => Linking.openSettings() },
        { text: "Понятно" },
      ],
    );
    await locationPermissionPrefs.markDenialNoticeShown();
  }
}
