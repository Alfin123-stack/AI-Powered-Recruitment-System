import { Bell, Calendar, FileText } from "lucide-react";

// ─── Type visual config ───────────────────────────────────────────────────────

export const typeConfig = {
  status_update: {
    gradient: "from-emerald-500/10 to-teal-500/5",
    border: "border-emerald-500/20",
    accentColors: "linear-gradient(180deg,#34d399,#059669)",
    shimmerColors:
      "linear-gradient(90deg,transparent 5%,#34d399 40%,#059669 60%,transparent 95%)",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    iconEl: FileText,
    dotColor: "bg-emerald-400",
    pillBg: "bg-emerald-500/10",
    pillText: "text-emerald-400",
    label: "Status",
  },
  interview: {
    gradient: "from-sky-500/10 to-blue-500/5",
    border: "border-sky-500/20",
    accentColors: "linear-gradient(180deg,#38bdf8,#0284c7)",
    shimmerColors:
      "linear-gradient(90deg,transparent 5%,#38bdf8 40%,#0284c7 60%,transparent 95%)",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-400",
    iconEl: Calendar,
    dotColor: "bg-sky-400",
    pillBg: "bg-sky-500/10",
    pillText: "text-sky-400",
    label: "Interview",
  },
  general: {
    gradient: "from-violet-500/10 to-purple-500/5",
    border: "border-violet-500/20",
    accentColors: "linear-gradient(180deg,#a78bfa,#7c3aed)",
    shimmerColors:
      "linear-gradient(90deg,transparent 5%,#a78bfa 40%,#7c3aed 60%,transparent 95%)",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    iconEl: Bell,
    dotColor: "bg-violet-400",
    pillBg: "bg-violet-500/10",
    pillText: "text-violet-400",
    label: "Umum",
  },
} as const;
