"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/lib/services/auth.service";

export function useAuthGuard() {
  const router = useRouter();
  const { user, setUser, hydrate, isHydrated } = useAuthStore();
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  React.useEffect(() => {
    if (!isHydrated) return;

    async function verify() {
      const token = Cookies.get("accessToken");
      if (!token) {
        router.replace("/login");
        return;
      }
      if (!user) {
        try {
          const me = await authService.me();
          setUser(me);
        } catch {
          router.replace("/login");
          return;
        }
      }
      setChecking(false);
    }
    verify();
  }, [isHydrated, user, router, setUser]);

  return { checking, user };
}
