import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total: number;
  limit: number;
}

export function Pagination({ page, totalPages, onPageChange, total, limit }: PaginationProps) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  const btn = (isActive: boolean, disabled: boolean) =>
    `inline-flex items-center justify-center h-8 min-w-[2rem] rounded px-2 text-sm font-medium transition-colors ${
      disabled
        ? 'text-[#d1d5db] cursor-not-allowed'
        : isActive
          ? 'bg-accent text-white'
          : 'text-[#374151] hover:bg-[#f3f4f6]'
    }`;

  return (
    <div className="flex items-center justify-between border-t border-[#e5e7eb] pt-4 mt-4">
      {/* Count info */}
      <p className="text-sm text-[#6b7280]">
        Showing <span className="font-medium text-[#111827]">{from}–{to}</span> of{' '}
        <span className="font-medium text-[#111827]">{total}</span>
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={btn(false, page === 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-sm text-[#9ca3af]">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={btn(p === page, false)}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={btn(false, page === totalPages)}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
