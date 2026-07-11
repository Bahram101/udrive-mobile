import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@/providers/AuthProvider';

import type { LoginPayload } from '../auth.types';

export function useLogin() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginPayload) => signIn(payload),
  });
}
