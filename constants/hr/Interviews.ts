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

export const INTERVIEW_ACCENT_CLASSES = [
  {
    bg: "bg-emerald-500/[0.18]",
    text: "text-emerald-400",
    id: "text-emerald-400/60",
  },
  { bg: "bg-cyan-500/[0.18]", text: "text-cyan-400", id: "text-cyan-400/60" },
  {
    bg: "bg-violet-500/[0.18]",
    text: "text-violet-400",
    id: "text-violet-400/60",
  },
  {
    bg: "bg-amber-500/[0.18]",
    text: "text-amber-400",
    id: "text-amber-400/60",
  },
  { bg: "bg-rose-500/[0.18]", text: "text-rose-400", id: "text-rose-400/60" },
  {
    bg: "bg-orange-500/[0.18]",
    text: "text-orange-400",
    id: "text-orange-400/60",
  },
  { bg: "bg-teal-400/[0.18]", text: "text-teal-300", id: "text-teal-300/60" },
  {
    bg: "bg-purple-400/[0.18]",
    text: "text-purple-400",
    id: "text-purple-400/60",
  },
] as const;
