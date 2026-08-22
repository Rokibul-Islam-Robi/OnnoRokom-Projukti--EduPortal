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
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
            Curriculum Administration
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Subjects & Faculty Assignments
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage academic curriculum tracks and authorize faculty members for assignment creation.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-semibold text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Create Subject Card */}
        <Card className="p-7 border-purple-100/90">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold">
                +
              </div>
              <p className="text-base font-bold text-slate-900">Add New Subject</p>
            </div>
            <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
              Curriculum Unit
            </span>
          </div>

          <form onSubmit={handleCreateSubject} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Target Class *
              </label>
              <select
                required
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15"
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
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Subject Name *
              </label>
              <input
                required
                placeholder="e.g. Physics, Higher Mathematics"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Subject Code (Optional)
              </label>
              <input
                placeholder="e.g. PHY-101"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={submittingSubject}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 py-2.5 px-4 text-sm font-bold text-white shadow-md shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-600 hover:shadow-purple-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-60 transition-all duration-200"
            >
              {submittingSubject ? "Creating..." : "Create Subject"}
            </button>
          </form>
        </Card>

        {/* Assign Teacher to Subject Card */}
        <Card className="p-7 border-purple-100/90">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold">
                ⚡
              </div>
              <p className="text-base font-bold text-slate-900">Assign Teacher to Subject</p>
            </div>
            <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200/60">
              Authority Delegation
            </span>
          </div>

          <form onSubmit={handleAssignTeacher} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Select Subject *
              </label>
              <select
                required
                value={assignSubjectId}
                onChange={(e) => setAssignSubjectId(e.target.value)}
                className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15"
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
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Select Teacher *
              </label>
              <select
                required
                value={assignTeacherId}
                onChange={(e) => setAssignTeacherId(e.target.value)}
                className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15"
              >
                <option value="">Select teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} ({t.email})
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs text-purple-900/60 bg-purple-50/60 p-2.5 rounded-xl border border-purple-100">
              Note: Assigning a teacher gives them authority to create assignments and grade submissions for this subject.
            </p>

            <button
              type="submit"
              disabled={submittingAssign}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 py-2.5 px-4 text-sm font-bold text-white shadow-md shadow-indigo-600/30 hover:from-indigo-500 hover:to-purple-600 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-60 transition-all duration-200"
            >
              {submittingAssign ? "Assigning..." : "Assign Teacher to Course"}
            </button>
          </form>
        </Card>
      </div>

      {/* Subjects List */}
      <Card className="overflow-hidden p-0 border-purple-100/90">
        <div className="border-b border-purple-100/70 px-6 py-4 bg-purple-50/20 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">All Subjects & Assigned Faculty</h2>
            <p className="text-xs text-slate-500">{subjects.length} active course tracks</p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading subjects...</div>
        ) : subjects.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No subjects created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-100/70 bg-purple-50/40 text-[11px] uppercase font-bold text-purple-900/70 tracking-wider">
                  <th className="px-6 py-3.5">Subject Name</th>
                  <th className="px-6 py-3.5">Code</th>
                  <th className="px-6 py-3.5">Class</th>
                  <th className="px-6 py-3.5">Assigned Teachers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/50">
                {subjects.map((s) => (
                  <tr key={s.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{s.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-purple-700 font-semibold">{s.code || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-0.5 text-xs font-bold text-purple-800 border border-purple-200">
                        {s.className}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {s.assignedTeachers && s.assignedTeachers.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {s.assignedTeachers.map((t) => (
                            <span
                              key={t.id}
                              className="inline-flex items-center gap-2 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-bold text-purple-900 shadow-2xs"
                            >
                              <span>{t.fullName}</span>
                              <button
                                onClick={() => handleUnassignTeacher(s.id, t.id)}
                                title="Unassign teacher"
                                className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-200 text-purple-800 hover:bg-rose-500 hover:text-white transition-colors"
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
                              className="inline-flex items-center rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-xs font-bold text-purple-900"
                            >
                              {tName}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-amber-600 font-medium italic">No teacher assigned yet</span>
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
