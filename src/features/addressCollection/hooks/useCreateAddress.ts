import { useMutation } from "@tanstack/react-query";

import { withNormalizedError } from "@/lib/api/withNormalizedError";

import type { CreateAddressPayload } from "../addressCollection.types";
import { AddressCollectionService } from "../api/addressCollection.service";

export function useCreateAddress() {
  return useMutation({
    mutationFn: (payload: CreateAddressPayload) =>
      withNormalizedError(() => AddressCollectionService.createAddress(payload)),
  });
}
