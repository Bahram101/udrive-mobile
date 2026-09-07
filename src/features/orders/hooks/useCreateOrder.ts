import { useMutation } from "@tanstack/react-query";
import * as Location from "expo-location";

import { withNormalizedError } from "@/lib/api/withNormalizedError";

import { OrdersService } from "../api/orders.service";
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

      return withNormalizedError(() =>
        OrdersService.createOrder({
          fromAddress,
          toAddress,
          fromLat: position.coords.latitude,
          fromLng: position.coords.longitude,
        }),
      );
    },
  });
}
