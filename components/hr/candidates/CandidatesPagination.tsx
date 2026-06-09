"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export function CandidatesPagination({
  page,
  total,
  perPage,
  onChange,
}: {
  page: number;
  total: number;
  perPage: number;
  onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    )
      pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const btnBase =
    "w-7 h-7 flex items-center justify-center rounded-[7px] text-[12px] font-semibold transition-all";
  const navStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(16,185,129,0.12)",
    color: "#7a9585",
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        title="First page"
        onClick={() => onChange(1)}
        disabled={page === 1}
        className={`${btnBase} disabled:opacity-30`}
        style={navStyle}>
        <ChevronsLeft size={12} />
      </button>
      <button
        type="button"
        title="Previous page"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${btnBase} disabled:opacity-30`}
        style={navStyle}>
        <ChevronLeft size={12} />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`e${i}`}
            className="w-7 text-center text-[11px] text-[#7a9585]">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            title={`Page ${p}`}
            onClick={() => onChange(p as number)}
            className={btnBase}
            style={
              page === p
                ? {
                    background: "#10b981",
                    color: "#0a100d",
                    border: "1px solid #10b981",
                  }
                : navStyle
            }>
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        title="Next page"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={`${btnBase} disabled:opacity-30`}
        style={navStyle}>
        <ChevronRight size={12} />
      </button>
      <button
        type="button"
        title="Last page"
        onClick={() => onChange(totalPages)}
        disabled={page === totalPages}
        className={`${btnBase} disabled:opacity-30`}
        style={navStyle}>
        <ChevronsRight size={12} />
      </button>
    </div>
  );
}
