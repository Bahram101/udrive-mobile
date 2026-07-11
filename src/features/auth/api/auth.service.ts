import { apiClient } from '@/lib/api/client';

import type { LoginPayload, LoginResponse } from '../auth.types';

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
    return data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
};
