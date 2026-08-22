"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ApiClientError } from "@/lib/api";

type RolePreset = "Admin" | "Teacher" | "Student";

interface PresetConfig {
  email: string;
  label: string;
  role: RolePreset;
  sub: string;
  iconBg: string;
}

const PRESETS: PresetConfig[] = [
  {
    role: "Admin",
    label: "Administrator",
    email: "admin@school.edu",
    sub: "System Governance",
    iconBg: "bg-purple-600 text-white",
  },
  {
    role: "Teacher",
    label: "Faculty / Teacher",
    email: "teacher@school.edu",
    sub: "Courses & Grading",
    iconBg: "bg-indigo-600 text-white",
  },
  {
    role: "Student",
    label: "Student",
    email: "student@school.edu",
    sub: "Homework & Scores",
    iconBg: "bg-fuchsia-600 text-white",
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("teacher@school.edu");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<RolePreset>("Teacher");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSelectRole(preset: PresetConfig) {
    setActiveRole(preset.role);
    setEmail(preset.email);
    setPassword("password123");
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email.trim(), password);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Unable to authenticate. Please check your credentials.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#faf8ff] text-slate-900 font-sans flex flex-col justify-between selection:bg-purple-500 selection:text-white">
      {/* Background Flowing Organic Curves & Educational Blobs Inspired by the User Reference Image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-Right Purple Organic Gradient Wave */}
        <svg
          className="absolute -top-28 -right-28 w-[720px] h-[720px] text-purple-600/15 animate-float-delayed"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M410,310Q370,370,305,400Q240,430,175,405Q110,380,85,315Q60,250,90,185Q120,120,185,90Q250,60,315,85Q380,110,415,180Q450,250,410,310Z"
            fill="url(#topWaveGrad)"
          />
          <defs>
            <linearGradient id="topWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop stopColor="#7C3AED" stopOpacity="0.85" />
              <stop stopColor="#C084FC" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Bottom-Left Fluid Violet Organic Wave */}
        <svg
          className="absolute -bottom-36 -left-32 w-[850px] h-[850px] text-indigo-500/10 animate-float"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M430,320Q390,390,325,415Q260,440,195,415Q130,390,95,330Q60,270,85,200Q110,130,175,95Q240,60,310,85Q380,110,425,180Q470,250,430,320Z"
            fill="url(#botWaveGrad)"
          />
          <defs>
            <linearGradient id="botWaveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop stopColor="#6366F1" stopOpacity="0.7" />
              <stop stopColor="#A855F7" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Playful Botanical & Spark Elements */}
        <div className="absolute top-28 left-[12%] h-4 w-4 rounded-full bg-amber-400/80 animate-ping opacity-60" />
        <div className="absolute top-[45%] left-[6%] h-6 w-6 rounded-full bg-fuchsia-400/40 animate-pulse-glow" />
        <div className="absolute bottom-28 right-[18%] h-5 w-5 rounded-full bg-indigo-400/50 animate-bounce" />

        {/* Fine background dot mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04]" />
      </div>

      {/* Top Navbar Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 shadow-md shadow-purple-600/30 text-white">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Edu<span className="text-purple-600">Portal</span>
              </span>
              <span className="hidden sm:inline-flex rounded-full bg-purple-100/90 border border-purple-200/80 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-purple-800">
                OnnoRokom Projukti
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-600 hidden sm:block">
              Academic Assignment & Grading Ecosystem
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex items-center gap-5 text-xs font-bold text-slate-600">
            <span className="hover:text-purple-700 cursor-pointer transition-colors">Overview</span>
            <span className="hover:text-purple-700 cursor-pointer transition-colors">Curriculum</span>
            <span className="hover:text-purple-700 cursor-pointer transition-colors">Governance</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1.5 border border-purple-200/80 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-400/20 animate-pulse" />
            <span className="text-xs font-bold text-slate-700">System Ready</span>
          </div>
        </div>
      </header>

      {/* Main Hero & Authentication Area */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Showcase & Educational Illustration Card */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-100/80 border border-purple-200 px-3.5 py-1.5 text-xs font-bold text-purple-900 shadow-2xs">
                <span className="flex h-2 w-2 rounded-full bg-purple-600" />
                Next-Gen Academic Governance
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Empowering <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Academic Learning</span> & Seamless Evaluation
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-medium">
                Streamline role-based curriculum distribution, online assignment submissions, real-time rubric grading, and student progress tracking in one unified corporate portal.
              </p>
            </div>

            {/* Educational SaaS Showcase Card */}
            <div className="relative rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-900 p-6 sm:p-8 text-white shadow-xl shadow-purple-900/15 overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-purple-400/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <svg className="w-48 h-48 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>

              {/* Graphic Cards & Metrics Grid */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/15 hover:bg-white/15 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-bold shadow-sm">
                      ⚡
                    </div>
                    <div>
                      <p className="text-xs text-purple-200 font-semibold">Faculty Workspace</p>
                      <p className="text-sm font-extrabold text-white">1-Click Publish</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-purple-100/80 font-medium">
                    Assign coursework, set submission rules, and grade with personalized remarks.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/15 hover:bg-white/15 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-slate-950 font-bold shadow-sm">
                      🎓
                    </div>
                    <div>
                      <p className="text-xs text-purple-200 font-semibold">Student Portal</p>
                      <p className="text-sm font-extrabold text-white">Live Submissions</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-purple-100/80 font-medium">
                    Submit answers, view grades, and monitor feedback from course teachers.
                  </p>
                </div>
              </div>

              {/* Bottom Trust Badge */}
              <div className="relative z-10 mt-5 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-purple-200">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">Enterprise Role Security</span>
                </div>
                <span className="font-mono text-[11px] text-purple-200/90 font-bold bg-white/10 px-2.5 py-0.5 rounded-md">
                  V1.0 Enterprise
                </span>
              </div>
            </div>

            {/* Quick Feature Pills */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 border border-purple-100 shadow-2xs">
                <span className="text-purple-600 font-bold">✓</span> Role-Based Auth
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 border border-purple-100 shadow-2xs">
                <span className="text-purple-600 font-bold">✓</span> Subject Assignment
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 border border-purple-100 shadow-2xs">
                <span className="text-purple-600 font-bold">✓</span> Resubmission Rules
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 border border-purple-100 shadow-2xs">
                <span className="text-purple-600 font-bold">✓</span> Real-Time Analytics
              </span>
            </div>
          </div>

          {/* Right Authentication Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl border border-purple-100/90 p-7 sm:p-9 shadow-[0_20px_60px_-15px_rgba(109,40,217,0.15)] relative">
              
              {/* Card Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    Sign In to Portal
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200/80 px-2.5 py-0.5 text-[11px] font-bold text-purple-700">
                    🔒 Secure Access
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  Select a demo account below for 1-click test login, or enter credentials.
                </p>
              </div>

              {/* 1-Click Demo Role Selector Tabs */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-purple-900">
                    Select Demo Role (1-Click Auto Fill)
                  </label>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
                    Instant Demo
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {PRESETS.map((preset) => {
                    const isSelected = activeRole === preset.role;
                    return (
                      <button
                        key={preset.role}
                        type="button"
                        onClick={() => handleSelectRole(preset)}
                        className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 text-center ${
                          isSelected
                            ? "border-purple-600 bg-purple-50/80 shadow-md shadow-purple-600/10 ring-2 ring-purple-500/20"
                            : "border-purple-100 bg-white hover:border-purple-200 hover:bg-purple-50/30"
                        }`}
                      >
                        <div
                          className={`mb-1.5 flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                            isSelected
                              ? "bg-purple-600 text-white shadow-xs"
                              : "bg-purple-100/70 text-purple-700 group-hover:bg-purple-200/70"
                          }`}
                        >
                          {preset.role === "Admin" && (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          )}
                          {preset.role === "Teacher" && (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          )}
                          {preset.role === "Student" && (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-900">{preset.label.split(" ")[0]}</span>
                        <span className="text-[10px] font-medium text-slate-500 truncate w-full">{preset.sub.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-5 flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs font-semibold text-red-700 animate-fadeIn">
                  <span className="text-sm">⚠️</span>
                  <div className="flex-1">{error}</div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Academic Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="e.g. user@school.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-purple-200/90 bg-purple-50/20 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15 font-medium"
                    />
                    <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                    </svg>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Password
                    </label>
                    <span className="text-[11px] font-bold text-purple-600 hover:text-purple-800 cursor-pointer">
                      Forgot password?
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-purple-200/90 bg-purple-50/20 py-3 pl-10 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-500/15 font-mono"
                    />
                    <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-xs text-purple-400 hover:text-purple-700 font-bold"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-600 hover:shadow-purple-600/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-60 transition-all duration-200 mt-2"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Signing In to Portal...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to {activeRole} Portal</span>
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Security Footnote */}
              <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between text-[11px] text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  🔒 256-Bit SSL Encrypted
                </span>
                <span className="font-bold text-purple-900">OnnoRokom Projukti</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-600 font-medium">
        © {new Date().getFullYear()} OnnoRokom Projukti Limited. EduPortal Assignment & Grading System. All rights reserved.
      </footer>
    </div>
  );
}
