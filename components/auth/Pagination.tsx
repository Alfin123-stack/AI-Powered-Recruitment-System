"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** ID of the element to scroll to the top of on page change */
  scrollTargetId?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  scrollTargetId,
}: PaginationProps) {
  const handleChange = (page: number) => {
    onPageChange(page);
    if (scrollTargetId) {
      document
        .getElementById(scrollTargetId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(
      (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
    )
    .reduce<(number | "…")[]>((acc, p, idx, arr) => {
      if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1)
        acc.push("…");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-emerald-500/[0.08]">
      <span className="text-[#3a5545] text-[0.75rem]">
        Page <span className="text-emerald-400/70">{currentPage}</span> of{" "}
        <span className="text-emerald-400/70">{totalPages}</span>
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-[7px] rounded-[8px] border border-emerald-500/10 text-[#4a6b58] text-[0.78rem] hover:border-emerald-500/25 hover:text-emerald-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
          <ChevronLeft size={13} /> Previous
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) =>
            p === "…" ? (
              <span
                key={`ellipsis-${idx}`}
                className="text-[#2a4035] text-[0.75rem] px-1">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => handleChange(p as number)}
                className={`w-8 h-8 rounded-[7px] text-[0.78rem] font-medium transition-all border cursor-pointer
                  ${
                    currentPage === p
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "border-emerald-500/10 text-[#4a6b58] hover:border-emerald-500/20 hover:text-[#e8f0ec]"
                  }`}>
                {p}
              </button>
            ),
          )}
        </div>

        <button
          onClick={() => handleChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-[7px] rounded-[8px] border border-emerald-500/10 text-[#4a6b58] text-[0.78rem] hover:border-emerald-500/25 hover:text-emerald-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
          Next <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
