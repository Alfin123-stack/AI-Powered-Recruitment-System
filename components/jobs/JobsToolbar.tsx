// @/components/jobs/JobsToolbar.tsx
// Presentational toolbar: search input + filter pills
// Zero state — all controlled from parent via props

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FILTERS_JOB } from "@/constants/jobs";

interface JobsToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  filter: string;
  onFilterChange: (v: string) => void;
}

export function JobsToolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
}: JobsToolbarProps) {
  return (
    <section className="pt-7" id="jobs-section">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-4 flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search
              size={16}
              className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
            />
            <Input
              placeholder="Search position, company, or skill..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-[#141f19] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.45)] rounded-[10px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
            />
          </div>

          {/* Filter pills */}
          <div className="flex gap-[6px] flex-wrap">
            {FILTERS_JOB?.map((f) => (
              <button
                key={f}
                onClick={() => onFilterChange(f)}
                className={[
                  "px-[14px] py-2 rounded-[8px] border font-medium text-[0.78rem] cursor-pointer transition-all duration-200 whitespace-nowrap",
                  filter === f
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-transparent border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec]",
                ].join(" ")}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
