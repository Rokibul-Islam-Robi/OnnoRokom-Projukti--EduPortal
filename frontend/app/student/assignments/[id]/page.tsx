"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { api, ApiClientError } from "@/lib/api";
import { AssignmentRecord } from "@/lib/types";

export default function StudentAssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = Number(params.id);

  const [assignment, setAssignment] = useState<AssignmentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function loadAssignment() {
    setLoading(true);
    api
      .get<AssignmentRecord>(`/api/assignments/${assignmentId}`)
      .then((a) => {
        setAssignment(a);
        if (a.mySubmission) {
          setContent(a.mySubmission.content);
        }
      })
      .catch((err) => {
        setError(err instanceof ApiClientError ? err.message : "Failed to load assignment.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(loadAssignment, [assignmentId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!assignment) return;
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const isUpdate = Boolean(assignment.mySubmission);

    try {
      if (isUpdate) {
        await api.put(`/api/assignments/${assignmentId}/submissions`, {
          content: content.trim(),
        });
        setSuccess("Submission updated successfully!");
      } else {
        await api.post(`/api/assignments/${assignmentId}/submissions`, {
          content: content.trim(),
        });
        setSuccess("Work submitted successfully!");
      }
      loadAssignment();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to submit work.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-500">Loading assignment...</div>;
  }

  if (!assignment) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm font-bold text-slate-700">Assignment not found or access denied.</p>
        <Link href="/student" className="mt-4 inline-block text-xs font-bold text-purple-700 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  const sub = assignment.mySubmission;
  const isPastDeadline = assignment.isPastDeadline;
  const isGraded = sub?.status === "Graded";
  const canSubmit = !isGraded && (!sub || (assignment.allowResubmission && !isPastDeadline));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/student" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors">
          <span>&larr;</span> Back to Assignments
        </Link>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-700">
          {success}
        </div>
      )}

      {/* Assignment Overview Card */}
      <Card className="p-7 sm:p-8 border-purple-100/90 shadow-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-block rounded-full bg-purple-100 px-3 py-0.5 text-xs font-bold text-purple-800 border border-purple-200 mb-2">
              {assignment.subjectName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{assignment.title}</h1>
            <p className="mt-1 text-xs font-medium text-slate-500">Instructor: {assignment.teacherName}</p>
          </div>
          <div>
            <Badge
              label={
                sub ? sub.status : isPastDeadline ? "Past Deadline" : "Not Submitted"
              }
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-purple-100/70 pt-5 sm:grid-cols-3">
          <div className="rounded-xl bg-purple-50/40 p-3 border border-purple-100/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-900/60">Deadline</p>
            <p className={`mt-1 text-xs font-bold ${isPastDeadline ? "text-rose-600" : "text-slate-900"}`}>
              {new Date(assignment.deadline).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="rounded-xl bg-purple-50/40 p-3 border border-purple-100/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-900/60">Max Marks</p>
            <p className="mt-1 text-xs font-bold text-slate-900">{assignment.maxMarks} Points</p>
          </div>
          <div className="rounded-xl bg-purple-50/40 p-3 border border-purple-100/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-900/60">Resubmissions</p>
            <p className="mt-1 text-xs font-bold text-slate-900">
              {assignment.allowResubmission ? "Allowed" : "Not Allowed"}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-purple-100/70 pt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-900/60 mb-2">
            Questions & Instructions
          </p>
          <div className="rounded-2xl bg-purple-50/20 p-5 text-sm text-slate-800 whitespace-pre-wrap font-mono leading-relaxed border border-purple-100">
            {assignment.description}
          </div>
        </div>
      </Card>

      {/* Graded Results Banner if applicable */}
      {sub && sub.marks !== null && (
        <Card className="bg-emerald-500/10 border-emerald-300 p-7 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white font-bold text-xl shadow-xs">
              ✓
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-950">Evaluation Result</h2>
              <p className="mt-1 text-3xl font-extrabold text-emerald-700">
                {sub.marks} <span className="text-lg font-semibold text-emerald-900/60">/ {assignment.maxMarks} Marks</span>
              </p>
              {sub.feedback && (
                <div className="mt-3.5 rounded-xl bg-white p-4 text-xs text-slate-700 border border-emerald-200 shadow-2xs">
                  <p className="font-bold text-emerald-800 uppercase text-[10px] tracking-wider mb-1">
                    Teacher Feedback & Remarks:
                  </p>
                  <p className="italic leading-relaxed font-medium">&quot;{sub.feedback}&quot;</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Submission Form Card */}
      <Card className="p-7 sm:p-8 border-purple-100/90 shadow-md">
        <h2 className="text-base font-bold text-slate-900 mb-1">Your Answer Submission</h2>
        <p className="text-xs text-slate-500 mb-4">
          Type or paste your complete solution, mathematical proofs, or essay answers below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            required
            disabled={!canSubmit}
            rows={8}
            placeholder={
              canSubmit
                ? "Write your detailed answer response here..."
                : isGraded
                ? "Submission is graded and locked."
                : "Submissions closed after deadline."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-2xl border border-purple-200/80 bg-purple-50/20 p-4 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15 font-mono disabled:bg-slate-100 disabled:text-slate-600"
          />

          {sub && (
            <p className="text-xs text-slate-500 font-medium">
              Submitted on:{" "}
              {new Date(sub.submittedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {sub.updatedAt && " (edited)"}
            </p>
          )}

          {canSubmit && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-600 hover:shadow-purple-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-60 transition-all duration-200"
              >
                {submitting ? "Submitting..." : sub ? "Update Submission" : "Submit Answer"}
              </button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
