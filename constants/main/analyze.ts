import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { ItemStyleConfig, LineFeedback } from "@/types/main/analyze";
export const FEATURES = [
  {
    label: "Skor CV",
    desc: "Resume score, ATS score, impact, dan readability",
  },
  {
    label: "ATS Check",
    desc: "8 titik cek kompatibilitas sistem rekrutmen otomatis",
  },
  { label: "Feedback", desc: "Komentar AI spesifik per bagian dan baris CV" },
  {
    label: "Saran Penulisan",
    desc: "AI menulis ulang kalimat lemah menjadi versi lebih kuat",
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
      label: "Sudah bagus",
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
      label: "Bisa diperkuat",
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
      label: "Kritis",
    },
  },
};
