// components/auth/register/StepProgress.tsx
"use client";

import { CheckCircle2 } from "lucide-react";

interface StepProgressProps {
  current: number;
  total: number;
}

export function StepProgress({ current, total }: StepProgressProps) {
  return (
    <div className="flex items-center gap-[6px]">
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "active" : "idle";
        return (
          <div key={i} className="flex items-center gap-[6px]">
            <div
              className={`flex items-center justify-center rounded-full font-bold transition-all duration-300
              ${
                state === "active"
                  ? "w-7 h-7 text-[0.7rem] bg-emerald-500 text-black border-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.45)]"
                  : state === "done"
                    ? "w-7 h-7 text-[0.7rem] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "w-7 h-7 text-[0.7rem] bg-[#0f1a14] text-[#3a5444] border border-emerald-500/10"
              }`}
            >
              {state === "done" ? <CheckCircle2 size={13} /> : <span>{n}</span>}
            </div>
            {i < total - 1 && (
              <div className="w-8 h-[2px] rounded-full overflow-hidden bg-emerald-500/10">
                <div
                  className={`h-full bg-emerald-500/50 transition-all duration-500 ${
                    n < current ? "w-full" : "w-0"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
