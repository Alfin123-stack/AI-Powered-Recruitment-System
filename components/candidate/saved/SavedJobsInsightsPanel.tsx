"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { Insight } from "../../../types/candidate/saved";
import { INSIGHT_CONFIG } from "@/constants/candidate/saved";

interface SavedJobsInsightsPanelProps {
  insights: Insight[];
}

export default function SavedJobsInsightsPanel({
  insights,
}: SavedJobsInsightsPanelProps) {
  const [showInsights, setShowInsights] = useState(false);

  if (insights.length === 0) return null;

  return (
    <div className="mb-3">
      <button
        onClick={() => setShowInsights((v) => !v)}
        className="flex items-center gap-1.5 text-[0.7rem] text-violet-400 hover:text-violet-300 transition-colors cursor-pointer">
        <Sparkles size={11} />
        AI Insight
        <ChevronDown
          size={11}
          className={`transition-transform duration-200 ${showInsights ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {showInsights && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden">
            <div className="pt-2 space-y-1.5">
              {insights.map((ins, i) => {
                const cfg = INSIGHT_CONFIG[ins.type];
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-2 rounded-[9px] px-3 py-[8px] border ${cfg.bg} ${cfg.border}`}>
                    <cfg.Icon
                      size={11}
                      className={`${cfg.color} mt-[1px] flex-shrink-0`}
                    />
                    <span
                      className={`text-[0.7rem] leading-relaxed ${cfg.color}`}>
                      {ins.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
