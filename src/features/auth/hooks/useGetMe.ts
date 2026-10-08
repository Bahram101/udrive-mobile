import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { useAuth } from "@/providers/AuthProvider";

export function useGetMe() {
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: async () => {
      try {
        const user = await refreshUser();
        return user;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = (
            error.response?.data as { error?: string } | undefined
          )?.error;
          throw new Error(message ?? error.message);
        }
        throw error;
      }
    },
  });
}
