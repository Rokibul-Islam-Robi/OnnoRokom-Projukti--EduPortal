"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { UserRole } from "@/lib/types";

function isRoleMatch(userRole?: string | number, targetRole?: string): boolean {
  if (!userRole || !targetRole) return false;
  const u = String(userRole).toLowerCase();
  const t = String(targetRole).toLowerCase();
  if (u === t) return true;
  if (t === "admin" && u === "0") return true;
  if (t === "teacher" && u === "1") return true;
  if (t === "student" && u === "2") return true;
  return false;
}

export function RoleGuard({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!isRoleMatch(user.role, role)) {
      router.replace("/login");
    }
  }, [loading, user, role, router]);

  if (loading || !user || !isRoleMatch(user.role, role)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
