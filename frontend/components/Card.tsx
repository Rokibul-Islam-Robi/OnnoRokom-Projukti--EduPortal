export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-purple-100/80 bg-white/95 p-6 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md ${className}`}>
      {children}
    </div>
  );
}
