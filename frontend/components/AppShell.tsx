"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { NotificationBell } from "@/components/Notifications";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export function AppShell({
  navItems,
  sectionLabel,
  children,
}: {
  navItems: NavItem[];
  sectionLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-[#fbfaff] font-sans text-slate-900 antialiased selection:bg-purple-500 selection:text-white">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-purple-100/80 bg-white/95 backdrop-blur-xl shadow-xs">
        {/* Brand Header */}
        <div className="flex items-center gap-3 border-b border-purple-100/70 px-6 py-5">
          {/* Animated Modern Corporate Logo */}
          <div className="relative group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-800 p-0.5 shadow-md shadow-purple-600/25 ring-1 ring-purple-400/30">
            <div className="relative flex h-full w-full items-center justify-center rounded-[10px] bg-[#1a0b33]">
              <svg
                className="h-5 w-5 text-purple-200 transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 3L2 8.5L12 14L22 8.5L12 3Z"
                  fill="url(#sidebarLogoGrad)"
                />
                <path
                  d="M6 10.7V15.5C6 17.5 8.7 19.5 12 19.5C15.3 19.5 18 17.5 18 15.5V10.7"
                  stroke="#c084fc"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="sidebarLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div>
            <span className="inline-block rounded-full bg-purple-100 px-2 py-0.2 text-[9px] font-extrabold uppercase tracking-wider text-purple-700">
              ONNOROKOM
            </span>
            <p className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent">
              EduPortal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 px-3.5 py-6">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Navigation
          </p>
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" &&
                item.href !== "/teacher" &&
                item.href !== "/student" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/25"
                    : "text-slate-600 hover:bg-purple-50/70 hover:text-purple-900"
                }`}
              >
                {item.icon ? (
                  <span
                    className={`transition-colors ${
                      active ? "text-white" : "text-slate-400 group-hover:text-purple-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                ) : (
                  <span
                    className={`h-2 w-2 rounded-full transition-colors ${
                      active ? "bg-white" : "bg-slate-300 group-hover:bg-purple-500"
                    }`}
                  />
                )}
                <span className="truncate">{item.label}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="border-t border-purple-100/70 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-purple-50/60 p-2.5 border border-purple-100/60 transition-all hover:bg-purple-50">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-xs">
              {getInitials(user?.fullName)}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900">{user?.fullName}</p>
              <div className="flex items-center gap-1.5">
                <span className="truncate text-[10px] font-medium text-purple-700">{user?.role}</span>
                <span className="text-[10px] text-slate-300">•</span>
                <span className="truncate text-[10px] text-slate-500">{user?.email}</span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 shadow-xs transition-all"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Sticky Header Bar */}
        <header className="sticky top-0 z-40 border-b border-purple-100/80 bg-white/80 backdrop-blur-xl px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200/80 px-3 py-1 text-xs font-bold text-purple-800 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-600"></span>
              {sectionLabel} Portal
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-slate-500">Enterprise Academic Management</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Live System</span>
            </div>
            <NotificationBell />
          </div>
        </header>

        {/* Page Inner Container */}
        <div className="mx-auto max-w-6xl px-8 py-8 animate-fadeIn">{children}</div>
      </main>
    </div>
  );
}
