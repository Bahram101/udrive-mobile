export type Role = 'CLIENT' | 'DRIVER' | 'ADMIN';

export type SelectableRole = Extract<Role, 'CLIENT' | 'DRIVER'>;

export type AuthUser = {
  id: string;
  phone: string;
  name: string;
  role: Role;
  email?: string | null;
  avatar?: string | null;
  rating?: number | null;
  termsAcceptedAt: string | null;
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
  needsTelegramLink: boolean;
  telegramBotUsername?: string;
};

export type VerifyOtpPayload = {
  phone: string;
  code: string;
  name?: string;
  role?: SelectableRole;
  termsAccepted?: boolean;
};

export type AcceptTermsResponse = {
  user: AuthUser;
};

export type VerifyOtpResponse = AuthTokens & {
  user: AuthUser;
};

export type MeResponse = {
  user: AuthUser;
};

export type SwitchRoleResponse = AuthTokens & {
  user: AuthUser;
};
