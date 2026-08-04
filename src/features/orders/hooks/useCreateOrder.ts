import { useMutation } from "@tanstack/react-query";

import { ordersService } from "../api/orders.service";
import type { CreateOrderPayload } from "../orders.types";

export function useCreateOrder() {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      ordersService.createOrder(payload),
  });
}
