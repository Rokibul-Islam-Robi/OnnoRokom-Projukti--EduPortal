import { RoleGuard } from "@/components/RoleGuard";
import { AppShell } from "@/components/AppShell";

const NAV = [
  { label: "Overview", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Classes", href: "/admin/classes" },
  { label: "Subjects", href: "/admin/subjects" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="Admin">
      <AppShell navItems={NAV} sectionLabel="Admin">
        {children}
      </AppShell>
    </RoleGuard>
  );
}
