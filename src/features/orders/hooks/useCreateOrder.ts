import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import * as Location from "expo-location";

import { ordersService } from "../api/orders.service";
import type { CreateOrderInput } from "../orders.types";

export function useCreateOrder() {
  return useMutation({
    mutationFn: async ({ fromAddress, toAddress }: CreateOrderInput) => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        throw new Error("Разрешите доступ к геолокации, чтобы отправить заказ");
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      try {
        return await ordersService.createOrder({
          fromAddress,
          toAddress,
          fromLat: position.coords.latitude,
          fromLng: position.coords.longitude,
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
  });
}
