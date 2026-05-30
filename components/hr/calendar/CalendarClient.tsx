// @/components/hr/calendar/CalendarClient.tsx
// CSR orchestrator — mengelola seluruh state interaksi calendar
// Data interviews di-pass sebagai prop dari Server Component (SSR/ISR)
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Calendar,
  Search, SlidersHorizontal, RefreshCw, Plus,
} from "lucide-react";
import Link from "next/link";

import {
  type Interview,
  type ViewMode,
  MONTHS_EN,
  SCROLLBAR_STYLE,
  sameDay,
  getWeekDays,
} from "./types";
import { Avatar } from "./EventCard";
import { MiniCalendar } from "./MiniCalendar";
import { InterviewModal } from "./InterviewModal";
import { WeekView } from "./WeekView";
import { MonthView } from "./MonthView";
import { DayView } from "./DayView";

// ─── Scrollbar global style injector ─────────────────────────────────────────
function ScrollbarInject() {
  return <style>{SCROLLBAR_STYLE}</style>;
}

// ─── MAIN CLIENT COMPONENT ────────────────────────────────────────────────────
export function CalendarClient({
  interviews: initialInterviews,
}: {
  interviews: Interview[];
}) {
  const [interviews] = useState<Interview[]>(initialInterviews);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const today = useMemo(() => new Date(), []);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Filter interviews berdasarkan search query
  const filteredInterviews = useMemo(() => {
    if (!searchQuery.trim()) return interviews;
    const q = searchQuery.toLowerCase();
    return interviews.filter(
      (iv) =>
        iv.candidate_name.toLowerCase().includes(q) ||
        iv.job_title.toLowerCase().includes(q),
    );
  }, [interviews, searchQuery]);

  // Navigasi antar periode (prev/next)
  const navigate = (dir: -1 | 1) => {
    const d = new Date(currentDate);
    if (viewMode === "month") d.setMonth(d.getMonth() + dir);
    else if (viewMode === "week") d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  };

  const goToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Label header berdasarkan view
  const headerLabel = useMemo(() => {
    if (viewMode === "month") return `${MONTHS_EN[month]} ${year}`;
    if (viewMode === "week") {
      const days = getWeekDays(currentDate);
      return `${MONTHS_EN[days[0].getMonth()]} ${year}`;
    }
    return `${MONTHS_EN[month]} ${currentDate.getDate()}, ${year}`;
  }, [viewMode, currentDate, month, year]);

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

      <div
        className="flex h-[calc(100vh-80px)] rounded-[18px] overflow-hidden"
        style={{
          background: "#0d1810",
          border: "1px solid rgba(16,185,129,0.12)",
        }}
      >
        {/* ── LEFT SIDEBAR ────────────────────────────────────────────────── */}
        <div
          className="cal-scroll flex-shrink-0 flex flex-col overflow-y-auto overflow-x-hidden"
          style={{ width: 240, borderRight: "1px solid rgba(16,185,129,0.1)" }}
        >
          {/* Add schedule button */}
          <div className="px-4 pt-5 pb-4">
            <Link href="/dashboard/hr/interviews">
              <button
                className="w-full flex items-center justify-center gap-[6px] rounded-full font-semibold text-[12.5px] transition-all hover:brightness-110"
                style={{
                  padding: "9px 0",
                  background: "rgba(99,102,241,0.08)",
                  border: "1.5px solid rgba(99,102,241,0.25)",
                  color: "#a5b4fc",
                }}
              >
                <Plus size={14} /> Add Schedule
              </button>
            </Link>
          </div>

          {/* Mini calendar */}
          <div className="px-4 pb-4">
            <div
              className="rounded-[16px] p-4"
              style={{
                background: "#0f1612",
                border: "1px solid rgba(16,185,129,0.1)",
              }}
            >
              <MiniCalendar
                year={year}
                month={month}
                today={today}
                selectedDate={selectedDate}
                interviews={filteredInterviews}
                onSelectDate={(d) => {
                  setSelectedDate(d);
                  setCurrentDate(d);
                  if (viewMode === "month") setViewMode("day");
                }}
                onChangeMonth={(dir) => {
                  const d = new Date(currentDate);
                  d.setMonth(d.getMonth() + dir);
                  setCurrentDate(d);
                }}
              />
            </div>
          </div>

          {/* Bottom: avatar stack + refresh */}
          <div className="mt-auto px-4 pb-5 flex items-center justify-between">
            <div className="flex items-center">
              {interviews.slice(0, 3).map((iv, i) => (
                <div
                  key={i}
                  style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 3 - i }}
                >
                  <Avatar
                    name={iv.candidate_name}
                    src={iv.interviewer_avatar}
                    size={30}
                  />
                </div>
              ))}
              {interviews.length > 3 && (
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{
                    marginLeft: -8,
                    zIndex: 0,
                    background: "rgba(16,185,129,0.12)",
                    color: "#10b981",
                    border: "1px solid rgba(16,185,129,0.2)",
                  }}
                >
                  +{interviews.length - 3}
                </div>
              )}
            </div>
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-emerald-500/10 transition-colors"
              style={{
                border: "1px solid rgba(16,185,129,0.15)",
                color: "#4d7060",
              }}
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        {/* ── CENTER MAIN AREA ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Toolbar */}
          <div
            className="flex items-center gap-3 px-5 py-[14px] flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}
          >
            <h2 className="font-bold text-[17px] text-[#e8f0ec] whitespace-nowrap">
              {headerLabel}
            </h2>
            <button
              className="w-7 h-7 rounded-[7px] flex items-center justify-center hover:bg-emerald-500/10 transition-colors flex-shrink-0"
              style={{
                color: "#5a8070",
                border: "1px solid rgba(16,185,129,0.12)",
              }}
            >
              <Calendar size={13} />
            </button>

            {/* Prev / Today / Next */}
            <div className="flex items-center gap-[4px]">
              <button
                onClick={() => navigate(-1)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-emerald-500/10 transition-colors"
                style={{ color: "#5a8070" }}
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={goToday}
                className="px-3 py-[4px] rounded-full text-[11.5px] font-semibold transition-all hover:bg-emerald-500/10 whitespace-nowrap"
                style={{
                  color: "#a8c5b2",
                  border: "1px solid rgba(16,185,129,0.18)",
                }}
              >
                Today
              </button>
              <button
                onClick={() => navigate(1)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-emerald-500/10 transition-colors"
                style={{ color: "#5a8070" }}
              >
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="flex-1 min-w-0" />

            {/* Search */}
            <div
              className="flex items-center gap-2 px-3 py-[6px] rounded-full flex-shrink-0"
              style={{
                background: "#0f1612",
                border: "1px solid rgba(16,185,129,0.12)",
                minWidth: 150,
              }}
            >
              <Search size={11} className="text-[#4d7060] flex-shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-transparent text-[11px] text-[#a8c5b2] placeholder-[#3d5c49] outline-none w-full"
              />
            </div>

            {/* View mode toggle */}
            <div
              className="flex items-center rounded-full p-[3px] gap-[2px] flex-shrink-0"
              style={{
                background: "#0f1612",
                border: "1px solid rgba(16,185,129,0.12)",
              }}
            >
              {(["month", "week", "day"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className="px-3 py-[5px] rounded-full text-[11px] font-semibold transition-all capitalize"
                  style={{
                    background:
                      viewMode === mode
                        ? "rgba(99,102,241,0.2)"
                        : "transparent",
                    color: viewMode === mode ? "#a5b4fc" : "#5a8070",
                  }}
                >
                  {mode === "month" ? "Month" : mode === "week" ? "Week" : "Day"}
                </button>
              ))}
            </div>

            {/* Filter button */}
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-emerald-500/10 transition-colors flex-shrink-0"
              style={{
                color: "#5a8070",
                border: "1px solid rgba(16,185,129,0.12)",
              }}
            >
              <SlidersHorizontal size={13} />
            </button>
          </div>

          {/* Calendar body — animated view transitions */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <AnimatePresence mode="wait">
              {viewMode === "week" && (
                <motion.div
                  key="week"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <WeekView
                    currentDate={currentDate}
                    today={today}
                    interviews={filteredInterviews}
                    onSelectInterview={setSelectedInterview}
                  />
                </motion.div>
              )}

              {viewMode === "month" && (
                <motion.div
                  key="month"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <MonthView
                    year={year}
                    month={month}
                    today={today}
                    interviews={filteredInterviews}
                    selectedDate={selectedDate}
                    onSelectDate={(d) => {
                      setSelectedDate(d);
                      setSelectedInterview(null);
                    }}
                    onSelectInterview={setSelectedInterview}
                  />
                </motion.div>
              )}

              {viewMode === "day" && (
                <motion.div
                  key="day"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <DayView
                    currentDate={currentDate}
                    today={today}
                    interviews={filteredInterviews}
                    onSelectInterview={setSelectedInterview}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
