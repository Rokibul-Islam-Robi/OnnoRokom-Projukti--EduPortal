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
    borderTop: "border-t-brand-500",
    iconBg: "bg-brand-50 text-brand-600 ring-1 ring-brand-500/20",
    badgeBg: "bg-brand-50 text-brand-700",
  },
  amber: {
    borderTop: "border-t-amber-500",
    iconBg: "bg-amber-50 text-amber-600 ring-1 ring-amber-500/20",
    badgeBg: "bg-amber-50 text-amber-700",
  },
  emerald: {
    borderTop: "border-t-emerald-500",
    iconBg: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20",
    badgeBg: "bg-emerald-50 text-emerald-700",
  },
  indigo: {
    borderTop: "border-t-indigo-500",
    iconBg: "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/20",
    badgeBg: "bg-indigo-50 text-indigo-700",
  },
  purple: {
    borderTop: "border-t-purple-500",
    iconBg: "bg-purple-50 text-purple-600 ring-1 ring-purple-500/20",
    badgeBg: "bg-purple-50 text-purple-700",
  },
};

export function StatCard({ label, value, subtext, icon, variant = "brand", badgeText }: StatCardProps) {
  const v = VARIANTS[variant] || VARIANTS.brand;

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm border-t-4 ${v.borderTop} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink">{value}</p>
        </div>
        
        {icon && (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${v.iconBg} shadow-xs`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        {subtext && <p className="text-xs font-medium text-slate-500">{subtext}</p>}
        {badgeText && (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${v.badgeBg}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
