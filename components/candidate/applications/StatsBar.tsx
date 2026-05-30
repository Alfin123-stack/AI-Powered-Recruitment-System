// StatsBar.tsx — Server Component
// Menerima data dari server (page.tsx) dan dirender di server
// Tidak butuh "use client" karena tidak ada interaktivitas

import { BarChart2, Briefcase, Calendar, TrendingUp } from "lucide-react";
import { Application, Interview } from "./types";
import { computeStats } from "./utils";

interface StatsBarProps {
  applications: Application[];
  interviews: Interview[];
}

export default function StatsBar({ applications, interviews }: StatsBarProps) {
  const { total, inProgress, responseRate, upcomingIv } = computeStats(
    applications,
    interviews,
  );

  const stats = [
    {
      label: "Total Lamaran",
      value: total,
      Icon: Briefcase,
      color: "text-emerald-400",
      bg: "bg-emerald-500/8",
    },
    {
      label: "Sedang Diproses",
      value: inProgress,
      Icon: TrendingUp,
      color: "text-cyan-400",
      bg: "bg-cyan-500/8",
    },
    {
      label: "Response Rate",
      value: `${responseRate}%`,
      Icon: BarChart2,
      color: "text-violet-400",
      bg: "bg-violet-500/8",
    },
    {
      label: "Interview Mendatang",
      value: upcomingIv,
      Icon: Calendar,
      color: "text-amber-400",
      bg: "bg-amber-500/8",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {stats.map(({ label, value, Icon, color, bg }) => (
        <div
          key={label}
          className="bg-[#0a0f0c] border border-emerald-500/10 rounded-[14px] p-4">
          <div
            className={`w-8 h-8 rounded-[8px] ${bg} flex items-center justify-center mb-3`}>
            <Icon size={15} className={color} />
          </div>
          <div
            className={`text-[1.4rem] font-black ${color} leading-none mb-1`}>
            {value}
          </div>
          <div className="text-[0.68rem] text-[#7a9585] leading-tight">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
