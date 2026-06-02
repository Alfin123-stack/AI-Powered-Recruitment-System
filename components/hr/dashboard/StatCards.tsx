"use client";

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARDS — CSR (butuh animasi motion per-card)
// Route: @/components/hr/dashboard/StatCards.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  Inbox,
  Calendar,
  UserCheck,
  UserX,
  ArrowUpRight,
} from "lucide-react";

interface StatCardsProps {
  uniqueJobsCount: number;
  total: number;
  totalInterviews: number;
  totalHired: number;
  totalRejected: number;
  shortlisted: number;
}

export function StatCards({
  uniqueJobsCount,
  total,
  totalInterviews,
  totalHired,
  totalRejected,
  shortlisted,
}: StatCardsProps) {
  const cards = [
    {
      Icon: Briefcase,
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      num: uniqueJobsCount,
      label: "Active Jobs",
      sub: "posisi terbuka",
    },
    {
      Icon: Users,
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.1)",
      num: total,
      label: "Total Kandidat",
      sub: `${shortlisted} shortlisted`,
    },
    {
      Icon: Inbox,
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
      num: total,
      label: "Applications",
      sub: "all time",
    },
    {
      Icon: Calendar,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      num: totalInterviews,
      label: "Interviews",
      sub: "scheduled & done",
    },
    {
      Icon: UserCheck,
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      num: totalHired,
      label: "Hired",
      sub: "all positions",
    },
    {
      Icon: UserX,
      color: "#ef4444",
      bg: "rgba(239,68,68,0.08)",
      num: totalRejected,
      label: "Rejected",
      sub: "all positions",
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-3 mb-5">
      {cards.map(({ Icon, color, bg, num, label, sub }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[16px] p-5 hover:border-emerald-500/30 hover:-translate-y-[2px] transition-all duration-200 cursor-default relative overflow-hidden"
        >
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(90deg,${color},transparent)` }}
          />
          <div
            className="w-8 h-8 rounded-[8px] flex items-center justify-center mb-3"
            style={{ background: bg, color }}
          >
            <Icon size={14} />
          </div>
          <div
            className="font-black text-[1.9rem] leading-none mb-1"
            style={{ color }}
          >
            {num}
          </div>
          <div className="text-[0.73rem] text-[#c8d8d0] font-medium mb-[2px]">
            {label}
          </div>
          <div className="text-[0.65rem] text-emerald-400/60 flex items-center gap-1">
            <ArrowUpRight size={9} style={{ color }} /> {sub}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
