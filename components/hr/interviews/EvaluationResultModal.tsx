"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  User,
  ClipboardList,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

// Bentuk data dari GET /api/evaluations/application/:applicationId.
// Field evaluator_name & notes cuma muncul kalau yang fetch adalah HR
// (backend filter otomatis berdasarkan role token) — di sisi HR dua-duanya
// ada, jadi tetap dideklarasikan optional supaya komponen ini reusable
// kalau suatu saat dipakai juga di sisi candidate.
export interface EvaluationRecord {
  id: string;
  interview_id?: string | null;
  evaluator_name?: string;
  score: number;
  recommendation: "hire" | "reject" | "consider";
  notes?: string | null;
  created_at: string;
}

interface EvaluationResultModalProps {
  applicationId: string;
  token: string;
  candidateName?: string;
  jobTitle?: string;
  onClose: () => void;
}

const RECOMMENDATION_META: Record <
  EvaluationRecord["recommendation"],
  { label: string; icon: typeof CheckCircle2; color: string; bg: string; border: string }
> = {
  hire: {
    label: "Hire",
    icon: CheckCircle2,
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
  },
  consider: {
    label: "Consider",
    icon: Clock,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
  },
  reject: {
    label: "Reject",
    icon: XCircle,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
  },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function ResultSection({ label, icon }: { label: string; icon: React.ReactNode }) {
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

export default function EvaluationResultModal({
  applicationId,
  token,
  candidateName,
  jobTitle,
  onClose,
}: EvaluationResultModalProps) {
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch(
          `/api/evaluations/application/${applicationId}`,
          token,
        );
        if (!cancelled) setEvaluations(data ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Gagal memuat data evaluasi.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [applicationId, token]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-[8px]">
        <div className="absolute inset-0" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[560px] max-h-[92vh] flex flex-col bg-[#0a100c] border border-emerald-500/20 rounded-[20px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent flex-shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-500/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ClipboardList size={15} />
              </div>
              <div>
                <h2 className="font-bold text-[0.95rem] text-[#e8f0ec] leading-none">
                  Evaluation Results
                </h2>
                {(candidateName || jobTitle) && (
                  <p className="text-[0.72rem] text-[#4d7060] mt-[3px]">
                    {candidateName} {candidateName && jobTitle ? "·" : ""} {jobTitle}
                  </p>
                )}
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
            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Loader2 size={22} className="text-emerald-400 animate-spin" />
                <p className="text-[0.78rem] text-[#5a8070]">Memuat evaluasi...</p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                <AlertCircle size={22} className="text-red-400" />
                <p className="text-[0.78rem] text-red-400">{error}</p>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && evaluations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                <Clock size={22} className="text-[#3d5c49]" />
                <p className="text-[0.78rem] text-[#5a8070]">
                  Belum ada evaluasi tersimpan untuk kandidat ini.
                </p>
              </div>
            )}

            {/* List */}
            {!loading && !error && evaluations.length > 0 && (
              <>
                <ResultSection
                  label={`${evaluations.length} Evaluasi`}
                  icon={<ClipboardList size={12} />}
                />
                <div className="flex flex-col gap-3">
                  {evaluations.map((evaluation) => {
                    const meta = RECOMMENDATION_META[evaluation.recommendation];
                    const Icon = meta.icon;
                    return (
                      <div
                        key={evaluation.id}
                        className="rounded-[12px] p-4"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}>
                        {/* Row 1: recommendation badge + score */}
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.72rem] font-bold border"
                            style={{
                              background: meta.bg,
                              borderColor: meta.border,
                              color: meta.color,
                            }}>
                            <Icon size={12} />
                            {meta.label}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star size={12} fill="#10b981" color="#10b981" />
                            <span className="text-[0.85rem] font-black text-emerald-400">
                              {evaluation.score}
                            </span>
                            <span className="text-[0.65rem] text-[#3d5c49]">/10</span>
                          </div>
                        </div>

                        {/* Notes */}
                        {evaluation.notes && (
                          <p className="text-[0.8rem] text-[#c8d8d0] leading-relaxed mb-3 whitespace-pre-wrap">
                            {evaluation.notes}
                          </p>
                        )}

                        {/* Footer: evaluator + date */}
                        <div className="flex items-center justify-between text-[0.68rem] text-[#5a8070]">
                          {evaluation.evaluator_name && (
                            <span className="flex items-center gap-1">
                              <User size={10} />
                              {evaluation.evaluator_name}
                            </span>
                          )}
                          <span>{formatDate(evaluation.created_at)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-2 px-6 py-4 border-t border-emerald-500/10 bg-[#080f0b] flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-[10px] rounded-[10px] border border-emerald-500/15 text-[#5a8070] text-[0.82rem] font-medium hover:border-emerald-500/30 hover:text-[#e8f0ec] transition-all cursor-pointer">
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}