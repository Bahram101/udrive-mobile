export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Address = {
  id: string;
  street: string;
  houseNumber: string;
  lat: number;
  lng: number;
  createdByUserId: string | null;
  createdAt: string;
};

export type CreateAddressPayload = {
  street: string;
  houseNumber: string;
  lat: number;
  lng: number;
};
