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
        <h1 className="text-2xl font-bold tracking-tight text-ink">Create New Assignment</h1>
        <p className="mt-1 text-sm text-slate-500">
          Formulate coursework instructions, set deadlines, and configure grading metrics.
        </p>
      </div>

      <Card>
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-3.5 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, publishImmediately)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Assignment Title *
            </label>
            <input
              required
              placeholder="e.g. Midterm Physics Problem Set 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 font-medium"
            />
          </div>

          {/* Subject & Class Picker */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Course Subject *
              </label>
              <select
                required
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.className})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Enrolled Class
              </label>
              <select
                disabled
                value={classId}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-600 outline-none"
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
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Submission Deadline *
              </label>
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Maximum Marks *
              </label>
              <input
                type="number"
                required
                min={1}
                max={1000}
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {/* Description / Instructions */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Instructions & Questions *
            </label>
            <textarea
              required
              rows={6}
              placeholder="Provide detailed assignment questions, submission guidelines, and reference criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-3.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 font-mono"
            />
          </div>

          {/* Options */}
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200/80">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowResubmission}
                onChange={(e) => setAllowResubmission(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <div>
                <span className="text-sm font-semibold text-ink">Allow Student Resubmissions</span>
                <p className="text-xs text-slate-500">
                  Students may edit and resubmit their work prior to the deadline.
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              onClick={() => setPublishImmediately(false)}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-slate-50 disabled:opacity-60 transition-colors"
            >
              {submitting && !publishImmediately ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="submit"
              disabled={submitting}
              onClick={() => setPublishImmediately(true)}
              className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-60 transition-colors"
            >
              {submitting && publishImmediately ? "Publishing..." : "Publish Assignment"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
