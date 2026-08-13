"use client";

import { FormEvent, useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { api, ApiClientError } from "@/lib/api";
import { Subject, SchoolClass, UserRecord } from "@/lib/types";

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [teachers, setTeachers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states for Create Subject
  const [submittingSubject, setSubmittingSubject] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [classId, setClassId] = useState("");

  // Form states for Assign Teacher
  const [submittingAssign, setSubmittingAssign] = useState(false);
  const [assignSubjectId, setAssignSubjectId] = useState("");
  const [assignTeacherId, setAssignTeacherId] = useState("");

  function loadData() {
    setLoading(true);
    Promise.all([
      api.get<Subject[]>("/api/subjects"),
      api.get<SchoolClass[]>("/api/classes"),
      api.get<UserRecord[]>("/api/users"),
    ])
      .then(([s, c, u]) => {
        setSubjects(s);
        setClasses(c);
        setTeachers(u.filter((user) => user.role === "Teacher" && user.isActive));
      })
      .finally(() => setLoading(false));
  }

  useEffect(loadData, []);

  async function handleCreateSubject(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmittingSubject(true);

    try {
      await api.post("/api/subjects", {
        name: subjectName.trim(),
        code: subjectCode.trim() || null,
        classId: Number(classId),
      });
      setSubjectName("");
      setSubjectCode("");
      setClassId("");
      setSuccess("Subject created successfully!");
      loadData();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to create subject.");
    } finally {
      setSubmittingSubject(false);
    }
  }

  async function handleAssignTeacher(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmittingAssign(true);

    try {
      await api.post("/api/subjects/assign-teacher", {
        subjectId: Number(assignSubjectId),
        teacherId: Number(assignTeacherId),
      });
      setAssignSubjectId("");
      setAssignTeacherId("");
      setSuccess("Teacher assigned to subject successfully!");
      loadData();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to assign teacher.");
    } finally {
      setSubmittingAssign(false);
    }
  }

  async function handleUnassignTeacher(subjectId: number, teacherId: number) {
    if (!confirm("Are you sure you want to unassign this teacher from the subject?")) return;
    setError(null);
    setSuccess(null);
    try {
      await api.delete(`/api/subjects/${subjectId}/teachers/${teacherId}`);
      setSuccess("Teacher unassigned successfully!");
      loadData();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to unassign teacher.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Subjects & Teacher Assignments</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage curriculum subjects for each class and assign authorized teaching staff.
        </p>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Create Subject Card */}
        <Card>
          <p className="text-base font-bold text-ink mb-4">Add New Subject</p>
          <form onSubmit={handleCreateSubject} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Target Class *
              </label>
              <select
                required
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Select a class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.section ? `(${c.section})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Subject Name *
              </label>
              <input
                required
                placeholder="e.g. Physics, Higher Mathematics"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Subject Code (Optional)
              </label>
              <input
                placeholder="e.g. PHY-101"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={submittingSubject}
              className="w-full rounded-lg bg-brand-500 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-60 transition-colors"
            >
              {submittingSubject ? "Creating..." : "Create Subject"}
            </button>
          </form>
        </Card>

        {/* Assign Teacher to Subject Card */}
        <Card>
          <p className="text-base font-bold text-ink mb-4">Assign Teacher to Subject</p>
          <form onSubmit={handleAssignTeacher} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Select Subject *
              </label>
              <select
                required
                value={assignSubjectId}
                onChange={(e) => setAssignSubjectId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — [{s.className}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Select Teacher *
              </label>
              <select
                required
                value={assignTeacherId}
                onChange={(e) => setAssignTeacherId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Select teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} ({t.email})
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs text-slate-500">
              Note: Assigning a teacher gives them authority to create assignments and grade submissions for this subject.
            </p>

            <button
              type="submit"
              disabled={submittingAssign}
              className="w-full rounded-lg bg-emerald-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60 transition-colors"
            >
              {submittingAssign ? "Assigning..." : "Assign Teacher"}
            </button>
          </form>
        </Card>
      </div>

      {/* Subjects List */}
      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-ink">All Subjects & Assigned Faculty</h2>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading subjects...</div>
        ) : subjects.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No subjects created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/50 text-xs uppercase font-semibold text-slate-500">
                  <th className="px-6 py-3">Subject Name</th>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Assigned Teachers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-ink">{s.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{s.code || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        {s.className}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {s.assignedTeachers && s.assignedTeachers.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {s.assignedTeachers.map((t) => (
                            <span
                              key={t.id}
                              className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200/60 px-2.5 py-1 text-xs font-medium text-brand-800"
                            >
                              {t.fullName}
                              <button
                                onClick={() => handleUnassignTeacher(s.id, t.id)}
                                title="Unassign teacher"
                                className="text-brand-400 hover:text-rose-600 transition-colors"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : s.teachers && s.teachers.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {s.teachers.map((tName, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700"
                            >
                              {tName}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-amber-600 italic">No teacher assigned yet</span>
                      )}
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
