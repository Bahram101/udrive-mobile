import { apiClient } from "@/lib/api/client";

import type { CreateOrderPayload, CreateOrderResponse } from "../orders.types";

export const ordersService = {
  async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const { data } = await apiClient.post<CreateOrderResponse>(
      "/orders",
      payload,
    );
    return data;
  },
};
