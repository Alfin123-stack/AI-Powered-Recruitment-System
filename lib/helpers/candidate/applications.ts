import { Application, Interview, AIInsight, CARD_COLORS } from "../../../constants/candidate/applications";

// ── Date Helpers ──────────────────────────────────────────────────────────────

export const formatDateLong = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const isToday = (d: string) =>
  new Date(d).toDateString() === new Date().toDateString();

export const isTomorrow = (d: string) => {
  const tom = new Date();
  tom.setDate(tom.getDate() + 1);
  return new Date(d).toDateString() === tom.toDateString();
};

export const getDayLabel = (d: string): string => {
  if (isToday(d)) return "Hari Ini";
  if (isTomorrow(d)) return "Besok";
  return formatDateLong(d);
};

export const groupSortKey = (label: string, dateStr: string): string => {
  if (label === "Hari Ini") return "0";
  if (label === "Besok") return "1";
  return `2_${new Date(dateStr).getTime()}`;
};

export const getCountdown = (targetDate: string): string => {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return "Sudah dimulai";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)} hari lagi`;
  if (h > 0) return `${h} jam ${m} menit lagi`;
  return `${m} menit lagi`;
};

// ── Color Helpers ─────────────────────────────────────────────────────────────

export const getCardColor = (index: number) =>
  CARD_COLORS[index % CARD_COLORS.length];

// ── AI Insights ───────────────────────────────────────────────────────────────

export const getAIInsights = (
  app: Application,
  interviews: Interview[],
): AIInsight[] => {
  const insights: AIInsight[] = [];
  const hasInterview = interviews.some(
    (iv) => iv.application_id === app.id && iv.status === "scheduled",
  );

  const matchingScore = app.matching_score ?? 0;
  const resumeScore = app.resume_score ?? 0;

  if (matchingScore >= 80) {
    insights.push({
      type: "success",
      text: "Profil kamu sangat cocok untuk posisi ini. Tingkatkan peluang dengan follow-up!",
    });
  } else if (matchingScore >= 60) {
    insights.push({
      type: "tip",
      text: "Ada beberapa skill gap. Highlight pengalaman relevan di portofoliomu.",
    });
  } else if (matchingScore > 0 && matchingScore < 60) {
    insights.push({
      type: "warning",
      text: "Match score rendah. Pertimbangkan untuk update CV dengan keyword yang relevan.",
    });
  }

  if (resumeScore >= 85) {
    insights.push({
      type: "success",
      text: "CV kamu terdeteksi kuat oleh ATS sistem perusahaan ini.",
    });
  }

  if (hasInterview) {
    insights.push({
      type: "tip",
      text: "Riset interviewer di LinkedIn sebelum sesi dimulai.",
    });
  }

  if (app.status === "review") {
    insights.push({
      type: "tip",
      text: "Lamaran sedang direview. Rata-rata HR membutuhkan 3-5 hari kerja.",
    });
  }

  return insights.slice(0, 2);
};

// ── Stats Helpers ─────────────────────────────────────────────────────────────

export const computeStats = (
  applications: Application[],
  interviews: Interview[],
) => {
  const total = applications.length;
  const inProgress = applications.filter((a) =>
    ["review", "shortlisted"].includes(a.status),
  ).length;
  const responseRate =
    total > 0
      ? Math.round(
          ((total - applications.filter((a) => a.status === "applied").length) /
            total) *
            100,
        )
      : 0;
  const upcomingIv = interviews.filter(
    (iv) => iv.status === "scheduled" && new Date(iv.scheduled_at) > new Date(),
  ).length;

  return { total, inProgress, responseRate, upcomingIv };
};

// ── Platform Detection ────────────────────────────────────────────────────────

export const getPlatformInfo = (url: string | null) => {
  if (!url) return null;
  if (url.includes("zoom.us")) return { name: "Zoom", color: "#2D8CFF" };
  if (url.includes("meet.google.com"))
    return { name: "Google Meet", color: "#34A853" };
  if (url.includes("teams.microsoft.com"))
    return { name: "MS Teams", color: "#6264A7" };
  return { name: "Meeting Link", color: "#06b6d4" };
};

// ── Group Interviews by Date ──────────────────────────────────────────────────

export const groupInterviewsByDate = (interviews: Interview[]) => {
  const sorted = [...interviews].sort(
    (a, b) =>
      new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime(),
  );

  const grouped = sorted.reduce<Record<string, Interview[]>>((acc, iv) => {
    const label = getDayLabel(iv.scheduled_at);
    if (!acc[label]) acc[label] = [];
    acc[label].push(iv);
    return acc;
  }, {});

  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const refA = grouped[a][0].scheduled_at;
    const refB = grouped[b][0].scheduled_at;
    return groupSortKey(a, refA).localeCompare(groupSortKey(b, refB));
  });

  return { grouped, sortedKeys };
};
