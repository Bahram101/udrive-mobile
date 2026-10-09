import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

import { DriverService } from "../api/driver.service";

export const DRIVER_LOCATION_TASK = "DRIVER_LOCATION_TASK";

TaskManager.defineTask(DRIVER_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error("DRIVER_LOCATION_TASK error:", error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const latest = locations[locations.length - 1];
    if (latest) {
      try {
        await DriverService.updateLocation({
          lat: latest.coords.latitude,
          lng: latest.coords.longitude,
        });
      } catch (err) {
        console.error("Failed to sync location to backend:", err);
      }
    }
  }
});

export async function startLocationTracking() {
  const isStarted =
    await Location.hasStartedLocationUpdatesAsync(DRIVER_LOCATION_TASK);
  if (!isStarted) {
    await Location.startLocationUpdatesAsync(DRIVER_LOCATION_TASK, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 10000,
      distanceInterval: 20,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "uDrive: вы на линии",
        notificationBody: "Ваше местоположение передаётся пассажирам",
      },
    });
  }
}

export async function stopLocationTracking() {
  const isStarted =
    await Location.hasStartedLocationUpdatesAsync(DRIVER_LOCATION_TASK);
  if (isStarted) {
    await Location.stopLocationUpdatesAsync(DRIVER_LOCATION_TASK);
  }
  stopForegroundTracking();
}

let fgSubscription: Location.LocationSubscription | null = null;
let fgCanceled = false;

export async function startForegroundTracking(): Promise<boolean> {
  fgCanceled = false;
  if (fgSubscription) return true;

  const fg = await Location.getForegroundPermissionsAsync();
  if (fg.status !== Location.PermissionStatus.GRANTED) {
    return false;
  }

  try {
    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 20,
      },
      (position) => {
        DriverService.updateLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }).catch(console.error);
      },
    );

    if (fgCanceled) {
      sub.remove();
    } else {
      fgSubscription = sub;
    }
    return true;
  } catch (err) {
    console.warn("Failed to start foreground tracking:", err);
    return false;
  }
}

export function stopForegroundTracking() {
  fgCanceled = true;
  if (fgSubscription) {
    fgSubscription.remove();
    fgSubscription = null;
  }
}
