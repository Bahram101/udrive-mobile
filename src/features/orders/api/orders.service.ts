import { apiClient } from "@/lib/api/client";

import type {
  CreateOrderPayload,
  CreateOrderResponse,
  CurrentOrderResponse,
  Order,
  OrderResponse,
} from "../orders.types";

export const OrdersService = {
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const { data } = await apiClient.post<CreateOrderResponse>(
      "/client/orders",
      payload,
    );
    return data.order;
  },

  async getCurrentDriverOrder(): Promise<Order | null> {
    const { data } = await apiClient.get<CurrentOrderResponse>(
      "/driver/orders/current",
    );
    return data.order;
  },

  async getCurrentClientOrder(): Promise<Order | null> {
    const { data } = await apiClient.get<CurrentOrderResponse>(
      "/client/orders/current",
    );
    return data.order;
  },

  async cancelClientOrder(orderId: string): Promise<Order> {
    const { data } = await apiClient.patch<OrderResponse>(
      `/client/orders/${orderId}/cancel`,
    );
    return data.order;
  },

  async cancelDriverOrder(orderId: string): Promise<Order> {
    const { data } = await apiClient.patch<OrderResponse>(
      `/driver/orders/${orderId}/cancel`,
    );
    return data.order;
  },
};
