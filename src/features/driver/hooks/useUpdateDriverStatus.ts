import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";

import { withNormalizedError } from "@/lib/api/withNormalizedError";

import { DriverService } from "../api/driver.service";
import type { UpdateDriverStatusResponse } from "../driver.types";
import {
  requestBackgroundWithPriming,
  showDenialNoticeOnce,
} from "../services/locationPermissions";
import {
  startForegroundTracking,
  startLocationTracking,
  stopLocationTracking,
} from "../services/locationTask";

const BACKGROUND_LOCATION_REQUIRED_MESSAGE =
  "Разрешите доступ к геолокации «Всегда», чтобы выйти на линию";

export function useUpdateDriverStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isOnline: boolean) => {
      if (!isOnline) {
        const response = await withNormalizedError(() =>
          DriverService.updateStatus({ isOnline: false }),
        );
        await stopLocationTracking();
        return response;
      }

      const fg = await Location.requestForegroundPermissionsAsync();
      if (fg.status !== Location.PermissionStatus.GRANTED) {
        throw new Error("Разрешите доступ к геолокации, чтобы выйти на линию");
      }

      const bgStatus = await requestBackgroundWithPriming();

      if (bgStatus !== Location.PermissionStatus.GRANTED) {
        await showDenialNoticeOnce();
        throw new Error(BACKGROUND_LOCATION_REQUIRED_MESSAGE);
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const response = await withNormalizedError(() =>
        DriverService.updateStatus({
          isOnline: true,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      );

      try {
        await startLocationTracking();
      } catch (err) {
        console.error("Failed to start background tracking:", err);
        await startForegroundTracking();
      }

      return response;
    },
    onSuccess: (response) => {
      queryClient.setQueryData<UpdateDriverStatusResponse>(
        ["driver", "status"],
        response,
      );
    },
  });
}
