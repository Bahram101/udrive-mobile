import { useMutation, useQueryClient } from "@tanstack/react-query";

import { withNormalizedError } from "@/lib/api/withNormalizedError";
import { useAuth } from "@/providers/AuthProvider";

import { DriverService } from "../api/driver.service";
import type {
  DriverProfile,
  UpdateDriverProfilePayload,
} from "../driver.types";

export function useUpdateDriverProfile() {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: (payload: UpdateDriverProfilePayload) =>
      withNormalizedError(() => DriverService.updateProfile(payload)),
    onSuccess: (response, payload) => {
      queryClient.setQueryData<DriverProfile>(["driver", "profile"], response);
      if (payload.email !== undefined) {
        void refreshUser();
      }
    },
  });
}
