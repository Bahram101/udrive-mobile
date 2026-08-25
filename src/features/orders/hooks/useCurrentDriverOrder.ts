import { useQuery } from "@tanstack/react-query";

import { OrdersService } from "../api/orders.service";

// Polling, not push: no realtime transport in this project, so this just
// refetches on an interval instead.
export function useCurrentDriverOrder() {
  return useQuery({
    queryKey: ["driver", "current-order"],
    queryFn: () => OrdersService.getCurrentDriverOrder(),
    // refetchInterval: 5000,
  });
}
