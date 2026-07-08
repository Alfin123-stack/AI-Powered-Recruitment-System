"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ClipboardCheck,
  Gauge,
  FileText,
  ThumbsUp,
} from "lucide-react";
import type { Interview } from "@/types/calendar";
import { useInterviewsEvaluation } from "@/hooks/dashboard/hr/useInterviewsEvaluation";
import RichTextEditor, { isRichTextEmpty } from "./RichTextEditor";

export type EvaluationResult = {
  score: number; // 1–10
  notes: string;
  recommendation: "hire" | "reject" | "consider";
};

interface EvaluationModalProps {
  interview: Interview;
  candidateEmail: string;
  companyName: string;
  onClose: () => void;
  /** Called when HR clicks Hire — parent opens OfferLetterModal */
  onHire: (evaluation: EvaluationResult) => void;
  /** Called when HR clicks Reject — parent sends rejection email */
  onReject: (evaluation: EvaluationResult) => void;
  /** Called when HR clicks Consider — parent saves evaluation only, no email */
  onConsider: (evaluation: EvaluationResult) => void;
}

const SCORE_LABELS: Record<number, string> = {
  1: "Very poor",
  2: "Poor",
  3: "Below average",
  4: "Average",
  5: "Satisfactory",
  6: "Good",
  7: "Very good",
  8: "Excellent",
  9: "Outstanding",
  10: "Exceptional",
};

const RECOMMENDATIONS = [
  {
    id: "hire" as const,
    label: "Hire",
    icon: CheckCircle2,
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
  },
  {
    id: "consider" as const,
    label: "Consider",
    icon: Clock,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
  },
  {
    id: "reject" as const,
    label: "Reject",
    icon: XCircle,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
  },
];

function EvaluationSection({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <span className="text-emerald-400/70">{icon}</span>
      <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#4d7060]">
        {label}
      </span>
      <div className="flex-1 h-px bg-emerald-500/10" />
    </div>
  );
}

export default function EvaluationModal({
  interview,
  companyName,
  onClose,
  onHire,
  onReject,
  onConsider,
}: EvaluationModalProps) {
  const {
    score,
    setScore,
    notes,
    setNotes,
    recommendation,
    setRecommendation,
    submitting,
    handleSubmit,
  } = useInterviewsEvaluation({ onHire, onReject, onConsider });

  const isEdit = false; // kept for parity with JobsFormModal's icon-swap pattern

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-[8px]">
        <div className="absolute inset-0" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[520px] max-h-[92vh] flex flex-col bg-[#0a100c] border border-emerald-500/20 rounded-[20px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent flex-shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-500/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ClipboardCheck size={15} />
              </div>
              <div>
                <h2 className="font-bold text-[0.95rem] text-[#e8f0ec] leading-none">
                  Post-Interview Evaluation
                </h2>
                <p className="text-[0.72rem] text-[#4d7060] mt-[3px]">
                  {interview.candidate_name} · {interview.job_title}
                </p>
              </div>
            </div>
            <button
              title="close"
              onClick={onClose}
              className="w-8 h-8 rounded-[7px] bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#4d7060] hover:text-[#e8f0ec] hover:border-emerald-500/25 transition-all cursor-pointer">
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            <EvaluationSection label="Overall Score" icon={<Gauge size={12} />} />

            {/* Score */}
            <div className="flex flex-col gap-[5px]">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-[6px] text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
                  <span className="opacity-60">
                    <Star size={10} />
                  </span>
                  Score
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[1.05rem] font-black text-emerald-400">
                    {score}
                  </span>
                  <span className="text-[0.65rem] text-[#3d5c49]">/10</span>
                  <span className="ml-2 text-[0.68rem] text-[#5a8070]">
                    — {SCORE_LABELS[score]}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer mt-1"
                style={{
                  background: `linear-gradient(to right, #10b981 ${(score - 1) * 11.1}%, rgba(255,255,255,0.07) ${(score - 1) * 11.1}%)`,
                }}
              />
              <div className="flex justify-between mt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <div
                    key={n}
                    className="flex flex-col items-center gap-[2px] cursor-pointer"
                    onClick={() => setScore(n)}>
                    <Star
                      size={9}
                      fill={n <= score ? "#10b981" : "transparent"}
                      color={n <= score ? "#10b981" : "rgba(255,255,255,0.1)"}
                    />
                    <span className="text-[0.55rem] text-[#3d5c49]">{n}</span>
                  </div>
                ))}
              </div>
            </div>

            <EvaluationSection label="Details" icon={<FileText size={12} />} />

            {/* Notes */}
            <div className="flex flex-col gap-[5px]">
              <label className="flex items-center gap-[6px] text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
                <span className="opacity-60">
                  <FileText size={10} />
                </span>
                Evaluation Notes <span className="text-red-400 normal-case">*</span>
              </label>
              <RichTextEditor
                value={notes}
                onChange={setNotes}
                placeholder="Write your evaluation — candidate's strengths, performance during interview, cultural fit..."
              />
            </div>

            <EvaluationSection
              label="Recommendation"
              icon={<ThumbsUp size={12} />}
            />

            {/* Recommendation */}
            <div className="flex flex-col gap-[5px]">
              <div className="grid grid-cols-3 gap-2">
                {RECOMMENDATIONS.map(({ id, label, icon: Icon, color, bg, border }) => (
                  <button
                    key={id}
                    onClick={() => setRecommendation(id)}
                    className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-[10px] transition-all cursor-pointer border"
                    style={{
                      background:
                        recommendation === id ? bg : "rgba(255,255,255,0.02)",
                      borderColor:
                        recommendation === id ? border : "rgba(255,255,255,0.06)",
                      color: recommendation === id ? color : "#4d7060",
                    }}>
                    <Icon size={16} />
                    <span className="text-[0.75rem] font-bold">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info box */}
            {recommendation === "hire" && (
              <div
                className="rounded-[10px] px-3 py-2.5 text-[0.75rem]"
                style={{
                  background: "rgba(16,185,129,0.06)",
                  border: "1px solid rgba(16,185,129,0.15)",
                  color: "#5d9e7a",
                }}>
                ✓ After submitting, you&apos;ll be prompted to fill in the offer letter details.
              </div>
            )}
            {recommendation === "reject" && (
              <div
                className="rounded-[10px] px-3 py-2.5 text-[0.75rem]"
                style={{
                  background: "rgba(239,68,68,0.05)",
                  border: "1px solid rgba(239,68,68,0.15)",
                  color: "#9a6060",
                }}>
                ✗ Your notes will be sent as feedback to the candidate via in-app notification and email.
              </div>
            )}
            {recommendation === "consider" && (
              <div
                className="rounded-[10px] px-3 py-2.5 text-[0.75rem]"
                style={{
                  background: "rgba(245,158,11,0.05)",
                  border: "1px solid rgba(245,158,11,0.15)",
                  color: "#9a8060",
                }}>
                ~ This saves the evaluation without sending any notification yet. You can decide later.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-2 px-6 py-4 border-t border-emerald-500/10 bg-[#080f0b] flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-[10px] rounded-[10px] border border-emerald-500/15 text-[#5a8070] text-[0.82rem] font-medium hover:border-emerald-500/30 hover:text-[#e8f0ec] transition-all cursor-pointer">
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={isRichTextEmpty(notes) || submitting}
              className="flex-[2] flex items-center justify-center gap-2 py-[10px] rounded-[10px] text-[0.82rem] font-bold transition-all cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  recommendation === "hire"
                    ? "#10b981"
                    : recommendation === "reject"
                    ? "rgba(239,68,68,0.85)"
                    : "rgba(245,158,11,0.8)",
                color: recommendation === "hire" ? "#000" : "#fff",
              }}>
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Menyimpan...
                </>
              ) : recommendation === "hire" ? (
                "Submit & Proceed to Offer"
              ) : recommendation === "reject" ? (
                "Submit & Send Rejection"
              ) : (
                "Save Evaluation"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}