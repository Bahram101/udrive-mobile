import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";

import { Alert } from "react-native";

import { withNormalizedError } from "@/lib/api/withNormalizedError";

import { DriverService } from "../api/driver.service";
import type { UpdateDriverStatusResponse } from "../driver.types";
import {
  startForegroundTracking,
  startLocationTracking,
  stopLocationTracking,
} from "../services/locationTask";

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

      const bg = await Location.requestBackgroundPermissionsAsync();
      if (bg.status !== Location.PermissionStatus.GRANTED) {
        Alert.alert(
          "Фоновый режим отключен",
          "Ваше местоположение будет передаваться только когда приложение открыто.",
          [{ text: "Понятно" }],
        );
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

      if (bg.status === Location.PermissionStatus.GRANTED) {
        try {
          await startLocationTracking();
        } catch (err) {
          console.error("Failed to start background tracking:", err);
          await startForegroundTracking();
        }
      } else {
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
