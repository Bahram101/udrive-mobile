import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { tokenStorage } from "@/lib/storage/secureStore";

type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string> | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  onUnauthorized = handler;
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token");
  }
  const { data } = await axios.post<{ accessToken: string }>(
    `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
    { refreshToken },
  );
  await tokenStorage.setTokens(data.accessToken);
  return data.accessToken;
}

export function attachAuthInterceptor(apiClient: AxiosInstance) {
  apiClient.interceptors.response.use(
    (response) => {
      console.log("REQUEST");
      return response;
    },
    async (error: unknown) => {
      console.log("Req error");
      if (!axios.isAxiosError(error) || error?.response?.status !== 401) {
        throw error;
      }
      const config = error.config as RetriableConfig | undefined;
      const isRefreshCall = config?.url?.includes("/auth/refresh");

      if (!config || config._retry || isRefreshCall) {
        await tokenStorage.clearTokens();
        onUnauthorized?.();
        throw error;
      }

      config._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        await refreshPromise;
        return apiClient(config);
      } catch (refreshError) {
        await tokenStorage.clearTokens();
        onUnauthorized?.();
        throw refreshError;
      }
    },
  );
}
