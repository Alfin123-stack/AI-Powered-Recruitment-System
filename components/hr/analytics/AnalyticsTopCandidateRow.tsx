"use client";

import { motion } from "framer-motion";
import { T } from "@/constants/hr/analytics";

interface AnalyticsTopCandidateRowProps {
  rank: number;
  name: string;
  job: string;
  cvScore: number;
  matchScore: number;
  color: string;
}

export function AnalyticsTopCandidateRow({
  rank,
  name,
  job,
  cvScore,
  matchScore,
  color,
}: AnalyticsTopCandidateRowProps) {
  const rankColors = ["#f59e0b", "#94a3b8", "#cd7c38"];
  const rc = rankColors[rank - 1] ?? T.textSecondary;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.06 }}
      className="flex items-center gap-3 py-2 px-3 rounded-[11px] group cursor-default"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
      whileHover={{
        background: "rgba(16,185,129,0.04)",
        borderColor: "rgba(16,185,129,0.15)",
        transition: { duration: 0.15 },
      }}>
      <div
        className="w-6 h-6 rounded-[6px] flex items-center justify-center text-[0.65rem] font-black flex-shrink-0"
        style={{
          background: `${rc}18`,
          color: rc,
          border: `1px solid ${rc}30`,
        }}>
        {rank}
      </div>
      <div
        className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[0.7rem] font-black flex-shrink-0"
        style={{
          background: `${color}18`,
          color,
          border: `1px solid ${color}25`,
        }}>
        {name.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-[0.78rem] font-semibold truncate"
          style={{ color: T.textPrimary }}>
          {name}
        </div>
        <div
          className="text-[0.63rem] truncate"
          style={{ color: T.textSecondary }}>
          {job}
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-center">
          <div
            className="text-[0.82rem] font-black"
            style={{
              color:
                cvScore >= 80 ? T.emerald : cvScore >= 60 ? T.cyan : T.amber,
            }}>
            {cvScore}
          </div>
          <div className="text-[0.55rem]" style={{ color: T.textMuted }}>
            CV
          </div>
        </div>
        <div className="text-center">
          <div
            className="text-[0.82rem] font-black"
            style={{
              color:
                matchScore >= 80
                  ? T.violet
                  : matchScore >= 60
                    ? T.cyan
                    : T.amber,
            }}>
            {matchScore}%
          </div>
          <div className="text-[0.55rem]" style={{ color: T.textMuted }}>
            Match
          </div>
        </div>
      </div>
    </motion.div>
  );
}
