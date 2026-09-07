import { useMutation } from "@tanstack/react-query";

import { withNormalizedError } from "@/lib/api/withNormalizedError";

import { OrdersService } from "../api/orders.service";

// Every mutation a driver can perform on their currently assigned order.
// Grouped in one file since they're always used together (DriverOrderSheet).

export function useCancelDriverOrder() {
  return useMutation({
    mutationFn: (orderId: string) =>
      withNormalizedError(() => OrdersService.cancelDriverOrder(orderId)),
  });
}

export function useMarkOrderArrived() {
  return useMutation({
    mutationFn: (orderId: string) =>
      withNormalizedError(() => OrdersService.markOrderArrived(orderId)),
  });
}

export function useStartOrder() {
  return useMutation({
    mutationFn: (orderId: string) =>
      withNormalizedError(() => OrdersService.startOrder(orderId)),
  });
}

export function useCompleteOrder() {
  return useMutation({
    mutationFn: (orderId: string) =>
      withNormalizedError(() => OrdersService.completeOrder(orderId)),
  });
}
