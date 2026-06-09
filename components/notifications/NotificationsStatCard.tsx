"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  bg: string;
  icon: LucideIcon;
  index: number;
}

export default function NotificationsStatCard({
  label,
  value,
  color,
  bg,
  icon: Icon,
  index,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.06 + index * 0.06 }}
      className="flex items-center gap-3 rounded-xl px-4 py-3 border border-white/[0.05]"
      style={{ background: "rgba(13,19,16,0.9)" }}>
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg} ${color} border border-white/[0.07]`}>
        <Icon size={18} />
      </div>
      <div>
        <div className={`font-bold text-[1.2rem] leading-none ${color}`}>
          {value}
        </div>
        <div className="text-[0.63rem] mt-[3px] text-[#2e4438]">{label}</div>
      </div>
    </motion.div>
  );
}
