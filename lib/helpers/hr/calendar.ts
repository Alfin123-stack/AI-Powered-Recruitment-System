import { CARD_COLORS } from "@/constants/calendar";
export { getInitials } from "@/lib/utils";

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

export const getAvatarColor = (name: string) => {
  const colors = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];
  return colors[name.charCodeAt(0) % colors.length];
};
