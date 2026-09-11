import { useMutation, useQueryClient } from "@tanstack/react-query";

import { withNormalizedError } from "@/lib/api/withNormalizedError";
import { useAuth } from "@/providers/AuthProvider";

// Role switching resets driver/client-side state on the backend (e.g. isOnline),
// but the query cache doesn't know that on its own — force a refetch so the
// next screen doesn't show data left over from the previous role.
export function useSwitchRole() {
  const { switchRole } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => withNormalizedError(() => switchRole()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver", "status"] });
      queryClient.invalidateQueries({ queryKey: ["driver", "current-order"] });
      queryClient.invalidateQueries({ queryKey: ["client", "current-order"] });
    },
  });
}
