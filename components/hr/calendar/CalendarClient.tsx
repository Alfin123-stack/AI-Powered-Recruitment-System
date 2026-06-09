"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useCalendarState } from "@/hooks/dashboard/hr/useCalendarState";
import { useInterviewFilter } from "@/hooks/dashboard/hr/useInterviewFilter";
import { navigateDate, getHeaderLabel } from "@/lib/helpers/navigation";
import { InterviewModal } from "./CalendarInterviewModal";
import { ScrollbarInject } from "./CalendarScrollbarInject";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarSidebar } from "./CalendarSidebar";
import { CalendarToolbar } from "./CalendarToolbar";
import { CalendarBody } from "./CalendarBody";
import { Interview } from "@/types/calendar";

export function CalendarClient({
  interviews: initialInterviews,
}: {
  interviews: Interview[];
}) {
  // ── Centralized state via hook ───────────────────────────────────────────────
  const {
    interviews,
    viewMode,
    setViewMode,
    currentDate,
    setCurrentDate,
    selectedDate,
    setSelectedDate,
    selectedInterview,
    setSelectedInterview,
    searchQuery,
    setSearchQuery,
    today,
    year,
    month,
  } = useCalendarState(initialInterviews);

  // ── Filter interviews ─────────────────────────────────────────────────────
  const filteredInterviews = useInterviewFilter(interviews, searchQuery);

  // ── Navigation ──────────────────────────────────────────────────────────────
  const navigate = (dir: -1 | 1) => {
    setCurrentDate(navigateDate(currentDate, viewMode, dir));
  };

  const goToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // ── Header label ─────────────────────────────────────────────────────────
  const headerLabel = useMemo(
    () => getHeaderLabel(currentDate, viewMode),
    [currentDate, viewMode],
  );

  // ── Handler: select date from sidebar ──────────────────────────────────────
  const handleSidebarSelectDate = (d: Date) => {
    setSelectedDate(d);
    setCurrentDate(d);
    if (viewMode === "month") setViewMode("day");
  };

  // ── Handler: select date from month view ────────────────────────────────────
  const handleBodySelectDate = (d: Date) => {
    setSelectedDate(d);
    setSelectedInterview(null);
  };

  return (
    <>
      <ScrollbarInject />

      {/* Modal overlay */}
      <AnimatePresence>
        {selectedInterview && (
          <InterviewModal
            interview={selectedInterview}
            onClose={() => setSelectedInterview(null)}
          />
        )}
      </AnimatePresence>

      {/* Page header */}
      <CalendarHeader totalInterviews={interviews.length} />

      {/* Main calendar card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-[calc(100vh-148px)] rounded-[18px] overflow-hidden relative bg-[#0b1410] border border-emerald-500/[0.13]">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[18px] pointer-events-none z-10 bg-gradient-to-r from-emerald-500 via-cyan-400/60 to-transparent" />

        {/* Left sidebar */}
        <CalendarSidebar
          year={year}
          month={month}
          today={today}
          selectedDate={selectedDate}
          currentDate={currentDate}
          interviews={filteredInterviews}
          viewMode={viewMode}
          onSelectDate={handleSidebarSelectDate}
          onChangeMonth={(dir) => {
            const d = new Date(currentDate);
            d.setMonth(d.getMonth() + dir);
            setCurrentDate(d);
          }}
        />

        {/* Center main area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <CalendarToolbar
            headerLabel={headerLabel}
            viewMode={viewMode}
            searchQuery={searchQuery}
            onNavigate={navigate}
            onGoToday={goToday}
            onChangeView={setViewMode}
            onSearchChange={setSearchQuery}
          />

          <CalendarBody
            viewMode={viewMode}
            currentDate={currentDate}
            today={today}
            year={year}
            month={month}
            interviews={filteredInterviews}
            selectedDate={selectedDate}
            onSelectDate={handleBodySelectDate}
            onSelectInterview={setSelectedInterview}
          />
        </div>
      </motion.div>
    </>
  );
}
