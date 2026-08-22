import { RoleGuard } from "@/components/RoleGuard";
import { AppShell, NavItem } from "@/components/AppShell";

const NAV: NavItem[] = [
  {
    label: "Dashboard",
    href: "/teacher",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Create Assignment",
    href: "/teacher/assignments/new",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="Teacher">
      <AppShell navItems={NAV} sectionLabel="Faculty">
        {children}
      </AppShell>
    </RoleGuard>
  );
}
