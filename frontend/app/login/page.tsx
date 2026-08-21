"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ApiClientError } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

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
        setError("Could not connect to authentication server. Verify API status.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemo(demoEmail: string, demoPass: string, roleName: string) {
    setEmail(demoEmail);
    setPassword(demoPass);
    setSelectedRole(roleName);
    setError(null);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 font-sans text-slate-100 antialiased selection:bg-brand-500 selection:text-white sm:p-6 lg:p-8">
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/90 shadow-2xl backdrop-blur-xl lg:grid lg:grid-cols-12">
        {/* Left Side: Corporate Hero Branding */}
        <div className="relative flex flex-col justify-between bg-gradient-to-br from-brand-950 via-slate-900 to-slate-950 p-8 lg:col-span-5 lg:p-10 border-b border-slate-800/60 lg:border-b-0 lg:border-r">
          {/* Top Logo & Title */}
          <div>
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 shadow-lg shadow-brand-500/25 ring-1 ring-white/20">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <span className="inline-block rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-400 border border-brand-500/20">
                  Shikhon
                </span>
                <h1 className="text-xl font-extrabold tracking-tight text-white">EduProtal</h1>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Enterprise Academic Governance
              </h2>
              <p className="text-xs leading-relaxed text-slate-400">
                Role-based coursework creation, submission tracking, and grading environment engineered for Shikhon-EduProtal.
              </p>
            </div>
          </div>

          {/* Core Feature Badges */}
          <div className="mt-8 space-y-2.5 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                ✓
              </div>
              <span>Role-Based Authentication (Admin, Teacher, Student)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                ✓
              </div>
              <span>Subject Assignment & Resubmission Enforcement</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                ✓
              </div>
              <span>PostgreSQL & ASP.NET Core EF Security</span>
            </div>
          </div>
        </div>

        {/* Right Side: Modern Login Form */}
        <div className="flex flex-col justify-between p-8 lg:col-span-7 lg:p-10 bg-white text-ink">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-ink">Sign in to Shikhon-EduProtal</h3>
                <p className="mt-1 text-xs text-slate-500">Access your academic dashboard</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                V1.0 Enterprise
              </span>
            </div>

            {/* Quick Demo Accounts Selection */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Select Demo Role Account (1-Click Fill)
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => fillDemo("admin@school.edu", "Admin@123", "Admin")}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                    selectedRole === "Admin"
                      ? "border-purple-600 bg-purple-50 text-purple-900 shadow-sm ring-2 ring-purple-500/20 font-bold"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-purple-300 hover:bg-purple-50/50"
                  }`}
                >
                  <svg className="h-4 w-4 text-purple-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs font-semibold">Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo("teacher@school.edu", "Teacher@123", "Teacher")}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                    selectedRole === "Teacher"
                      ? "border-blue-600 bg-blue-50 text-blue-900 shadow-sm ring-2 ring-blue-500/20 font-bold"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <svg className="h-4 w-4 text-blue-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-xs font-semibold">Teacher</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo("student@school.edu", "Student@123", "Student")}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                    selectedRole === "Student"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm ring-2 ring-emerald-500/20 font-bold"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50"
                  }`}
                >
                  <svg className="h-4 w-4 text-emerald-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                  <span className="text-xs font-semibold">Student</span>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs font-medium text-red-700 flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-ink outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 font-medium"
                    placeholder="name@school.edu"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 py-2.5 text-sm text-ink outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 013.682-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-xl bg-brand-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-700 hover:shadow-brand-600/35 active:scale-[0.99] disabled:opacity-60"
              >
                {submitting ? "Authenticating Account..." : "Sign In to Portal"}
              </button>
            </form>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] text-slate-400">
            <span>🔒 256-Bit SSL Encrypted Session</span>
            <span>Shikhon-EduProtal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
