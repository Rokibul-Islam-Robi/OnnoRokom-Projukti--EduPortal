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
    return <div className="p-12 text-center text-sm text-slate-500">Loading assignment details...</div>;
  }

  if (!assignment) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm font-bold text-slate-700">Assignment not found.</p>
        <Link href="/teacher" className="mt-4 inline-block text-xs font-bold text-purple-700 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div>
        <Link href="/teacher" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors">
          <span>&larr;</span> Back to Dashboard
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

      {/* Assignment Header Card */}
      <Card className="p-7 sm:p-8 border-purple-100/90 shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{assignment.title}</h1>
              <Badge label={assignment.status} />
            </div>
            <p className="mt-1.5 text-sm font-semibold text-purple-900">
              {assignment.subjectName} — <span className="text-slate-500 font-medium">{assignment.className}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={toggleStatus}
              className={`rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition-all ${
                assignment.status === "Published"
                  ? "border border-purple-200 bg-white text-purple-900 hover:bg-purple-50"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-600"
              }`}
            >
              {assignment.status === "Published" ? "Unpublish to Draft" : "Publish Now"}
            </button>
            <button
              onClick={handleDelete}
              className="rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-purple-100/70 pt-5 sm:grid-cols-4">
          <div className="rounded-xl bg-purple-50/40 p-3 border border-purple-100/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-900/60">Deadline</p>
            <p className="mt-1 text-xs font-bold text-slate-900">
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
              {assignment.allowResubmission ? "Allowed" : "Blocked"}
            </p>
          </div>
          <div className="rounded-xl bg-purple-50/40 p-3 border border-purple-100/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-900/60">Submissions</p>
            <p className="mt-1 text-xs font-bold text-purple-700">{submissions.length} Received</p>
          </div>
        </div>

        <div className="mt-6 border-t border-purple-100/70 pt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-900/60 mb-2">
            Instructions & Questions
          </p>
          <div className="rounded-2xl bg-purple-50/20 p-5 text-sm text-slate-800 whitespace-pre-wrap font-mono leading-relaxed border border-purple-100">
            {assignment.description}
          </div>
        </div>
      </Card>

      {/* Submissions Section */}
      <Card className="overflow-hidden p-0 border-purple-100/90 shadow-md">
        <div className="border-b border-purple-100/70 px-6 py-4 bg-purple-50/20 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Student Submissions ({submissions.length})</h2>
            <p className="text-xs text-slate-500">Evaluation and grading queue</p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No submissions received yet for this assignment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-100/70 bg-purple-50/40 text-[11px] uppercase font-bold text-purple-900/70 tracking-wider">
                  <th className="px-6 py-3.5">Student Name</th>
                  <th className="px-6 py-3.5">Submitted At</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Grade</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/50">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{sub.studentName}</td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
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
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {sub.marks} / {assignment.maxMarks}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium italic">Not graded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openGradeModal(sub)}
                        className="rounded-xl bg-purple-50 border border-purple-200 px-3.5 py-1.5 text-xs font-bold text-purple-800 hover:bg-purple-600 hover:text-white transition-all shadow-2xs"
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

      {/* Grade Submission Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-7 shadow-2xl space-y-5 border border-purple-200">
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-slate-900">Grade Student Submission</h3>
                <p className="text-xs font-semibold text-purple-700">Student: {selectedSubmission.studentName}</p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-slate-500 hover:bg-purple-100 hover:text-slate-900 transition-colors"
              >
                &times;
              </button>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Submitted Solution Content
              </p>
              <div className="max-h-52 overflow-y-auto rounded-2xl bg-purple-50/20 p-4 text-sm text-slate-800 font-mono whitespace-pre-wrap border border-purple-100">
                {selectedSubmission.content}
              </div>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Awarded Marks (Maximum: {assignment.maxMarks}) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={assignment.maxMarks}
                  value={gradeMarks}
                  onChange={(e) => setGradeMarks(Number(e.target.value))}
                  className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15 font-mono font-bold"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Faculty Feedback & Remarks
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide constructive feedback and grading justification for the student..."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 p-3.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15 font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-purple-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingGrade}
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 transition-all"
                >
                  {submittingGrade ? "Saving Grade..." : "Save Grade & Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
