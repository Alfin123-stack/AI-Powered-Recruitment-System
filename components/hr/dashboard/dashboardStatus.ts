import { toast } from "sonner";
import { ThumbsUp, ThumbsDown, Eye, CheckCircle2, Send } from "lucide-react";
import type { CandidateUI } from "@/types/hr/dashboard";
import { getRec } from "@/lib/helpers/hr/dashboard";
import { REC_ICON_MAP } from "@/constants/hr/dashboard";

// ── Decision-state helpers ─────────────────────────────────────────────────
// Dipindah dari DashboardCandidateRanking.tsx lama (pecahan komponen) —
// dipakai bareng oleh DashboardCandidateModal & DashboardJobGroupTable
// supaya definisi "sudah final / decided" cuma ada di satu tempat.
export const DECIDED_STATUSES = new Set([
  "shortlisted",
  "offered",
  "hired",
  "rejected",
]);

export function isLocked(status: string) {
  return DECIDED_STATUSES.has(status);
}

// ── Status confirm dialog data ──────────────────────────────────────────────
export type ConfirmableStatus = "shortlisted" | "review" | "rejected";

export type StatusConfirmInfo = {
  title: string;
  description: (name: string) => string;
  confirmLabel: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bg: string;
  border: string;
};

export const STATUS_CONFIRM_INFO: Record<ConfirmableStatus, StatusConfirmInfo> = {
  shortlisted: {
    title: "Shortlist kandidat ini?",
    description: (name) =>
      `${name} akan masuk ke tahap shortlisted dan siap dijadwalkan untuk interview.`,
    confirmLabel: "Ya, Shortlist",
    Icon: ThumbsUp,
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.3)",
  },
  review: {
    title: "Pindahkan ke In Review?",
    description: (name) =>
      `${name} akan ditandai sedang dalam proses review lebih lanjut.`,
    confirmLabel: "Ya, Pindahkan",
    Icon: Eye,
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.12)",
    border: "rgba(6,182,212,0.3)",
  },
  rejected: {
    title: "Tolak kandidat ini?",
    description: (name) =>
      `${name} akan ditandai sebagai rejected. Status ini masih bisa diubah lagi selama belum masuk proses offer.`,
    confirmLabel: "Ya, Tolak",
    Icon: ThumbsDown,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.3)",
  },
};

// TAMBAHAN: toast sonner setelah status kandidat benar-benar berubah (Shortlist
// / Review / Tolak). Tone-nya ngikut STATUS_CONFIRM_INFO di atas — kalau
// labelnya diubah nanti, pesan toast otomatis ikut, tidak perlu disunting
// manual di tempat lain.
export function showStatusToast(status: ConfirmableStatus, candidateName: string) {
  const label =
    status === "shortlisted"
      ? "Shortlisted"
      : status === "review"
        ? "In Review"
        : "Rejected";
  const message = `${candidateName} → ${label}`;
  const description = `Status kandidat berhasil diubah ke ${label}.`;

  if (status === "rejected") {
    toast.error(message, { description });
    return;
  }
  if (status === "review") {
    toast(message, {
      description,
      style: { borderLeft: `3px solid ${STATUS_CONFIRM_INFO.review.color}` },
    });
    return;
  }
  toast.success(message, { description });
}

// TAMBAHAN: toast sonner untuk aksi kirim onboarding email — belum ada di
// versi sebelumnya (cuma dihandle lewat OnboardingModal internal / disabled
// state tombol, tanpa notifikasi eksplisit).
export function showOnboardingSentToast(candidateName: string) {
  toast.success(`Onboarding email terkirim`, {
    description: `Detail onboarding sudah dikirim ke ${candidateName}.`,
    style: { borderLeft: "3px solid #10b981" },
  });
}

// Scores can legitimately be 0, jadi falsy check (`c.matchScore ? ... : "—"`)
// salah nyembunyiin nilai 0 asli — dan karena matchScore kadang masih
// undefined/null pas AI match lagi dihitung, falsy check yang sama bikin
// flicker ke "—" walau nilainya lagi otw. Ini bikin kasus "belum ada data"
// eksplisit, tidak nebeng ke truthiness.
export function hasScore(val: number | null | undefined): val is number {
  return typeof val === "number" && !Number.isNaN(val);
}

// ── Recommendation display ──────────────────────────────────────────────────
export type RecDisplay = {
  label: string;
  color: string;
  bg: string;
  border: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
};

export function getRecommendationDisplay(c: CandidateUI): RecDisplay {
  switch (c.status) {
    case "hired":
      return {
        label: "Hired",
        color: "#10b981",
        bg: "rgba(16,185,129,0.12)",
        border: "rgba(16,185,129,0.32)",
        Icon: CheckCircle2,
      };
    case "offered":
      return {
        label: "Offer Sent",
        color: "#06b6d4",
        bg: "rgba(6,182,212,0.1)",
        border: "rgba(6,182,212,0.28)",
        Icon: Send,
      };
    case "shortlisted":
      return {
        label: "Shortlisted",
        color: "#10b981",
        bg: "rgba(16,185,129,0.08)",
        border: "rgba(16,185,129,0.22)",
        Icon: ThumbsUp,
      };
    case "rejected":
      return {
        label: "Rejected",
        color: "#ef4444",
        bg: "rgba(239,68,68,0.08)",
        border: "rgba(239,68,68,0.22)",
        Icon: ThumbsDown,
      };
    default: {
      // Belum ada keputusan — fallback ke saran AI.
      const rec = getRec(c.resumeScore, c.matchScore);
      const RecIcon =
        REC_ICON_MAP[rec.iconName as keyof typeof REC_ICON_MAP] ?? CheckCircle2;
      return {
        label: rec.label,
        color: rec.color,
        bg: rec.bg,
        border: rec.border,
        Icon: RecIcon,
      };
    }
  }
}
