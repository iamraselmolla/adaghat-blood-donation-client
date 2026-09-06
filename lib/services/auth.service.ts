import { api } from "@/lib/axios";
import { AuthTokens, AuthUser, Role } from "@/types";

export interface LoginPayload {
  identifier: string; // email OR phone
  password: string;
}

export interface RegisterStaffPayload {
  name: string;
  identifier: string;
  password: string;
  role: Role;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);
    return data;
  },

  registerStaff: async (payload: RegisterStaffPayload): Promise<AuthUser> => {
    const { data } = await api.post<AuthUser>("/auth/register-staff", payload);
    return data;
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await api.get<AuthUser>("/auth/me");
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};
