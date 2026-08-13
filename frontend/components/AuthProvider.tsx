"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, LoginResponse } from "@/lib/types";
import { api } from "@/lib/api";
import { saveSession, getStoredUser, clearSession, dashboardPathForRole } from "@/lib/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setUser(getStoredUser());
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const response = await api.post<LoginResponse>("/api/auth/login", { email, password });
    saveSession(response.token, response.user);
    setUser(response.user);
    const dest = dashboardPathForRole(response.user.role);
    if (typeof window !== "undefined") {
      window.location.href = dest;
    } else {
      router.push(dest);
    }
  }

  function logout() {
    clearSession();
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    } else {
      router.push("/login");
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}
