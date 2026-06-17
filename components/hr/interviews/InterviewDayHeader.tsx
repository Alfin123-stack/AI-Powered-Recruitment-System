"use client";

import { getDayHeaderLabel, isToday, isTomorrow } from "@/lib/helpers/hr/interviews";



export function InterviewDayHeader({ dateStr }: { dateStr: string }) {
  const { weekday, day } = getDayHeaderLabel(dateStr);
  const isT = isToday(dateStr);
  const isTo = isTomorrow(dateStr);

  return (
    <div className="flex items-stretch min-h-[1px]">
      <div className="w-[220px] shrink-0 p-4 flex items-start gap-[10px] border-b border-white/[0.05]">
        <div
          className={[
            "w-11 h-11 rounded-[12px] shrink-0 flex flex-col items-center justify-center",
            isT
              ? "bg-emerald-500 text-[#07100a]"
              : isTo
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25"
                : "bg-white/[0.03] text-[#7a9585] border border-white/[0.07]",
          ].join(" ")}>
          <span className="text-[0.5rem] font-bold tracking-[0.08em] leading-none mb-0.5">
            {weekday}
          </span>
          <span className="text-[1.05rem] font-extrabold leading-none">{day}</span>
        </div>

        {isT && (
          <span className="self-center text-[0.58rem] font-bold px-2 py-[3px] rounded-full bg-emerald-500/[0.08] text-emerald-400 border border-emerald-500/20">
            Today
          </span>
        )}
        {isTo && (
          <span className="self-center text-[0.58rem] font-bold px-2 py-[3px] rounded-full bg-cyan-500/[0.08] text-cyan-400 border border-cyan-500/20">
            Tomorrow
          </span>
        )}
      </div>
      <div className="flex-1 border-b border-white/[0.05]" />
    </div>
  );
}
