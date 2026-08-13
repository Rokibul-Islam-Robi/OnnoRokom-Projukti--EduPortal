import { RoleGuard } from "@/components/RoleGuard";
import { AppShell } from "@/components/AppShell";

const NAV = [
  { label: "My Assignments", href: "/student" },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="Student">
      <AppShell navItems={NAV} sectionLabel="Student">
        {children}
      </AppShell>
    </RoleGuard>
  );
}
