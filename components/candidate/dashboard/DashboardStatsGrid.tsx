"use client";

// app/dashboard/candidate/_components/StatsGrid.tsx
// CSR — animated number counter, harus di client

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Star, Calendar, Target } from "lucide-react";

interface DashboardStatsGridProps {
  totalApplications: number;
  shortlistedCount: number;
  upcomingInterviewCount: number;
  avgMatchScore: number;
  hasCv: boolean;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    let current = 0;
    const step = Math.ceil(value / 30);
    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(current);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [value]);

  return <>{display}</>;
}

export function DashboardStatsGrid({
  totalApplications,
  shortlistedCount,
  upcomingInterviewCount,
  avgMatchScore,
  hasCv,
}: DashboardStatsGridProps) {
  const stats = [
    {
      Icon: Briefcase,
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      value: totalApplications,
      suffix: "",
      label: "Total Lamaran",
      sub: "semua posisi",
    },
    {
      Icon: Star,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      value: shortlistedCount,
      suffix: "",
      label: "Shortlisted",
      sub: "peluang interview",
    },
    {
      Icon: Calendar,
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.1)",
      value: upcomingInterviewCount,
      suffix: "",
      label: "Interview Dijadwalkan",
      sub: "segera datang",
    },
    {
      Icon: Target,
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
      value: avgMatchScore,
      suffix: avgMatchScore > 0 ? "%" : "",
      label: "Avg Match Score",
      sub: hasCv && totalApplications > 0 ? "vs skills lamaran" : "upload CV dulu",
      placeholder: !hasCv || totalApplications === 0 ? "—" : null,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {stats.map(({ Icon, color, bg, value, suffix, label, sub, placeholder }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 + i * 0.07 }}
          className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[16px] p-5 hover:border-emerald-500/30 hover:-translate-y-[2px] transition-all duration-200 cursor-default">
          <div
            className="w-8 h-8 rounded-[8px] flex items-center justify-center mb-3"
            style={{ background: bg, color }}>
            <Icon size={15} />
          </div>
          <div
            className="font-black text-[1.9rem] leading-none mb-1"
            style={{ color }}>
            {placeholder ?? (
              <>
                <AnimatedNumber value={value} />
                {suffix}
              </>
            )}
          </div>
          <div className="text-[0.73rem] text-[#c8d8d0] font-medium mb-[2px]">
            {label}
          </div>
          <div className="text-[0.65rem] text-emerald-400/60">{sub}</div>
        </motion.div>
      ))}
    </div>
  );
}
