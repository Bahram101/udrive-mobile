export type Driver = {
  id: string;
  userId: string;
  carModel: string | null;
  carNumber: string | null;
  isOnline: boolean;
  rating: number;
  lat: number | null;
  lng: number | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateDriverStatusPayload = {
  isOnline: boolean;
  lat?: number;
  lng?: number;
};

export type DriverStatusResponse = {
  driver: Driver;
};

export type UpdateDriverStatusResponse = DriverStatusResponse;
