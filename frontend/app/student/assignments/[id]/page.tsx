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
    return <div className="p-8 text-center text-sm text-slate-500">Loading assignment...</div>;
  }

  if (!assignment) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">Assignment not found or access denied.</p>
        <Link href="/student" className="mt-4 inline-block text-xs font-semibold text-brand-600">
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
        <Link href="/student" className="text-xs font-semibold text-slate-500 hover:text-ink transition-colors">
          &larr; Back to Assignments
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3.5 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3.5 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Assignment Overview Card */}
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-block rounded-md bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 mb-2">
              {assignment.subjectName}
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-ink">{assignment.title}</h1>
            <p className="mt-1 text-xs text-slate-500">Teacher: {assignment.teacherName}</p>
          </div>
          <div>
            <Badge
              label={
                sub ? sub.status : isPastDeadline ? "Past Deadline" : "Not Submitted"
              }
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Deadline</p>
            <p className={`mt-1 text-xs font-semibold ${isPastDeadline ? "text-rose-600" : "text-ink"}`}>
              {new Date(assignment.deadline).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Max Marks</p>
            <p className="mt-1 text-xs font-semibold text-ink">{assignment.maxMarks} Points</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Resubmissions</p>
            <p className="mt-1 text-xs font-semibold text-ink">
              {assignment.allowResubmission ? "Allowed" : "Not Allowed"}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Questions & Instructions
          </p>
          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed border border-slate-200/80">
            {assignment.description}
          </div>
        </div>
      </Card>

      {/* Graded Results Banner if applicable */}
      {sub && sub.marks !== null && (
        <Card className="bg-emerald-500/10 border-emerald-200">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
              ✓
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-900">Graded Result</h2>
              <p className="mt-1 text-2xl font-extrabold text-emerald-700">
                {sub.marks} / {assignment.maxMarks} Marks
              </p>
              {sub.feedback && (
                <div className="mt-3 rounded-lg bg-white p-3.5 text-xs text-slate-700 border border-emerald-200">
                  <p className="font-semibold text-emerald-800 uppercase text-[10px] tracking-wider mb-1">
                    Teacher Feedback:
                  </p>
                  <p className="italic">&quot;{sub.feedback}&quot;</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Submission Form Card */}
      <Card>
        <h2 className="text-base font-bold text-ink mb-2">Your Answer Submission</h2>
        <p className="text-xs text-slate-500 mb-4">
          Type or paste your complete solution below.
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
            className="w-full rounded-lg border border-slate-300 p-4 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 font-mono disabled:bg-slate-100 disabled:text-slate-600"
          />

          {sub && (
            <p className="text-xs text-slate-500">
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
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-60 transition-colors"
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
