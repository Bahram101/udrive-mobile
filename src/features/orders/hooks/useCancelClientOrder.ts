import { useMutation } from "@tanstack/react-query";

import { withNormalizedError } from "@/lib/api/withNormalizedError";

import { OrdersService } from "../api/orders.service";

export function useCancelClientOrder() {
  return useMutation({
    mutationFn: (orderId: string) =>
      withNormalizedError(() => OrdersService.cancelClientOrder(orderId)),
  });
}
