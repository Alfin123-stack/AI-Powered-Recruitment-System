"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CandidateStatus } from "@/types/candidates";

// ─────────────────────────────────────────────────────────────────────────────
// Status yang bisa diubah manual oleh HR lewat dropdown/modal aksi di
// Candidates Table — di luar 4 status offer-flow (offered/declined/
// expired/hired) yang cuma bisa berubah lewat Evaluate & Offer di halaman
// Interviews.
// ─────────────────────────────────────────────────────────────────────────────
export type ConfirmableStatus = "shortlisted" | "review" | "rejected";

// ─────────────────────────────────────────────────────────────────────────────
// LOCK RULE — dipakai bersama oleh CandidatesActionDropdown &
// CandidatesModal supaya aturannya konsisten di satu tempat.
//
// - Kandidat sudah "shortlisted" → tombol Review & Reject terkunci.
// - Kandidat sudah "rejected"    → tombol Shortlist & Review terkunci.
// - Kandidat "review" (atau status lain di luar 2 di atas) → tidak ada
//   yang dikunci, HR masih bebas pindah ke Shortlist/Reject.
// ─────────────────────────────────────────────────────────────────────────────
export function isStatusLocked(
  currentStatus: CandidateStatus,
  targetStatus: ConfirmableStatus,
): boolean {
  if (currentStatus === "shortlisted") {
    return targetStatus === "review" || targetStatus === "rejected";
  }
  if (currentStatus === "rejected") {
    return targetStatus === "review" || targetStatus === "shortlisted";
  }
  return false;
}

interface StatusConfirmConfig {
  title: string;
  description: (name: string) => string;
  confirmLabel: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
}

const CONFIRM_CONFIG: Record<ConfirmableStatus, StatusConfirmConfig> = {
  shortlisted: {
    title: "Shortlist kandidat ini?",
    description: (name) =>
      `${name} akan masuk ke tahap shortlisted dan siap dijadwalkan untuk interview.`,
    confirmLabel: "Ya, Shortlist",
    icon: ThumbsUp,
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.3)",
  },
  review: {
    title: "Pindahkan ke In Review?",
    description: (name) =>
      `${name} akan ditandai sedang dalam proses review lebih lanjut.`,
    confirmLabel: "Ya, Pindahkan",
    icon: RotateCcw,
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.12)",
    border: "rgba(6,182,212,0.3)",
  },
  rejected: {
    title: "Tolak kandidat ini?",
    description: (name) =>
      `${name} akan ditandai sebagai rejected. Status ini masih bisa diubah lagi selama belum masuk proses offer.`,
    confirmLabel: "Ya, Tolak",
    icon: ThumbsDown,
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.12)",
    border: "rgba(244,63,94,0.3)",
  },
};

// TAMBAHAN: satu sumber kebenaran untuk toast sukses setelah status
// benar-benar berubah — dipanggil dari handleConfirm di
// CandidatesActionDropdown.tsx & CandidatesModal.tsx supaya labelnya tetap
// sinkron dengan CONFIRM_CONFIG di atas (kalau title/label berubah nanti,
// tidak perlu mengubah pesan toast di 2 tempat terpisah).
//
// Jenis toast disesuaikan tone-nya per status: shortlisted → success
// (hijau), review → info-ish pakai toast.message dengan warna cyan lewat
// style, rejected → toast.error (merah) karena secara semantik ini
// keputusan negatif bagi kandidat meski bukan error aplikasi.
export function showStatusToast(
  status: ConfirmableStatus,
  candidateName: string,
) {
  const cfg = CONFIRM_CONFIG[status];
  const message = `${candidateName} → ${
    status === "shortlisted"
      ? "Shortlisted"
      : status === "review"
        ? "In Review"
        : "Rejected"
  }`;

  if (status === "rejected") {
    toast.error(message, {
      description: "Status kandidat berhasil diubah ke Rejected.",
    });
    return;
  }

  if (status === "review") {
    toast(message, {
      description: "Status kandidat berhasil diubah ke In Review.",
      style: { borderLeft: `3px solid ${cfg.color}` },
    });
    return;
  }

  toast.success(message, {
    description: "Status kandidat berhasil diubah ke Shortlisted.",
  });
}

export function CandidatesStatusConfirmModal({
  status,
  candidateName,
  onConfirm,
  onCancel,
  loading = false,
}: {
  status: ConfirmableStatus;
  candidateName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const cfg = CONFIRM_CONFIG[status];
  const Icon = cfg.icon;

  const modal = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div
          className="absolute inset-0"
          onClick={loading ? undefined : onCancel}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-[360px] rounded-[20px] overflow-hidden"
          style={{
            background: "#0f1612",
            border: "1px solid rgba(16,185,129,0.2)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          }}>
          <div
            className="h-[3px] w-full"
            style={{
              background: `linear-gradient(90deg,${cfg.color},transparent)`,
            }}
          />
          <div className="p-6">
            <div
              className="w-12 h-12 rounded-[13px] flex items-center justify-center mx-auto mb-4"
              style={{
                background: cfg.bg,
                color: cfg.color,
                border: `1px solid ${cfg.border}`,
              }}>
              <Icon size={20} />
            </div>
            <div className="text-center mb-5">
              <div className="font-bold text-[1rem] text-[#e8f0ec] mb-1">
                {cfg.title}
              </div>
              <p className="text-[0.8rem] text-[#7a9585] leading-[1.65]">
                {cfg.description(candidateName)}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 py-[10px] rounded-[10px] text-[0.83rem] font-medium cursor-pointer transition-all disabled:opacity-40"
                style={{
                  background: "#141f19",
                  border: "1px solid rgba(16,185,129,0.15)",
                  color: "#7a9585",
                }}>
                Batal
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-[10px] rounded-[10px] text-[0.83rem] font-bold cursor-pointer transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                style={{
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  color: cfg.color,
                }}>
                {loading && <Loader2 size={13} className="animate-spin" />}
                {cfg.confirmLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return typeof document !== "undefined"
    ? createPortal(modal, document.body)
    : null;
}