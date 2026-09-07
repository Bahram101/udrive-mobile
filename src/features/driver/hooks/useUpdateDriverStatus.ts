import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";

import { withNormalizedError } from "@/lib/api/withNormalizedError";

import { DriverService } from "../api/driver.service";
import type { UpdateDriverStatusResponse } from "../driver.types";

export function useUpdateDriverStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isOnline: boolean) => {
      if (!isOnline) {
        return withNormalizedError(() =>
          DriverService.updateStatus({ isOnline: false }),
        );
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        throw new Error("Разрешите доступ к геолокации, чтобы выйти на линию");
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return withNormalizedError(() =>
        DriverService.updateStatus({
          isOnline: true,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      );
    },
    onSuccess: (response) => {
      queryClient.setQueryData<UpdateDriverStatusResponse>(
        ["driver", "status"],
        response,
      );
    },
  });
}
