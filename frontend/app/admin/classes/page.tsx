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
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
            Structure Management
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Classes & Grade Sections
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Define academic classes and cohorts for curriculum assignment and student enrollment.
        </p>
      </div>

      <Card className="p-7 border-purple-100/90">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold">
              +
            </div>
            <p className="text-base font-bold text-slate-900">Add New Academic Class</p>
          </div>
          <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
            Academic Unit
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Class Name *
            </label>
            <input
              required
              placeholder="e.g. Class 10, Grade 8"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Section (Optional)
            </label>
            <input
              placeholder="e.g. Section A, Science"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 py-2.5 px-4 text-sm font-bold text-white shadow-md shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-600 hover:shadow-purple-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-60 transition-all duration-200"
            >
              {submitting ? "Creating..." : "Create Class"}
            </button>
          </div>
        </form>
      </Card>

      <Card className="overflow-hidden p-0 border-purple-100/90">
        <div className="border-b border-purple-100/70 px-6 py-4 bg-purple-50/20 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">All Academic Classes</h2>
            <p className="text-xs text-slate-500">{classes.length} registered classes</p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading classes...</div>
        ) : classes.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No classes created yet. Use the form above to add your first class.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-100/70 bg-purple-50/40 text-[11px] uppercase font-bold text-purple-900/70 tracking-wider">
                  <th className="px-6 py-3.5">Class Name</th>
                  <th className="px-6 py-3.5">Section</th>
                  <th className="px-6 py-3.5">Enrolled Students</th>
                  <th className="px-6 py-3.5">Subjects</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/50">
                {classes.map((c) => (
                  <tr key={c.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{c.name}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{c.section || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-0.5 text-xs font-bold text-purple-800 border border-purple-200">
                        {c.studentCount} students
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-bold text-indigo-800 border border-indigo-200">
                        {c.subjectCount} subjects
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(c.id, `${c.name} ${c.section || ""}`.trim())}
                        className="rounded-lg px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
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
