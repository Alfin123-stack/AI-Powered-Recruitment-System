"use client";

import { MONTHS_ID } from "@/constants/candidate/calendar";
import type { Interview } from "@/types/calendar";

interface CalendarGridCellProps {
  day: number;
  dateKey: string;
  year: number;
  month: number;
  ivs: Interview[];
  isSelected: boolean;
  isCurrentDay: boolean;
  onSelect: (key: string) => void;
}

export default function CalendarGridCell({
  day,
  dateKey,
  year,
  month,
  ivs,
  isSelected,
  isCurrentDay,
  onSelect,
}: CalendarGridCellProps) {
  const hasIv = ivs.length > 0;
  const hasScheduled = ivs.some((iv) => iv.status === "scheduled");
  const hasDone = ivs.some((iv) => iv.status === "done");
  const hasCancelled = ivs.some((iv) => iv.status === "cancelled");

  return (
    <button
      title={`${day} ${MONTHS_ID[month]} ${year}${hasIv ? ` — ${ivs.length} interview` : ""}`}
      onClick={() => onSelect(dateKey)}
      className={`relative flex flex-col items-center justify-start pt-2 pb-[18px] rounded-[10px] min-h-[56px]
        text-[0.82rem] font-medium transition-all cursor-pointer border-0
        ${
          isSelected
            ? "bg-emerald-500 text-black font-bold"
            : isCurrentDay
              ? "bg-emerald-500/12 text-emerald-400 ring-1 ring-emerald-500/35"
              : hasIv
                ? "bg-cyan-500/[0.06] text-[#e8f0ec] hover:bg-cyan-500/12 border border-cyan-500/15"
                : "bg-transparent text-[#7a9585] hover:bg-white/[0.04] hover:text-[#c8d8d0]"
        }`}>
      {day}
      {hasIv && !isSelected && (
        <div className="absolute bottom-[6px] flex gap-[3px]">
          {hasScheduled && (
            <div className="w-[5px] h-[5px] rounded-full bg-cyan-400" />
          )}
          {hasDone && (
            <div className="w-[5px] h-[5px] rounded-full bg-emerald-400" />
          )}
          {hasCancelled && (
            <div className="w-[5px] h-[5px] rounded-full bg-red-400/60" />
          )}
        </div>
      )}
      {hasIv && ivs.length > 1 && !isSelected && (
        <div className="absolute top-[4px] right-[5px] w-[14px] h-[14px] rounded-full bg-cyan-500/20 text-cyan-400 text-[0.55rem] font-black flex items-center justify-center">
          {ivs.length}
        </div>
      )}
    </button>
  );
}
