import { useQuery } from "@tanstack/react-query";

import { OrdersService } from "../api/orders.service";

export function useNewOrders(enabled: boolean) {
  return useQuery({
    queryKey: ["driver", "new-orders"],
    queryFn: () => OrdersService.getNewOrders(),
    refetchInterval: 5000,
    enabled,
  });
}
