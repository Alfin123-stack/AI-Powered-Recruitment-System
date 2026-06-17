// constants/hr/Interviews.ts

import type {
  InterviewStatusKey,
  InterviewStatusStyle,
} from "@/types/hr/interviews";

export const INTERVIEW_STATUS_STYLE: Record<
  InterviewStatusKey,
  InterviewStatusStyle
> = {
  scheduled: {
    bg: "bg-emerald-500/[0.08]",
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
    label: "Terjadwal",
  },
  scheduled_late: {
    bg: "bg-orange-500/[0.08]",
    color: "text-orange-400",
    border: "border-orange-500/[0.22]",
    dot: "bg-orange-400",
    label: "Lewat Waktu",
  },
  done: {
    bg: "bg-violet-500/[0.08]",
    color: "text-violet-400",
    border: "border-violet-500/[0.22]",
    dot: "bg-violet-400",
    label: "Selesai",
  },
  overdue: {
    bg: "bg-amber-500/[0.07]",
    color: "text-amber-400",
    border: "border-amber-500/[0.22]",
    dot: "bg-amber-400",
    label: "Overdue",
  },
  cancelled: {
    bg: "bg-rose-500/[0.07]",
    color: "text-rose-400",
    border: "border-rose-500/[0.18]",
    dot: "bg-rose-400",
    label: "Dibatalkan",
  },
};

// ── Status Config (hex colors — dipakai di komponen non-Tailwind) ─────────────
// Dipindahkan dari types/hr/interviews.ts
export const INTERVIEW_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  scheduled: { label: "Scheduled", color: "#6366f1", bg: "rgba(99,102,241,0.10)",  border: "rgba(99,102,241,0.28)",  dot: "#6366f1" },
  done:      { label: "Completed", color: "#10b981", bg: "rgba(16,185,129,0.10)",  border: "rgba(16,185,129,0.28)",  dot: "#10b981" },
  overdue:   { label: "Overdue",   color: "#f59e0b", bg: "rgba(245,158,11,0.10)",  border: "rgba(245,158,11,0.28)",  dot: "#f59e0b" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "rgba(239,68,68,0.10)",   border: "rgba(239,68,68,0.28)",   dot: "#ef4444" },
};

// ── Round Config ──────────────────────────────────────────────────────────────
// Dipindahkan dari types/hr/interviews.ts
export const INTERVIEW_ROUND_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  "First Interview":  { color: "#06b6d4", bg: "rgba(6,182,212,0.08)",   border: "rgba(6,182,212,0.25)"   },
  "Second Interview": { color: "#8b5cf6", bg: "rgba(139,92,246,0.08)",  border: "rgba(139,92,246,0.25)"  },
  "Final Interview":  { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)"  },
};

export const INTERVIEW_ACCENT_CLASSES = [
  { bg: "bg-emerald-500/[0.18]", text: "text-emerald-400", id: "text-emerald-400/60" },
  { bg: "bg-cyan-500/[0.18]",    text: "text-cyan-400",    id: "text-cyan-400/60"    },
  { bg: "bg-violet-500/[0.18]",  text: "text-violet-400",  id: "text-violet-400/60"  },
  { bg: "bg-amber-500/[0.18]",   text: "text-amber-400",   id: "text-amber-400/60"   },
  { bg: "bg-rose-500/[0.18]",    text: "text-rose-400",    id: "text-rose-400/60"    },
  { bg: "bg-orange-500/[0.18]",  text: "text-orange-400",  id: "text-orange-400/60"  },
  { bg: "bg-teal-400/[0.18]",    text: "text-teal-300",    id: "text-teal-300/60"    },
  { bg: "bg-purple-400/[0.18]",  text: "text-purple-400",  id: "text-purple-400/60"  },
] as const;
