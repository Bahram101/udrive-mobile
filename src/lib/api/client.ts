import axios from "axios";

import { attachAuthInterceptor } from "@/lib/api/authInterceptor";
import { tokenStorage } from "@/lib/storage/secureStore";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
  headers: process.env.EXPO_PUBLIC_API_URL?.includes("ngrok") ? { "ngrok-skip-browser-warning": "true" } : undefined,
});

apiClient.interceptors.request.use(async (config) => {
  const accessToken = await tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

attachAuthInterceptor(apiClient);
