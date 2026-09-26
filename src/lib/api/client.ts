import axios from "axios";

import { attachAuthInterceptor } from "@/lib/api/authInterceptor";
import { tokenStorage } from "@/lib/storage/secureStore";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
  // Bypasses ngrok's free-tier browser-warning interstitial, which
  // otherwise returns an HTML page instead of JSON on the first request.
  headers: { "ngrok-skip-browser-warning": "true" },
});

apiClient.interceptors.request.use(async (config) => {
  const accessToken = await tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

attachAuthInterceptor(apiClient);
