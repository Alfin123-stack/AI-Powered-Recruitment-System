// @/components/hr/calendar/CalendarMiniCalendar.tsx
// Mini calendar for sidebar — pure presentational, CSR
"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMonthGrid, sameDay } from "@/lib/helpers/hr/calendar";
import { Interview } from "@/types/calendar";
import { MONTHS_EN } from "@/constants/calendar";

export function MiniCalendar({
  year,
  month,
  today,
  selectedDate,
  interviews,
  onSelectDate,
  onChangeMonth,
}: {
  year: number;
  month: number;
  today: Date;
  selectedDate: Date | null;
  interviews: Interview[];
  onSelectDate: (d: Date) => void;
  onChangeMonth: (dir: -1 | 1) => void;
}) {
  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);

  const hasDot = (d: Date) =>
    interviews.some((iv) => sameDay(new Date(iv.scheduled_at), d));

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          title="Previous month"
          onClick={() => onChangeMonth(-1)}
          className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-emerald-500/10 transition-colors"
          style={{ color: "#5a8070" }}>
          <ChevronLeft size={13} />
        </button>
        <span className="text-[12.5px] font-bold text-[#a8c5b2]">
          {MONTHS_EN[month]} {year}
        </span>
        <button
          type="button"
          title="Next month"
          onClick={() => onChangeMonth(1)}
          className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-emerald-500/10 transition-colors"
          style={{ color: "#5a8070" }}>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 mb-1">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div
            key={d}
            className="text-center text-[9px] font-bold text-[#3d5c49]">
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-y-[2px]">
        {grid.map((date, i) =>
          !date ? (
            <div key={`e-${i}`} />
          ) : (
            <button
              key={date.toISOString()}
              onClick={() => onSelectDate(date)}
              className="relative flex flex-col items-center justify-center h-[26px] rounded-full transition-all"
              style={{
                background:
                  selectedDate && sameDay(date, selectedDate)
                    ? "#6366f1"
                    : sameDay(date, today)
                      ? "rgba(99,102,241,0.2)"
                      : "transparent",
              }}>
              <span
                className="text-[10px] font-semibold"
                style={{
                  color:
                    selectedDate && sameDay(date, selectedDate)
                      ? "#fff"
                      : sameDay(date, today)
                        ? "#6366f1"
                        : date.getMonth() !== month
                          ? "#2d4a38"
                          : "#7a9585",
                }}>
                {date.getDate()}
              </span>
              {hasDot(date) &&
                !(selectedDate && sameDay(date, selectedDate)) && (
                  <span className="absolute bottom-[2px] w-[3px] h-[3px] rounded-full bg-emerald-500" />
                )}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
