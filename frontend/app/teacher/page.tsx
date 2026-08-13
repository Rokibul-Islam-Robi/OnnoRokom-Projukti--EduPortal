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
          <h1 className="text-2xl font-bold tracking-tight text-ink">Faculty Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, publish, and grade student assignment submissions.
          </p>
        </div>
        <Link
          href="/teacher/assignments/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Assignment
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-200/60" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Created" value={totalAssignments} subtext="Assignments in system" />
          <StatCard label="Published" value={publishedCount} subtext="Visible to enrolled students" />
          <StatCard label="Drafts" value={draftCount} subtext="Unpublished work" />
          <StatCard label="Submissions" value={totalSubmissionsReceived} subtext="Received from students" />
        </div>
      )}

      {/* Assignments Directory */}
      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-ink">My Course Assignments</h2>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600">
            {["All", "Published", "Draft"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`rounded-md px-3 py-1 transition-all ${
                  filterStatus === st ? "bg-white font-semibold text-ink shadow-xs" : "hover:text-ink"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading assignments...</div>
        ) : filteredAssignments.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-3 text-sm font-semibold text-ink">No assignments found</p>
            <p className="mt-1 text-xs text-slate-500">
              Get started by creating a new assignment for your assigned subjects.
            </p>
            <Link
              href="/teacher/assignments/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3.5 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition-colors"
            >
              Create Assignment &rarr;
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/50 text-xs uppercase font-semibold text-slate-500">
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Subject & Class</th>
                  <th className="px-6 py-3">Deadline</th>
                  <th className="px-6 py-3">Max Marks</th>
                  <th className="px-6 py-3">Submissions</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssignments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-ink">
                      <Link href={`/teacher/assignments/${a.id}`} className="hover:text-brand-600">
                        {a.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-semibold text-ink">{a.subjectName}</p>
                      <p className="text-[11px] text-slate-500">{a.className}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {new Date(a.deadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-700">{a.maxMarks} pts</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {a.submissionCount} submitted
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge label={a.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/teacher/assignments/${a.id}`}
                        className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
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
