"use client";

import type { Interview } from "@/types/calendar";

interface CalendarStatsProps {
  interviews: Interview[];
}

export default function CalendarStats({ interviews }: CalendarStatsProps) {
  const stats = [
    {
      label: "Terjadwal",
      count: interviews.filter((iv) => iv.status === "scheduled").length,
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.06)",
    },
    {
      label: "Selesai",
      count: interviews.filter((iv) => iv.status === "done").length,
      color: "#10b981",
      bg: "rgba(16,185,129,0.06)",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ label, count, color, bg }) => (
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
  );
}
