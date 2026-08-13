"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { api } from "@/lib/api";
import { UserRecord, SchoolClass, Subject } from "@/lib/types";

export default function AdminOverviewPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<UserRecord[]>("/api/users"),
      api.get<SchoolClass[]>("/api/classes"),
      api.get<Subject[]>("/api/subjects"),
    ])
      .then(([u, c, s]) => {
        setUsers(u);
        setClasses(c);
        setSubjects(s);
      })
      .finally(() => setLoading(false));
  }, []);

  const teacherCount = users.filter((u) => u.role === "Teacher").length;
  const studentCount = users.filter((u) => u.role === "Student").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">System Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage classes, subjects, faculty assignments, and user accounts.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-200/60" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Teachers"
            value={teacherCount}
            subtext="Active teaching staff"
            variant="purple"
            badgeText="Faculty"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
          <StatCard
            label="Enrolled Students"
            value={studentCount}
            subtext="Across all classes"
            variant="emerald"
            badgeText="Enrolled"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            }
          />
          <StatCard
            label="Active Classes"
            value={classes.length}
            subtext="Academic sections"
            variant="brand"
            badgeText="Active"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
            }
          />
          <StatCard
            label="Curriculum Subjects"
            value={subjects.length}
            subtext="Across all programs"
            variant="indigo"
            badgeText="Curriculum"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <h2 className="text-base font-bold text-ink">Quick Setup Guide</h2>
          <p className="mt-1 text-xs text-slate-500">
            Follow this workflow when setting up a new term or school year:
          </p>
          <div className="mt-5 space-y-4">
            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                1
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Create Classes</p>
                <p className="text-xs text-slate-500">Define academic classes and sections (e.g. Class 10 - Section A).</p>
                <Link href="/admin/classes" className="mt-1 inline-block text-xs font-medium text-brand-600 hover:underline">
                  Manage Classes &rarr;
                </Link>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                2
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Add Subjects</p>
                <p className="text-xs text-slate-500">Add course subjects assigned to specific classes (e.g. Physics for Class 10).</p>
                <Link href="/admin/subjects" className="mt-1 inline-block text-xs font-medium text-brand-600 hover:underline">
                  Manage Subjects &rarr;
                </Link>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                3
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Provision Accounts</p>
                <p className="text-xs text-slate-500">Create teacher and student user accounts with initial credentials.</p>
                <Link href="/admin/users" className="mt-1 inline-block text-xs font-medium text-brand-600 hover:underline">
                  Manage Users &rarr;
                </Link>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                4
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Assign Faculty</p>
                <p className="text-xs text-slate-500">Link teachers to their respective subjects to grant assignment creation permissions.</p>
                <Link href="/admin/subjects" className="mt-1 inline-block text-xs font-medium text-brand-600 hover:underline">
                  Assign Teachers &rarr;
                </Link>
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between bg-slate-900 text-white">
          <div>
            <div className="inline-flex rounded-md bg-slate-800 px-2.5 py-1 text-xs font-semibold text-brand-400">
              System Admin
            </div>
            <h3 className="mt-4 text-lg font-bold">Role Capabilities</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              As Administrator, you hold full governance over system users, classes, subjects, and teacher assignments. Teachers manage assignments and grades for their subjects, while students view and submit homework for their class.
            </p>
          </div>
          <div className="mt-6 border-t border-slate-800 pt-4">
            <p className="text-[11px] text-slate-400">Role-Based Access Enforcement Active</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
