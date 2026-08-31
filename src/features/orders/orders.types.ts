export type Order = {
  id: string;
  clientId: string;
  driverId: string | null;
  fromAddress: string;
  toAddress: string | null;
  status: OrderStatus;
  fromLat: number | null;
  fromLng: number | null;
  toLat: number | null;
  toLng: number | null;
  price: number | null;
  createdAt: string;
  updatedAt: string;
  driver?: { lat: number | null; lng: number | null } | null;
};

export type OrderStatus =
  | "NEW"
  | "ACCEPTED"
  | "ARRIVED"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED";

export type CreateOrderPayload = {
  fromAddress: string;
  fromLat: number;
  fromLng: number;
  toAddress?: string;
};

export type CreateOrderInput = {
  fromAddress: string;
  toAddress?: string;
};

export type OrderResponse = {
  order: Order;
};

export type CurrentOrderResponse = {
  order: Order;
};

export type CreateOrderResponse = OrderResponse;
