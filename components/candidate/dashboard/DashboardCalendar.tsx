"use client";

// components/candidate/dashboard/MiniCalendar.tsx
// CSR — interactive calendar, month navigation, interview markers

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, ChevronLeft, ChevronRight,
  Calendar, Video, Monitor,
} from "lucide-react";
import { formatDate, formatTime, DAYS_ID, MONTHS_ID } from "./DashboardHelpers";
import type { Interview } from "@/types/candidate-dashboard";

export function DashboardCalendar({ interviews }: { interviews: Interview[] }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const interviewDateMap = new Map<string, Interview[]>();
  interviews
    .filter((iv) => iv.status === "scheduled")
    .forEach((iv) => {
      const d = new Date(iv.scheduled_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!interviewDateMap.has(key)) interviewDateMap.set(key, []);
      interviewDateMap.get(key)!.push(iv);
    });

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const upcomingAll = interviews
    .filter((iv) => iv.status === "scheduled" && new Date(iv.scheduled_at) > new Date())
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

  useEffect(() => {
    if (upcomingAll.length > 0) {
      const d = new Date(upcomingAll[0].scheduled_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      setSelectedDate(key);
      setViewMonth(d.getMonth());
      setViewYear(d.getFullYear());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedInterviews = selectedDate ? (interviewDateMap.get(selectedDate) ?? []) : [];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  return (
    <div className="bg-[#0a0f0c] border border-cyan-500/20 rounded-[18px] overflow-hidden mb-4">
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.04]">
        {/* Title */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[6px] bg-cyan-500/15 flex items-center justify-center">
              <CalendarDays size={12} className="text-cyan-400" />
            </div>
            <span className="font-bold text-[0.82rem] text-[#e8f0ec]">Jadwal Interview</span>
            {upcomingAll.length > 0 && (
              <span className="px-[6px] py-[1px] rounded-full bg-cyan-500/10 text-cyan-400 text-[0.6rem] font-bold border border-cyan-500/20">
                {upcomingAll.length}
              </span>
            )}
          </div>
        </div>

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-3">
          <button title="Bulan sebelumnya" onClick={prevMonth}
            className="w-6 h-6 rounded-[5px] flex items-center justify-center hover:bg-white/[0.06] text-[#7a9585] hover:text-[#e8f0ec] transition-colors bg-transparent border-0 cursor-pointer">
            <ChevronLeft size={13} />
          </button>
          <span className="text-[0.75rem] font-bold text-[#c8d8d0]">
            {MONTHS_ID[viewMonth]} {viewYear}
          </span>
          <button title="Bulan berikutnya" onClick={nextMonth}
            className="w-6 h-6 rounded-[5px] flex items-center justify-center hover:bg-white/[0.06] text-[#7a9585] hover:text-[#e8f0ec] transition-colors bg-transparent border-0 cursor-pointer">
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS_ID.map((d) => (
            <div key={d} className="text-center text-[0.6rem] font-bold text-[#7a9585] py-[2px]">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-y-[2px]">
          {cells.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} />;
            const key = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const hasInterview = interviewDateMap.has(key);
            const isToday = key === todayKey;
            const isSelected = key === selectedDate;
            const ivs = interviewDateMap.get(key) ?? [];
            const isOnline = ivs.some((iv) => iv.type === "online");
            const isOnsite = ivs.some((iv) => iv.type === "onsite");

            return (
              <button
                key={key}
                title={`${day} ${MONTHS_ID[viewMonth]}${hasInterview ? ` — ${ivs.length} interview` : ""}`}
                onClick={() => hasInterview && setSelectedDate(isSelected ? null : key)}
                className={`relative flex flex-col items-center justify-center w-full aspect-square rounded-[6px] text-[0.7rem] font-medium transition-all duration-150 border-0 cursor-pointer
                  ${isSelected
                    ? "bg-cyan-500 text-black font-bold"
                    : isToday
                      ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/40"
                      : hasInterview
                        ? "bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
                        : "bg-transparent text-[#7a9585] hover:bg-white/[0.04] hover:text-[#c8d8d0]"
                  }`}>
                {day}
                {hasInterview && !isSelected && (
                  <div className="absolute bottom-[3px] flex gap-[2px]">
                    {isOnline && <div className="w-[3px] h-[3px] rounded-full bg-violet-400" />}
                    {isOnsite && <div className="w-[3px] h-[3px] rounded-full bg-orange-400" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-3 pt-2 border-t border-white/[0.04]">
          {[
            { dot: "bg-emerald-400/60", label: "Hari ini", size: "w-[6px] h-[6px]" },
            { dot: "bg-cyan-400/60", label: "Ada jadwal", size: "w-[6px] h-[6px]" },
            { dot: "bg-violet-400", label: "Online", size: "w-[3px] h-[3px]" },
            { dot: "bg-orange-400", label: "Onsite", size: "w-[3px] h-[3px]" },
          ].map(({ dot, label, size }) => (
            <div key={label} className="flex items-center gap-1 text-[0.6rem] text-[#7a9585]">
              <div className={`${size} rounded-full ${dot}`} /> {label}
            </div>
          ))}
        </div>
      </div>

      {/* Selected date interviews */}
      <AnimatePresence>
        {selectedDate && selectedInterviews.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}>
            <div className="px-4 py-3">
              <div className="text-[0.68rem] text-[#7a9585] font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                <Calendar size={10} className="text-cyan-400" />
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("id-ID", {
                  weekday: "long", day: "numeric", month: "long",
                })}
              </div>
              <div className="space-y-2">
                {selectedInterviews.map((iv) => {
                  const isOnline = iv.type === "online";
                  const daysUntil = Math.ceil(
                    (new Date(iv.scheduled_at).getTime() - Date.now()) / 86400000,
                  );
                  return (
                    <div key={iv.id} className="flex items-center gap-2 p-2 rounded-[9px] bg-white/[0.025] border border-white/[0.05]">
                      <div className={`w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0 ${isOnline ? "bg-violet-500/15 text-violet-400" : "bg-orange-500/15 text-orange-400"}`}>
                        {isOnline ? <Video size={13} /> : <Monitor size={13} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[0.75rem] text-[#e8f0ec] truncate">
                          {iv.job_title ?? "Interview"}
                        </div>
                        <div className="text-[0.65rem] text-[#7a9585] truncate">
                          {iv.company_name} · {formatTime(iv.scheduled_at)}
                        </div>
                      </div>
                      <div className={`text-[0.62rem] font-bold flex-shrink-0 ${daysUntil <= 0 ? "text-red-400" : daysUntil === 1 ? "text-amber-400" : "text-cyan-400"}`}>
                        {daysUntil <= 0 ? "Hari ini" : daysUntil === 1 ? "Besok" : `${daysUntil}h`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upcoming list (when nothing selected) */}
      {upcomingAll.length > 0 && !selectedDate && (
        <div className="px-4 pb-4">
          <div className="text-[0.68rem] text-[#7a9585] font-bold uppercase tracking-wider mb-2">Akan datang</div>
          <div className="space-y-2">
            {upcomingAll.slice(0, 3).map((iv) => {
              const isOnline = iv.type === "online";
              const daysUntil = Math.ceil(
                (new Date(iv.scheduled_at).getTime() - Date.now()) / 86400000,
              );
              return (
                <div key={iv.id} className="flex items-center gap-2 p-2 rounded-[9px] bg-white/[0.025] border border-white/[0.05]">
                  <div className={`w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0 ${isOnline ? "bg-violet-500/15 text-violet-400" : "bg-orange-500/15 text-orange-400"}`}>
                    {isOnline ? <Video size={13} /> : <Monitor size={13} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[0.75rem] text-[#e8f0ec] truncate">
                      {iv.job_title ?? "Interview"}
                    </div>
                    <div className="text-[0.65rem] text-[#7a9585]">
                      {formatDate(iv.scheduled_at)} · {formatTime(iv.scheduled_at)}
                    </div>
                  </div>
                  <div className={`text-[0.62rem] font-bold flex-shrink-0 ${daysUntil <= 1 ? "text-red-400" : daysUntil <= 3 ? "text-amber-400" : "text-cyan-400"}`}>
                    {daysUntil === 0 ? "Hari ini!" : daysUntil === 1 ? "Besok" : `${daysUntil} hari`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {upcomingAll.length === 0 && (
        <div className="px-4 pb-4 text-center">
          <div className="text-[0.72rem] text-[#7a9585] py-3">Belum ada jadwal interview.</div>
        </div>
      )}
    </div>
  );
}