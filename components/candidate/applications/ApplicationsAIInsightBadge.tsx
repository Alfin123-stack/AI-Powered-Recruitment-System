"use client";

// ApplicationsAIInsightBadge.tsx — Client Component (kecil, reusable)
// Separated because used in both ApplicationCard AND ApplicationDetailModal

import { AlertCircle, Brain, Sparkles } from "lucide-react";
import { AIInsight } from "../../../constants/candidate/applications";

export default function ApplicationsAIInsightBadge({
  insight,
}: {
  insight: AIInsight;
}) {
  const cfg = {
    tip: {
      color: "text-violet-400",
      bg: "bg-violet-500/[0.06]",
      border: "border-violet-500/15",
      Icon: Brain,
    },
    warning: {
      color: "text-amber-400",
      bg: "bg-amber-500/[0.06]",
      border: "border-amber-500/15",
      Icon: AlertCircle,
    },
    success: {
      color: "text-emerald-400",
      bg: "bg-emerald-500/[0.06]",
      border: "border-emerald-500/15",
      Icon: Sparkles,
    },
  }[insight.type];

  return (
    <div
      className={`flex items-start gap-2 rounded-[9px] px-3 py-[9px] border ${cfg.bg} ${cfg.border}`}>
      <cfg.Icon size={11} className={`${cfg.color} mt-[1px] flex-shrink-0`} />
      <span className={`text-[0.71rem] leading-relaxed ${cfg.color}`}>
        {insight.text}
      </span>
    </div>
  );
}
