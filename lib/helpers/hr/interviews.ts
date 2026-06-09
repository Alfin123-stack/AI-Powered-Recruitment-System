import {
  AdvancedFilters,
  FilterStatus,
  Interview,
  SortOption,
} from "@/types/hr/interviews";
// ─────────────────────────────────────────────────────────────────────────────
// DATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const formatTimeRange = (d: string, durationMinutes = 60) => {
  const start = new Date(d);
  const end = new Date(start.getTime() + durationMinutes * 60000);
  const fmt = (dt: Date) =>
    dt.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  return `${fmt(start)} - ${fmt(end)}`;
};

export const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const isToday = (d: string) =>
  new Date(d).toDateString() === new Date().toDateString();

export const isTomorrow = (d: string) => {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return new Date(d).toDateString() === t.toDateString();
};

export const getDayLabel = (d: string) => {
  if (isToday(d)) return "Hari Ini";
  if (isTomorrow(d)) return "Besok";
  return formatDate(d);
};

export const getDayHeaderLabel = (d: string) => {
  const dt = new Date(d);
  const weekday = dt
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
  const day = dt.getDate();
  const month = dt.toLocaleDateString("en-US", { month: "short" });
  const year = dt.getFullYear();
  return { weekday, day, month, year };
};

// ─────────────────────────────────────────────────────────────────────────────
// LIST HELPERS
// ─────────────────────────────────────────────────────────────────────────────
export const applySort = (list: Interview[], sort: SortOption): Interview[] => {
  return [...list].sort((a, b) => {
    switch (sort) {
      case "date_asc":
        return (
          new Date(a.scheduled_at).getTime() -
          new Date(b.scheduled_at).getTime()
        );
      case "date_desc":
        return (
          new Date(b.scheduled_at).getTime() -
          new Date(a.scheduled_at).getTime()
        );
      case "name_asc":
        return a.candidate_name.localeCompare(b.candidate_name);
      case "name_desc":
        return b.candidate_name.localeCompare(a.candidate_name);
      case "created_asc":
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "created_desc":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        return 0;
    }
  });
};

export const applyFilters = (
  list: Interview[],
  filter: FilterStatus,
  search: string,
  advFilters: AdvancedFilters,
): Interview[] => {
  return list.filter((iv) => {
    const matchFilter = filter === "all" || iv.status === filter;
    const matchSearch =
      !search ||
      iv.candidate_name.toLowerCase().includes(search.toLowerCase()) ||
      iv.job_title.toLowerCase().includes(search.toLowerCase()) ||
      iv.interviewer_name?.toLowerCase().includes(search.toLowerCase());
    const matchRound = !advFilters.round || iv.round === advFilters.round;
    const matchType = !advFilters.type || iv.type === advFilters.type;
    const matchInterviewer =
      !advFilters.interviewer || iv.interviewer_name === advFilters.interviewer;
    return (
      matchFilter && matchSearch && matchRound && matchType && matchInterviewer
    );
  });
};

export const groupByDay = (
  list: Interview[],
): Record<string, { dateStr: string; items: Interview[] }> => {
  return list.reduce<Record<string, { dateStr: string; items: Interview[] }>>(
    (acc, iv) => {
      const key = getDayLabel(iv.scheduled_at);
      if (!acc[key]) acc[key] = { dateStr: iv.scheduled_at, items: [] };
      acc[key].items.push(iv);
      return acc;
    },
    {},
  );
};

export function interviewIsTimePast(interview: Interview): boolean {
  if (interview.status !== "scheduled") return false;
  try {
    const end = new Date(interview.scheduled_at);
    end.setMinutes(end.getMinutes() + (interview.duration_minutes ?? 60));
    return end < new Date();
  } catch {
    return false;
  }
}
