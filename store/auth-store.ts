import { create } from "zustand";
import Cookies from "js-cookie";
import { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  isHydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,

  setUser: (user) => {
    set({ user });
    if (typeof window !== "undefined") {
      if (user) sessionStorage.setItem("user", JSON.stringify(user));
      else sessionStorage.removeItem("user");
    }
  },

  setTokens: (accessToken, refreshToken) => {
    Cookies.set("accessToken", accessToken, { expires: 1 / 96, secure: true, sameSite: "strict" });
    Cookies.set("refreshToken", refreshToken, { expires: 7, secure: true, sameSite: "strict" });
  },

  logout: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    if (typeof window !== "undefined") sessionStorage.removeItem("user");
    set({ user: null });
  },

  hydrate: () => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("user");
      if (cached) set({ user: JSON.parse(cached), isHydrated: true });
      else set({ isHydrated: true });
    }
  },
}));
