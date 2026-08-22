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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0416] p-4 font-sans text-slate-100 antialiased selection:bg-purple-500 selection:text-white sm:p-6 lg:p-8">
      {/* Dynamic Purple/Violet Ambient Lighting & Mesh Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated Aurora Glow Orbs */}
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-purple-600/30 via-fuchsia-600/20 to-transparent blur-[120px] animate-float" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-indigo-600/30 via-purple-700/25 to-transparent blur-[140px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[150px] animate-pulse-glow" />

        {/* Ambient Grid Matrix Overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(rgba(192, 132, 252, 0.8) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Soft Diagonal Light Streaks */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/40 via-transparent to-purple-900/20 mix-blend-screen" />
      </div>

      {/* Main Glassmorphic Corporate Card */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-purple-500/25 bg-[#120726]/80 shadow-[0_25px_70px_-15px_rgba(124,58,237,0.4)] backdrop-blur-2xl lg:grid lg:grid-cols-12 transition-all duration-300">
        {/* Top Edge Ambient Gradient Line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/70 to-transparent z-20" />

        {/* ================= LEFT PANEL: Luxury Corporate Brand Hero ================= */}
        <div className="relative flex flex-col justify-between bg-gradient-to-br from-[#1a0b33]/95 via-[#140628]/90 to-[#0d031c]/95 p-8 lg:col-span-5 lg:p-10 border-b border-purple-500/20 lg:border-b-0 lg:border-r">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/[0.04] to-transparent pointer-events-none" />

          {/* Top Logo & Branding */}
          <div className="relative z-10">
            <div className="flex items-center gap-3.5">
              {/* Modern Corporate Animated Logo */}
              <div className="relative group flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-800 p-[1.5px] shadow-lg shadow-purple-600/35 ring-1 ring-purple-400/40">
                {/* Pulsing Aura */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 opacity-50 blur-md group-hover:opacity-100 transition-opacity animate-pulse-glow" />

                <div className="relative flex h-full w-full items-center justify-center rounded-[14px] bg-gradient-to-br from-[#1e0a38] to-[#120424]">
                  {/* Modern Animated SVG Academic Icon */}
                  <svg
                    className="h-7 w-7 text-purple-200 transition-transform duration-500 group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="50%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#e879f9" />
                      </linearGradient>
                    </defs>
                    {/* Graduation Cap Top Surface */}
                    <path
                      d="M12 3L2 8.5L12 14L22 8.5L12 3Z"
                      fill="url(#logoGrad)"
                      fillOpacity="0.9"
                    />
                    {/* Lower Cap Geometry */}
                    <path
                      d="M6 10.7V15.5C6 17.5 8.7 19.5 12 19.5C15.3 19.5 18 17.5 18 15.5V10.7"
                      stroke="url(#logoGrad)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Academic Tassel & Pendant */}
                    <path
                      d="M22 8.5V15.5C22 16 21.5 16.5 21 16.5C20.5 16.5 20 16 20 15.5V9.6"
                      stroke="#e9d5ff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle cx="20.5" cy="17" r="1.2" fill="#c084fc" className="animate-ping" />
                    <circle cx="20.5" cy="17" r="1" fill="#ffffff" />
                  </svg>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/15 border border-purple-400/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300 shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400"></span>
                  </span>
                  <span>ONNOROKOM PROJUKTI</span>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                  EduPortal
                </h1>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
                Enterprise Academic Governance
              </h2>
              <p className="text-xs leading-relaxed text-purple-200/75">
                Role-based coursework creation, submission tracking, and automated grading environment engineered for OnnoRokom Projukti Limited.
              </p>
            </div>
          </div>

          {/* Animated Core Feature Badges */}
          <div className="relative z-10 mt-8 space-y-3 pt-6 border-t border-purple-500/20">
            {/* Feature 1 */}
            <div className="group flex items-center gap-3 rounded-xl bg-purple-950/40 border border-purple-500/15 p-2.5 text-xs text-purple-100/90 transition-all hover:bg-purple-900/30 hover:border-purple-400/30">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/30 to-indigo-500/20 text-purple-300 border border-purple-400/30 group-hover:scale-110 transition-transform">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-medium">Role-Based Authentication (Admin, Teacher, Student)</span>
            </div>

            {/* Feature 2 */}
            <div className="group flex items-center gap-3 rounded-xl bg-purple-950/40 border border-purple-500/15 p-2.5 text-xs text-purple-100/90 transition-all hover:bg-purple-900/30 hover:border-purple-400/30">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/30 to-indigo-500/20 text-purple-300 border border-purple-400/30 group-hover:scale-110 transition-transform">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="font-medium">Subject Assignment & Resubmission Enforcement</span>
            </div>

            {/* Feature 3 */}
            <div className="group flex items-center gap-3 rounded-xl bg-purple-950/40 border border-purple-500/15 p-2.5 text-xs text-purple-100/90 transition-all hover:bg-purple-900/30 hover:border-purple-400/30">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/30 to-indigo-500/20 text-purple-300 border border-purple-400/30 group-hover:scale-110 transition-transform">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="font-medium">PostgreSQL & ASP.NET Core EF Security</span>
            </div>
          </div>

          {/* System Status Pill */}
          <div className="relative z-10 mt-8 flex items-center justify-between rounded-xl bg-purple-950/60 border border-purple-500/25 px-3.5 py-2 text-[11px] text-purple-300">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-purple-200">System Online</span>
            </div>
            <span className="text-purple-400/80 font-mono text-[10px]">99.99% Enterprise Uptime</span>
          </div>
        </div>

        {/* ================= RIGHT PANEL: Modern Clean White & Purple Tone Login ================= */}
        <div className="flex flex-col justify-between p-8 lg:col-span-7 lg:p-10 bg-gradient-to-b from-white via-[#faf8ff] to-white text-slate-800">
          <div>
            {/* Header with Title & Enterprise Pill */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Sign in to EduPortal
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Access your academic dashboard & services
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-200/80 shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-pulse"></span>
                V1.0 Enterprise
              </span>
            </div>

            {/* Quick Demo Accounts Selection */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-purple-900/60">
                  Select Demo Role Account (1-Click Fill)
                </p>
                <span className="text-[10px] font-medium text-purple-600 bg-purple-100/60 px-2 py-0.5 rounded-md">
                  Instant Test Login
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {/* Admin Button */}
                <button
                  type="button"
                  onClick={() => fillDemo("admin@school.edu", "Admin@123", "Admin")}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all duration-200 ${
                    selectedRole === "Admin"
                      ? "border-purple-600 bg-gradient-to-b from-purple-100/90 to-purple-50 text-purple-950 shadow-md shadow-purple-500/15 ring-2 ring-purple-500/30 scale-[1.02]"
                      : "border-purple-100/80 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50/60 hover:shadow-xs"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl transition-transform group-hover:scale-110 mb-1.5 ${
                      selectedRole === "Admin"
                        ? "bg-purple-600 text-white shadow-sm shadow-purple-600/30"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold">Admin</span>
                </button>

                {/* Teacher Button */}
                <button
                  type="button"
                  onClick={() => fillDemo("teacher@school.edu", "Teacher@123", "Teacher")}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all duration-200 ${
                    selectedRole === "Teacher"
                      ? "border-indigo-600 bg-gradient-to-b from-indigo-100/90 to-indigo-50 text-indigo-950 shadow-md shadow-indigo-500/15 ring-2 ring-indigo-500/30 scale-[1.02]"
                      : "border-purple-100/80 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/60 hover:shadow-xs"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl transition-transform group-hover:scale-110 mb-1.5 ${
                      selectedRole === "Teacher"
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold">Teacher</span>
                </button>

                {/* Student Button */}
                <button
                  type="button"
                  onClick={() => fillDemo("student@school.edu", "Student@123", "Student")}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all duration-200 ${
                    selectedRole === "Student"
                      ? "border-fuchsia-600 bg-gradient-to-b from-fuchsia-100/90 to-fuchsia-50 text-fuchsia-950 shadow-md shadow-fuchsia-500/15 ring-2 ring-fuchsia-500/30 scale-[1.02]"
                      : "border-purple-100/80 bg-white text-slate-700 hover:border-fuchsia-300 hover:bg-fuchsia-50/60 hover:shadow-xs"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl transition-transform group-hover:scale-110 mb-1.5 ${
                      selectedRole === "Student"
                        ? "bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-600/30"
                        : "bg-fuchsia-100 text-fuchsia-700"
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold">Student</span>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs font-medium text-red-700 flex items-center gap-2.5 animate-fadeIn">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold">
                    !
                  </div>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-purple-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-purple-200/90 bg-purple-50/20 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15 font-medium"
                    placeholder="name@school.edu"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-purple-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-purple-200/90 bg-purple-50/20 pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15 font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-purple-600 transition-colors"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="group relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 py-3 px-4 text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition-all duration-200 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-600 hover:shadow-purple-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-60"
              >
                {/* Button shine reflection effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                <span className="relative flex items-center justify-center gap-2">
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Authenticating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Portal</span>
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* Footer with Security & Company */}
          <div className="mt-8 border-t border-purple-100 pt-4 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span>🔒 256-Bit SSL Encrypted Session</span>
            </div>
            <span className="font-semibold text-purple-900/70">OnnoRokom Projukti Limited</span>
          </div>
        </div>
      </div>
    </div>
  );
}
