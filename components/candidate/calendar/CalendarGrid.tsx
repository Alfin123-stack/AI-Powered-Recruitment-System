"use client";

import { DAYS_ID } from "@/constants/calendar";
import CalendarGridCell from "./CalendarGridCell";
import type { Interview } from "@/types/calendar";

interface CalendarGridProps {
  year: number;
  month: number;
  cells: (number | null)[];
  todayKey: string;
  selectedDate: string | null;
  interviewMap: Map<string, Interview[]>;
  onSelectDate: (key: string) => void;
}

export default function CalendarGrid({
  year,
  month,
  cells,
  todayKey,
  selectedDate,
  interviewMap,
  onSelectDate,
}: CalendarGridProps) {
  return (
    <>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_ID.map((d) => (
          <div
            key={d}
            className="text-center text-[0.7rem] font-bold text-[#7a9585] py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-[4px]">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`e-${idx}`} />;

          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const ivs = interviewMap.get(key) ?? [];

          return (
            <CalendarGridCell
              key={key}
              day={day}
              dateKey={key}
              year={year}
              month={month}
              ivs={ivs}
              isSelected={key === selectedDate}
              isCurrentDay={key === todayKey}
              onSelect={(k) => onSelectDate(k === selectedDate ? null! : k)}
            />
          );
        })}
      </div>
    </>
  );
}
