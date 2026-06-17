import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Activity,
} from "lucide-react";

import { type ViewMode } from "@/types/calendar";
import { VIEW_MODES } from "@/constants/calendar";

interface CalendarToolbarProps {
  headerLabel: string;
  viewMode: ViewMode;
  searchQuery: string;
  onNavigate: (dir: -1 | 1) => void;
  onGoToday: () => void;
  onChangeView: (mode: ViewMode) => void;
  onSearchChange: (query: string) => void;
}

export function CalendarToolbar({
  headerLabel,
  viewMode,
  searchQuery,
  onNavigate,
  onGoToday,
  onChangeView,
  onSearchChange,
}: CalendarToolbarProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-[13px] flex-shrink-0 border-b border-emerald-500/10 bg-emerald-500/[0.015]">
      {/* Header label */}
      <h2 className="font-black text-[17px] whitespace-nowrap tracking-tight text-[#e8f5ee]">
        {headerLabel}
      </h2>

      {/* Activity icon button */}
      <button
        type="button"
        title="Change view mode"
        className="w-7 h-7 rounded-[7px] flex items-center justify-center transition-colors flex-shrink-0 text-[#7a9585] bg-emerald-500/[0.06] border border-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/[0.28] cursor-pointer">
        <Activity size={12} />
      </button>

      {/* Prev / Today / Next */}
      <div className="flex items-center gap-[3px]">
        <button
          type="button"
          title="Previous period"
          onClick={() => onNavigate(-1)}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors text-[#7a9585] hover:bg-emerald-500/[0.08] hover:text-emerald-500 cursor-pointer">
          <ChevronLeft size={15} />
        </button>
        <button
          type="button"
          title="Go to today"
          onClick={onGoToday}
          className="px-3 py-[4px] rounded-full text-[11.5px] font-semibold transition-all whitespace-nowrap text-[#7a9585] border border-emerald-500/10 bg-transparent hover:bg-emerald-500/[0.08] hover:text-emerald-500 hover:border-emerald-500/[0.28] cursor-pointer">
          Today
        </button>
        <button
          type="button"
          title="Next period"
          onClick={() => onNavigate(1)}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors text-[#7a9585] hover:bg-emerald-500/[0.08] hover:text-emerald-500 cursor-pointer">
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="flex-1 min-w-0" />

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-[6px] rounded-full flex-shrink-0 bg-[#0f1612] border border-emerald-500/10 min-w-[150px]">
        <Search
          size={11}
          className="text-[rgba(122,149,133,0.55)] flex-shrink-0"
        />
        <input
          type="search"
          title="Search candidate or position"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-transparent outline-none w-full text-[11px] text-[#7a9585] placeholder:text-[rgba(122,149,133,0.55)]"
        />
      </div>

      {/* View mode toggle */}
      <div className="flex items-center rounded-[12px] p-[3px] gap-[2px] flex-shrink-0 bg-white/[0.03] border border-white/[0.06]">
        {VIEW_MODES.map(({ key, label }) => {
          const isActive = viewMode === key;
          return (
            <button
              key={key}
              type="button"
              title={`Tampilan ${key}`}
              onClick={() => onChangeView(key)}
              className={[
                "px-3 py-[5px] rounded-[9px] text-[11px] font-semibold transition-all capitalize cursor-pointer",
                isActive
                  ? "bg-emerald-500/[0.18] text-emerald-500 border border-emerald-500/30"
                  : "bg-transparent text-[#7a9585] border border-transparent",
              ].join(" ")}>
              {label}
            </button>
          );
        })}
      </div>

      {/* Filter button */}
      <button
        type="button"
        title="Filter interviews"
        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 text-[#7a9585] border border-emerald-500/10 bg-transparent hover:bg-emerald-500/[0.08] hover:text-emerald-500 hover:border-emerald-500/[0.28] cursor-pointer">
        <SlidersHorizontal size={13} />
      </button>
    </div>
  );
}
