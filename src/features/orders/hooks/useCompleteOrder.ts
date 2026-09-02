import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { OrdersService } from "../api/orders.service";

export function useCompleteOrder() {
  return useMutation({
    mutationFn: async (orderId: string) => {
      try {
        return await OrdersService.completeOrder(orderId);
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
