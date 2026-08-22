"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { dashboardPathForRole } from "@/lib/auth";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? dashboardPathForRole(user.role) : "/login");
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d031c] text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-purple-500/20 border-t-purple-400" />
        <span className="text-xs font-semibold text-purple-200/70 tracking-wider uppercase">Loading EduPortal...</span>
      </div>
    </div>
  );
}
