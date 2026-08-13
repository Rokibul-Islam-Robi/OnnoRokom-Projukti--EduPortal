"use client";

import { FormEvent, useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { api, ApiClientError } from "@/lib/api";
import { SchoolClass } from "@/lib/types";

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [section, setSection] = useState("");

  function loadClasses() {
    setLoading(true);
    api
      .get<SchoolClass[]>("/api/classes")
      .then(setClasses)
      .finally(() => setLoading(false));
  }

  useEffect(loadClasses, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await api.post("/api/classes", {
        name: name.trim(),
        section: section.trim() || null,
      });
      setName("");
      setSection("");
      loadClasses();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to create class.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number, className: string) {
    if (!confirm(`Are you sure you want to delete ${className}?`)) return;
    setError(null);
    try {
      await api.delete(`/api/classes/${id}`);
      loadClasses();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to delete class.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Classes & Sections</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create and manage academic classes for student enrollment and subject grouping.
        </p>
      </div>

      <Card>
        <p className="text-base font-bold text-ink mb-4">Add New Class</p>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Class Name *
            </label>
            <input
              required
              placeholder="e.g. Class 10, Grade 8"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Section (Optional)
            </label>
            <input
              placeholder="e.g. Section A, Science"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand-500 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-60 transition-colors"
            >
              {submitting ? "Creating..." : "Create Class"}
            </button>
          </div>
        </form>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-ink">All Academic Classes</h2>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading classes...</div>
        ) : classes.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No classes created yet. Use the form above to add your first class.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/50 text-xs uppercase font-semibold text-slate-500">
                  <th className="px-6 py-3">Class Name</th>
                  <th className="px-6 py-3">Section</th>
                  <th className="px-6 py-3">Enrolled Students</th>
                  <th className="px-6 py-3">Subjects</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-ink">{c.name}</td>
                    <td className="px-6 py-4 text-slate-600">{c.section || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        {c.studentCount} students
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                        {c.subjectCount} subjects
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(c.id, `${c.name} ${c.section || ""}`.trim())}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
                      >
                        Delete
                      </button>
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
