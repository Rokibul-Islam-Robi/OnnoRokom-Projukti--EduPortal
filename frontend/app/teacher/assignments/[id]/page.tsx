"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { api, ApiClientError } from "@/lib/api";
import { AssignmentRecord, SubmissionRecord } from "@/lib/types";

export default function TeacherAssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = Number(params.id);

  const [assignment, setAssignment] = useState<AssignmentRecord | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Selected submission for grading modal
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRecord | null>(null);
  const [gradeMarks, setGradeMarks] = useState<number>(0);
  const [gradeFeedback, setGradeFeedback] = useState<string>("");
  const [submittingGrade, setSubmittingGrade] = useState(false);

  function loadData() {
    setLoading(true);
    Promise.all([
      api.get<AssignmentRecord>(`/api/assignments/${assignmentId}`),
      api.get<SubmissionRecord[]>(`/api/assignments/${assignmentId}/submissions`),
    ])
      .then(([a, subs]) => {
        setAssignment(a);
        setSubmissions(subs);
      })
      .catch((err) => {
        setError(err instanceof ApiClientError ? err.message : "Failed to load assignment.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(loadData, [assignmentId]);

  async function toggleStatus() {
    if (!assignment) return;
    const newStatus = assignment.status === "Published" ? "Draft" : "Published";
    setError(null);
    setSuccess(null);
    try {
      await api.put(`/api/assignments/${assignmentId}/status`, { status: newStatus });
      setSuccess(`Assignment status updated to ${newStatus}.`);
      loadData();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to update status.");
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this assignment? All submissions will be permanently removed.")) return;
    try {
      await api.delete(`/api/assignments/${assignmentId}`);
      router.push("/teacher");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to delete assignment.");
    }
  }

  function openGradeModal(sub: SubmissionRecord) {
    setSelectedSubmission(sub);
    setGradeMarks(sub.marks ?? assignment?.maxMarks ?? 100);
    setGradeFeedback(sub.feedback ?? "");
  }

  async function handleGradeSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedSubmission) return;
    setSubmittingGrade(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post(`/api/submissions/${selectedSubmission.id}/grade`, {
        marks: Number(gradeMarks),
        feedback: gradeFeedback.trim() || null,
      });
      setSelectedSubmission(null);
      setSuccess(`Grade saved for ${selectedSubmission.studentName}.`);
      loadData();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to save grade.");
    } finally {
      setSubmittingGrade(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-sm text-slate-500">Loading assignment details...</div>;
  }

  if (!assignment) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">Assignment not found.</p>
        <Link href="/teacher" className="mt-4 inline-block text-xs font-semibold text-brand-600">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div>
        <Link href="/teacher" className="text-xs font-semibold text-slate-500 hover:text-ink transition-colors">
          &larr; Back to Dashboard
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

      {/* Assignment Header Card */}
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-ink">{assignment.title}</h1>
              <Badge label={assignment.status} />
            </div>
            <p className="mt-1 text-sm font-medium text-slate-600">
              {assignment.subjectName} — <span className="text-slate-500">{assignment.className}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleStatus}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold shadow-xs transition-colors ${
                assignment.status === "Published"
                  ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {assignment.status === "Published" ? "Unpublish to Draft" : "Publish Now"}
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Deadline</p>
            <p className="mt-1 text-xs font-semibold text-ink">
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
              {assignment.allowResubmission ? "Allowed" : "Blocked"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Submissions</p>
            <p className="mt-1 text-xs font-semibold text-brand-600">{submissions.length} Received</p>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Instructions & Questions
          </p>
          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
            {assignment.description}
          </div>
        </div>
      </Card>

      {/* Submissions Section */}
      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-ink">Student Submissions ({submissions.length})</h2>
        </div>

        {submissions.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No submissions received yet for this assignment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/50 text-xs uppercase font-semibold text-slate-500">
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Submitted At</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Grade</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-ink">{sub.studentName}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {new Date(sub.submittedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Badge label={sub.status} />
                    </td>
                    <td className="px-6 py-4">
                      {sub.marks !== null ? (
                        <span className="font-semibold text-emerald-700">
                          {sub.marks} / {assignment.maxMarks}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not graded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openGradeModal(sub)}
                        className="rounded-md bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition-colors"
                      >
                        {sub.marks !== null ? "Edit Grade" : "Grade Submission"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Grade Submission Modal Drawer */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-ink">Grade Submission</h3>
                <p className="text-xs text-slate-500">Student: {selectedSubmission.studentName}</p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-ink text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Submitted Content
              </p>
              <div className="max-h-48 overflow-y-auto rounded-lg bg-slate-50 p-4 text-sm text-slate-800 font-mono whitespace-pre-wrap border border-slate-200/80">
                {selectedSubmission.content}
              </div>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Awarded Marks (Max: {assignment.maxMarks}) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={assignment.maxMarks}
                  value={gradeMarks}
                  onChange={(e) => setGradeMarks(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 font-bold"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Faculty Feedback & Remarks
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide constructive feedback for the student..."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingGrade}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-60"
                >
                  {submittingGrade ? "Saving Grade..." : "Save Grade"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
