const STYLES: Record<string, { bg: string; dot: string }> = {
  Draft: { bg: "bg-slate-100 text-slate-700 border-slate-200", dot: "bg-slate-400" },
  Published: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200/60", dot: "bg-emerald-500" },
  Submitted: { bg: "bg-blue-50 text-blue-700 border-blue-200/60", dot: "bg-blue-500" },
  Late: { bg: "bg-amber-50 text-amber-800 border-amber-200/60", dot: "bg-amber-500" },
  Graded: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200/60", dot: "bg-emerald-500" },
  Resubmitted: { bg: "bg-indigo-50 text-indigo-700 border-indigo-200/60", dot: "bg-indigo-500" },
  Active: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200/60", dot: "bg-emerald-500" },
  Inactive: { bg: "bg-slate-100 text-slate-500 border-slate-200", dot: "bg-slate-400" },
  "Not Submitted": { bg: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" },
  "Past Deadline": { bg: "bg-rose-50 text-rose-700 border-rose-200/60", dot: "bg-rose-500" },
};

export function Badge({ label }: { label: string }) {
  const style = STYLES[label] || { bg: "bg-slate-100 text-slate-700 border-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
}
