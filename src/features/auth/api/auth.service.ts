import { apiClient } from '@/lib/api/client';

import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from '../auth.types';

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
    return data;
  },

  async registerClient(payload: RegisterPayload): Promise<RegisterResponse> {
    const { data } = await apiClient.post<RegisterResponse>('/auth/client/register', payload);
    return data;
  },

  async registerDriver(payload: RegisterPayload): Promise<RegisterResponse> {
    const { data } = await apiClient.post<RegisterResponse>('/auth/driver/register', payload);
    return data;
  },
};
