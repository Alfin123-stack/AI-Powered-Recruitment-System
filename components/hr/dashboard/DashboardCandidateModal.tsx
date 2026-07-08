"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp,
  ThumbsDown,
  Eye,
  Building2,
  X,
  FileText,
  Clock,
  ExternalLink,
  CheckCircle2,
  Brain,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";
import type {
  CandidateUI,
  InsightPanel,
  ScoreItem,
  StatusAction,
} from "@/types/hr/dashboard";
// FIX: dibutuhkan supaya onStatusChange bisa diketatkan jadi CandidateStatus
// — sebelumnya bertipe `string` bebas, yang bikin `onStatusChange={updateStatus}`
// dari DashboardClient.tsx gagal type-check begitu updateStatus di sana
// diketatkan jadi (id: string, status: CandidateStatus) => void.
import type { CandidateStatus } from "@/types/candidates";
import { getScoreColor, getScoreGradient, statusMap, computeInsight } from "@/lib/helpers/hr/dashboard";
import {
  isLocked,
  hasScore,
  showStatusToast,
  getRecommendationDisplay,
  type ConfirmableStatus,
} from "@/lib/helpers/hr/dashboardStatus";
import { DashboardStatusConfirmModal } from "./DashboardStatusConfirmModal";

export function DashboardCandidateModal({
  candidate,
  onClose,
  onStatusChange,
  onSendOnboarding,
}: {
  candidate: CandidateUI;
  onClose: () => void;
  onStatusChange: (id: string, status: CandidateStatus) => void;
  // TAMBAHAN: buka OnboardingModal untuk candidate ini. Hanya relevan kalau
  // offer_status === "accepted" — lihat tombol di body modal di bawah.
  onSendOnboarding: (c: CandidateUI) => void;
}) {
  const st = statusMap[candidate.status] ?? {
    label: candidate.status,
    color: "#475569",
  };
  const rec = getRecommendationDisplay(candidate);
  const ins = useMemo(() => computeInsight(candidate), [candidate]);

  const RecIcon = rec.Icon;

  const scoreItems: ScoreItem[] = [
    { label: "AI Score", val: candidate.resumeScore, suffix: "/100" },
    { label: "Match Score", val: candidate.matchScore, suffix: "%" },
  ];

  const insightPanels: InsightPanel[] = [
    {
      title: "Kekuatan",
      items: ins.strengths.slice(0, 3),
      color: "#10b981",
      bg: "rgba(16,185,129,0.06)",
      border: "rgba(16,185,129,0.15)",
      Icon: CheckCircle2,
    },
    {
      title: "Perhatian",
      items: ins.weaknesses.slice(0, 3),
      color: "#ef4444",
      bg: "rgba(239,68,68,0.05)",
      border: "rgba(239,68,68,0.15)",
      Icon: AlertTriangle,
    },
  ];

  const locked = isLocked(candidate.status);

  // Status yang menunggu konfirmasi HR lewat DashboardStatusConfirmModal —
  // klik tombol cuma men-set pending status; eksekusi + toast + penutupan
  // modal detail ada di handleConfirm.
  const [pendingStatus, setPendingStatus] = useState<ConfirmableStatus | null>(
    null,
  );

  const handleConfirm = () => {
    if (!pendingStatus) return;
    onStatusChange(candidate.id, pendingStatus);
    showStatusToast(pendingStatus, candidate.name);
    setPendingStatus(null);
    onClose();
  };

  const handleCancel = () => setPendingStatus(null);

  const statusActions: StatusAction[] = [
    {
      label: "Shortlist",
      status: "shortlisted",
      Icon: ThumbsUp,
      color: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.25)",
    },
    {
      label: "Review",
      status: "review",
      Icon: Eye,
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.07)",
      border: "rgba(6,182,212,0.2)",
    },
    {
      label: "Tolak",
      status: "rejected",
      Icon: ThumbsDown,
      color: "#ef4444",
      bg: "rgba(239,68,68,0.07)",
      border: "rgba(239,68,68,0.2)",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-[8px] p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Candidate detail ${candidate.name}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-[520px] max-h-[92vh] overflow-y-auto rounded-[20px] bg-[#0a0f0c] border border-emerald-500/25"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>
        <div
          className="h-[3px] rounded-t-[20px]"
          style={{
            background: `linear-gradient(90deg,${st.color},transparent)`,
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-12 h-12 rounded-[13px] flex items-center justify-center text-[0.9rem] font-black flex-shrink-0"
              style={{
                background: `${candidate.color}18`,
                border: `1px solid ${candidate.color}30`,
                color: candidate.color,
              }}>
              {candidate.avatar}
            </div>
            <div className="min-w-0">
              <div className="font-black text-[0.95rem] text-[#e8f0ec]">
                {candidate.name}
              </div>
              <div className="text-[0.75rem] text-[#7a9585] mt-[2px] truncate">
                {candidate.job}
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span
                  className="text-[0.68rem] font-bold px-2 py-[3px] rounded-full flex items-center gap-1"
                  style={{
                    background: `${st.color}18`,
                    color: st.color,
                    border: `1px solid ${st.color}30`,
                  }}>
                  <span
                    className="w-[5px] h-[5px] rounded-full"
                    style={{ background: st.color }}
                    aria-hidden="true"
                  />
                  {st.label}
                </span>
                <span
                  className="text-[0.68rem] font-bold px-2 py-[3px] rounded-full flex items-center gap-1 border"
                  style={{
                    background: rec.bg,
                    color: rec.color,
                    borderColor: rec.border,
                  }}>
                  <RecIcon size={10} aria-hidden="true" /> {rec.label}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            title="Close candidate detail"
            aria-label="Close candidate detail"
            onClick={onClose}
            className="w-8 h-8 rounded-[9px] bg-white/[0.05] border border-white/10 flex items-center justify-center cursor-pointer text-[#64748b] hover:text-[#e8f0ec] hover:bg-white/[0.08] transition-colors flex-shrink-0">
            <X size={13} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          {/* Scores */}
          <div className="grid grid-cols-2 gap-3">
            {scoreItems.map((s) => (
              <div
                key={s.label}
                className="rounded-[13px] p-4 bg-white/[0.03] border border-white/[0.07]">
                <div className="text-[0.62rem] font-bold uppercase tracking-widest text-[#7a9585] mb-2">
                  {s.label}
                </div>
                <div className="flex items-end gap-1 mb-3">
                  <span
                    className="font-black text-[2rem] leading-none"
                    style={{ color: getScoreColor(s.val) }}>
                    {hasScore(s.val) ? s.val : "—"}
                  </span>
                  <span className="text-[0.7rem] text-[#7a9585] mb-[2px]">
                    {s.suffix}
                  </span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${hasScore(s.val) ? s.val : 0}%` }}
                    transition={{ duration: 0.9 }}
                    className="h-full rounded-full"
                    style={{ background: getScoreGradient(s.val) }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Analysis */}
          <div className="rounded-[13px] p-4 bg-emerald-500/[0.04] border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Brain
                size={13}
                className="text-emerald-400"
                aria-hidden="true"
              />
              <span className="text-[0.72rem] font-bold text-emerald-400">
                AI Analysis
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {insightPanels.map(
                ({ title, items, color, bg, border, Icon }) => (
                  <div
                    key={title}
                    className="rounded-[9px] p-3"
                    style={{ background: bg, border: `1px solid ${border}` }}>
                    <div
                      className="text-[0.6rem] font-black uppercase tracking-widest mb-2 flex items-center gap-1"
                      style={{ color }}>
                      <Icon size={9} aria-hidden="true" /> {title}
                    </div>
                    {items.map((s, i) => (
                      <div
                        key={i}
                        className="text-[0.68rem] mb-1 flex items-start gap-1"
                        style={{ color: `${color}cc` }}>
                        <span
                          className="mt-[5px] w-1 h-1 rounded-full flex-shrink-0"
                          style={{ background: color }}
                          aria-hidden="true"
                        />
                        {s}
                      </div>
                    ))}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Skills */}
          {candidate.skills.length > 0 && (
            <div>
              <div className="text-[0.62rem] font-bold uppercase tracking-widest text-[#7a9585] mb-2">
                Skills Terdeteksi
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-[7px] text-[0.75rem] font-mono text-[#e8f0ec] bg-white/[0.04] border border-white/[0.08]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="rounded-[12px] p-3 bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-[0.75rem] text-[#7a9585]">
              <Building2
                size={12}
                className="text-[#475569]"
                aria-hidden="true"
              />
              {candidate.job}
            </div>
            <div className="flex items-center gap-2 text-[0.75rem] text-[#7a9585]">
              <Clock size={12} className="text-[#475569]" aria-hidden="true" />
              Dilamar {candidate.appliedDate}
            </div>
          </div>

          {/* CV Link */}
          {candidate.cv_url ? (
            <a
              href={candidate.cv_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-[11px] no-underline bg-emerald-500/[0.07] border border-emerald-500/20 text-emerald-400 text-[0.82rem] font-semibold hover:bg-emerald-500/[0.12] transition-colors">
              <div className="flex items-center gap-2">
                <FileText size={14} aria-hidden="true" /> Lihat CV Kandidat
              </div>
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          ) : (
            <div className="flex items-center justify-center gap-2 p-3 rounded-[11px] bg-white/[0.02] border border-white/[0.06] text-[0.82rem] text-[#7a9585]">
              <FileText size={14} aria-hidden="true" /> CV tidak tersedia
            </div>
          )}

          {/* Kirim Onboarding Email — hanya muncul kalau offer sudah diterima
              kandidat. Butuh field `offer_status`, `onboarding_sent`, `email`
              di CandidateUI (types/hr/dashboard.ts):
              offer_status?: "pending" | "accepted" | "declined" | null;
              onboarding_sent?: boolean;
              email?: string;
              FIX: backend langsung set status="hired" begitu offer accepted
              (offer_status="accepted" jadi field terpisah) — kombinasikan
              keduanya supaya tetap kena walau offer_status belum ke-mapping
              dari API. */}
          {(candidate.offer_status === "accepted" ||
            candidate.status === "hired") && (
            <button
              type="button"
              title={
                candidate.onboarding_sent
                  ? "Onboarding email sudah dikirim"
                  : "Kirim detail onboarding ke kandidat ini"
              }
              onClick={() => onSendOnboarding(candidate)}
              disabled={candidate.onboarding_sent}
              className="flex items-center justify-center gap-2 p-3 rounded-[11px] font-bold text-[0.82rem] cursor-pointer transition-all duration-150 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "rgba(16,185,129,0.1)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.28)",
              }}>
              <ClipboardList size={13} aria-hidden="true" />
              {candidate.onboarding_sent
                ? "Onboarding Email Sudah Dikirim"
                : "Kirim Onboarding Email"}
            </button>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-2">
            {statusActions.map(({ label, status, Icon, color, bg, border }) => (
              <button
                key={status}
                type="button"
                title={locked ? `${st.label} — keputusan sudah final` : label}
                aria-label={`${label} candidate ${candidate.name}`}
                onClick={() => setPendingStatus(status as ConfirmableStatus)}
                disabled={locked || candidate.status === status}
                className="flex items-center justify-center gap-2 p-3 rounded-[11px] font-bold text-[0.82rem] cursor-pointer transition-all duration-150 hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: bg,
                  color,
                  border: `1px solid ${border}`,
                }}>
                <Icon size={13} aria-hidden="true" /> {label}
              </button>
            ))}
          </div>
          {locked && (
            <p className="text-[0.68rem] text-[#5d7a6a] text-center -mt-2">
              Kandidat ini sudah berstatus &quot;{st.label}&quot; — tidak bisa diubah lewat aksi cepat.
            </p>
          )}
        </div>
      </motion.div>
      {pendingStatus && (
        <DashboardStatusConfirmModal
          status={pendingStatus}
          candidateName={candidate.name}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
