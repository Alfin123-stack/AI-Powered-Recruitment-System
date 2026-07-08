import { BarChart3, Bell, Calendar, FileText, Gift, XCircle } from "lucide-react";
import type { FilterId, StatDef } from "@/types/main/notifications";

export const FILTER_LABELS: Record<string, string> = {
  all: "All",
  unread: "Unread",
  read: "Read",
};

export const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "status_update", label: "Status" },
  { id: "interview", label: "Interview" },
  { id: "offer_letter", label: "Offers" },
  { id: "rejection", label: "Rejections" },
  { id: "general", label: "General" },
];

export const DEFAULT_STATS: StatDef[] = [
  {
    label: "Total",
    getValue: (n) => n.length,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    icon: BarChart3,
  },
  {
    label: "Unread",
    getValue: (n) => n.filter((x) => !x.read).length,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    icon: Bell,
  },
  {
    label: "Interview",
    getValue: (n) => n.filter((x) => x.type === "interview").length,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    icon: Calendar,
  },
];

export const TYPE_CONFIG = {
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
  offer_letter: {
    gradient: "from-emerald-500/15 to-cyan-500/5",
    border: "border-emerald-500/30",
    accentColors: "linear-gradient(180deg,#10b981,#06b6d4)",
    shimmerColors:
      "linear-gradient(90deg,transparent 5%,#10b981 40%,#06b6d4 60%,transparent 95%)",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    iconEl: Gift,
    dotColor: "bg-emerald-400",
    pillBg: "bg-emerald-500/15",
    pillText: "text-emerald-300",
    label: "Offer",
  },
  rejection: {
    gradient: "from-gray-500/10 to-slate-500/5",
    border: "border-gray-500/20",
    accentColors: "linear-gradient(180deg,#6b7280,#4b5563)",
    shimmerColors:
      "linear-gradient(90deg,transparent 5%,#6b7280 40%,#4b5563 60%,transparent 95%)",
    iconBg: "bg-gray-500/10",
    iconColor: "text-gray-400",
    iconEl: XCircle,
    dotColor: "bg-gray-400",
    pillBg: "bg-gray-500/10",
    pillText: "text-gray-400",
    label: "Rejection",
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
    label: "General",
  },
} as const;
