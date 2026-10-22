export type Driver = {
  id: string;
  userId: string;
  carBrand: string | null;
  carModel: string | null;
  carColor: string | null;
  carNumber: string | null;
  isOnline: boolean;
  rating: number;
  lat: number | null;
  lng: number | null;
  createdAt: string;
  updatedAt: string;
};

export type DriverProfile = {
  carBrand: string | null;
  carModel: string | null;
  carColor: string | null;
  email: string | null;
};

export type UpdateDriverProfilePayload = Partial<{
  carBrand: string;
  carModel: string;
  carColor: string;
  email: string;
}>;

export type UpdateDriverStatusPayload = {
  isOnline: boolean;
  lat?: number;
  lng?: number;
};

export type DriverStatusResponse = {
  driver: Driver;
};

export type UpdateDriverStatusResponse = DriverStatusResponse;
