export type CreateOrderPayload = {
  fromAddress: string;
  toAddress?: string;
  fromLat: number;
  fromLng: number;
};

export type CreateOrderInput = {
  fromAddress: string;
  toAddress?: string;
};

export type OrderStatus =
  | "NEW"
  | "ACCEPTED"
  | "ARRIVED"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED";

export type CreatedOrder = {
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
};

export type CreateOrderResponse = {
  order: CreatedOrder;
};
