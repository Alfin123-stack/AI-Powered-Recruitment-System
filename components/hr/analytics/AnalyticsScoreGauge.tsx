"use client";

import { motion } from "framer-motion";
import { T } from "@/constants/hr/analytics";

interface AnalyticsScoreGaugeProps {
  value: number;
  color: string;
  label: string;
}

export function AnalyticsScoreGauge({
  value,
  color,
  label,
}: AnalyticsScoreGaugeProps) {
  const r = 36,
    cx = 48,
    cy = 48;
  const halfCirc = Math.PI * r;
  const dash = (value / 100) * halfCirc;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={96} height={56} viewBox="0 0 96 64">
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={7}
          strokeLinecap="round"
        />
        <motion.path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={`${halfCirc}`}
          initial={{ strokeDashoffset: halfCirc }}
          animate={{ strokeDashoffset: halfCirc - dash }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fill={color}
          fontSize="15"
          fontWeight="800">
          {value}
        </text>
      </svg>
      <div
        className="text-[0.65rem] font-semibold"
        style={{ color: T.textSecondary }}>
        {label}
      </div>
    </div>
  );
}
