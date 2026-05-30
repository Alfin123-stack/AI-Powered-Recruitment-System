// @/components/hr/calendar/DayView.tsx
// Day view calendar grid — CSR
"use client";

import { useMemo, useRef, useEffect } from "react";
import {
  type Interview,
  VISIBLE_HOURS,
  CELL_H,
  sameDay,
} from "./types";
import { EventCard } from "./EventCard";

export function DayView({
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
  const dayIvs = useMemo(
    () =>
      interviews.filter((iv) =>
        sameDay(new Date(iv.scheduled_at), currentDate),
      ),
    [interviews, currentDate],
  );

  const isToday = sameDay(currentDate, today);
  const now = new Date();
  const nowTop = (now.getHours() - 8 + now.getMinutes() / 60) * CELL_H;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  const getCardStyle = (iv: Interview) => {
    const d = new Date(iv.scheduled_at);
    return {
      top: Math.max(0, d.getHours() - 8 + d.getMinutes() / 60) * CELL_H,
      heightPx: Math.max(((iv.duration_minutes ?? 60) / 60) * CELL_H, 36),
    };
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div
        ref={scrollRef}
        className="cal-scroll flex-1 overflow-y-auto overflow-x-hidden"
      >
        <div
          className="flex"
          style={{ minHeight: VISIBLE_HOURS.length * CELL_H }}
        >
          {/* Hour labels */}
          <div
            className="flex-shrink-0"
            style={{
              width: 72,
              borderRight: "1px solid rgba(16,185,129,0.08)",
            }}
          >
            {VISIBLE_HOURS.map((h) => (
              <div
                key={h}
                className="flex items-start justify-end pr-3 pt-[6px]"
                style={{ height: CELL_H }}
              >
                <span className="text-[10px] text-[#4d7060] font-medium whitespace-nowrap">
                  {h < 12
                    ? `${String(h).padStart(2, "0")}:00 AM`
                    : h === 12
                    ? "12:00 PM"
                    : `${String(h - 12).padStart(2, "0")}:00 PM`}
                </span>
              </div>
            ))}
          </div>

          {/* Single day column */}
          <div
            className="flex-1 relative min-w-0"
            style={{
              background: isToday
                ? "rgba(99,102,241,0.018)"
                : "transparent",
            }}
          >
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
            {isToday && nowTop >= 0 && (
              <div
                className="absolute left-0 right-0 z-20 flex items-center"
                style={{ top: nowTop }}
              >
                <div className="w-2 h-2 rounded-full bg-indigo-400 -ml-1 flex-shrink-0" />
                <div
                  className="flex-1 h-[1.5px]"
                  style={{ background: "rgba(99,102,241,0.5)" }}
                />
              </div>
            )}

            {/* Event cards */}
            {dayIvs.map((iv) => {
              const { top, heightPx } = getCardStyle(iv);
              return (
                <div
                  key={iv.id}
                  className="absolute left-0 right-0 z-10"
                  style={{ top }}
                >
                  <EventCard
                    interview={iv}
                    heightPx={heightPx}
                    onClick={() => onSelectInterview(iv)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
