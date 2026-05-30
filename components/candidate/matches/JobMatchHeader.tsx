"use client";

// Wajib client karena menggunakan motion untuk animasi counter stats.

import { motion } from "framer-motion";
import { Zap, Briefcase, TrendingUp, CheckCircle2 } from "lucide-react";

type JobMatchHeaderProps = {
  totalJobs: number;
  unappliedCount: number;
  highMatchCount: number;
  appliedCount: number;
};

export default function JobMatchHeader({
  totalJobs,
  unappliedCount,
  highMatchCount,
  appliedCount,
}: JobMatchHeaderProps) {
  const stats = [
    {
      label: "Lowongan Tersedia",
      value: totalJobs,
      icon: Briefcase,
      color: "#10b981",
    },
    {
      label: "Belum Dilamar",
      value: unappliedCount,
      icon: Zap,
      color: "#06b6d4",
    },
    {
      label: "Match Tinggi (≥60%)",
      value: highMatchCount,
      icon: TrendingUp,
      color: "#8b5cf6",
    },
    {
      label: "Sudah Dilamar",
      value: appliedCount,
      icon: CheckCircle2,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="mb-5">
      {/* Title */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <div className="font-bold text-[1rem]">Job Matches</div>
          <div className="text-[0.73rem] text-white/35 mt-[2px]">
            Dicocokkan berdasarkan skills dari analisis CV kamu
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className="bg-[#0f1612] border border-white/[0.07] rounded-[12px] px-4 py-[14px] flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}15` }}>
              <Icon size={14} style={{ color }} />
            </div>
            <div>
              <div
                className="font-bold text-[1.15rem] leading-none tabular-nums"
                style={{ color }}>
                {value}
              </div>
              <div className="text-[0.65rem] text-white/30 mt-[3px] leading-tight">
                {label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
