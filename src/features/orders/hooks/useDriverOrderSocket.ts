import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { connectSocket, disconnectSocket } from "@/lib/socket/client";
import { tokenStorage } from "@/lib/storage/secureStore";

import type { CreatedOrder } from "../orders.types";

// Keeps the driver's "new" and "current" order queries live-updated via
// Socket.IO, so the screen reflects new/assigned orders instantly instead
// of waiting for the next manual refresh.
export function useDriverOrderSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      const token = await tokenStorage.getAccessToken();
      if (!token || cancelled) return;

      const socket = connectSocket(token);

      socket.on("order:new", (order: CreatedOrder) => {
        queryClient.setQueryData<CreatedOrder[]>(
          ["driver", "new-orders"],
          (current) => {
            if (!current) return [order];
            if (current.some((existing) => existing.id === order.id)) {
              return current;
            }
            return [order, ...current];
          },
        );
      });

      socket.on("order:assigned", (order: CreatedOrder) => {
        queryClient.setQueryData<CreatedOrder | null>(
          ["driver", "current-order"],
          order,
        );
        queryClient.setQueryData<CreatedOrder[]>(
          ["driver", "new-orders"],
          (current) => current?.filter((o) => o.id !== order.id) ?? [],
        );
      });
    }

    setup();

    return () => {
      cancelled = true;
      disconnectSocket();
    };
  }, [queryClient]);
}
