// components/candidate/dashboard/types.ts (atau wherever file ini berada)
// Re-export types dari source of truth — jangan definisikan ulang di sini.
export type {
  Application,
  ApplicationStatus,
  Interview,
  InterviewType,
  InterviewStatus,
  AIInsight,
} from "@/types/candidate-dashboard";

// ── Constants (tetap di sini karena UI-specific) ──────────────────────────────

export const STATUS_MAP: Record<
  import("@/types/candidate-dashboard").ApplicationStatus,
  { label: string; color: string }
> = {
  applied: { label: "Dikirim", color: "#06b6d4" },
  review: { label: "Direview", color: "#f59e0b" },
  shortlisted: { label: "Shortlisted", color: "#10b981" },
  rejected: { label: "Ditolak", color: "#ef4444" },
};

export const IV_STATUS_MAP: Record<
  import("@/types/candidate-dashboard").InterviewStatus,
  { label: string; color: string; bg: string }
> = {
  scheduled: {
    label: "Terjadwal",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
  },
  done: { label: "Selesai", color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  cancelled: {
    label: "Dibatalkan",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
  },
};

export const CARD_COLORS = [
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
  "#3b82f6",
];

export const INTERVIEW_TIPS = [
  {
    icon: "BookOpen" as const,
    title: "Riset Perusahaan",
    desc: "Pelajari produk, visi-misi, dan kultur perusahaan.",
  },
  {
    icon: "Mic" as const,
    title: "Latihan Jawaban",
    desc: "Siapkan jawaban STAR untuk behavioral questions.",
  },
  {
    icon: "Target" as const,
    title: "Review Job Desc",
    desc: "Cocokkan pengalamanmu dengan requirement posisi.",
  },
  {
    icon: "Lightbulb" as const,
    title: "Siapkan Pertanyaan",
    desc: "Siapkan 2–3 pertanyaan cerdas untuk interviewer.",
  },
];

export const FILTER_OPTIONS = [
  { val: "all", label: "Semua" },
  { val: "applied", label: "Dikirim" },
  { val: "review", label: "Direview" },
  { val: "shortlisted", label: "Shortlisted" },
  { val: "rejected", label: "Ditolak" },
] as const;
