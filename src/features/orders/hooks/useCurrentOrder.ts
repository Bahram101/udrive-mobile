import { useQuery } from "@tanstack/react-query";

import { OrdersService } from "../api/orders.service";

export function useCurrentOrder(role: "driver" | "client") {
  return useQuery({
    queryKey: [role, "current-order"],
    queryFn: () => OrdersService.getCurrentOrder(role),
    refetchInterval: 5000,
  });
}
