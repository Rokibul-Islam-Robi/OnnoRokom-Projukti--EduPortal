"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { api, ApiClientError } from "@/lib/api";
import { Subject, SchoolClass } from "@/lib/types";

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [classId, setClassId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [maxMarks, setMaxMarks] = useState(100);
  const [allowResubmission, setAllowResubmission] = useState(true);
  const [publishImmediately, setPublishImmediately] = useState(false);

  useEffect(() => {
    Promise.all([api.get<Subject[]>("/api/subjects"), api.get<SchoolClass[]>("/api/classes")])
      .then(([sList, cList]) => {
        setSubjects(sList);
        setClasses(cList);
      })
      .finally(() => setLoading(false));
  }, []);

  // When a subject is selected, automatically infer its classId
  function handleSubjectChange(idStr: string) {
    setSubjectId(idStr);
    const selected = subjects.find((s) => s.id === Number(idStr));
    if (selected) {
      setClassId(String(selected.classId));
    }
  }

  async function handleSubmit(e: FormEvent, publish: boolean) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await api.post("/api/assignments", {
        title: title.trim(),
        description: description.trim(),
        subjectId: Number(subjectId),
        classId: Number(classId),
        deadline: new Date(deadline).toISOString(),
        maxMarks: Number(maxMarks),
        allowResubmission,
        publish,
      });

      router.push("/teacher");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to create assignment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
            Coursework Creation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Create New Assignment
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Formulate coursework instructions, set submission deadlines, and configure evaluation criteria.
        </p>
      </div>

      <Card className="p-7 sm:p-9 border-purple-100/90 shadow-lg">
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, publishImmediately)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Assignment Title *
            </label>
            <input
              required
              placeholder="e.g. Midterm Physics Problem Set 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15 font-bold"
            />
          </div>

          {/* Subject & Class Picker */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Course Subject *
              </label>
              <select
                required
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15 font-medium"
              >
                <option value="">Select assigned subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.className})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Target Class (Auto-Inferred)
              </label>
              <select
                disabled
                value={classId}
                className="w-full rounded-xl border border-purple-100 bg-purple-50/60 px-4 py-2.5 text-sm text-purple-950 font-semibold outline-none cursor-not-allowed"
              >
                <option value="">Auto-selected from subject</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.section ? `(${c.section})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Deadline & Max Marks */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Submission Deadline *
              </label>
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15 font-medium"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Maximum Points / Marks *
              </label>
              <input
                type="number"
                required
                min={1}
                max={1000}
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15 font-mono font-bold"
              />
            </div>
          </div>

          {/* Description / Instructions */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Instructions & Questions *
            </label>
            <textarea
              required
              rows={6}
              placeholder="Provide detailed assignment questions, problem sets, guidelines, and reference expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 p-4 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15 font-mono"
            />
          </div>

          {/* Options Card */}
          <div className="rounded-2xl bg-purple-50/40 p-4 border border-purple-100/80">
            <label className="flex items-center gap-3.5 cursor-pointer">
              <input
                type="checkbox"
                checked={allowResubmission}
                onChange={(e) => setAllowResubmission(e.target.checked)}
                className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-bold text-slate-900">Allow Student Resubmissions</span>
                <p className="text-xs text-slate-500">
                  Enables students to modify and re-upload their solution prior to deadline expiration.
                </p>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end border-t border-purple-100/70 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              onClick={() => setPublishImmediately(false)}
              className="rounded-xl border border-purple-200 bg-purple-50 px-5 py-2.5 text-sm font-bold text-purple-900 hover:bg-purple-100 disabled:opacity-60 transition-all"
            >
              {submitting && !publishImmediately ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="submit"
              disabled={submitting}
              onClick={() => setPublishImmediately(true)}
              className="rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-600 hover:shadow-purple-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-60 transition-all duration-200"
            >
              {submitting && publishImmediately ? "Publishing..." : "Publish Assignment"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
