import { apiClient } from "@/lib/api/client";

import type {
  CreateOrderPayload,
  CreateOrderResponse,
  CreatedOrder,
} from "../orders.types";

export const OrdersService = {
  async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const { data } = await apiClient.post<CreateOrderResponse>(
      "/orders",
      payload,
    );
    return data;
  },

  async getCurrentDriverOrder(): Promise<CreatedOrder | null> {
    const { data } = await apiClient.get<{ order: CreatedOrder | null }>(
      "/driver/orders/current",
    );
    return data.order;
  },

  async getNewOrders(): Promise<CreatedOrder[]> {
    const { data } = await apiClient.get<{ orders: CreatedOrder[] }>(
      "/driver/orders/new",
    );
    return data.orders;
  },

  async getCurrentClientOrder(): Promise<CreatedOrder | null> {
    const { data } = await apiClient.get<{ order: CreatedOrder | null }>(
      "/client/orders/current",
    );
    return data.order;
  },
};
