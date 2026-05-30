"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import AnimatedBar from "./AnimatedBar";
import { scoreColor } from "./analyze-helpers";
import type { AnalysisData } from "./analyze";

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
type Props = { data: AnalysisData };

export default function OverviewTab({ data }: Props) {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const visibleSkills = showAllSkills ? data.skills : data.skills.slice(0, 7);

  return (
    <div className="grid grid-cols-2 gap-5">
      {/* Skills */}
      <div
        className="rounded-[12px] p-5"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
        <div
          className="text-[10px] font-bold uppercase tracking-widest mb-4"
          style={{ color: "rgba(255,255,255,0.28)" }}>
          Skills terdeteksi
        </div>
        {data.skills.length === 0 ? (
          <p
            className="text-[12px]"
            style={{ color: "rgba(255,255,255,0.25)" }}>
            Tidak ada skill yang terdeteksi.
          </p>
        ) : (
          <>
            <div className="space-y-[10px]">
              {visibleSkills.map((s, i) => {
                const col = scoreColor(s.level);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="text-[12px] font-medium flex-shrink-0 truncate"
                      style={{ width: 90, color: "rgba(255,255,255,0.65)" }}>
                      {s.name}
                    </div>
                    <div className="flex-1">
                      <AnimatedBar
                        value={s.level}
                        color={col}
                        delay={i * 55 + 200}
                        height={5}
                      />
                    </div>
                    <div
                      className="text-[11px] font-bold flex-shrink-0 w-7 text-right"
                      style={{ color: col }}>
                      {s.level}
                    </div>
                  </div>
                );
              })}
            </div>
            {data.skills.length > 7 && (
              <button
                onClick={() => setShowAllSkills(!showAllSkills)}
                className="mt-3 flex items-center gap-1 text-[11px]"
                style={{ color: "rgba(255,255,255,0.3)" }}>
                {showAllSkills
                  ? "Lebih sedikit"
                  : `+${data.skills.length - 7} lainnya`}
                <ChevronDown
                  size={11}
                  style={{
                    transform: showAllSkills ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                />
              </button>
            )}
          </>
        )}
      </div>

      {/* Categories */}
      <div
        className="rounded-[12px] p-5"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
        <div
          className="text-[10px] font-bold uppercase tracking-widest mb-4"
          style={{ color: "rgba(255,255,255,0.28)" }}>
          Analisis per bagian CV
        </div>
        {data.categories.length === 0 ? (
          <p
            className="text-[12px]"
            style={{ color: "rgba(255,255,255,0.25)" }}>
            Tidak ada data kategori.
          </p>
        ) : (
          <div className="space-y-[12px]">
            {data.categories.map((c, i) => {
              const col = scoreColor(c.score);
              return (
                <div key={i}>
                  <div className="flex justify-between mb-[5px]">
                    <span
                      className="text-[12px]"
                      style={{ color: "rgba(255,255,255,0.6)" }}>
                      {c.label}
                    </span>
                    <span
                      className="text-[12px] font-bold"
                      style={{ color: col }}>
                      {c.score}
                    </span>
                  </div>
                  <AnimatedBar
                    value={c.score}
                    color={col}
                    delay={i * 65 + 200}
                    height={5}
                  />
                  {c.feedback && (
                    <p
                      className="text-[10.5px] mt-[4px]"
                      style={{ color: "rgba(255,255,255,0.22)" }}>
                      {c.feedback}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Strengths */}
      <div
        className="rounded-[12px] p-5"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
        <div
          className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
          style={{ color: "rgba(255,255,255,0.28)" }}>
          <Star size={11} style={{ color: "rgba(74,222,128,0.5)" }} />
          Kekuatan CV
        </div>
        {data.strengths.length === 0 ? (
          <p
            className="text-[12px]"
            style={{ color: "rgba(255,255,255,0.25)" }}>
            Tidak ada data kekuatan.
          </p>
        ) : (
          <div className="space-y-[6px]">
            {data.strengths.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
                className="flex gap-[9px] items-start py-[8px] px-[10px] rounded-[8px]"
                style={{
                  background: "rgba(74,222,128,0.04)",
                  border: "1px solid rgba(74,222,128,0.08)",
                }}>
                <CheckCircle2
                  size={12}
                  className="flex-shrink-0 mt-[2px]"
                  style={{ color: "rgba(74,222,128,0.6)" }}
                />
                <span
                  className="text-[12px] leading-[1.55]"
                  style={{ color: "rgba(255,255,255,0.5)" }}>
                  {s}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Improvements */}
      <div
        className="rounded-[12px] p-5"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
        <div
          className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
          style={{ color: "rgba(255,255,255,0.28)" }}>
          <Lightbulb size={11} style={{ color: "rgba(245,158,11,0.5)" }} />
          Area perbaikan
        </div>
        {data.improvements.length === 0 ? (
          <p
            className="text-[12px]"
            style={{ color: "rgba(255,255,255,0.25)" }}>
            Tidak ada saran perbaikan.
          </p>
        ) : (
          <div className="space-y-[6px]">
            {data.improvements.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
                className="flex gap-[9px] items-start py-[8px] px-[10px] rounded-[8px]"
                style={{
                  background: "rgba(245,158,11,0.04)",
                  border: "1px solid rgba(245,158,11,0.09)",
                }}>
                <AlertTriangle
                  size={12}
                  className="flex-shrink-0 mt-[2px]"
                  style={{ color: "rgba(245,158,11,0.6)" }}
                />
                <span
                  className="text-[12px] leading-[1.55]"
                  style={{ color: "rgba(255,255,255,0.5)" }}>
                  {s}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
