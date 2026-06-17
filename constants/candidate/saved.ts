// constants/candidate/saved.ts

import { FilterValue, InsightType } from "@/types/candidate/saved";
import { AlertCircle, Brain, Sparkles } from "lucide-react";

// COLORS (palet warna) dikonsolidasi ke shared.ts sebagai PALETTE_COLORS
export { PALETTE_COLORS as COLORS } from "../shared";

// ── Filter Options (khusus halaman saved — beda dari dashboard) ───────────────
export const FILTER_OPTIONS: { val: FilterValue; label: string }[] = [
  { val: "all", label: "Semua" },
  { val: "active", label: "Aktif" },
  { val: "expiring", label: "⚡ Segera Expired" },
  { val: "expired", label: "Expired" },
];

// ── Insight Config ────────────────────────────────────────────────────────────
export const INSIGHT_CONFIG: Record<
  InsightType,
  {
    color: string;
    bg: string;
    border: string;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  tip: {
    color: "text-violet-400",
    bg: "bg-violet-500/[0.06]",
    border: "border-violet-500/15",
    Icon: Brain,
  },
  warning: {
    color: "text-amber-400",
    bg: "bg-amber-500/[0.06]",
    border: "border-amber-500/15",
    Icon: AlertCircle,
  },
  success: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/[0.06]",
    border: "border-emerald-500/15",
    Icon: Sparkles,
  },
};
