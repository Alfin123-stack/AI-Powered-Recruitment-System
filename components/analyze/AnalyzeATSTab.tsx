"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCheck, XCircle, Info } from "lucide-react";
import AnimatedBar from "./AnalyzeAnimatedBar";
import type { ATSCheck } from "@/types/main/analyze";
import { getScoreColor } from "@/lib/utils";

// ─── EMPTY STATE (local, reused in tab files) ─────────────────────────────────
function EmptyTabState({ message }: { message: string }) {
  return (
    <div
      className="rounded-[12px] p-8 text-center"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
      <p className="text-[12.5px]" style={{ color: "rgba(255,255,255,0.25)" }}>
        {message}
      </p>
    </div>
  );
}

type Props = { checks: ATSCheck[] | undefined };

export default function ATSTab({ checks }: Props) {
  const [openTip, setOpenTip] = useState<number | null>(null);

  if (!checks || checks.length === 0) {
    return (
      <EmptyTabState message="ATS check data is not available for this analysis." />
    );
  }

  const passCount = checks.filter((c) => c.ok).length;
  const pct = Math.round((passCount / checks.length) * 100);
  const col = getScoreColor(pct);

  return (
    <div>
      <div
        className="flex items-center gap-5 mb-5 p-4 rounded-[12px]"
        style={{
          background: getScoreColor(pct),
          border: `1px solid ${getScoreColor(pct)}`,
        }}>
        <div>
          <div
            className="text-[10px] font-bold uppercase tracking-widest mb-1"
            style={{ color: "rgba(255,255,255,0.28)" }}>
            ATS Compatibility
          </div>
          <div
            className="text-[36px] font-black leading-none"
            style={{ color: col }}>
            {pct}%
          </div>
          <div
            className="text-[11px] mt-[3px]"
            style={{ color: "rgba(255,255,255,0.28)" }}>
            {passCount} of {checks.length} criteria passed
          </div>
        </div>
        <div className="flex-1">
          <AnimatedBar value={pct} color={col} delay={200} height={5} />
          <div
            className="text-[11.5px] mt-[8px] leading-[1.6]"
            style={{ color: "rgba(255,255,255,0.35)" }}>
            {passCount === checks.length
              ? "Your CV meets all ATS criteria."
              : `${checks.length - passCount} item${checks.length - passCount > 1 ? "s" : ""} need${checks.length - passCount === 1 ? "s" : ""} improvement for optimal results.`}
          </div>
        </div>
      </div>

      <div className="space-y-[5px]">
        {checks.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-[10px] overflow-hidden"
            style={{
              border: `1px solid ${c.ok ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.12)"}`,
            }}>
            <button
              onClick={() => setOpenTip(openTip === i ? null : i)}
              className="w-full flex items-center gap-3 px-4 py-[10px] text-left"
              style={{
                background: c.ok
                  ? "rgba(74,222,128,0.03)"
                  : "rgba(248,113,113,0.03)",
              }}>
              {c.ok ? (
                <CheckCheck
                  size={13}
                  className="flex-shrink-0"
                  style={{ color: "rgba(74,222,128,0.65)" }}
                />
              ) : (
                <XCircle
                  size={13}
                  className="flex-shrink-0"
                  style={{ color: "rgba(248,113,113,0.65)" }}
                />
              )}
              <span
                className="flex-1 text-[12.5px]"
                style={{ color: "rgba(255,255,255,0.6)" }}>
                {c.label}
              </span>
              <span
                className="text-[10px] font-bold px-[7px] py-[2px] rounded-full flex-shrink-0"
                style={{
                  background: c.ok
                    ? "rgba(74,222,128,0.09)"
                    : "rgba(248,113,113,0.09)",
                  color: c.ok
                    ? "rgba(74,222,128,0.8)"
                    : "rgba(248,113,113,0.8)",
                }}>
                {c.ok ? "Pass" : "Fail"}
              </span>
              {c.tip && (
                <Info
                  size={11}
                  className="flex-shrink-0 ml-1"
                  style={{ color: "rgba(255,255,255,0.16)" }}
                />
              )}
            </button>
            {c.tip && openTip === i && (
              <div
                className="px-[42px] pb-3 text-[11.5px] leading-[1.6]"
                style={{ color: "rgba(255,255,255,0.32)" }}>
                {c.tip}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
