"use client";

import { FormEvent, useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Pagination } from "@/components/Pagination";
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
            Directory Management
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          User Account Directory
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Provision credentials, assign classroom roles, and enforce security policies.
        </p>
      </div>

      {/* Provision Account Card */}
      <Card className="p-7 border-purple-100/90">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold">
              +
            </div>
            <p className="text-base font-bold text-slate-900">Provision New Account</p>
          </div>
          <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
            Enterprise Account Setup
          </span>
        </div>

        <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {error && (
            <div className="sm:col-span-2 lg:col-span-3 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Full Name *
            </label>
            <input
              required
              placeholder="e.g. Sarah Jenkins"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="user@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Initial Password *
            </label>
            <input
              type="text"
              required
              minLength={6}
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15 font-mono"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              User Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Administrator</option>
            </select>
          </div>

          {role === "Student" && (
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Assigned Class *
              </label>
              <select
                required
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full rounded-xl border border-purple-200/80 bg-purple-50/20 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15"
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
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 py-2.5 px-4 text-sm font-bold text-white shadow-md shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-600 hover:shadow-purple-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-60 transition-all duration-200"
            >
              {submitting ? "Creating User..." : "Provision Account"}
            </button>
          </div>
        </form>
      </Card>

      {/* Directory Section */}
      <Card className="overflow-hidden p-0 border-purple-100/90">
        <div className="flex flex-col gap-4 border-b border-purple-100/70 p-6 sm:flex-row sm:items-center sm:justify-between bg-purple-50/20">
          <div>
            <h2 className="text-base font-bold text-slate-900">Account Directory</h2>
            <p className="text-xs text-slate-500">{filteredUsers.length} total users registered</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Role Filter Tabs */}
            <div className="flex rounded-xl bg-purple-100/60 p-1 text-xs font-semibold text-purple-900">
              {["All", "Teacher", "Student", "Admin"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`rounded-lg px-3 py-1.5 transition-all ${
                    roleFilter === r
                      ? "bg-white font-bold text-purple-900 shadow-xs ring-1 ring-purple-200/80"
                      : "hover:text-purple-700"
                  }`}
                >
                  {r}s
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-purple-200/80 bg-white px-3.5 py-1.5 pl-8 text-xs text-slate-900 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 shadow-xs"
              />
              <svg className="absolute left-2.5 top-2 h-3.5 w-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading directory...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No user accounts found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-100/70 bg-purple-50/40 text-[11px] uppercase font-bold text-purple-900/70 tracking-wider">
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Email Address</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Classroom</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/50">
                {paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-xs font-bold text-purple-700 border border-purple-200/60">
                          {getInitials(u.fullName)}
                        </div>
                        <span className="font-bold text-slate-900">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          u.role === "Admin"
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : u.role === "Teacher"
                            ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                            : "bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{u.className || "—"}</td>
                    <td className="px-6 py-4">
                      <Badge label={u.isActive ? "Active" : "Inactive"} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleActive(u)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                          u.isActive
                            ? "text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                            : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-800"
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </Card>
    </div>
  );
}
