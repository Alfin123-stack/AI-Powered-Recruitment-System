"use client";

import { useState } from "react";
import { getRec, getScoreColor } from "@/lib/helpers/candidate/dashboard";
import { CandidateRaw, CandidateStatus } from "@/types/candidates";
import { motion } from "framer-motion";
import {
  X,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Building2,
  Clock,
  FileText,
  ExternalLink,
  Lock,
  ClipboardList,
} from "lucide-react";
import { STATUS_CONFIG } from "@/constants/candidates";
import {
  isStatusLocked,
  CandidatesStatusConfirmModal,
  showStatusToast,
  type ConfirmableStatus,
} from "./CandidatesStatusConfirmModal";

// Same lock set as CandidatesActionDropdown — kept in sync manually since
// each file already keeps its own local action-button config.
//
// FIX: "accepted" dibuang — sudah dihapus dari CandidateStatus juga
// (types/candidates.ts), karena deriveDisplayStatus() tidak pernah
// benar-benar mengembalikan nilai ini ke UI.
const OFFER_FLOW_STATUSES: CandidateStatus[] = [
  "offered",
  "declined",
  "expired",
  "hired",
];

export function CandidatesModal({
  candidate,
  onClose,
  onStatusChange,
  onSendOnboarding,
}: {
  candidate: CandidateRaw;
  onClose: () => void;
  onStatusChange: (id: string, status: CandidateStatus) => void;
  // Sama seperti di CandidatesActionDropdown — buka OnboardingModal untuk
  // candidate ini, hanya relevan kalau status === "hired".
  onSendOnboarding: (candidate: CandidateRaw) => void;
}) {
  const rec = getRec(candidate.resumeScore, candidate.matchScore);
  const RecIcon = rec.icon;
  const st = STATUS_CONFIG[candidate.status as CandidateStatus];
  const isLocked = OFFER_FLOW_STATUSES.includes(
    candidate.status as CandidateStatus,
  );
  // FIX: sebelumnya kondisi ini cek `status === "accepted" || status ===
  // "hired"`. Backend (updateOfferStatus) men-set `status` langsung ke
  // "hired" di baris yang sama saat offer_status jadi "accepted", jadi
  // "accepted" tidak pernah benar-benar sampai ke UI sebagai nilai
  // `candidate.status` (lihat deriveDisplayStatus di
  // useCandidatesData.ts). Disederhanakan jadi satu-satunya kondisi yang
  // memang bisa terjadi.
  const canSendOnboarding = candidate.status === "hired";

  // TAMBAHAN: sama seperti di CandidatesActionDropdown — klik
  // Shortlist/Review/Reject sebelumnya langsung memanggil onStatusChange +
  // onClose tanpa dialog konfirmasi. CandidatesStatusConfirmModal sudah ada
  // lengkap tapi tidak pernah dirender di mana pun. Sekarang klik tombol
  // cuma men-set pending status; eksekusi + tutup modal detail pindah ke
  // handleConfirm.
  const [pendingStatus, setPendingStatus] = useState<ConfirmableStatus | null>(
    null,
  );

  // NOTE: sama seperti di CandidatesActionDropdown — onStatusChange
  // bertipe `(id, status) => void`, tidak ada Promise untuk di-await, jadi
  // `loading` di CandidatesStatusConfirmModal tidak merepresentasikan
  // request in-flight yang sesungguhnya.
  const handleConfirm = () => {
    if (!pendingStatus) return;
    onStatusChange(candidate.id, pendingStatus);
    // TAMBAHAN: toast konfirmasi visual setelah status berhasil diubah.
    showStatusToast(pendingStatus, candidate.name);
    setPendingStatus(null);
    onClose();
  };

  const handleCancel = () => setPendingStatus(null);

  const actionButtons: Array<{
    label: string;
    status: ConfirmableStatus;
    Icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
  }> = [
    {
      label: "Shortlist",
      status: "shortlisted",
      Icon: ThumbsUp,
      color: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.22)",
    },
    {
      label: "Review",
      status: "review",
      Icon: RotateCcw,
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.07)",
      border: "rgba(6,182,212,0.2)",
    },
    {
      label: "Reject",
      status: "rejected",
      Icon: ThumbsDown,
      color: "#f43f5e",
      bg: "rgba(244,63,94,0.07)",
      border: "rgba(244,63,94,0.2)",
    },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-[20px]"
        style={{
          background: "#0f1612",
          border: "1px solid rgba(16,185,129,0.2)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}>
        <div
          className="h-[3px] w-full rounded-t-[20px]"
          style={{
            background: st
              ? `linear-gradient(90deg,${st.color},transparent)`
              : "transparent",
          }}
        />

        {/* Header */}
        <div
          className="flex items-start justify-between px-6 pt-5 pb-4"
          style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-[12px] flex items-center justify-center font-extrabold text-[0.9rem] flex-shrink-0"
              style={{
                background: `${candidate.color}18`,
                color: candidate.color,
              }}>
              {candidate.avatar}
            </div>
            <div>
              <div className="font-bold text-[#e8f0ec] text-[15px]">
                {candidate.name}
              </div>
              <div className="text-[12px] text-[#7a9585] mt-[2px]">
                {candidate.job}
              </div>
              <div className="flex items-center gap-2 mt-2">
                {st && (
                  <span
                    className="inline-flex items-center gap-[5px] px-2 py-[3px] rounded-full text-[11px] font-bold"
                    style={{
                      background: st.bg,
                      color: st.color,
                      border: `1px solid ${st.border}`,
                    }}>
                    <span
                      className="w-[5px] h-[5px] rounded-full"
                      style={{ background: st.color }}
                    />
                    {st.label}
                  </span>
                )}
                <span
                  className="inline-flex items-center gap-[5px] px-2 py-[3px] rounded-full text-[11px] font-bold"
                  style={{
                    background: rec.bg,
                    color: rec.color,
                    border: `1px solid ${rec.border}`,
                  }}>
                  <RecIcon size={10} />
                  {rec.short}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            title="Close modal"
            onClick={onClose}
            className="w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors text-[#7a9585] hover:bg-[rgba(16,185,129,0.08)]"
            style={{
              background: "#141f19",
              border: "1px solid rgba(16,185,129,0.15)",
            }}>
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Score cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "AI Score",
                val: candidate.resumeScore,
                suffix: "/100",
                gradient: "linear-gradient(90deg,#10b981,#06b6d4)",
              },
              {
                label: "Match Score",
                val: candidate.matchScore,
                suffix: "%",
                gradient: "linear-gradient(90deg,#8b5cf6,#06b6d4)",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-[12px] p-4"
                style={{
                  background: "#141f19",
                  border: "1px solid rgba(16,185,129,0.12)",
                }}>
                <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-[#7a9585] mb-2">
                  {s.label}
                </div>
                <div className="flex items-end gap-1 mb-2">
                  <span
                    className="font-extrabold text-[2rem] leading-none"
                    style={{ color: getScoreColor(s.val) }}>
                    {s.val || "—"}
                  </span>
                  <span className="text-[11px] text-[#7a9585] mb-1">
                    {s.suffix}
                  </span>
                </div>
                <div
                  className="h-[4px] rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.val}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: s.gradient }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recommendation badge */}
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-[10px] text-[13px] font-semibold"
            style={{
              background: rec.bg,
              color: rec.color,
              border: `1px solid ${rec.border}`,
            }}>
            <RecIcon size={14} />
            {rec.label}
          </div>

          {/* Skills */}
          {candidate.skills.length > 0 && (
            <div>
              <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-[#7a9585] mb-2">
                Detected Skills
              </div>
              <div className="flex flex-wrap gap-[6px]">
                {candidate.skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-[9px] py-[4px] rounded-[6px] text-[12px] font-mono text-[#e8f0ec]"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meta info */}
          <div
            className="rounded-[12px] p-3 space-y-2"
            style={{
              background: "#141f19",
              border: "1px solid rgba(16,185,129,0.12)",
            }}>
            <div className="flex items-center gap-2 text-[12px] text-[#7a9585]">
              <Building2 size={12} className="flex-shrink-0" />
              {candidate.job}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#7a9585]">
              <Clock size={12} className="flex-shrink-0" />
              Applied {candidate.appliedDate}
            </div>
          </div>

          {/* CV link */}
          {candidate.cv_url ? (
            <a
              href={candidate.cv_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between w-full px-4 py-[10px] rounded-[10px] text-[13px] font-semibold no-underline text-[#10b981] hover:bg-[rgba(16,185,129,0.06)] transition-colors"
              style={{
                background: "#141f19",
                border: "1px solid rgba(16,185,129,0.15)",
              }}>
              <div className="flex items-center gap-2">
                <FileText size={14} />
                View Candidate CV
              </div>
              <ExternalLink size={12} />
            </a>
          ) : (
            <div
              className="flex items-center justify-center gap-2 w-full py-[10px] rounded-[10px] text-[13px] text-[#7a9585]"
              style={{
                background: "#141f19",
                border: "1px solid rgba(16,185,129,0.1)",
              }}>
              <FileText size={14} />
              CV not available
            </div>
          )}

          {/* Action buttons — hidden once in the offer flow; that stage is
              only ever changed via Evaluate & Offer, not this modal. */}
          {isLocked ? (
            <>
              {/* Kirim Onboarding Email — hanya untuk status "hired". */}
              {canSendOnboarding && (
                <button
                  type="button"
                  title={
                    candidate.onboarding_sent
                      ? "Onboarding email sudah dikirim"
                      : "Kirim detail onboarding ke kandidat ini"
                  }
                  onClick={() => onSendOnboarding(candidate)}
                  disabled={candidate.onboarding_sent}
                  className="flex items-center justify-center gap-2 w-full py-[10px] rounded-[10px] font-bold text-[13px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "rgba(16,185,129,0.1)",
                    color: "#10b981",
                    border: "1px solid rgba(16,185,129,0.28)",
                  }}>
                  <ClipboardList size={14} />
                  {candidate.onboarding_sent
                    ? "Onboarding Email Sudah Dikirim"
                    : "Kirim Onboarding Email"}
                </button>
              )}
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-[10px] text-[12px] font-medium"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#5d7a6a",
                }}>
                <Lock size={13} className="flex-shrink-0" />
                Status is managed via the Evaluate &amp; Offer flow on the
                Interviews page.
              </div>
            </>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {actionButtons.map(({ label, status, Icon, color, bg, border }) => {
                const isActive = candidate.status === status;

                // TAMBAHAN: aturan lock yang sama dengan
                // CandidatesActionDropdown (satu sumber kebenaran di
                // CandidatesStatusConfirmModal.tsx) — kalau kandidat sudah
                // shortlisted, Review & Reject terkunci; kalau sudah
                // rejected, Shortlist & Review terkunci. Status "review"
                // tidak mengunci apa pun.
                const isCrossLocked = isStatusLocked(
                  candidate.status as CandidateStatus,
                  status,
                );
                const disabled = isActive || isCrossLocked;

                const title = isActive
                  ? `Kandidat sudah berstatus ${label}`
                  : isCrossLocked
                    ? `Tidak bisa diubah — kandidat sudah ${
                        STATUS_CONFIG[candidate.status as CandidateStatus]
                          ?.label ?? candidate.status
                      }`
                    : `Change candidate status to ${label}`;

                return (
                  <button
                    key={status}
                    type="button"
                    title={title}
                    onClick={() => {
                      // FIX: sebelumnya `onStatusChange(candidate.id, status);
                      // onClose();` langsung dipanggil di sini tanpa
                      // konfirmasi. Sekarang cuma buka
                      // CandidatesStatusConfirmModal — eksekusi + penutupan
                      // modal detail pindah ke handleConfirm.
                      setPendingStatus(status);
                    }}
                    disabled={disabled}
                    className="flex items-center justify-center gap-[6px] py-[9px] rounded-[10px] font-bold text-[13px] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      background: bg,
                      color,
                      border: `1px solid ${border}`,
                    }}>
                    <Icon size={13} />
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
      {/* TAMBAHAN: konfirmasi sebelum status benar-benar berubah */}
      {pendingStatus && (
        <CandidatesStatusConfirmModal
          status={pendingStatus}
          candidateName={candidate.name}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}