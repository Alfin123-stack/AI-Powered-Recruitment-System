"use client";

import { Calendar, CalendarDays, ChevronRight } from "lucide-react";

import type { Interview } from "@/types/calendar";
import { formatTime, getDayLabel, isToday } from "@/lib/utils";

interface CalendarUpcomingProps {
  upcomingInterviews: Interview[];
  onGoToDate: (scheduledAt: string) => void;
}

export default function CalendarUpcoming({
  upcomingInterviews,
  onGoToDate,
}: CalendarUpcomingProps) {
  return (
    <div className="bg-[#070d0a] border border-emerald-500/12 rounded-[16px] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.04] flex items-center gap-2">
        <CalendarDays size={13} className="text-emerald-400" />
        <span className="font-bold text-[0.84rem]">Akan Datang</span>
      </div>
      <div className="p-3">
        {upcomingInterviews.length === 0 ? (
          <div className="text-center py-6 text-[0.75rem] text-[#7a9585]">
            Tidak ada interview mendatang.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {upcomingInterviews.map((iv) => (
              <button
                key={iv.id}
                title={`Lihat interview: ${iv.job_title ?? "Interview"} — ${getDayLabel(iv.scheduled_at)}, ${formatTime(iv.scheduled_at)}`}
                onClick={() => onGoToDate(iv.scheduled_at)}
                className="flex items-center gap-3 w-full text-left p-2 rounded-[10px] hover:bg-white/[0.03] transition-colors cursor-pointer border-0 bg-transparent">
                <div
                  className={`w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0
                    ${isToday(iv.scheduled_at) ? "bg-amber-500/12 text-amber-400" : "bg-cyan-500/10 text-cyan-400"}`}>
                  <Calendar size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.78rem] font-semibold text-[#e8f0ec] truncate">
                    {iv.job_title}
                  </div>
                  <div className="text-[0.68rem] text-[#7a9585]">
                    {getDayLabel(iv.scheduled_at)} ·{" "}
                    {formatTime(iv.scheduled_at)}
                  </div>
                </div>
                <ChevronRight
                  size={12}
                  className="text-[#7a9585] flex-shrink-0"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
