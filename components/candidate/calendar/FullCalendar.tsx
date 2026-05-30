"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CalendarDays,
} from "lucide-react";

import InterviewDetailCard from "./InterviewDetailCard";
import {
  Interview,
  MONTHS_ID,
  DAYS_ID,
  formatTime,
  isToday,
  getDayLabel,
} from "./types";

interface FullCalendarProps {
  interviews: Interview[];
}

export default function FullCalendar({ interviews }: FullCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Map: "YYYY-MM-DD" → Interview[]
  const interviewMap = new Map<string, Interview[]>();
  interviews.forEach((iv) => {
    const d = new Date(iv.scheduled_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!interviewMap.has(key)) interviewMap.set(key, []);
    interviewMap.get(key)!.push(iv);
  });

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const prevMonth = () => {
    setSelectedDate(null);
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    setSelectedDate(null);
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedKey = selectedDate;
  const selectedIvs = selectedKey ? interviewMap.get(selectedKey) || [] : [];
  const monthInterviewCount = Array.from(interviewMap.entries())
    .filter(([key]) =>
      key.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`),
    )
    .reduce((acc, [, ivs]) => acc + ivs.length, 0);

  const upcomingInterviews = interviews
    .filter(
      (iv) =>
        iv.status === "scheduled" && new Date(iv.scheduled_at) > new Date(),
    )
    .sort(
      (a, b) =>
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime(),
    )
    .slice(0, 4);

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 340px" }}>
      {/* Left: Big calendar */}
      <div className="bg-[#070d0a] border border-emerald-500/12 rounded-[20px] overflow-hidden">
        {/* Month nav */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-500/10">
          <div>
            <h2 className="font-extrabold text-[1.15rem]">
              {MONTHS_ID[month]} {year}
            </h2>
            <p className="text-[0.72rem] text-[#7a9585] mt-[2px]">
              {monthInterviewCount > 0
                ? `${monthInterviewCount} interview bulan ini`
                : "Tidak ada interview bulan ini"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-[9px] flex items-center justify-center border border-emerald-500/15 text-[#7a9585] hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer">
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => {
                setMonth(today.getMonth());
                setYear(today.getFullYear());
                setSelectedDate(todayKey);
              }}
              className="px-3 h-9 rounded-[9px] flex items-center justify-center border border-emerald-500/15 text-[#7a9585] hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer text-[0.74rem] font-medium">
              Hari Ini
            </button>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-[9px] flex items-center justify-center border border-emerald-500/15 text-[#7a9585] hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <div className="p-5">
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

          {/* Grid */}
          <div className="grid grid-cols-7 gap-[4px]">
            {cells.map((day, idx) => {
              if (day === null) return <div key={`e-${idx}`} />;

              const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const ivs = interviewMap.get(key) || [];
              const hasIv = ivs.length > 0;
              const isCurrentDay = key === todayKey;
              const isSelected = key === selectedDate;
              const hasScheduled = ivs.some((iv) => iv.status === "scheduled");
              const hasDone = ivs.some((iv) => iv.status === "done");
              const hasCancelled = ivs.some((iv) => iv.status === "cancelled");
              const todayFlag = isCurrentDay && hasIv;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDate(isSelected ? null : key)}
                  className={`relative flex flex-col items-center justify-start pt-2 pb-[18px] rounded-[10px] min-h-[56px]
                    text-[0.82rem] font-medium transition-all cursor-pointer border-0
                    ${
                      isSelected
                        ? "bg-emerald-500 text-black font-bold"
                        : isCurrentDay
                          ? "bg-emerald-500/12 text-emerald-400 ring-1 ring-emerald-500/35"
                          : hasIv
                            ? "bg-cyan-500/[0.06] text-[#e8f0ec] hover:bg-cyan-500/12 border border-cyan-500/15"
                            : "bg-transparent text-[#7a9585] hover:bg-white/[0.04] hover:text-[#c8d8d0]"
                    }`}>
                  {day}
                  {/* Dot indicators */}
                  {hasIv && !isSelected && (
                    <div className="absolute bottom-[6px] flex gap-[3px]">
                      {hasScheduled && (
                        <div className="w-[5px] h-[5px] rounded-full bg-cyan-400" />
                      )}
                      {hasDone && (
                        <div className="w-[5px] h-[5px] rounded-full bg-emerald-400" />
                      )}
                      {hasCancelled && (
                        <div className="w-[5px] h-[5px] rounded-full bg-red-400/60" />
                      )}
                    </div>
                  )}
                  {/* Count badge for multiple */}
                  {hasIv && ivs.length > 1 && !isSelected && (
                    <div className="absolute top-[4px] right-[5px] w-[14px] h-[14px] rounded-full bg-cyan-500/20 text-cyan-400 text-[0.55rem] font-black flex items-center justify-center">
                      {ivs.length}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mt-4 pt-4 border-t border-emerald-500/8 flex-wrap">
            <div className="flex items-center gap-1.5 text-[0.68rem] text-[#7a9585]">
              <div className="w-[8px] h-[8px] rounded-[2px] bg-emerald-500/25 ring-1 ring-emerald-500/50" />
              Hari ini
            </div>
            <div className="flex items-center gap-1.5 text-[0.68rem] text-[#7a9585]">
              <div className="w-[6px] h-[6px] rounded-full bg-cyan-400" />
              Terjadwal
            </div>
            <div className="flex items-center gap-1.5 text-[0.68rem] text-[#7a9585]">
              <div className="w-[6px] h-[6px] rounded-full bg-emerald-400" />
              Selesai
            </div>
            <div className="flex items-center gap-1.5 text-[0.68rem] text-[#7a9585]">
              <div className="w-[6px] h-[6px] rounded-full bg-red-400/60" />
              Dibatalkan
            </div>
          </div>
        </div>
      </div>

      {/* Right: Selected date detail + upcoming list */}
      <div className="flex flex-col gap-4">
        {/* Selected date panel */}
        <AnimatePresence mode="wait">
          {selectedDate && (
            <motion.div
              key={selectedDate}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}>
              <div className="bg-[#070d0a] border border-cyan-500/20 rounded-[16px] overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.04] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[0.88rem] text-[#e8f0ec]">
                      {new Date(
                        selectedDate + "T00:00:00",
                      ).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </div>
                    <div className="text-[0.68rem] text-[#7a9585] mt-[1px]">
                      {selectedIvs.length > 0
                        ? `${selectedIvs.length} interview`
                        : "Tidak ada interview"}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="w-6 h-6 rounded-[5px] flex items-center justify-center text-[#7a9585] hover:text-[#e8f0ec] bg-transparent border-0 cursor-pointer transition-colors">
                    <ChevronLeft size={13} />
                  </button>
                </div>
                <div className="p-3">
                  {selectedIvs.length === 0 ? (
                    <div className="text-center py-5 text-[0.75rem] text-[#7a9585]">
                      Tidak ada jadwal pada tanggal ini.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {selectedIvs.map((iv) => (
                        <InterviewDetailCard key={iv.id} iv={iv} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upcoming interviews */}
        <div className="bg-[#070d0a] border border-emerald-500/12 rounded-[16px] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.04] flex items-center gap-2">
            <CalendarDays size={13} className="text-emerald-400" />
            <span className="font-bold text-[0.84rem]">Akan Datang</span>
          </div>
          <div className="p-3">
            {upcomingInterviews.length === 0 ? (
              <div className="text-center py-6 text-[0.75rem] text-[#7a9585]">
                Tidak ada interview mendatang.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {upcomingInterviews.map((iv) => {
                  const todayFlag = isToday(iv.scheduled_at);
                  return (
                    <button
                      key={iv.id}
                      onClick={() => {
                        const d = new Date(iv.scheduled_at);
                        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                        setMonth(d.getMonth());
                        setYear(d.getFullYear());
                        setSelectedDate(key);
                      }}
                      className="flex items-center gap-3 w-full text-left p-2 rounded-[10px] hover:bg-white/[0.03] transition-colors cursor-pointer border-0 bg-transparent">
                      <div
                        className={`w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0
                          ${todayFlag ? "bg-amber-500/12 text-amber-400" : "bg-cyan-500/10 text-cyan-400"}`}>
                        <Calendar size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.78rem] font-semibold text-[#e8f0ec] truncate">
                          {iv.job_title}
                        </div>
                        <div className="text-[0.68rem] text-[#7a9585]">
                          {getDayLabel(iv.scheduled_at)} ·{" "}
                          {formatTime(iv.scheduled_at)}
                        </div>
                      </div>
                      <ChevronRight
                        size={12}
                        className="text-[#7a9585] flex-shrink-0"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Stats mini */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Terjadwal",
              count: interviews.filter((iv) => iv.status === "scheduled")
                .length,
              color: "#06b6d4",
              bg: "rgba(6,182,212,0.06)",
            },
            {
              label: "Selesai",
              count: interviews.filter((iv) => iv.status === "done").length,
              color: "#10b981",
              bg: "rgba(16,185,129,0.06)",
            },
          ].map(({ label, count, color, bg }) => (
            <div
              key={label}
              className="rounded-[12px] p-4 border border-white/[0.05] text-center"
              style={{ background: bg }}>
              <div
                className="text-[1.6rem] font-black leading-none mb-1"
                style={{ color }}>
                {count}
              </div>
              <div className="text-[0.68rem] text-[#7a9585]">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
