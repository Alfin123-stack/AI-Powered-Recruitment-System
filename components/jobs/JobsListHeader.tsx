// @/components/jobs/JobsListHeader.tsx
// Header row above the grid: result count + sort label

import { SlidersHorizontal } from "lucide-react";

interface JobsListHeaderProps {
  count: number;
  search: string;
}

export function JobsListHeader({ count, search }: JobsListHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-5">
      <p className="text-[0.82rem] text-[#7a9585]">
        Showing{" "}
        <strong className="text-[#e8f0ec]">{count}</strong>{" "}
        {count === 1 ? "opening" : "openings"}{search && ` for "${search}"`}
      </p>
      <span className="flex items-center gap-[6px] text-[#7a9585] text-[0.78rem]">
        <SlidersHorizontal size={13} />
        Sort: Newest
      </span>
    </div>
  );
}
