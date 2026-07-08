"use client";

import { useMemo } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { CandidateUI, InsightPanel } from "@/types/hr/dashboard";
import { computeInsight } from "@/lib/helpers/hr/dashboard";

export function DashboardCandidateInsightRow({
  candidate,
}: {
  candidate: CandidateUI;
}) {
  const ins = useMemo(() => computeInsight(candidate), [candidate]);

  const panels: InsightPanel[] = [
    {
      title: "Kekuatan",
      items: ins.strengths.slice(0, 2),
      color: "#10b981",
      bg: "rgba(16,185,129,0.05)",
      border: "rgba(16,185,129,0.12)",
      Icon: CheckCircle2,
    },
    {
      title: "Perhatian",
      items: ins.weaknesses.slice(0, 2),
      color: "#ef4444",
      bg: "rgba(239,68,68,0.05)",
      border: "rgba(239,68,68,0.12)",
      Icon: AlertTriangle,
    },
  ];

  return (
    <div className="flex gap-3 py-2 px-1 flex-wrap">
      {panels.map(({ title, items, color, bg, border, Icon }) => (
        <div
          key={title}
          className="flex-1 min-w-[200px] flex items-start gap-2 rounded-[9px] p-3"
          style={{ background: bg, border: `1px solid ${border}` }}>
          <Icon size={11} style={{ color, flexShrink: 0, marginTop: 2 }} />
          <div>
            <div
              className="text-[0.6rem] font-black uppercase tracking-widest mb-1"
              style={{ color }}>
              {title}
            </div>
            <div className="flex flex-wrap gap-1">
              {items.map((s, i) => (
                <span
                  key={i}
                  className="text-[0.68rem]"
                  style={{ color: `${color}cc` }}>
                  {s}
                  {i < items.length - 1 ? " ·" : ""}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
