// @/components/hr/calendar/CalendarWeekView.tsx
// Week view calendar grid — CSR, displays interviews per day of the week
"use client";

import { useMemo, useRef, useEffect } from "react";

import { EventCard } from "./CalendarEventCard";
import { Interview } from "@/types/calendar";
import { getWeekDays, sameDay } from "@/lib/helpers/hr/calendar";
import { CELL_H, DAYS_SHORT, VISIBLE_HOURS } from "@/constants/calendar";

export function WeekView({
  currentDate,
  today,
  interviews,
  onSelectInterview,
}: {
  currentDate: Date;
  today: Date;
  interviews: Interview[];
  onSelectInterview: (iv: Interview) => void;
}) {
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  const getForDay = (d: Date) =>
    interviews.filter((iv) => sameDay(new Date(iv.scheduled_at), d));

  const getCardStyle = (iv: Interview) => {
    const d = new Date(iv.scheduled_at);
    return {
      top: Math.max(0, d.getHours() - 8 + d.getMinutes() / 60) * CELL_H,
      heightPx: Math.max(((iv.duration_minutes ?? 60) / 60) * CELL_H, 36),
    };
  };

  const now = new Date();
  const nowTop = (now.getHours() - 8 + now.getMinutes() / 60) * CELL_H;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Day header row */}
      <div
        className="flex flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}>
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: 72,
            borderRight: "1px solid rgba(16,185,129,0.08)",
          }}>
          <span
            className="text-[8.5px] font-bold tracking-widest text-[#3d5c49]"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              letterSpacing: "0.15em",
            }}>
            GMT+7
          </span>
        </div>
        {weekDays.map((d) => {
          const isToday = sameDay(d, today);
          return (
            <div
              key={d.toISOString()}
              className="flex-1 flex flex-col items-center justify-center py-[10px] gap-[4px]"
              style={{ borderRight: "1px solid rgba(16,185,129,0.06)" }}>
              <span className="text-[10px] font-semibold text-[#5a8070]">
                {DAYS_SHORT[d.getDay()]}
              </span>
              <div
                className="flex items-center justify-center rounded-[10px] transition-all"
                style={{
                  width: 40,
                  height: 40,
                  background: isToday ? "#6366f1" : "rgba(16,185,129,0.06)",
                  border: isToday ? "none" : "1px solid rgba(16,185,129,0.12)",
                }}>
                <span
                  className="text-[20px] font-extrabold leading-none"
                  style={{ color: isToday ? "#fff" : "#a8c5b2" }}>
                  {d.getDate()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrollable time grid */}
      <div
        ref={scrollRef}
        className="cal-scroll flex-1 overflow-y-auto overflow-x-hidden">
        <div
          className="flex"
          style={{ minHeight: VISIBLE_HOURS.length * CELL_H }}>
          {/* Hour labels */}
          <div
            className="flex-shrink-0"
            style={{
              width: 72,
              borderRight: "1px solid rgba(16,185,129,0.08)",
            }}>
            {VISIBLE_HOURS.map((h) => (
              <div
                key={h}
                className="flex items-start justify-end pr-3 pt-[6px]"
                style={{ height: CELL_H }}>
                <span className="text-[10px] text-[#4d7060] font-medium whitespace-nowrap">
                  {h === 12
                    ? "12:00 PM"
                    : h < 12
                      ? `${String(h).padStart(2, "0")}:00 AM`
                      : `${String(h - 12).padStart(2, "0")}:00 PM`}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((d) => {
            const dayIvs = getForDay(d);
            const isToday = sameDay(d, today);
            return (
              <div
                key={d.toISOString()}
                className="flex-1 relative min-w-0"
                style={{
                  borderRight: "1px solid rgba(16,185,129,0.06)",
                  background: isToday
                    ? "rgba(99,102,241,0.018)"
                    : "transparent",
                }}>
                {/* Hour lines */}
                {VISIBLE_HOURS.map((h) => (
                  <div
                    key={h}
                    className="absolute w-full"
                    style={{
                      top: (h - 8) * CELL_H,
                      height: CELL_H,
                      borderBottom: "1px solid rgba(16,185,129,0.06)",
                    }}
                  />
                ))}

                {/* Now indicator */}
                {isToday &&
                  nowTop >= 0 &&
                  nowTop <= VISIBLE_HOURS.length * CELL_H && (
                    <div
                      className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
                      style={{ top: nowTop }}>
                      <div
                        className="w-[8px] h-[8px] rounded-full bg-indigo-400 -ml-1 flex-shrink-0"
                        style={{ boxShadow: "0 0 6px #6366f1" }}
                      />
                      <div
                        className="flex-1 h-[1.5px]"
                        style={{ background: "rgba(99,102,241,0.5)" }}
                      />
                    </div>
                  )}

                {/* Event cards */}
                {dayIvs.map((iv) => {
                  const { top, heightPx } = getCardStyle(iv);
                  if (top + heightPx < 0 || top > VISIBLE_HOURS.length * CELL_H)
                    return null;
                  return (
                    <div
                      key={iv.id}
                      className="absolute left-0 right-0 z-10"
                      style={{ top }}>
                      <EventCard
                        interview={iv}
                        heightPx={heightPx}
                        onClick={() => onSelectInterview(iv)}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
