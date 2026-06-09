"use client";

import { InterviewFilterType } from "@/types/hr/interviews";

const LABEL_MAP: Record<string, string> = {
  scheduled: "terjadwal",
  done: "selesai",
  overdue: "overdue",
  cancelled: "dibatalkan",
};

export function InterviewEmptyState({
  filter,
}: {
  filter: InterviewFilterType;
}) {
  const label = LABEL_MAP[filter] ?? null;

  return (
    <div className="flex flex-col items-center justify-center py-[80px] gap-3">
      <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[1.6rem] bg-white/[0.03] border border-white/[0.07]">
        📅
      </div>
      <div className="font-bold text-[0.93rem] text-[#e8f0ec]">
        {label ? `Tidak ada interview ${label}` : "Belum ada jadwal interview"}
      </div>
      {!label && (
        <p className="text-[0.76rem] text-[#7a9585] m-0">
          Klik tombol di atas untuk menjadwalkan.
        </p>
      )}
    </div>
  );
}
