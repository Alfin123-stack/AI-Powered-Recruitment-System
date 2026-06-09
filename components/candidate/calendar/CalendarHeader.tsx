"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS_ID } from "@/constants/candidate/calendar";

interface CalendarHeaderProps {
  year: number;
  month: number;
  monthInterviewCount: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function CalendarHeader({
  year,
  month,
  monthInterviewCount,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  return (
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
          title="Bulan sebelumnya"
          onClick={onPrev}
          className="w-9 h-9 rounded-[9px] flex items-center justify-center border border-emerald-500/15 text-[#7a9585] hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer">
          <ChevronLeft size={15} />
        </button>
        <button
          title="Kembali ke hari ini"
          onClick={onToday}
          className="px-3 h-9 rounded-[9px] flex items-center justify-center border border-emerald-500/15 text-[#7a9585] hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer text-[0.74rem] font-medium">
          Hari Ini
        </button>
        <button
          title="Bulan berikutnya"
          onClick={onNext}
          className="w-9 h-9 rounded-[9px] flex items-center justify-center border border-emerald-500/15 text-[#7a9585] hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer">
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
