// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — HR Dashboard
// ─────────────────────────────────────────────────────────────────────────────

import { CandidateExtended, CandidateInsight } from "./types";

export const JOB_COLORS = [
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
  "#0d9488",
  "#6366f1",
  "#f97316",
];

export const roundConfig: Record<string, { color: string; bg: string }> = {
  "First Interview": { color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
  "Second Interview": { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  "Final Interview": { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
};

export const statusMap: Record<string, { label: string; color: string }> = {
  applied: { label: "Applied", color: "#06b6d4" },
  review: { label: "In Review", color: "#f59e0b" },
  shortlisted: { label: "Shortlisted", color: "#10b981" },
  rejected: { label: "Ditolak", color: "#ef4444" },
  hired: { label: "Hired", color: "#8b5cf6" },
};

export function getScoreColor(s: number) {
  if (s >= 80) return "#10b981";
  if (s >= 65) return "#06b6d4";
  if (s >= 50) return "#f59e0b";
  return "#ef4444";
}

export function getScoreGradient(s: number) {
  if (s >= 80) return "linear-gradient(90deg,#10b981,#06b6d4)";
  if (s >= 65) return "linear-gradient(90deg,#06b6d4,#8b5cf6)";
  if (s >= 50) return "linear-gradient(90deg,#f59e0b,#f97316)";
  return "linear-gradient(90deg,#ef4444,#ec4899)";
}

export function getRec(score: number, match: number) {
  const avg = (score + match) / 2;
  if (avg >= 80)
    return {
      label: "Direkomendasikan",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.25)",
      iconName: "CheckCircle2" as const,
    };
  if (avg >= 60)
    return {
      label: "Perlu Review",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.25)",
      iconName: "AlertCircle" as const,
    };
  return {
    label: "Kurang Sesuai",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
    iconName: "XCircle" as const,
  };
}

export function computeInsight(c: CandidateExtended): CandidateInsight {
  const strengths: string[] = [];
  if (c.resumeScore >= 80) strengths.push("Resume kuat & terstruktur");
  if (c.matchScore >= 80) strengths.push("Match tinggi dengan kebutuhan posisi");
  if (c.skills.length >= 4) strengths.push(`${c.skills.length} skill relevan terdeteksi`);
  if (c.resumeScore >= 70 && c.matchScore >= 70) strengths.push("Konsistensi skor AI & match");
  if (strengths.length === 0) strengths.push("Memiliki pengalaman di bidang terkait");

  const weaknesses: string[] = [];
  if (c.matchScore < 50) weaknesses.push("Match score rendah dengan JD");
  if (c.resumeScore < 60) weaknesses.push("Resume perlu diperkuat");
  if (c.skills.length < 2) weaknesses.push("Skill terdeteksi terbatas");
  if (Math.abs(c.resumeScore - c.matchScore) > 30) weaknesses.push("Ketidaksesuaian skor AI vs match");
  if (weaknesses.length === 0) weaknesses.push("Belum ada data kelemahan signifikan");

  return { strengths, weaknesses };
}

export function generateInsights(candidates: CandidateExtended[]) {
  if (candidates.length === 0) return [];
  const ins = [];

  const topReady = candidates.filter(
    (c) => c.resumeScore >= 80 && c.matchScore >= 75 && c.status !== "shortlisted"
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
    const avg = Math.round(pending.reduce((a, c) => a + c.resumeScore, 0) / pending.length);
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

export const isToday = (d: string) =>
  new Date(d).toDateString() === new Date().toDateString();

export const isTomorrow = (d: string) => {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return new Date(d).toDateString() === t.toDateString();
};

export const formatInterviewTime = (d: string, dm = 60) => {
  const s = new Date(d);
  const e = new Date(s.getTime() + dm * 60000);
  const f = (dt: Date) =>
    dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${f(s)} – ${f(e)}`;
};

export const formatInterviewDate = (d: string) => {
  if (isToday(d)) return "Hari Ini";
  if (isTomorrow(d)) return "Besok";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
};

export function getColor(index: number): string {
  return JOB_COLORS[index % JOB_COLORS.length];
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
