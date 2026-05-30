// @/components/hr/calendar/types.ts
// Shared types, constants, dan utility functions untuk seluruh komponen Calendar

// ─── TYPES ────────────────────────────────────────────────────────────────────
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
};

export type ViewMode = "month" | "week" | "day";

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
export const STATUS_CFG: Record<
  string,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  scheduled: {
    label: "Scheduled",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.15)",
    border: "rgba(99,102,241,0.35)",
    dot: "#6366f1",
  },
  done: {
    label: "Selesai",
    color: "#10b981",
    bg: "rgba(16,185,129,0.15)",
    border: "rgba(16,185,129,0.35)",
    dot: "#10b981",
  },
  overdue: {
    label: "Overdue",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.15)",
    border: "rgba(245,158,11,0.35)",
    dot: "#f59e0b",
  },
  cancelled: {
    label: "Dibatalkan",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.3)",
    dot: "#ef4444",
  },
};

// ─── CARD COLORS ──────────────────────────────────────────────────────────────
export const CARD_COLORS = [
  {
    bg: "rgba(99,102,241,0.18)",
    border: "rgba(99,102,241,0.0)",
    text: "#c7c8ff",
    sub: "#8b8ef0",
  },
  {
    bg: "rgba(251,191,36,0.15)",
    border: "rgba(251,191,36,0.0)",
    text: "#fde68a",
    sub: "#f59e0b",
  },
  {
    bg: "rgba(16,185,129,0.15)",
    border: "rgba(16,185,129,0.0)",
    text: "#6ee7b7",
    sub: "#10b981",
  },
  {
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.0)",
    text: "#fca5a5",
    sub: "#ef4444",
  },
  {
    bg: "rgba(139,92,246,0.15)",
    border: "rgba(139,92,246,0.0)",
    text: "#ddd6fe",
    sub: "#8b5cf6",
  },
  {
    bg: "rgba(6,182,212,0.13)",
    border: "rgba(6,182,212,0.0)",
    text: "#a5f3fc",
    sub: "#06b6d4",
  },
];

// ─── DATE CONSTANTS ───────────────────────────────────────────────────────────
export const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const VISIBLE_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export const CELL_H = 80;

// ─── UTILITY FUNCTIONS ────────────────────────────────────────────────────────
export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const fmt12 = (d: Date) =>
  d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

export const fmtTimeRange = (d: string, dur = 60) => {
  const s = new Date(d);
  const e = new Date(s.getTime() + dur * 60000);
  return `${fmt12(s)} – ${fmt12(e)}`;
};

export const getWeekDays = (d: Date): Date[] => {
  const start = new Date(d);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(d.getDate() + diff);
  return Array.from({ length: 6 }, (_, i) => {
    const dd = new Date(start);
    dd.setDate(start.getDate() + i);
    return dd;
  });
};

export const getMonthGrid = (year: number, month: number): (Date | null)[] => {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const grid: (Date | null)[] = [];
  for (let i = 0; i < first.getDay(); i++) grid.push(null);
  for (let d = 1; d <= last.getDate(); d++) grid.push(new Date(year, month, d));
  return grid;
};

export const getCardColor = (id: string) =>
  CARD_COLORS[id.charCodeAt(0) % CARD_COLORS.length];

export const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export const getAvatarColor = (name: string) => {
  const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
  return colors[name.charCodeAt(0) % colors.length];
};

// ─── SCROLLBAR CSS ────────────────────────────────────────────────────────────
export const SCROLLBAR_STYLE = `
  .cal-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
  .cal-scroll::-webkit-scrollbar-track { background: transparent; }
  .cal-scroll::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.15); border-radius: 99px; }
  .cal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.28); }
  .cal-scroll { scrollbar-width: thin; scrollbar-color: rgba(16,185,129,0.15) transparent; }
`;
