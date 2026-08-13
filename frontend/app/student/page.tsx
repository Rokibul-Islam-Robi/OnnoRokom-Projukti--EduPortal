"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { StatCard } from "@/components/StatCard";
import { api } from "@/lib/api";
import { AssignmentRecord } from "@/lib/types";

export default function StudentDashboardPage() {
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<string>("All");

  useEffect(() => {
    api
      .get<AssignmentRecord[]>("/api/assignments")
      .then(setAssignments)
      .finally(() => setLoading(false));
  }, []);

  const totalAssigned = assignments.length;
  const submittedCount = assignments.filter((a) => a.mySubmission !== null).length;
  const gradedCount = assignments.filter((a) => a.mySubmission?.status === "Graded").length;
  const pendingSubmissionCount = totalAssigned - submittedCount;

  const filteredAssignments = assignments.filter((a) => {
    if (filterTab === "Pending") return a.mySubmission === null;
    if (filterTab === "Submitted") return a.mySubmission !== null && a.mySubmission.status !== "Graded";
    if (filterTab === "Graded") return a.mySubmission?.status === "Graded";
    return true;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Student Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          View assigned coursework, submit your answers, and check teacher feedback.
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
          <StatCard label="Total Coursework" value={totalAssigned} subtext="Assignments for your class" />
          <StatCard label="Pending Action" value={pendingSubmissionCount} subtext="Awaiting your submission" />
          <StatCard label="Submitted" value={submittedCount} subtext="Sent to faculty" />
          <StatCard label="Graded" value={gradedCount} subtext="Marks & feedback available" />
        </div>
      )}

      {/* Assignments List */}
      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-ink">Class Assignments</h2>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600">
            {["All", "Pending", "Submitted", "Graded"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`rounded-md px-3 py-1 transition-all ${
                  filterTab === tab ? "bg-white font-semibold text-ink shadow-xs" : "hover:text-ink"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading assignments...</div>
        ) : filteredAssignments.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-3 text-sm font-semibold text-ink">No assignments found</p>
            <p className="mt-1 text-xs text-slate-500">
              There are no assignments matching your current filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/50 text-xs uppercase font-semibold text-slate-500">
                  <th className="px-6 py-3">Assignment Title</th>
                  <th className="px-6 py-3">Subject & Teacher</th>
                  <th className="px-6 py-3">Deadline</th>
                  <th className="px-6 py-3">Submission Status</th>
                  <th className="px-6 py-3">Score</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssignments.map((a) => {
                  const sub = a.mySubmission;
                  const statusLabel = sub ? sub.status : a.isPastDeadline ? "Past Deadline" : "Not Submitted";
                  
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-ink">
                        <Link href={`/student/assignments/${a.id}`} className="hover:text-brand-600">
                          {a.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-semibold text-ink">{a.subjectName}</p>
                        <p className="text-[11px] text-slate-500">{a.teacherName}</p>
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
                      <td className="px-6 py-4">
                        <Badge label={statusLabel} />
                      </td>
                      <td className="px-6 py-4">
                        {sub?.marks !== null && sub?.marks !== undefined ? (
                          <span className="font-bold text-emerald-700">
                            {sub.marks} / {a.maxMarks}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/student/assignments/${a.id}`}
                          className={`rounded-md px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-colors ${
                            !sub
                              ? "bg-brand-500 text-white hover:bg-brand-600"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {!sub ? "Submit Work" : "View Work"}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
