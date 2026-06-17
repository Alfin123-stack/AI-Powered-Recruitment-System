// constants/calendar.ts
// ─────────────────────────────────────────────────────────────────────────────
// Gabungan dari: calendar.ts (root), hr/calendar.ts, candidate/calendar.ts
// DAYS_ID, MONTHS_ID, IV_STATUS_MAP → dikonsolidasi ke shared.ts
// ─────────────────────────────────────────────────────────────────────────────

import { ViewMode } from "@/types/calendar";

// Re-export dari shared agar consumer lama tidak perlu ubah import
export { DAYS_ID, MONTHS_ID, IV_STATUS_MAP } from "./shared";

// ─── View Modes (dari hr/calendar.ts) ────────────────────────────────────────
export const VIEW_MODES: { key: ViewMode; label: string }[] = [
  { key: "month", label: "Month" },
  { key: "week", label: "Week" },
  { key: "day", label: "Day" },
];

// ─── Status Config (dari calendar.ts root — dipakai HR calendar) ─────────────
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

// ─── Card Colors ──────────────────────────────────────────────────────────────
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

// ─── Date Constants (English) ─────────────────────────────────────────────────
export const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const VISIBLE_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export const CELL_H = 80;

// ─── Scrollbar CSS ────────────────────────────────────────────────────────────
export const SCROLLBAR_STYLE = `
  .cal-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
  .cal-scroll::-webkit-scrollbar-track { background: transparent; }
  .cal-scroll::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.15); border-radius: 99px; }
  .cal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.28); }
  .cal-scroll { scrollbar-width: thin; scrollbar-color: rgba(16,185,129,0.15) transparent; }
`;
