// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — HR Dashboard
// ─────────────────────────────────────────────────────────────────────────────

import { CandidateInsight, CandidateUI } from "@/types/hr/dashboard";
import { isToday, isTomorrow } from "@/lib/utils";

export {
  getInitials,
  isToday,
  isTomorrow,
  getScoreColor,
  getScoreGradient,
  getColor,
  PALETTE as JOB_COLORS,
} from "@/lib/utils";

export { getRec } from "@/lib/helpers/candidate/dashboard";

/**
 * roundConfig — alias INTERVIEW_ROUND_CONFIG (canonical di constants/hr/Interviews.ts).
 * Sebelumnya didefinisikan ulang di sini dengan field lebih sedikit (tanpa `border`).
 */
export { INTERVIEW_ROUND_CONFIG as roundConfig } from "@/constants/hr/Interviews";

// FIX: sebelumnya statusMap tidak punya entry untuk "offered", "declined",
// "expired" — begitu fetchDashboardData.ts mulai men-derive status-status
// ini (lihat deriveDisplayStatus), badge di DashboardCandidateRanking.tsx
// akan fallback ke `{ label: c.status, color: "#475569" }` (nama status
// mentah tanpa terjemahan/warna yang sesuai). Warna disamakan dengan
// STATUS_CONFIG di constants/candidates.ts supaya konsisten dengan halaman
// /candidates.
export const statusMap: Record<string, { label: string; color: string }> = {
  applied: { label: "Applied", color: "#06b6d4" },
  review: { label: "In Review", color: "#f59e0b" },
  shortlisted: { label: "Shortlisted", color: "#10b981" },
  offered: { label: "Offer Sent", color: "#f59e0b" },
  declined: { label: "Offer Declined", color: "#6b7280" },
  expired: { label: "Offer Expired", color: "#57534e" },
  rejected: { label: "Ditolak", color: "#ef4444" },
  hired: { label: "Hired", color: "#8b5cf6" },
};

export function computeInsight(c: CandidateUI): CandidateInsight {
  const strengths: string[] = [];
  if (c.resumeScore >= 80) strengths.push("Resume kuat & terstruktur");
  if (c.matchScore >= 80)
    strengths.push("Match tinggi dengan kebutuhan posisi");
  if (c.skills.length >= 4)
    strengths.push(`${c.skills.length} skill relevan terdeteksi`);
  if (c.resumeScore >= 70 && c.matchScore >= 70)
    strengths.push("Konsistensi skor AI & match");
  if (strengths.length === 0)
    strengths.push("Memiliki pengalaman di bidang terkait");

  const weaknesses: string[] = [];
  if (c.matchScore < 50) weaknesses.push("Match score rendah dengan JD");
  if (c.resumeScore < 60) weaknesses.push("Resume perlu diperkuat");
  if (c.skills.length < 2) weaknesses.push("Skill terdeteksi terbatas");
  if (Math.abs(c.resumeScore - c.matchScore) > 30)
    weaknesses.push("Ketidaksesuaian skor AI vs match");
  if (weaknesses.length === 0)
    weaknesses.push("Belum ada data kelemahan signifikan");

  return { strengths, weaknesses };
}

export function getMatchColor(score: number) {
  if (score >= 80) return "#10b981";
  if (score >= 65) return "#06b6d4";
  if (score >= 50) return "#f59e0b";
  return "#f43f5e";
}

export function generateInsights(candidates: CandidateUI[]) {
  if (candidates.length === 0) return [];
  const ins = [];

  const topReady = candidates.filter(
    (c) =>
      c.resumeScore >= 80 && c.matchScore >= 75 && c.status !== "shortlisted",
  );
  if (topReady.length > 0)
    ins.push({
      iconName: "Target" as const,
      color: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.2)",
      text: `${topReady.length} kandidat skor tinggi (AI ≥80, Match ≥75) belum di-shortlist — segera tinjau.`,
    });

  const pending = candidates.filter((c) => c.status === "applied");
  if (pending.length > 0) {
    const avg = Math.round(
      pending.reduce((a, c) => a + c.resumeScore, 0) / pending.length,
    );
    ins.push({
      iconName: "Clock" as const,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
      text: `${pending.length} lamaran masih Applied — avg skor ${avg}. Proses lebih cepat.`,
    });
  }

  const highMatch = candidates.filter((c) => c.matchScore >= 85);
  if (highMatch.length > 0)
    ins.push({
      iconName: "Star" as const,
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.08)",
      border: "rgba(139,92,246,0.2)",
      text: `${highMatch.length} kandidat match ≥85% — direkomendasikan untuk interview segera.`,
    });

  return ins.slice(0, 3);
}

export const formatInterviewTime = (d: string, dm = 60) => {
  const s = new Date(d);
  const e = new Date(s.getTime() + dm * 60000);
  const f = (dt: Date) =>
    dt.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  return `${f(s)} – ${f(e)}`;
};

export const formatInterviewDate = (d: string): string => {
  if (isToday(d)) return "Hari Ini";
  if (isTomorrow(d)) return "Besok";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
};