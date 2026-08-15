import { useQuery } from "@tanstack/react-query";

import { OrdersService } from "../api/orders.service";

export function useCurrentDriverOrder() {
  return useQuery({
    queryKey: ["driver", "current-order"],
    queryFn: () => OrdersService.getCurrentDriverOrder(),
  });
}
