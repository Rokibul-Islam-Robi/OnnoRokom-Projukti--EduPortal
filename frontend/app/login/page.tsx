"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ApiClientError } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Could not reach the server. Please verify backend API status.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemo(demoEmail: string, demoPass: string) {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50/70 px-4 font-sans text-ink">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md mb-3">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01-6.824-2.998L12 14z" />
            </svg>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">OnnoRokom Projukti</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">EduPortal</h1>
          <p className="mt-1 text-sm text-slate-500">
            Assignment & Submission Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-7 shadow-card">
          <h2 className="text-lg font-bold text-ink mb-1">Sign in to your portal</h2>
          <p className="text-xs text-slate-500 mb-6">Enter your registered email and password</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                placeholder="user@school.edu"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand-500 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-60 transition-colors"
            >
              {submitting ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          {/* Quick Fill Demo Credentials */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Quick Demo Accounts (Click to Fill)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo("admin@school.edu", "Admin@123")}
                className="rounded-lg border border-purple-200 bg-purple-50/50 py-2 px-2 text-center text-xs font-semibold text-purple-800 hover:bg-purple-100 transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemo("teacher@school.edu", "Teacher@123")}
                className="rounded-lg border border-blue-200 bg-blue-50/50 py-2 px-2 text-center text-xs font-semibold text-blue-800 hover:bg-blue-100 transition-colors"
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => fillDemo("student@school.edu", "Student@123")}
                className="rounded-lg border border-emerald-200 bg-emerald-50/50 py-2 px-2 text-center text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                Student
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          OnnoRokom Projukti Recruitment Assignment Demo Portal
        </p>
      </div>
    </div>
  );
}
