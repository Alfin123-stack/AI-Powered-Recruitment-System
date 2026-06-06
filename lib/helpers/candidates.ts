import { ThumbsUp, ThumbsDown, AlertTriangle, XCircle } from "lucide-react";

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
    };
  if (avg >= 60)
    return {
      label: "Perlu Review Lanjut",
      short: "Review",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
      icon: AlertTriangle,
    };
  return {
    label: "Kurang Sesuai",
    short: "Tidak Sesuai",
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.08)",
    border: "rgba(244,63,94,0.2)",
    icon: XCircle,
  };
}

export function getScoreColor(s: number): string {
  if (s >= 80) return "#10b981";
  if (s >= 65) return "#06b6d4";
  if (s >= 50) return "#f59e0b";
  return "#f43f5e";
}

export function getScoreGradient(s: number): string {
  if (s >= 80) return "linear-gradient(90deg,#10b981,#06b6d4)";
  if (s >= 65) return "linear-gradient(90deg,#06b6d4,#6366f1)";
  if (s >= 50) return "linear-gradient(90deg,#f59e0b,#f97316)";
  return "linear-gradient(90deg,#f43f5e,#f97316)";
}

export function isToday(dateStr: string): boolean {
  return new Date(dateStr).toDateString() === new Date().toDateString();
}
