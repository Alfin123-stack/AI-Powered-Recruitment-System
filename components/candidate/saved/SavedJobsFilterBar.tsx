"use client";

import { FILTER_OPTIONS } from "@/constants/candidate/saved";
import { FilterValue, SortOption } from "@/types/candidate/saved";

type Props = {
  filter: FilterValue;
  setFilter: (v: FilterValue) => void;
  sortBy: SortOption;
  setSortBy: (v: SortOption) => void;
};

export default function SavedJobsFilterBar({
  filter,
  setFilter,
  sortBy,
  setSortBy,
}: Props) {
  return (
    <div className="flex items-center gap-3 mb-5 flex-wrap">
      <div className="flex gap-2 flex-wrap">
        {FILTER_OPTIONS.map(({ val, label }) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-3 py-[5px] rounded-[7px] border text-[0.75rem] font-medium cursor-pointer transition-all whitespace-nowrap
              ${
                filter === val
                  ? val === "expiring"
                    ? "bg-amber-500/10 border-amber-500/28 text-amber-400"
                    : val === "expired"
                      ? "bg-red-500/10 border-red-500/28 text-red-400"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-transparent border-emerald-500/12 text-[#7a9585] hover:text-[#e8f0ec] hover:border-emerald-500/25"
              }`}>
            {label}
          </button>
        ))}
      </div>

      <div className="ml-auto">
        <select
          title="Sortir berdasarkan"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="bg-[#0a0f0c] border border-emerald-500/15 text-[#7a9585] text-[0.76rem] rounded-[8px] px-3 py-[6px] cursor-pointer focus:outline-none focus:border-emerald-500/30 transition-all">
          <option value="saved_at">Terbaru Disimpan</option>
          <option value="deadline">Deadline Terdekat</option>
          <option value="matching_score">Highest Match</option>
          <option value="title">Nama A–Z</option>
        </select>
      </div>
    </div>
  );
}
