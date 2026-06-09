"use client";

import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import CalendarLegend from "./CalendarLegend";
import CalendarSelectedPanel from "./CalendarSelectedPanel";
import CalendarUpcoming from "./CalendarUpcoming";
import CalendarStats from "./CalendarStats";
import { useCalendar } from "@/hooks/dashboard/candidate/useCalendar";
import type { Interview } from "@/types/calendar";

interface FullCalendarProps {
  interviews: Interview[];
}

export default function FullCalendar({ interviews }: FullCalendarProps) {
  const {
    year,
    month,
    selectedDate,
    setSelectedDate,
    todayKey,
    cells,
    interviewMap,
    selectedIvs,
    monthInterviewCount,
    upcomingInterviews,
    prevMonth,
    nextMonth,
    goToToday,
    goToDate,
  } = useCalendar(interviews);

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 340px" }}>
      {/* ── Left: Calendar grid ────────────────────────────────────────────── */}
      <div className="bg-[#070d0a] border border-emerald-500/12 rounded-[20px] overflow-hidden">
        <CalendarHeader
          year={year}
          month={month}
          monthInterviewCount={monthInterviewCount}
          onPrev={prevMonth}
          onNext={nextMonth}
          onToday={goToToday}
        />
        <div className="p-5">
          <CalendarGrid
            year={year}
            month={month}
            cells={cells}
            todayKey={todayKey}
            selectedDate={selectedDate}
            interviewMap={interviewMap}
            onSelectDate={(key) =>
              setSelectedDate(key === selectedDate ? null : key)
            }
          />
          <CalendarLegend />
        </div>
      </div>

      {/* ── Right: Detail + upcoming ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <CalendarSelectedPanel
          selectedDate={selectedDate}
          selectedIvs={selectedIvs}
          onClose={() => setSelectedDate(null)}
        />
        <CalendarUpcoming
          upcomingInterviews={upcomingInterviews}
          onGoToDate={goToDate}
        />
        <CalendarStats interviews={interviews} />
      </div>
    </div>
  );
}
