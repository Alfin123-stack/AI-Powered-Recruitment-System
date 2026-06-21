import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { ItemStyleConfig, LineFeedback } from "@/types/main/analyze";

export const FEATURES = [
  {
    label: "CV Score",
    desc: "Resume score, ATS score, impact, and readability",
  },
  {
    label: "ATS Check",
    desc: "8 compatibility checkpoints for automated recruitment systems",
  },
  { label: "Feedback", desc: "AI-specific comments per section and line of the CV" },
  {
    label: "Writing Suggestions",
    desc: "AI rewrites weak sentences into stronger versions",
  },
];

export const ITEM_STYLES: Record<LineFeedback["type"], ItemStyleConfig> = {
  good: {
    border: "rgba(74,222,128,0.1)",
    bg: "rgba(74,222,128,0.03)",
    icon: CheckCircle2,
    iconColor: "rgba(74,222,128,0.65)",
    badge: {
      bg: "rgba(74,222,128,0.08)",
      color: "rgba(74,222,128,0.75)",
      label: "Looks good",
    },
  },
  warn: {
    border: "rgba(245,158,11,0.1)",
    bg: "rgba(245,158,11,0.03)",
    icon: AlertTriangle,
    iconColor: "rgba(245,158,11,0.65)",
    badge: {
      bg: "rgba(245,158,11,0.08)",
      color: "rgba(245,158,11,0.75)",
      label: "Can be improved",
    },
  },
  bad: {
    border: "rgba(248,113,113,0.1)",
    bg: "rgba(248,113,113,0.03)",
    icon: XCircle,
    iconColor: "rgba(248,113,113,0.65)",
    badge: {
      bg: "rgba(248,113,113,0.08)",
      color: "rgba(248,113,113,0.75)",
      label: "Critical",
    },
  },
};