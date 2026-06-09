"use client";

// Wajib client karena menerima onChange / onClick handler dari parent.

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type FilterValue = "all" | "unapplied" | "high";

type MatchesToolbarProps = {
  search: string;
  onSearchChange: (v: string) => void;
  filter: FilterValue;
  onFilterChange: (v: FilterValue) => void;
  resultCount: number;
};

const FILTERS: { val: FilterValue; label: string }[] = [
  { val: "unapplied", label: "Belum Dilamar" },
  { val: "high", label: "Match ≥60%" },
  { val: "all", label: "Semua" },
];

export default function MatchesToolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  resultCount,
}: MatchesToolbarProps) {
  return (
    <div className="flex gap-3 mb-5 flex-wrap items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search
          size={13}
          className="absolute left-[11px] top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari posisi atau perusahaan..."
          className="pl-[34px] h-[38px] bg-[#0f1612] border-white/[0.07] text-[#e8f0ec] text-[0.8rem] placeholder:text-white/20 rounded-[9px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30"
        />
      </div>

      {/* Filter pills */}
      <div className="flex gap-2">
        {FILTERS.map(({ val, label }) => (
          <button
            key={val}
            onClick={() => onFilterChange(val)}
            className={`px-3 py-[7px] rounded-[8px] border text-[0.75rem] font-medium cursor-pointer transition-all whitespace-nowrap
              ${filter === val
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                : "bg-transparent border-white/[0.07] text-white/35 hover:border-white/[0.14] hover:text-white/70"
              }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Count */}
      <span className="text-[0.7rem] text-white/25 ml-auto whitespace-nowrap">
        {resultCount} lowongan
      </span>
    </div>
  );
}
