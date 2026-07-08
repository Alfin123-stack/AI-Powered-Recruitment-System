"use client";

import { Search, X, ChevronDown } from "lucide-react";
import type { SortKey, DateFilter } from "@/types/candidates";

interface CandidatesHeaderBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  sortKey: SortKey;
  onSortChange: (k: SortKey) => void;
  dateFilter: DateFilter;
  onDateFilterChange: (d: DateFilter) => void;
}

export function CandidatesHeaderBar({
  search,
  onSearchChange,
  sortKey,
  onSortChange,
  dateFilter,
  onDateFilterChange,
}: CandidatesHeaderBarProps) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-6 py-3 bg-[#0f1612]"
      style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}>
      <h2 className="font-bold text-[#e8f0ec] text-[15px]">Candidates</h2>
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search
            size={13}
            className="absolute left-[10px] top-1/2 -translate-y-1/2 pointer-events-none text-[#7a9585]"
          />
          <input
            type="search"
            title="Search candidates by name or position"
            aria-label="Search candidates"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, role"
            className="pl-8 pr-3 py-[7px] w-[200px] rounded-[9px] text-[13px] outline-none text-[#e8f0ec] bg-[#141f19] border border-[rgba(16,185,129,0.15)] focus:border-[rgba(16,185,129,0.4)] transition-colors"
          />
          {search && (
            <button
              type="button"
              title="Clear search"
              aria-label="Clear search"
              onClick={() => onSearchChange("")}
              className="absolute right-[8px] top-1/2 -translate-y-1/2 text-[#7a9585] hover:text-[#e8f0ec] transition-colors">
              <X size={11} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            title="Sort candidates by column"
            aria-label="Candidate sort options"
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="pl-3 pr-8 py-[7px] rounded-[9px] text-[12px] outline-none cursor-pointer appearance-none font-semibold text-[#7a9585] bg-[#141f19] border border-[rgba(16,185,129,0.15)]">
            <option value="name">Sort by A–Z</option>
            <option value="score">Sort by AI Score</option>
            <option value="match">Sort by Match</option>
            <option value="applied_role">Sort by Role</option>
            <option value="date">Sort by Applied Date</option>
          </select>
          <ChevronDown
            size={12}
            className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none text-[#7a9585]"
          />
        </div>

        {/* Date filter */}
        <div className="relative">
          <select
            title="Filter candidates by date range"
            aria-label="Date range filter"
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value as DateFilter)}
            className="pl-3 pr-8 py-[7px] rounded-[9px] text-[12px] outline-none cursor-pointer appearance-none font-semibold text-[#7a9585] bg-[#141f19] border border-[rgba(16,185,129,0.15)]">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>All time</option>
          </select>
          <ChevronDown
            size={12}
            className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none text-[#7a9585]"
          />
        </div>
      </div>
    </div>
  );
}