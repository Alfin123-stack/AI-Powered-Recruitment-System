// ─── components/notifications/config.ts ──────────────────────────────────────

import { BarChart3, Bell, Calendar } from "lucide-react";
import type { FilterId, StatDef } from "@/types/notifications";

// ─── Filter tabs ──────────────────────────────────────────────────────────────

export const FILTER_LABELS: Record<string, string> = {
  all: "Semua",
  unread: "Belum Dibaca",
  read: "Sudah Dibaca",
};

export const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "unread", label: "Belum Dibaca" },
  { id: "status_update", label: "Status" },
  { id: "interview", label: "Interview" },
  { id: "general", label: "Umum" },
];

// ─── Default stats ────────────────────────────────────────────────────────────

export const DEFAULT_STATS: StatDef[] = [
  {
    label: "Total",
    getValue: (n) => n.length,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    icon: BarChart3, // LucideIcon — render di StatCard: <Icon size={18} />
  },
  {
    label: "Belum Dibaca",
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
