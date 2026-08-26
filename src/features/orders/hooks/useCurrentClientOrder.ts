import { useQuery } from "@tanstack/react-query";

import { OrdersService } from "../api/orders.service";

// Polling, not push: lets the client see when their order gets accepted
// without a realtime transport.
export function useCurrentClientOrder() {
  return useQuery({
    queryKey: ["client", "current-order"],
    queryFn: () => OrdersService.getCurrentClientOrder(),
    refetchInterval: 5000,
  });
}
