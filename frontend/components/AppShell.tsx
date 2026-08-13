"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

interface NavItem {
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
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-ink antialiased">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white">
        {/* Brand Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white shadow-sm">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">OnnoRokom Projukti</p>
            <p className="text-sm font-extrabold tracking-tight text-ink">EduPortal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 px-3 py-6">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && item.href !== "/teacher" && item.href !== "/student" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-brand-50 text-brand-700 font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-ink"
                }`}
              >
                {item.icon && (
                  <span className={active ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600"}>
                    {item.icon}
                  </span>
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50/80 p-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {getInitials(user?.fullName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-ink">{user?.fullName}</p>
              <p className="truncate text-[11px] text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
