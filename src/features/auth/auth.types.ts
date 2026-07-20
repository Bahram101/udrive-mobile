export type Role = 'CLIENT' | 'DRIVER' | 'ADMIN';

export type AuthUser = {
  id: string;
  phone: string;
  name: string;
  role: Role;
  email?: string | null;
  avatar?: string | null;
  rating?: number | null;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginPayload = {
  phone: string;
};

export type LoginResponse = AuthTokens & {
  user: AuthUser;
};

export type RegisterPayload = {
  phone: string;
  name: string;
};

export type RegisterResponse = {
  user: AuthUser;
};
