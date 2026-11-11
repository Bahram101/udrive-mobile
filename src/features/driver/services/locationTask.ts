import axios from "axios";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

import { DriverService } from "../api/driver.service";

export const DRIVER_LOCATION_TASK = "DRIVER_LOCATION_TASK";

async function syncLocation(coords: Location.LocationObjectCoords) {
  try {
    await DriverService.updateLocation({
      lat: coords.latitude,
      lng: coords.longitude,
    });
  } catch (err) {
    // 409 = backend already has the driver offline: an update that was
    // in flight while going off the line, nothing to report.
    if (axios.isAxiosError(err) && err.response?.status === 409) return;
    console.warn("Failed to sync location to backend:", err);
  }
}

TaskManager.defineTask(DRIVER_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error("DRIVER_LOCATION_TASK error:", error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const latest = locations[locations.length - 1];
    if (latest) await syncLocation(latest.coords);
  }
});

/** Background tracking, falling back to foreground-only if it can't start. */
export async function startDriverTracking() {
  try {
    await startLocationTracking();
  } catch (err) {
    console.warn("Failed to start background tracking:", err);
    await startForegroundTracking();
  }
}

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
        void syncLocation(position.coords);
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
