interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-purple-100/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 bg-purple-50/10">
      <div>
        Showing <span className="font-bold text-slate-900">{startItem}</span> to{" "}
        <span className="font-bold text-slate-900">{endItem}</span> of{" "}
        <span className="font-bold text-slate-900">{totalItems}</span> entries
      </div>

      <div className="flex items-center gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 font-medium">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-xl border border-purple-200 bg-white px-2.5 py-1 text-xs font-bold text-purple-900 outline-none focus:border-purple-600 shadow-2xs"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded-xl border border-purple-200 bg-white px-3 py-1.5 font-bold text-purple-900 hover:bg-purple-50 disabled:opacity-40 disabled:hover:bg-white shadow-2xs transition-all"
          >
            &larr; Prev
          </button>

          <span className="px-2 font-mono font-bold text-purple-950">
            {currentPage} / {Math.max(1, totalPages)}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded-xl border border-purple-200 bg-white px-3 py-1.5 font-bold text-purple-900 hover:bg-purple-50 disabled:opacity-40 disabled:hover:bg-white shadow-2xs transition-all"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
