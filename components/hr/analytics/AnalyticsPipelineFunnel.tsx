"use client";

import { motion } from "framer-motion";
import { T } from "@/constants/hr/analytics";

interface PipelineItem {
  label: string;
  count: number;
  color: string;
  icon: React.ElementType;
}

interface AnalyticsPipelineFunnelProps {
  data: PipelineItem[];
}

export function AnalyticsPipelineFunnel({ data }: AnalyticsPipelineFunnelProps) {
  const max = data[0]?.count || 1;
  return (
    <div className="flex flex-col gap-2">
      {data.map((d, i) => {
        const pct = (d.count / max) * 100;
        const DIcon = d.icon;
        return (
          <div key={d.label} className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0"
              style={{ background: `${d.color}18`, color: d.color }}>
              <DIcon size={12} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span
                  className="text-[0.72rem] font-semibold"
                  style={{ color: T.textPrimary }}>
                  {d.label}
                </span>
                <span
                  className="text-[0.72rem] font-black"
                  style={{ color: d.color }}>
                  {d.count}
                </span>
              </div>
              <div
                className="h-[6px] rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${d.color}, ${d.color}99)`,
                  }}
                />
              </div>
            </div>
            <span
              className="text-[0.65rem] w-8 text-right flex-shrink-0"
              style={{ color: T.textSecondary }}>
              {max > 0 ? Math.round(pct) : 0}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
