import Constants from "expo-constants";
import { Platform } from "react-native";

const isUnsupportedInExpoGo =
  Constants.appOwnership === "expo" && Platform.OS === "android";

// expo-notifications crashes Expo Go on Android as soon as it's loaded —
// loaded lazily so it can be skipped entirely there.
export async function loadNotifications(): Promise<
  typeof import("expo-notifications") | null
> {
  if (isUnsupportedInExpoGo) return null;

  try {
    return await import("expo-notifications");
  } catch {
    return null;
  }
}
