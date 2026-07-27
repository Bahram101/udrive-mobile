export type Role = 'CLIENT' | 'DRIVER' | 'ADMIN';

export type SelectableRole = Extract<Role, 'CLIENT' | 'DRIVER'>;

export type AuthUser = {
  id: string;
  phone: string;
  name: string;
  role: Role;
  driver?: { id: string };
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type SendOtpPayload = {
  phone: string;
};

export type SendOtpResponse = {
  message: string;
  code: string;
};

export type VerifyOtpPayload = {
  phone: string;
  code: string;
  name?: string;
  role?: SelectableRole;
};

export type VerifyOtpResponse = AuthTokens & {
  user: AuthUser;
};
