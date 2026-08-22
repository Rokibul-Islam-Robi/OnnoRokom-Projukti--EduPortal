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
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-purple-600 animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
              System Administration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Enterprise System Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Comprehensive governance of faculty, student directory, class structures, and curriculum.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-purple-100/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Teachers"
            value={teacherCount}
            subtext="Active teaching faculty"
            variant="purple"
            badgeText="Faculty"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
          <StatCard
            label="Enrolled Students"
            value={studentCount}
            subtext="Active in class rosters"
            variant="emerald"
            badgeText="Enrolled"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            }
          />
          <StatCard
            label="Active Classes"
            value={classes.length}
            subtext="Configured sections"
            variant="brand"
            badgeText="Classes"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
            }
          />
          <StatCard
            label="Curriculum Subjects"
            value={subjects.length}
            subtext="Active course tracks"
            variant="indigo"
            badgeText="Curriculum"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
        </div>
      )}

      {/* Main Grid: Guide & Roles */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Setup Workflow */}
        <Card className="md:col-span-2 p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Academic Initialization Workflow</h2>
              <p className="text-xs text-slate-500 mt-0.5">Standard operation setup guide for administrators</p>
            </div>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-[11px] font-bold text-purple-800">
              Setup Guide
            </span>
          </div>

          <div className="space-y-4">
            <div className="group flex items-start gap-4 rounded-xl border border-purple-100/60 bg-purple-50/20 p-4 transition-all hover:bg-purple-50/60 hover:border-purple-200">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-xs">
                1
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">Establish Academic Classes</p>
                  <Link href="/admin/classes" className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors">
                    Manage Classes &rarr;
                  </Link>
                </div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Configure class definitions, grades, and section allocations (e.g. Class 10 - Section A).
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-4 rounded-xl border border-purple-100/60 bg-purple-50/20 p-4 transition-all hover:bg-purple-50/60 hover:border-purple-200">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-xs">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">Register Curriculum Subjects</p>
                  <Link href="/admin/subjects" className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors">
                    Manage Subjects &rarr;
                  </Link>
                </div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Create specific subjects linked directly to respective academic grade levels.
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-4 rounded-xl border border-purple-100/60 bg-purple-50/20 p-4 transition-all hover:bg-purple-50/60 hover:border-purple-200">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-xs">
                3
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">Provision Faculty & Student Accounts</p>
                  <Link href="/admin/users" className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors">
                    Manage Users &rarr;
                  </Link>
                </div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Register secure role-based credentials for teachers and assign students to their classes.
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-4 rounded-xl border border-purple-100/60 bg-purple-50/20 p-4 transition-all hover:bg-purple-50/60 hover:border-purple-200">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-xs">
                4
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">Delegate Faculty Authority</p>
                  <Link href="/admin/subjects" className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors">
                    Assign Teachers &rarr;
                  </Link>
                </div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Authorize teachers over their assigned courses to unlock coursework publishing & grading.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Corporate Dark Glass Card */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-purple-500/25 bg-gradient-to-br from-[#1c0a36] via-[#140628] to-[#0d031c] p-7 text-white shadow-xl">
          <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 px-3 py-1 text-xs font-bold text-purple-300">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping" />
              Role-Based Security
            </div>
            <h3 className="mt-5 text-xl font-extrabold tracking-tight">Enterprise Governance</h3>
            <p className="mt-3 text-xs leading-relaxed text-purple-200/80">
              The system enforces strict role-based isolation. Administrators manage users and curricula, faculty publish and grade coursework, and students submit solutions under real-time deadline monitoring.
            </p>
          </div>

          <div className="mt-8 border-t border-purple-500/20 pt-4 flex items-center justify-between text-[11px] text-purple-300">
            <span>🛡️ ASP.NET Core EF Security</span>
            <span>PostgreSQL Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
