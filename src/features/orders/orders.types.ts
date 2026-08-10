export type Order = {
  id: string;
  passengerName: string;
  rating: number;
  ratingCount: number;
  etaMinutes: number;
  pricePerKm: number;
  distanceKm: number;
  price: number;
  isFairPrice?: boolean;
  pickup: string;
  dropoff: string;
  paymentTag?: string;
};

export type CreateOrderPayload = {
  fromAddress: string;
  fromLat: number;
  fromLng: number;
};

export type CreateOrderInput = {
  fromAddress: string;
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
  price: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderResponse = {
  order: CreatedOrder;
};
