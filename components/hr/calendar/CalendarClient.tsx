// @/components/hr/calendar/CalendarClient.tsx
// CSR orchestrator — mengelola seluruh state interaksi calendar
// Data interviews di-pass sebagai prop dari Server Component (SSR/ISR)
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Search,
  SlidersHorizontal,
  RefreshCw,
  Plus,
  Activity,
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
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const today = useMemo(() => new Date(), []);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Filter interviews berdasarkan search query
  const filteredInterviews = useMemo<Interview[]>(() => {
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
  const headerLabel = useMemo<string>(() => {
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

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-[9px] flex items-center justify-center bg-emerald-500/15 text-emerald-500">
            <Calendar size={15} />
          </div>
          <h1 className="text-[1.35rem] font-black tracking-tight text-[#e8f5ee]">
            Calendar
          </h1>
        </div>
        <p className="text-[0.75rem] ml-11 text-[#7a9585]">
          Jadwal interview — {interviews.length} jadwal terdaftar
        </p>
      </div>

      {/* ── Main calendar card ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-[calc(100vh-148px)] rounded-[18px] overflow-hidden relative bg-[#0b1410] border border-emerald-500/[0.13]">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[18px] pointer-events-none z-10 bg-gradient-to-r from-emerald-500 via-cyan-400/60 to-transparent" />

        {/* ── LEFT SIDEBAR ──────────────────────────────────────────────── */}
        <div
          className="cal-scroll flex-shrink-0 flex flex-col overflow-y-auto overflow-x-hidden border-r border-emerald-500/10"
          style={{ width: 240 }}>
          {/* Add schedule button */}
          <div className="px-4 pt-6 pb-4">
            <Link href="/dashboard/hr/interviews">
              <motion.button
                whileHover={{ y: -1, transition: { duration: 0.15 } }}
                type="button"
                title="Tambah jadwal interview"
                className="w-full flex items-center justify-center gap-[6px] rounded-[11px] font-semibold text-[12.5px] transition-all py-[9px] bg-emerald-500/10 border border-emerald-500/[0.28] text-emerald-500 hover:bg-emerald-500/20 cursor-pointer">
                <Plus size={14} />
                Add Schedule
              </motion.button>
            </Link>
          </div>

          {/* Mini calendar */}
          <div className="px-4 pb-4">
            <div className="rounded-[16px] p-4 bg-[#0f1612] border border-emerald-500/10">
              <MiniCalendar
                year={year}
                month={month}
                today={today}
                selectedDate={selectedDate}
                interviews={filteredInterviews}
                onSelectDate={(d: Date) => {
                  setSelectedDate(d);
                  setCurrentDate(d);
                  if (viewMode === "month") setViewMode("day");
                }}
                onChangeMonth={(dir: -1 | 1) => {
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
                  key={iv.candidate_name + i}
                  style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 3 - i }}>
                  <Avatar
                    name={iv.candidate_name}
                    src={iv.interviewer_avatar}
                    size={30}
                  />
                </div>
              ))}
              {interviews.length > 3 && (
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[9px] font-bold bg-emerald-500/[0.12] text-emerald-500 border border-emerald-500/[0.22]"
                  style={{ marginLeft: -8, zIndex: 0 }}>
                  +{interviews.length - 3}
                </div>
              )}
            </div>
            <button
              title="Refresh interviews"
              type="button"
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors border border-emerald-500/10 text-[#7a9585] bg-transparent hover:bg-emerald-500/[0.08] hover:text-emerald-500 cursor-pointer">
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        {/* ── CENTER MAIN AREA ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-3 px-5 py-[13px] flex-shrink-0 border-b border-emerald-500/10 bg-emerald-500/[0.015]">
            {/* Header label */}
            <h2 className="font-black text-[17px] whitespace-nowrap tracking-tight text-[#e8f5ee]">
              {headerLabel}
            </h2>

            {/* Activity icon button */}
            <button
              type="button"
              title="Change view mode"
              className="w-7 h-7 rounded-[7px] flex items-center justify-center transition-colors flex-shrink-0 text-[#7a9585] bg-emerald-500/[0.06] border border-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/[0.28] cursor-pointer">
              <Activity size={12} />
            </button>

            {/* Prev / Today / Next */}
            <div className="flex items-center gap-[3px]">
              <button
                type="button"
                title="Periode sebelumnya"
                onClick={() => navigate(-1)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors text-[#7a9585] hover:bg-emerald-500/[0.08] hover:text-emerald-500 cursor-pointer">
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                title="Kembali ke hari ini"
                onClick={goToday}
                className="px-3 py-[4px] rounded-full text-[11.5px] font-semibold transition-all whitespace-nowrap text-[#7a9585] border border-emerald-500/10 bg-transparent hover:bg-emerald-500/[0.08] hover:text-emerald-500 hover:border-emerald-500/[0.28] cursor-pointer">
                Today
              </button>
              <button
                type="button"
                title="Periode berikutnya"
                onClick={() => navigate(1)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors text-[#7a9585] hover:bg-emerald-500/[0.08] hover:text-emerald-500 cursor-pointer">
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="flex-1 min-w-0" />

            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-[6px] rounded-full flex-shrink-0 bg-[#0f1612] border border-emerald-500/10 min-w-[150px]">
              <Search
                size={11}
                className="text-[rgba(122,149,133,0.55)] flex-shrink-0"
              />
              <input
                type="search"
                title="Cari candidate atau posisi"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-[11px] text-[#7a9585] placeholder:text-[rgba(122,149,133,0.55)]"
              />
            </div>

            {/* View mode toggle */}
            <div className="flex items-center rounded-[12px] p-[3px] gap-[2px] flex-shrink-0 bg-white/[0.03] border border-white/[0.06]">
              {(["month", "week", "day"] as ViewMode[]).map((mode) => {
                const isActive = viewMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    title={`Tampilan ${mode}`}
                    onClick={() => setViewMode(mode)}
                    className={[
                      "px-3 py-[5px] rounded-[9px] text-[11px] font-semibold transition-all capitalize cursor-pointer",
                      isActive
                        ? "bg-emerald-500/[0.18] text-emerald-500 border border-emerald-500/30"
                        : "bg-transparent text-[#7a9585] border border-transparent",
                    ].join(" ")}>
                    {mode === "month"
                      ? "Month"
                      : mode === "week"
                        ? "Week"
                        : "Day"}
                  </button>
                );
              })}
            </div>

            {/* Filter button */}
            <button
              type="button"
              title="Filter interviews"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 text-[#7a9585] border border-emerald-500/10 bg-transparent hover:bg-emerald-500/[0.08] hover:text-emerald-500 hover:border-emerald-500/[0.28] cursor-pointer">
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
                  className="h-full">
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
                  className="h-full">
                  <MonthView
                    year={year}
                    month={month}
                    today={today}
                    interviews={filteredInterviews}
                    selectedDate={selectedDate}
                    onSelectDate={(d: Date) => {
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
                  className="h-full">
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
      </motion.div>
    </>
  );
}
