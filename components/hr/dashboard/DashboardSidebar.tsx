"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  CalendarDays,
  Clock,
  Video,
  Monitor,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import type { Interview } from "@/types/hr-dashboard";
import {
  isToday,
  isTomorrow,
  formatInterviewTime,
  formatInterviewDate,
  roundConfig,
} from"@/lib/helpers/dashboardHR";

// ── Types ─────────────────────────────────────────────────────────────────────
type LegendItem = {
  dot: string;
  label: string;
};

type CalendarCell = number | null;

type StatItem = {
  label: string;
  val: number;
  color: string;
};

// ── Constants ─────────────────────────────────────────────────────────────────
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

const CALENDAR_LEGENDS: LegendItem[] = [
  { dot: "bg-emerald-400/60", label: "Hari ini" },
  { dot: "bg-cyan-400/60", label: "Has schedule" },
];

// ── Mini Calendar ─────────────────────────────────────────────────────────────
function MiniCalendar({ interviews }: { interviews: Interview[] }) {
  const [current, setCurrent] = useState(new Date());
  const today = new Date();
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const interviewDays = useMemo(() => {
    const days = new Set<number>();
    interviews.forEach((iv) => {
      const d = new Date(iv.scheduled_at);
      if (d.getMonth() === month && d.getFullYear() === year)
        days.add(d.getDate());
    });
    return days;
  }, [interviews, month, year]);

  const prevMonth = (): void => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = (): void => setCurrent(new Date(year, month + 1, 1));

  const cells = useMemo((): CalendarCell[] => {
    const result: CalendarCell[] = [];
    for (let i = 0; i < firstDay; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(d);
    while (result.length % 7 !== 0) result.push(null);
    return result;
  }, [firstDay, daysInMonth]);

  const todayInterviews = useMemo(
    () =>
      interviews.filter(
        (iv) => isToday(iv.scheduled_at) && iv.status === "scheduled",
      ),
    [interviews],
  );

  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/20 rounded-[18px] overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.04]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-[6px] bg-cyan-500/15 flex items-center justify-center">
            <CalendarDays
              size={12}
              className="text-cyan-400"
              aria-hidden="true"
            />
          </div>
          <span className="font-bold text-[0.82rem] text-[#e8f0ec]">
            Kalender Interview
          </span>
        </div>

        {/* Month nav */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={prevMonth}
            aria-label="Previous month"
            title="Previous month"
            className="w-6 h-6 rounded-[5px] flex items-center justify-center hover:bg-white/[0.06] text-[#7a9585] hover:text-[#e8f0ec] transition-colors bg-transparent border-0 cursor-pointer">
            <ChevronLeft size={13} aria-hidden="true" />
          </button>
          <span className="text-[0.75rem] font-bold text-[#c8d8d0]">
            {MONTHS[month]} {year}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            title="Next month"
            className="w-6 h-6 rounded-[5px] flex items-center justify-center hover:bg-white/[0.06] text-[#7a9585] hover:text-[#e8f0ec] transition-colors bg-transparent border-0 cursor-pointer">
            <ChevronRight size={13} aria-hidden="true" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div
              key={d}
              aria-label={d}
              className="text-center text-[0.6rem] font-bold text-[#7a9585] py-[2px]">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-y-[2px]">
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />;
            const isTodayDay =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();
            const hasInterview = interviewDays.has(day);
            return (
              <div
                key={`day-${day}`}
                className={`relative flex flex-col items-center justify-center w-full aspect-square rounded-[6px] text-[0.7rem] font-medium transition-all duration-150 ${
                  isTodayDay
                    ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/40"
                    : hasInterview
                      ? "bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
                      : "bg-transparent text-[#7a9585] hover:bg-white/[0.04] hover:text-[#c8d8d0] cursor-default"
                }`}>
                {day}
                {hasInterview && (
                  <div
                    className="absolute bottom-[3px] w-[4px] h-[4px] rounded-full bg-cyan-400"
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-3 pt-2 border-t border-white/[0.04]">
          {CALENDAR_LEGENDS.map(({ dot, label }) => (
            <div
              key={label}
              className="flex items-center gap-1 text-[0.6rem] text-[#7a9585]">
              <div
                className={`w-[6px] h-[6px] rounded-full ${dot}`}
                aria-hidden="true"
              />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Today's interviews */}
      {todayInterviews.length > 0 ? (
        <div className="px-4 py-3">
          <div className="text-[0.68rem] text-[#7a9585] font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
            <Calendar size={10} className="text-cyan-400" aria-hidden="true" />
            Hari Ini · {todayInterviews.length} interview
          </div>
          <div className="space-y-2">
            {todayInterviews.slice(0, 3).map((iv) => (
              <div
                key={iv.id}
                className="flex items-center gap-2 p-2 rounded-[9px] bg-white/[0.025] border border-white/[0.05]">
                <div
                  className={`w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0 ${
                    iv.type === "online"
                      ? "bg-violet-500/15 text-violet-400"
                      : "bg-orange-500/15 text-orange-400"
                  }`}>
                  {iv.type === "online" ? (
                    <Video size={13} aria-hidden="true" />
                  ) : (
                    <Monitor size={13} aria-hidden="true" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[0.75rem] text-[#e8f0ec] truncate">
                    {iv.candidate_name}
                  </div>
                  <div className="text-[0.65rem] text-[#7a9585]">
                    {formatInterviewTime(iv.scheduled_at, iv.duration_minutes)}
                  </div>
                </div>
                <span
                  className={`text-[0.62rem] font-bold flex-shrink-0 px-2 py-[2px] rounded-full ${
                    iv.type === "online"
                      ? "bg-violet-500/10 text-violet-400"
                      : "bg-orange-500/10 text-orange-400"
                  }`}>
                  {iv.type === "online" ? "Online" : "Onsite"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4 text-center">
          <p className="text-[0.72rem] text-[#7a9585] py-3">
            Tidak ada interview hari ini.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Interview Schedule Sidebar ────────────────────────────────────────────────
function InterviewScheduleSidebar({ interviews }: { interviews: Interview[] }) {
  const upcoming = useMemo(
    () =>
      interviews
        .filter((iv) => iv.status === "scheduled" || iv.status === "overdue")
        .sort(
          (a, b) =>
            new Date(a.scheduled_at).getTime() -
            new Date(b.scheduled_at).getTime(),
        )
        .slice(0, 8),
    [interviews],
  );

  const stats: StatItem[] = [
    { label: "Total", val: interviews.length, color: "#94a3b8" },
    {
      label: "Selesai",
      val: interviews.filter((iv) => iv.status === "done").length,
      color: "#10b981",
    },
    {
      label: "Batal",
      val: interviews.filter((iv) => iv.status === "cancelled").length,
      color: "#ef4444",
    },
  ];

  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[18px] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/[0.04] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[6px] bg-red-500/15 flex items-center justify-center">
            <Calendar size={12} className="text-red-400" aria-hidden="true" />
          </div>
          <span className="font-bold text-[0.82rem] text-[#e8f0ec]">
            Jadwal Interview
          </span>
        </div>
        <Link
          href="/dashboard/hr/interviews"
          title="View all interview schedules"
          aria-label="View all interview schedules"
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[0.65rem] font-bold hover:bg-cyan-500/20 transition-colors no-underline">
          Semua <ArrowRight size={9} aria-hidden="true" />
        </Link>
      </div>

      <div className="px-4 py-3">
        {upcoming.length === 0 ? (
          <p className="text-center py-6 text-[0.72rem] text-[#7a9585]">
            No schedules yet
          </p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((iv, i) => {
              const isToday_ = isToday(iv.scheduled_at);
              const isTmr = isTomorrow(iv.scheduled_at);
              const rc = iv.round ? roundConfig[iv.round] : null;

              return (
                <motion.div
                  key={iv.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-start gap-2 p-2 rounded-[9px] border transition-all duration-150 ${
                    isToday_
                      ? "bg-cyan-500/[0.07] border-cyan-500/20"
                      : "bg-white/[0.025] border-white/[0.05] hover:bg-white/[0.04]"
                  }`}>
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center gap-1 pt-[3px] flex-shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full border-2 ${
                        isToday_
                          ? "bg-cyan-400 border-cyan-400/50"
                          : "bg-[#334155] border-[#1e293b]"
                      }`}
                      aria-hidden="true"
                    />
                    {i < upcoming.length - 1 && (
                      <div
                        className="w-px h-4 bg-white/[0.06]"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name + badges */}
                    <div className="flex items-center gap-1 mb-[2px] flex-wrap">
                      <span className="text-[0.75rem] font-semibold text-[#e8f0ec] truncate">
                        {iv.candidate_name}
                      </span>
                      {isToday_ && (
                        <span className="text-[0.58rem] font-bold px-[5px] py-[1px] rounded-full bg-cyan-500/[0.12] text-cyan-400 border border-cyan-500/25 flex-shrink-0">
                          ⚡ Today
                        </span>
                      )}
                      {iv.status === "overdue" && (
                        <span className="text-[0.58rem] font-bold px-[5px] py-[1px] rounded-full bg-amber-500/10 text-amber-400 flex-shrink-0">
                          Overdue
                        </span>
                      )}
                    </div>

                    {/* Job title */}
                    <div className="text-[0.65rem] text-[#7a9585] truncate mb-1">
                      {iv.job_title}
                    </div>

                    {/* Date + time */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[0.65rem] font-semibold ${
                          isToday_
                            ? "text-cyan-400"
                            : isTmr
                              ? "text-emerald-400"
                              : "text-[#7a9585]"
                        }`}>
                        {formatInterviewDate(iv.scheduled_at)}
                      </span>
                      <span className="text-[0.65rem] text-[#475569] flex items-center gap-1">
                        <Clock size={8} aria-hidden="true" />
                        {formatInterviewTime(
                          iv.scheduled_at,
                          iv.duration_minutes,
                        )}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      <span
                        className={`text-[0.58rem] font-semibold px-[6px] py-[2px] rounded-full border flex items-center gap-1 ${
                          iv.type === "online"
                            ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                            : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        }`}>
                        {iv.type === "online" ? (
                          <Video size={8} aria-hidden="true" />
                        ) : (
                          <MapPin size={8} aria-hidden="true" />
                        )}
                        {iv.type === "online" ? "Online" : "Onsite"}
                      </span>
                      {iv.round && rc && (
                        <span
                          className="text-[0.58rem] font-semibold px-[6px] py-[2px] rounded-full"
                          style={{ background: rc.bg, color: rc.color }}>
                          {iv.round}
                        </span>
                      )}
                      <span className="text-[0.58rem] px-[6px] py-[2px] rounded-full bg-white/[0.04] text-[#7a9585] ml-auto">
                        {iv.duration_minutes ?? 60}m
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-between mt-4 pt-3 border-t border-white/[0.04]">
          {stats.map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-sm font-black" style={{ color: m.color }}>
                {m.val}
              </div>
              <div className="text-[0.6rem] text-[#7a9585] mt-[1px]">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Dashboard Sidebar (exported) ──────────────────────────────────────────────
export function DashboardSidebar({ interviews }: { interviews: Interview[] }) {
  return (
    <div
      className="flex flex-col gap-4"
      style={{ position: "sticky", top: 20, alignSelf: "start" }}>
      <MiniCalendar interviews={interviews} />
      <InterviewScheduleSidebar interviews={interviews} />
    </div>
  );
}
