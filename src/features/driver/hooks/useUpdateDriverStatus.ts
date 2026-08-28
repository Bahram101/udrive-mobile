import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as Location from "expo-location";

import { DriverService } from "../api/driver.service";
import type { UpdateDriverStatusResponse } from "../driver.types";

export function useUpdateDriverStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isOnline: boolean) => {
      try {
        if (!isOnline) {
          return await DriverService.updateStatus({ isOnline: false });
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== Location.PermissionStatus.GRANTED) {
          throw new Error(
            "Разрешите доступ к геолокации, чтобы выйти на линию",
          );
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        return await DriverService.updateStatus({
          isOnline: true,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = (
            error.response?.data as { error?: string } | undefined
          )?.error;
          throw new Error(message ?? error.message);
        }
        throw error;
      }
    },
    onSuccess: (response) => {
      queryClient.setQueryData<UpdateDriverStatusResponse>(
        ["driver", "status"],
        response,
      );
    },
  });
}
