import { useQuery } from "@tanstack/react-query";

import { OrdersService } from "../api/orders.service";

// Polling, not push: no realtime transport in this project, so the driver
// feed just refetches on an interval instead.
export function useNewOrders() {
  return useQuery({
    queryKey: ["driver", "new-orders"],
    queryFn: () => OrdersService.getNewOrders(),
    refetchInterval: 5000,
  });
}
