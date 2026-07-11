export type AuthUser = {
  id: string;
  phone: string;
  fullName: string;
  role: 'client' | 'driver';
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginPayload = {
  phone: string;
  password: string;
};

export type LoginResponse = AuthTokens & {
  user: AuthUser;
};
