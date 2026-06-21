import { FilterValue, InsightType } from "@/types/candidate/saved";
import { AlertCircle, Brain, Sparkles } from "lucide-react";

export { PALETTE_COLORS as COLORS } from "../shared";

export const FILTER_OPTIONS: { val: FilterValue; label: string }[] = [
  { val: "all", label: "All" },
  { val: "active", label: "Active" },
  { val: "expiring", label: "⚡ Expiring Soon" },
  { val: "expired", label: "Expired" },
];

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