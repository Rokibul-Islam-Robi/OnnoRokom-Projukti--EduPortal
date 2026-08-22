"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { StatCard } from "@/components/StatCard";
import { api } from "@/lib/api";
import { AssignmentRecord } from "@/lib/types";

export default function TeacherDashboardPage() {
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  useEffect(() => {
    api
      .get<AssignmentRecord[]>("/api/assignments")
      .then(setAssignments)
      .finally(() => setLoading(false));
  }, []);

  const totalAssignments = assignments.length;
  const publishedCount = assignments.filter((a) => a.status === "Published").length;
  const draftCount = assignments.filter((a) => a.status === "Draft").length;
  const totalSubmissionsReceived = assignments.reduce((acc, a) => acc + (a.submissionCount || 0), 0);

  const filteredAssignments = assignments.filter((a) => {
    if (filterStatus === "Published") return a.status === "Published";
    if (filterStatus === "Draft") return a.status === "Draft";
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
              Academic Faculty Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Faculty Coursework Workspace
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Formulate curriculum assignments, monitor submissions, and conduct evaluations.
          </p>
        </div>
        <Link
          href="/teacher/assignments/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-600 hover:shadow-purple-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Create Assignment
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-purple-100/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Created"
            value={totalAssignments}
            subtext="Course assignments"
            variant="brand"
            badgeText="Created"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          />
          <StatCard
            label="Published"
            value={publishedCount}
            subtext="Visible to students"
            variant="emerald"
            badgeText="Active"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
          <StatCard
            label="Drafts"
            value={draftCount}
            subtext="Pending publication"
            variant="amber"
            badgeText="Draft"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            }
          />
          <StatCard
            label="Submissions"
            value={totalSubmissionsReceived}
            subtext="Student answers received"
            variant="purple"
            badgeText="Received"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
        </div>
      )}

      {/* Assignments Directory */}
      <Card className="overflow-hidden p-0 border-purple-100/90">
        <div className="flex flex-col gap-4 border-b border-purple-100/70 p-6 sm:flex-row sm:items-center sm:justify-between bg-purple-50/20">
          <div>
            <h2 className="text-base font-bold text-slate-900">My Course Assignments</h2>
            <p className="text-xs text-slate-500">{filteredAssignments.length} assignments listed</p>
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-purple-100/60 p-1 text-xs font-semibold text-purple-900">
            {["All", "Published", "Draft"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  filterStatus === st
                    ? "bg-white font-bold text-purple-900 shadow-xs ring-1 ring-purple-200/80"
                    : "hover:text-purple-700"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading assignments...</div>
        ) : filteredAssignments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-3">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-base font-bold text-slate-900">No assignments found</p>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Get started by creating a new assignment for your assigned classes and subjects.
            </p>
            <Link
              href="/teacher/assignments/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-600 transition-all"
            >
              Create Assignment &rarr;
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-100/70 bg-purple-50/40 text-[11px] uppercase font-bold text-purple-900/70 tracking-wider">
                  <th className="px-6 py-3.5">Assignment Title</th>
                  <th className="px-6 py-3.5">Subject & Class</th>
                  <th className="px-6 py-3.5">Deadline</th>
                  <th className="px-6 py-3.5">Max Marks</th>
                  <th className="px-6 py-3.5">Submissions</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/50">
                {filteredAssignments.map((a) => (
                  <tr key={a.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <Link href={`/teacher/assignments/${a.id}`} className="hover:text-purple-700 transition-colors">
                        {a.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-900">{a.subjectName}</p>
                      <p className="text-[11px] font-medium text-slate-500">{a.className}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                      {new Date(a.deadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-purple-900">{a.maxMarks} pts</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 text-xs font-bold text-indigo-800">
                        {a.submissionCount} submitted
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge label={a.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/teacher/assignments/${a.id}`}
                        className="rounded-xl border border-purple-200 bg-white px-3.5 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-600 hover:text-white shadow-2xs transition-all"
                      >
                        Manage & Grade
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
