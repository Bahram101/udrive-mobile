import { apiClient } from "@/lib/api/client";

import type { CreateOrderPayload, CreateOrderResponse } from "../orders.types";

export const ordersService = {
  async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    console.log("ordersService.createOrder", payload);
    const { data } = await apiClient.post<CreateOrderResponse>(
      "/orders",
      payload,
    );
    return data;
  },
};
