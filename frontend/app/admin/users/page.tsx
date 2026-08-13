"use client";

import { FormEvent, useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { api, ApiClientError } from "@/lib/api";
import { UserRecord, SchoolClass, UserRole } from "@/lib/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Student");
  const [classId, setClassId] = useState<string>("");

  function loadData() {
    setLoading(true);
    Promise.all([api.get<UserRecord[]>("/api/users"), api.get<SchoolClass[]>("/api/classes")])
      .then(([u, c]) => {
        setUsers(u);
        setClasses(c);
      })
      .finally(() => setLoading(false));
  }

  useEffect(loadData, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await api.post("/api/users", {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role,
        classId: role === "Student" && classId ? Number(classId) : null,
      });
      setFullName("");
      setEmail("");
      setPassword("");
      setClassId("");
      loadData();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not create the user.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(user: UserRecord) {
    if (user.isActive) {
      if (!confirm(`Deactivate user account for ${user.fullName}?`)) return;
      await api.delete(`/api/users/${user.id}`);
    } else {
      await api.put(`/api/users/${user.id}`, {
        fullName: user.fullName,
        isActive: true,
        classId: user.classId,
      });
    }
    loadData();
  }

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.className && u.className.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">User Directory</h1>
        <p className="mt-1 text-sm text-slate-500">
          Provision and maintain administrator, faculty, and student user accounts.
        </p>
      </div>

      <Card>
        <p className="text-base font-bold text-ink mb-4">Provision New Account</p>
        <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {error && (
            <div className="sm:col-span-2 lg:col-span-3 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Full Name *
            </label>
            <input
              required
              placeholder="e.g. Sarah Jenkins"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="user@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Initial Password *
            </label>
            <input
              type="text"
              required
              minLength={6}
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              User Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Administrator</option>
            </select>
          </div>

          {role === "Student" && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Assigned Class *
              </label>
              <select
                required
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.section ? `(${c.section})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand-500 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-60 transition-colors"
            >
              {submitting ? "Creating User..." : "Provision Account"}
            </button>
          </div>
        </form>
      </Card>

      {/* Directory Section */}
      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-ink">Account Directory</h2>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Role Filter Tabs */}
            <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600">
              {["All", "Teacher", "Student", "Admin"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`rounded-md px-3 py-1 transition-all ${
                    roleFilter === r ? "bg-white font-semibold text-ink shadow-xs" : "hover:text-ink"
                  }`}
                >
                  {r}s
                </button>
              ))}
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading directory...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No user accounts found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/50 text-xs uppercase font-semibold text-slate-500">
                  <th className="px-6 py-3">Full Name</th>
                  <th className="px-6 py-3">Email Address</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-ink">{u.fullName}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                          u.role === "Admin"
                            ? "bg-purple-50 text-purple-700"
                            : u.role === "Teacher"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{u.className || "—"}</td>
                    <td className="px-6 py-4">
                      <Badge label={u.isActive ? "Active" : "Inactive"} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleActive(u)}
                        className={`text-xs font-semibold transition-colors ${
                          u.isActive ? "text-slate-500 hover:text-rose-600" : "text-emerald-600 hover:text-emerald-800"
                        }`}
                      >
                        {u.isActive ? "Deactivate" : "Reactivate"}
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
