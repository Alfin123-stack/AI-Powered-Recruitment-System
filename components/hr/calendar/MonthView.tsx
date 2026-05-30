// @/components/hr/calendar/MonthView.tsx
// Month view calendar grid — CSR
"use client";

import { useMemo } from "react";
import {
  type Interview,
  STATUS_CFG,
  sameDay,
  getMonthGrid,
  fmt12,
} from "./types";

export function MonthView({
  year,
  month,
  today,
  interviews,
  selectedDate,
  onSelectDate,
  onSelectInterview,
}: {
  year: number;
  month: number;
  today: Date;
  interviews: Interview[];
  selectedDate: Date | null;
  onSelectDate: (d: Date) => void;
  onSelectInterview: (iv: Interview) => void;
}) {
  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);

  const getForDay = (d: Date) =>
    interviews.filter((iv) => sameDay(new Date(iv.scheduled_at), d));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Day-of-week header */}
      <div
        className="grid grid-cols-7 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}
      >
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div
            key={d}
            className="py-2 text-center text-[10px] font-bold uppercase tracking-wider text-[#4d7060]"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div
        className="flex-1 grid grid-cols-7 overflow-hidden"
        style={{ gridAutoRows: "1fr" }}
      >
        {grid.map((date, i) => {
          if (!date)
            return (
              <div
                key={`e-${i}`}
                style={{
                  borderRight: "1px solid rgba(16,185,129,0.05)",
                  borderBottom: "1px solid rgba(16,185,129,0.05)",
                  background: "rgba(0,0,0,0.1)",
                }}
              />
            );

          const dayIvs = getForDay(date);
          const isToday = sameDay(date, today);
          const isSelected = !!(selectedDate && sameDay(date, selectedDate));

          return (
            <div
              key={date.toISOString()}
              onClick={() => onSelectDate(date)}
              className="flex flex-col p-2 cursor-pointer transition-all overflow-hidden"
              style={{
                borderRight: "1px solid rgba(16,185,129,0.06)",
                borderBottom: "1px solid rgba(16,185,129,0.06)",
                background: isSelected
                  ? "rgba(16,185,129,0.06)"
                  : isToday
                  ? "rgba(99,102,241,0.04)"
                  : "transparent",
                opacity: date.getMonth() !== month ? 0.35 : 1,
              }}
            >
              {/* Date number */}
              <div className="mb-1">
                <span
                  className={`text-[12px] font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isToday ? "bg-indigo-500 text-white" : "text-[#a8c5b2]"
                  }`}
                >
                  {date.getDate()}
                </span>
              </div>

              {/* Event pills */}
              <div className="flex flex-col gap-[2px] overflow-hidden">
                {dayIvs.slice(0, 3).map((iv) => {
                  const st = STATUS_CFG[iv.status] ?? STATUS_CFG.scheduled;
                  return (
                    <button
                      key={iv.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectInterview(iv);
                      }}
                      className="w-full text-left flex items-center gap-[4px] px-[5px] py-[3px] rounded-[5px] truncate hover:brightness-110 transition-all"
                      style={{
                        background: st.bg,
                        border: `1px solid ${st.border}`,
                      }}
                    >
                      <span
                        className="w-[4px] h-[4px] rounded-full flex-shrink-0"
                        style={{ background: st.dot }}
                      />
                      <span
                        className="text-[9.5px] font-semibold truncate"
                        style={{ color: st.color }}
                      >
                        {fmt12(new Date(iv.scheduled_at))}{" "}
                        {iv.candidate_name.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
                {dayIvs.length > 3 && (
                  <span className="text-[9px] text-[#4d7060] pl-1">
                    +{dayIvs.length - 3} lagi
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
