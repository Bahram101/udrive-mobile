import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@/providers/AuthProvider';

export function useLogout() {
  const { signOut } = useAuth();

  return useMutation({
    mutationFn: () => signOut(),
  });
}
