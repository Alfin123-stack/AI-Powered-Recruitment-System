// ── Types ─────────────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "applied"
  | "review"
  | "shortlisted"
  | "rejected";

export type InterviewStatus = "scheduled" | "done" | "cancelled";

export type Application = {
  id: string;
  job_title: string;
  company_name: string;
  status: ApplicationStatus;
  resume_score: number;
  matching_score: number;
  cv_url: string | null;
  created_at: string;
};

export type Interview = {
  id: string;
  application_id: string;
  scheduled_at: string;
  type: "online" | "onsite";
  location: string | null;
  notes: string | null;
  status: InterviewStatus;
  job_title: string;
  company_name: string;
};

export type AIInsight = {
  type: "tip" | "warning" | "success";
  text: string;
};

// ── Constants ─────────────────────────────────────────────────────────────────

export const STATUS_MAP: Record<
  ApplicationStatus,
  { label: string; color: string }
> = {
  applied: { label: "Dikirim", color: "#06b6d4" },
  review: { label: "Direview", color: "#f59e0b" },
  shortlisted: { label: "Shortlisted", color: "#10b981" },
  rejected: { label: "Ditolak", color: "#ef4444" },
};

export const IV_STATUS_MAP: Record<
  InterviewStatus,
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
