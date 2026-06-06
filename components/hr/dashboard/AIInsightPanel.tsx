"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, Target, Clock, Star } from "lucide-react";
import { CandidateExtended } from "@/types/hr-dashboard";
import { generateInsights } from "./helpers";

const ICON_MAP = {
  Target,
  Clock,
  Star,
  Brain,
};

interface AIInsightPanelProps {
  candidates: CandidateExtended[];
}

export function AIInsightPanel({ candidates }: AIInsightPanelProps) {
  const insights = useMemo(() => generateInsights(candidates), [candidates]);

  const total = candidates.length;
  const topScore = candidates.length
    ? Math.max(...candidates.map((c) => c.resumeScore))
    : 0;
  const avgScore = total
    ? Math.round(candidates.reduce((a, c) => a + c.resumeScore, 0) / total)
    : 0;
  const shortlisted = candidates.filter(
    (c) => c.status === "shortlisted",
  ).length;
  const convRate = total ? Math.round((shortlisted / total) * 100) : 0;

  if (candidates.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0f0c] border border-emerald-500/20 rounded-[18px] p-5 mb-5 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(16,185,129,0.05) 0%,transparent 70%)",
          transform: "translate(30%,-30%)",
        }}
      />

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Brain size={15} className="text-emerald-400" />
          </div>
          <div>
            <div className="font-black text-[0.85rem] text-[#e8f0ec]">
              AI Talent Intelligence
            </div>
            <div className="text-[0.65rem] text-emerald-400/60 mt-[1px]">
              Powered by resume analysis & job matching
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[
            { label: "Top Score", val: topScore, color: "#10b981" },
            { label: "Avg Score", val: avgScore, color: "#06b6d4" },
            { label: "Conv. Rate", val: `${convRate}%`, color: "#f59e0b" },
          ].map((m) => (
            <div
              key={m.label}
              className="text-center px-3 py-[6px] rounded-[10px] bg-white/[0.03] border border-white/[0.06]">
              <div
                className="text-[0.95rem] font-black"
                style={{ color: m.color }}>
                {m.val}
              </div>
              <div className="text-[0.58rem] text-[#7a9585] mt-[1px]">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {insights.length > 0 && (
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${insights.length},minmax(0,1fr))`,
          }}>
          {insights.map((ins, i) => {
            const InsIcon =
              ICON_MAP[ins.iconName as keyof typeof ICON_MAP] ?? Target;
            return (
              <div
                key={i}
                className="rounded-[12px] p-3 flex gap-3 items-start"
                style={{
                  background: ins.bg,
                  border: `1px solid ${ins.border}`,
                }}>
                <InsIcon
                  size={14}
                  style={{ color: ins.color, flexShrink: 0, marginTop: 1 }}
                />
                <p
                  className="text-[0.72rem] leading-relaxed m-0"
                  style={{ color: ins.color }}>
                  {ins.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
