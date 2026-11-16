import { apiClient } from "@/lib/api/client";

import type {
  Address,
  CreateAddressPayload,
} from "../addressCollection.types";

export const AddressCollectionService = {
  async createAddress(payload: CreateAddressPayload): Promise<Address> {
    const { data } = await apiClient.post<Address>("/addresses", payload);
    return data;
  },
};
