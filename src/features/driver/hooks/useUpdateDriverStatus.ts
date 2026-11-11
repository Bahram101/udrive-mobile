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
  startDriverTracking,
  stopLocationTracking,
} from "../services/locationTask";

const BACKGROUND_LOCATION_REQUIRED_MESSAGE =
  "Разрешите доступ к геолокации «Всегда», чтобы выйти на линию";

export function useUpdateDriverStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isOnline: boolean) => {
      if (!isOnline) {
        // Stop first: an update sent after the backend marks the driver
        // offline is rejected with 409.
        await stopLocationTracking();
        try {
          return await withNormalizedError(() =>
            DriverService.updateStatus({ isOnline: false }),
          );
        } catch (err) {
          await startDriverTracking();
          throw err;
        }
      }

      let fg: Location.LocationPermissionResponse;
      try {
        fg = await Location.requestForegroundPermissionsAsync();
      } catch {
        throw new Error(
          "Не удалось запросить доступ к геолокации. Попробуйте позже.",
        );
      }
      if (fg.status !== Location.PermissionStatus.GRANTED) {
        throw new Error("Разрешите доступ к геолокации, чтобы выйти на линию");
      }

      const bgStatus = await requestBackgroundWithPriming();

      if (bgStatus !== Location.PermissionStatus.GRANTED) {
        await showDenialNoticeOnce();
        throw new Error(BACKGROUND_LOCATION_REQUIRED_MESSAGE);
      }

      let position: Location.LocationObject;
      try {
        position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      } catch {
        throw new Error(
          "Не удалось определить местоположение. Проверьте GPS и попробуйте снова.",
        );
      }

      const response = await withNormalizedError(() =>
        DriverService.updateStatus({
          isOnline: true,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      );

      await startDriverTracking();

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
