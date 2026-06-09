import { COLORS } from "@/constants/candidate/saved";
import { Insight, SavedJob } from "@/types/candidate/saved";

export const getColor = (i: number): string => COLORS[i % COLORS.length];

export const timeAgo = (dateStr: string): string => {
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000,
  );
  if (days === 0) return "Hari ini";
  if (days === 1) return "1 hari lalu";
  if (days < 7) return `${days} hari lalu`;
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
  return `${Math.floor(days / 30)} bulan lalu`;
};

export const daysUntilDeadline = (deadline: string | null): number | null => {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
};

export const isDeadlineSoon = (deadline: string | null): boolean => {
  const d = daysUntilDeadline(deadline);
  return d !== null && d >= 0 && d <= 7;
};

export const isExpired = (deadline: string | null): boolean => {
  if (!deadline) return false;
  return new Date(deadline).getTime() < Date.now();
};

export const getJobInsights = (job: SavedJob): Insight[] => {
  const insights: Insight[] = [];
  const days = daysUntilDeadline(job.deadline);

  if (days !== null && days >= 0 && days <= 3) {
    insights.push({
      type: "warning",
      text: `Deadline ${days === 0 ? "hari ini" : `${days} hari lagi`}! Segera apply sebelum terlambat.`,
    });
  }
  if ((job.matching_score ?? 0) >= 80) {
    insights.push({
      type: "success",
      text: "Profil kamu sangat cocok untuk posisi ini. Peluang lolos lebih tinggi!",
    });
  } else if ((job.matching_score ?? 0) >= 60) {
    insights.push({
      type: "tip",
      text: "Match lumayan bagus. Highlight pengalaman yang relevan di cover letter.",
    });
  }
  if ((job.resume_score ?? 0) >= 85) {
    insights.push({
      type: "success",
      text: "CV kamu sudah kuat untuk posisi ini berdasarkan analisis ATS.",
    });
  }
  if (!job.salary) {
    insights.push({
      type: "tip",
      text: "Riset kisaran gaji posisi ini di Glassdoor/LinkedIn sebelum negosiasi.",
    });
  }

  return insights.slice(0, 2);
};
