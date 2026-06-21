"use client";

// Must be client because it receives event handlers (onChange, onClick)
// which cannot be passed from server to client as props.

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LOCATION_FILTERS } from "@/constants/main/blogs";

type CompanyToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  resultCount: number;
};

export default function CompanyToolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  resultCount,
}: CompanyToolbarProps) {
  return (
    <section className="pt-5">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="bg-[#0f1612] border border-white/[0.07] rounded-[13px] p-[14px] flex items-center gap-[10px] flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search
              size={14}
              className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#4a6456] pointer-events-none"
            />
            <Input
              placeholder="Search by company name, industry, or tag..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-[36px] bg-[#141f19] border-white/[0.07] text-[#e8f0ec] text-[0.78rem] placeholder:text-[#3a5444] rounded-[8px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30"
            />
          </div>

          {/* Filter pills */}
          <div className="flex gap-[5px] flex-wrap">
            {LOCATION_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => onFilterChange(f)}
                className={`px-[12px] py-[6px] rounded-[7px] border text-[0.72rem] font-medium cursor-pointer transition-all whitespace-nowrap ${
                  filter === f
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                    : "bg-transparent border-white/[0.07] text-[#5d7a6a] hover:border-white/[0.13] hover:text-[#e8f0ec]"
                }`}>
                {f}
              </button>
            ))}
          </div>

          {/* Result count */}
          <span className="flex items-center gap-[5px] text-[#4a6456] text-[0.72rem] ml-auto">
            <SlidersHorizontal size={12} />
            {resultCount} companies
          </span>
        </div>
      </div>
    </section>
  );
}
