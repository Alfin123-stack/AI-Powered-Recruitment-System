// ── Color Palette ─────────────────────────────────────────────────────────────
export const CARD_COLORS = [
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

// ── Locale Constants ──────────────────────────────────────────────────────────
export const DAYS_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
export const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const TABS = [
  { id: "all", label: "Semua" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "review", label: "In Review" },
  { id: "applied", label: "Dikirim" },
  { id: "rejected", label: "Ditolak" },
];

// ── Status Map ────────────────────────────────────────────────────────────────
export const STATUS_MAP: Record<string, { label: string; color: string }> = {
  applied: { label: "Dikirim", color: "#06b6d4" },
  review: { label: "In Review", color: "#f59e0b" },
  shortlisted: { label: "Shortlisted", color: "#10b981" },
  rejected: { label: "Ditolak", color: "#ef4444" },
};
