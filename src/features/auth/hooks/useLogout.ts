import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/providers/AuthProvider';
import { DriverService } from '@/features/driver/api/driver.service';

export function useLogout() {
  const { signOut, user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (user?.role === 'DRIVER') {
        try {
          await DriverService.updateStatus({ isOnline: false });
        } catch (error) {
          console.warn('Failed to update driver status on logout:', error);
        }
      }
      await signOut();
      queryClient.clear();
    },
  });
}
