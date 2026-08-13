import { RoleGuard } from "@/components/RoleGuard";
import { AppShell } from "@/components/AppShell";

const NAV = [
  { label: "Dashboard", href: "/teacher" },
  { label: "Create Assignment", href: "/teacher/assignments/new" },
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
