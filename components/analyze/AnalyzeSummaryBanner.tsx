"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import type { AnalysisData } from "@/types/main/analyze";
import { buildAISummary } from "../../lib/helpers/analyze";

// ─── AI SUMMARY BANNER ────────────────────────────────────────────────────────
type Props = { data: AnalysisData };

export default function SummaryBanner({ data }: Props) {
  const summary = data.aiSummary ?? buildAISummary(data);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="rounded-[12px] p-4 mb-5"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderLeft: "2px solid rgba(74,222,128,0.35)",
        borderRadius: "0 12px 12px 0",
      }}>
      <div className="flex items-center gap-2 mb-[7px]">
        <Brain size={12} style={{ color: "rgba(74,222,128,0.6)" }} />
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "rgba(74,222,128,0.6)" }}>
          AI Summary
        </span>
        {data.experienceLevel && (
          <span
            className="text-[10px] px-[7px] py-[2px] rounded-full"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.28)",
            }}>
            {data.experienceLevel}
          </span>
        )}
      </div>
      <p
        className="text-[12.5px] leading-[1.7]"
        style={{ color: "rgba(255,255,255,0.5)" }}>
        {summary}
      </p>
    </motion.div>
  );
}
