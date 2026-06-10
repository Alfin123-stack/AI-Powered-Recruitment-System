"use client";

// app/dashboard/candidate/_components/AiInsightCard.tsx
// CSR — interactive expand/collapse, radial progress animations

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Brain,
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Sparkles,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { timeAgo } from "../../../lib/helpers/candidate/dashboard";
import { CvAnalysis } from "@/types/candidate-dashboard";

// ── Radial Score ──────────────────────────────────────────────────────────────
function RadialScore({
  score,
  size = 80,
  strokeWidth = 6,
  color = "#10b981",
  label,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        <text
          x={size / 2}
          y={size / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={size * 0.22}
          fontWeight="700"
          style={{
            transform: "rotate(90deg)",
            transformOrigin: `${size / 2}px ${size / 2}px`,
          }}>
          {score}
        </text>
      </svg>
      {label && (
        <span className="text-[0.65rem] text-[#7a9585] font-medium tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function CvEmptyState() {
  return (
    <div className="bg-[#0a0f0c] border border-dashed border-emerald-500/20 rounded-[18px] px-6 py-5 mb-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-[12px] bg-emerald-500/[0.05] border border-emerald-500/15 flex items-center justify-center text-emerald-500/30 flex-shrink-0">
        <Brain size={20} />
      </div>
      <div className="flex-1">
        <p className="text-[0.88rem] font-bold mb-1">CV belum dianalisis AI</p>
        <p className="text-[0.74rem] text-[#7a9585] leading-relaxed">
          Upload CV untuk mendapatkan Resume Score, ATS Score, skill extraction,
          kelebihan & saran perbaikan dari AI.
        </p>
      </div>
      <Button
        asChild
        className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.8rem] px-4 py-2 rounded-[9px] flex-shrink-0">
        <Link href="/analyze" className="inline-flex items-center gap-2">
          <Upload size={13} /> Upload CV
        </Link>
      </Button>
    </div>
  );
}

// ── Main Card ─────────────────────────────────────────────────────────────────
export function DashboardAIInsight({ cv }: { cv: CvAnalysis | null }) {
  const [expanded, setExpanded] = useState(false);

  if (!cv) return <CvEmptyState />;

  const getScoreLabel = (score: number) => {
    if (score >= 85) return { label: "Excellent", color: "#10b981" };
    if (score >= 70) return { label: "Good", color: "#06b6d4" };
    if (score >= 55) return { label: "Fair", color: "#f59e0b" };
    return { label: "Needs Work", color: "#ef4444" };
  };
  const overall = getScoreLabel(cv.overall_score);

  const strengths = cv.strengths ?? [];
  const improvements = cv.improvements ?? [];
  const hasInsights = strengths.length > 0 || improvements.length > 0;

  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/20 rounded-[18px] overflow-hidden mb-5">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 bg-gradient-to-r from-emerald-500/[0.08] to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-emerald-500/15 flex items-center justify-center">
              <Brain size={14} className="text-emerald-400" />
            </div>
            <span className="font-bold text-[0.88rem] text-[#e8f0ec]">
              AI Resume Analysis
            </span>
            <span
              className="px-2 py-[2px] rounded-full text-[0.62rem] font-bold uppercase tracking-wider"
              style={{
                background: `${overall.color}18`,
                color: overall.color,
                border: `1px solid ${overall.color}25`,
              }}>
              {overall.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {cv.file_name && (
              <div className="flex items-center gap-1 text-[0.7rem] text-[#7a9585]">
                <FileText size={11} />
                <span className="truncate max-w-[140px]">{cv.file_name}</span>
                <span className="opacity-40">·</span>
                <Clock size={10} />
                <span>{timeAgo(cv.created_at)}</span>
              </div>
            )}
            <Button
              variant="outline"
              asChild
              className="h-7 px-3 text-[0.73rem] border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40 bg-transparent rounded-[7px] gap-1">
              <Link href="/analyze">
                <RefreshCw size={11} /> Update
              </Link>
            </Button>
          </div>
        </div>

        {/* Score rings + category bars */}
        <div className="flex items-center gap-6">
          <RadialScore
            score={cv.resume_score}
            size={88}
            strokeWidth={7}
            color="#10b981"
            label="Resume"
          />
          <RadialScore
            score={cv.ats_score}
            size={72}
            strokeWidth={6}
            color="#8b5cf6"
            label="ATS"
          />
          <RadialScore
            score={cv.overall_score}
            size={72}
            strokeWidth={6}
            color="#f59e0b"
            label="Overall"
          />

          <div className="flex-1 min-w-0">
            {((cv.categories ?? []).length > 0
              ? cv.categories!
              : [
                  { label: "Resume Score", score: cv.resume_score },
                  { label: "ATS Compatibility", score: cv.ats_score },
                  { label: "Overall Quality", score: cv.overall_score },
                ]
            )
              .slice(0, 4)
              .map((cat) => (
                <div
                  key={cat.label}
                  className="flex items-center gap-3 mb-[9px] last:mb-0">
                  <span className="text-[0.71rem] text-[#7a9585] w-[110px] shrink-0 truncate">
                    {cat.label}
                  </span>
                  <div className="flex-1 h-[4px] rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${cat.score}%`,
                        background:
                          cat.score >= 75
                            ? "linear-gradient(90deg,#10b981,#06b6d4)"
                            : cat.score >= 55
                              ? "linear-gradient(90deg,#f59e0b,#f97316)"
                              : "linear-gradient(90deg,#ef4444,#f43f5e)",
                        transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    />
                  </div>
                  <span
                    className="text-[0.71rem] font-bold w-7 text-right"
                    style={{
                      color:
                        cat.score >= 75
                          ? "#10b981"
                          : cat.score >= 55
                            ? "#f59e0b"
                            : "#ef4444",
                    }}>
                    {cat.score}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Skill chips */}
        {(cv.extracted_skills?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-[5px] mt-3">
            {cv.extracted_skills!.slice(0, 8).map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-[5px] px-[8px] py-[3px] rounded-[5px] text-[0.67rem] font-mono bg-emerald-500/[0.08] border border-emerald-500/15">
                <span className="text-emerald-400">{s.name}</span>
                {s.level > 0 && (
                  <div className="w-[28px] h-[3px] rounded-full bg-white/[0.08]">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
            {cv.extracted_skills!.length > 8 && (
              <span className="px-[8px] py-[3px] text-[0.67rem] text-[#7a9585]">
                +{cv.extracted_skills!.length - 8} lainnya
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expandable insights */}
      {hasInsights && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-5 py-[10px] text-[0.75rem] text-[#7a9585] hover:text-[#e8f0ec] transition-colors border-t border-emerald-500/10 bg-transparent cursor-pointer">
            <span className="flex items-center gap-2">
              <Sparkles size={12} className="text-emerald-400" />
              Detail AI Insights ({strengths.length + improvements.length} poin)
            </span>
            <ChevronDown
              size={14}
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.2s",
              }}
            />
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden">
                <div className="px-5 pb-5 grid grid-cols-2 gap-4">
                  {strengths.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 mb-2 text-[0.72rem] font-bold text-emerald-400">
                        <CheckCircle2 size={12} /> Kelebihan CV
                      </div>
                      <div className="space-y-[6px]">
                        {strengths.slice(0, 4).map((s, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-[0.73rem] text-[#a0b5aa]">
                            <div className="w-[5px] h-[5px] rounded-full bg-emerald-400/60 mt-[5px] flex-shrink-0" />
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {improvements.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 mb-2 text-[0.72rem] font-bold text-amber-400">
                        <AlertCircle size={12} /> Saran Perbaikan
                      </div>
                      <div className="space-y-[6px]">
                        {improvements.slice(0, 4).map((s, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-[0.73rem] text-[#a0b5aa]">
                            <div className="w-[5px] h-[5px] rounded-full bg-amber-400/60 mt-[5px] flex-shrink-0" />
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
