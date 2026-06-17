import { ThumbsUp, AlertTriangle, XCircle } from "lucide-react";
export { getScoreColor, getScoreGradient, isToday } from "@/lib/utils";

export function getRec(score: number, match: number) {
  const avg = (score + match) / 2;
  if (avg >= 80)
    return {
      label: "Direkomendasikan",
      short: "Rekomen",
      color: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.2)",
      icon: ThumbsUp,
      iconName: "CheckCircle2" as const,
    };
  if (avg >= 60)
    return {
      label: "Perlu Review Lanjut",
      short: "Review",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
      icon: AlertTriangle,
      iconName: "AlertCircle" as const,
    };
  return {
    label: "Kurang Sesuai",
    short: "Tidak Sesuai",
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.08)",
    border: "rgba(244,63,94,0.2)",
    icon: XCircle,
    iconName: "XCircle" as const,
  };
}
