// constants/candidates.ts
// Status, warna, dan pagination untuk tabel kandidat di sisi HR.

import { CandidateStatus, StatusFilter } from "@/types/candidates";

export const STATUS_CONFIG: Record<
  CandidateStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  applied: {
    label: "Applied",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.1)",
    border: "rgba(148,163,184,0.2)",
  },
  review: {
    label: "Screening",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.2)",
  },
  shortlisted: {
    label: "Interview",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
  },
  rejected: {
    label: "Offer",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
  },
  hired: {
    label: "Hired",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.25)",
  },
} as const;

/** @deprecated Gunakan getPaletteColor dari @/constants/shared */
export { PALETTE_COLORS as JOB_COLORS } from "./shared";

export const ROWS_PER_PAGE = 8;

export const STATUS_TABS: Array<{ key: StatusFilter; label: string }> = [
  { key: "all", label: "Semua" },
  { key: "applied", label: "Applied" },
  { key: "review", label: "Screening" },
  { key: "shortlisted", label: "Interview" },
  { key: "rejected", label: "Offer" },
];
