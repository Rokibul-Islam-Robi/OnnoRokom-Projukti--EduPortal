import { AuthUser } from "./types";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function saveSession(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function dashboardPathForRole(role: string): string {
  switch (role) {
    case "Admin":
      return "/admin";
    case "Teacher":
      return "/teacher";
    case "Student":
      return "/student";
    default:
      return "/login";
  }
}
