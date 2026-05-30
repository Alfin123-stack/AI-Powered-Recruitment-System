// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export type Interview = {
  id: string;
  application_id: string;
  scheduled_at: string;
  duration_minutes?: number;
  type: "online" | "onsite";
  location: string | null;
  notes: string | null;
  status: "scheduled" | "done" | "cancelled" | "overdue";
  round?: string;
  created_at: string;
  candidate_name: string;
  candidate_id?: string;
  job_title: string;
  interviewer_name?: string;
  interviewer_avatar?: string;
  recording_duration?: string;
};

export type ShortlistedCandidate = {
  application_id: string;
  candidate_id: string;
  candidate_name: string;
  job_title: string;
};

export type AnyInputEvent = { target: { value: string } };

export type SortOption =
  | "date_asc"
  | "date_desc"
  | "name_asc"
  | "name_desc"
  | "created_asc"
  | "created_desc";

export type FilterStatus = "all" | "scheduled" | "done" | "cancelled" | "overdue";

export type AdvancedFilters = {
  round: string;
  type: string;
  interviewer: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED INPUT STYLES
// ─────────────────────────────────────────────────────────────────────────────
export const inputCls =
  "w-full bg-[#080f0b] border border-emerald-500/15 rounded-[10px] px-3 py-[10px] text-[0.85rem] text-[#e8f0ec] placeholder:text-[#2d4a38] focus:outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/8 transition-all";

export const inputErrorCls =
  "w-full bg-[#080f0b] border border-red-500/40 rounded-[10px] px-3 py-[10px] text-[0.85rem] text-[#e8f0ec] placeholder:text-[#2d4a38] focus:outline-none focus:border-red-500/60 transition-all";

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  scheduled: {
    label: "Scheduled",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.10)",
    border: "rgba(99,102,241,0.28)",
    dot: "#6366f1",
  },
  done: {
    label: "Completed",
    color: "#10b981",
    bg: "rgba(16,185,129,0.10)",
    border: "rgba(16,185,129,0.28)",
    dot: "#10b981",
  },
  overdue: {
    label: "Overdue",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.28)",
    dot: "#f59e0b",
  },
  cancelled: {
    label: "Cancelled",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.10)",
    border: "rgba(239,68,68,0.28)",
    dot: "#ef4444",
  },
};

export const roundConfig: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  "First Interview": {
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.25)",
  },
  "Second Interview": {
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.25)",
  },
  "Final Interview": {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
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

export const applySort = (list: Interview[], sort: SortOption): Interview[] => {
  return [...list].sort((a, b) => {
    switch (sort) {
      case "date_asc":
        return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime();
      case "date_desc":
        return new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime();
      case "name_asc":
        return a.candidate_name.localeCompare(b.candidate_name);
      case "name_desc":
        return b.candidate_name.localeCompare(a.candidate_name);
      case "created_asc":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "created_desc":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });
};

export const applyFilters = (
  list: Interview[],
  filter: FilterStatus,
  search: string,
  advFilters: AdvancedFilters
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
    return matchFilter && matchSearch && matchRound && matchType && matchInterviewer;
  });
};

export const groupByDay = (list: Interview[]): Record<string, { dateStr: string; items: Interview[] }> => {
  return list.reduce<Record<string, { dateStr: string; items: Interview[] }>>((acc, iv) => {
    const key = getDayLabel(iv.scheduled_at);
    if (!acc[key]) acc[key] = { dateStr: iv.scheduled_at, items: [] };
    acc[key].items.push(iv);
    return acc;
  }, {});
};
