"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { T } from "@/constants/hr/analytics";

interface AnalyticsStatCardProps {
  icon: React.ElementType;
  color: string;
  bg: string;
  value: number | string;
  label: string;
  sub: string;
  trend?: number;
  delay?: number;
}

export function AnalyticsStatCard({
  icon: Icon,
  color,
  bg,
  value,
  label,
  sub,
  trend,
  delay = 0,
}: AnalyticsStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[18px] p-5 cursor-default group"
      style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}
      whileHover={{
        y: -3,
        borderColor: T.cardBorderHover,
        transition: { duration: 0.2 },
      }}>
      {/* top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[18px]"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
      {/* hover glow */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
        }}
      />
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-[11px] flex items-center justify-center"
          style={{ background: bg, color }}>
          <Icon size={17} />
        </div>
        {trend !== undefined && (
          <div
            className="flex items-center gap-1 text-[0.65rem] font-bold px-2 py-1 rounded-full"
            style={{
              background:
                trend >= 0 ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.12)",
              color: trend >= 0 ? T.emerald : T.rose,
            }}>
            <ArrowUpRight
              size={10}
              style={{ transform: trend < 0 ? "rotate(90deg)" : undefined }}
            />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div
        className="font-black text-[2.2rem] leading-none mb-1"
        style={{ color }}>
        {value}
      </div>
      <div
        className="text-[0.78rem] font-semibold"
        style={{ color: T.textPrimary }}>
        {label}
      </div>
      <div className="text-[0.68rem] mt-1" style={{ color: T.textSecondary }}>
        {sub}
      </div>
    </motion.div>
  );
}
