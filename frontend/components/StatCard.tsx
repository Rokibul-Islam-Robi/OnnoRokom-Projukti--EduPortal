interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: "brand" | "amber" | "emerald" | "indigo" | "purple";
  badgeText?: string;
}

const VARIANTS = {
  brand: {
    borderTop: "from-purple-500 to-indigo-500",
    iconBg: "bg-purple-50 text-purple-700 ring-1 ring-purple-500/20",
    badgeBg: "bg-purple-50 text-purple-700 border border-purple-200/60",
    glow: "group-hover:shadow-purple-500/10",
  },
  amber: {
    borderTop: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20",
    badgeBg: "bg-amber-50 text-amber-800 border border-amber-200/60",
    glow: "group-hover:shadow-amber-500/10",
  },
  emerald: {
    borderTop: "from-emerald-500 to-teal-500",
    iconBg: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20",
    badgeBg: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    glow: "group-hover:shadow-emerald-500/10",
  },
  indigo: {
    borderTop: "from-indigo-500 to-blue-500",
    iconBg: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/20",
    badgeBg: "bg-indigo-50 text-indigo-700 border border-indigo-200/60",
    glow: "group-hover:shadow-indigo-500/10",
  },
  purple: {
    borderTop: "from-purple-600 to-fuchsia-600",
    iconBg: "bg-purple-50 text-purple-700 ring-1 ring-purple-500/20",
    badgeBg: "bg-purple-50 text-purple-700 border border-purple-200/60",
    glow: "group-hover:shadow-purple-500/10",
  },
};

export function StatCard({ label, value, subtext, icon, variant = "brand", badgeText }: StatCardProps) {
  const v = VARIANTS[variant] || VARIANTS.brand;

  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-purple-100/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-purple-200 ${v.glow}`}>
      {/* Top Accent Gradient Line */}
      <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${v.borderTop}`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
        </div>

        {icon && (
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${v.iconBg} shadow-xs transition-transform duration-300 group-hover:scale-110`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5">
        {subtext && <p className="text-xs font-medium text-slate-500">{subtext}</p>}
        {badgeText && (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${v.badgeBg}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
