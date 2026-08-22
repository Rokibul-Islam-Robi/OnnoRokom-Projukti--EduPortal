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
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
            Student Academic Portal
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          My Academic Coursework
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View assigned course homework, submit solutions, and track grades & teacher feedback.
        </p>
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
            label="Total Coursework"
            value={totalAssigned}
            subtext="Assigned to your class"
            variant="brand"
            badgeText="Classwork"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
          <StatCard
            label="Pending Action"
            value={pendingSubmissionCount}
            subtext="Awaiting your answer"
            variant="amber"
            badgeText="Action Needed"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Submitted"
            value={submittedCount}
            subtext="Dispatched to faculty"
            variant="indigo"
            badgeText="Submitted"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Graded"
            value={gradedCount}
            subtext="Evaluated by teachers"
            variant="emerald"
            badgeText="Evaluated"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          />
        </div>
      )}

      {/* Assignments List */}
      <Card className="overflow-hidden p-0 border-purple-100/90 shadow-md">
        <div className="flex flex-col gap-4 border-b border-purple-100/70 p-6 sm:flex-row sm:items-center sm:justify-between bg-purple-50/20">
          <div>
            <h2 className="text-base font-bold text-slate-900">Class Assignments</h2>
            <p className="text-xs text-slate-500">{filteredAssignments.length} items in view</p>
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-purple-100/60 p-1 text-xs font-semibold text-purple-900">
            {["All", "Pending", "Submitted", "Graded"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  filterTab === tab
                    ? "bg-white font-bold text-purple-900 shadow-xs ring-1 ring-purple-200/80"
                    : "hover:text-purple-700"
                }`}
              >
                {tab}
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
            <p className="mt-1 text-xs text-slate-500">
              There are no assignments matching your selected filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-100/70 bg-purple-50/40 text-[11px] uppercase font-bold text-purple-900/70 tracking-wider">
                  <th className="px-6 py-3.5">Assignment Title</th>
                  <th className="px-6 py-3.5">Subject & Teacher</th>
                  <th className="px-6 py-3.5">Deadline</th>
                  <th className="px-6 py-3.5">Submission Status</th>
                  <th className="px-6 py-3.5">Score</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/50">
                {filteredAssignments.map((a) => {
                  const sub = a.mySubmission;
                  const statusLabel = sub ? sub.status : a.isPastDeadline ? "Past Deadline" : "Not Submitted";

                  return (
                    <tr key={a.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        <Link href={`/student/assignments/${a.id}`} className="hover:text-purple-700 transition-colors">
                          {a.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-900">{a.subjectName}</p>
                        <p className="text-[11px] font-medium text-slate-500">{a.teacherName}</p>
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
                      <td className="px-6 py-4">
                        <Badge label={statusLabel} />
                      </td>
                      <td className="px-6 py-4">
                        {sub?.marks !== null && sub?.marks !== undefined ? (
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {sub.marks} / {a.maxMarks}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium italic">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/student/assignments/${a.id}`}
                          className={`rounded-xl px-4 py-1.5 text-xs font-bold shadow-2xs transition-all ${
                            !sub
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-600"
                              : "border border-purple-200 bg-white text-purple-800 hover:bg-purple-50"
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
