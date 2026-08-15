import { useQuery } from "@tanstack/react-query";

import { OrdersService } from "../api/orders.service";

export function useNewOrders() {
  return useQuery({
    queryKey: ["driver", "new-orders"],
    queryFn: () => OrdersService.getNewOrders(),
  });
}
