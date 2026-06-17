// constants/shared.ts
// ─────────────────────────────────────────────────────────────────────────────
// Konstanta lintas modul: locale, warna, status map, rank colors.
// Import dari sini — jangan definisikan ulang di file lain.
//
// Menggabungkan (dari lib/constants.ts yang sudah dihapus):
//   - COLORS, statusMap, rankColors → sekarang canonical di sini
// ─────────────────────────────────────────────────────────────────────────────

import type { JobForm } from "@/types/jobs";

// ── Locale — Bahasa Indonesia ─────────────────────────────────────────────────
export const DAYS_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// ── Color Palette ─────────────────────────────────────────────────────────────
// Canonical — union dari semua color array yang pernah tersebar di codebase:
//   matches COLORS (6) + candidates JOB_COLORS (8) + dashboardHR JOB_COLORS (8)
// Semua JOB_COLORS / COLORS di file lain harus re-export dari sini.
export const PALETTE_COLORS = [
  "#10b981", // emerald-500
  "#06b6d4", // cyan-500
  "#0ea5e9", // sky-500
  "#3b82f6", // blue-500
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#14b8a6", // teal-400
  "#0d9488", // teal-600
  "#f59e0b", // amber-500
  "#f97316", // orange-500
  "#ef4444", // red-500
  "#ec4899", // pink-500
] as const;

/** Helper — ambil warna dari palet secara siklik. */
export const getPaletteColor = (i: number): string =>
  PALETTE_COLORS[i % PALETTE_COLORS.length];

// ── Rank Colors (podium: gold / silver / bronze) ──────────────────────────────
export const RANK_COLORS = ["#f59e0b", "#94a3b8", "#cd7f32"] as const;

// ── Application Status Map ────────────────────────────────────────────────────
export const STATUS_MAP: Record<string, { label: string; color: string }> = {
  applied:     { label: "Dikirim",     color: "#06b6d4" },
  review:      { label: "Direview",    color: "#f59e0b" },
  shortlisted: { label: "Shortlisted", color: "#10b981" },
  rejected:    { label: "Ditolak",     color: "#ef4444" },
};

// ── Interview Status Map ──────────────────────────────────────────────────────
export const IV_STATUS_MAP: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  scheduled: { label: "Terjadwal",  color: "#06b6d4", bg: "rgba(6,182,212,0.08)"  },
  done:      { label: "Selesai",    color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  cancelled: { label: "Dibatalkan", color: "#ef4444", bg: "rgba(239,68,68,0.08)"  },
};

// ── EMPTY_FORM ────────────────────────────────────────────────────────────────
/** Form kosong untuk membuat lowongan baru. */
export const EMPTY_FORM: JobForm = {
  title:        "",
  description:  "",
  requirements: "",
  salary:       "",
  location:     "",
  type:         "Full-time",
  skills:       "",
  benefits:     "",
  deadline:     "",
};

// ── Job Type Filters ──────────────────────────────────────────────────────────
export const JOB_TYPE_FILTERS = [
  "Semua",
  "Remote",
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

// ── Status Config UI (teks Bahasa Indonesia, ada border) ─────────────────────
export const STATUS_CONFIG_UI: Record<
  string,
  { text: string; color: string; bg: string; border: string }
> = {
  applied:     { text: "Lamaran Terkirim",  color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)"  },
  review:      { text: "Sedang Direview",   color: "#06b6d4", bg: "rgba(6,182,212,0.08)",   border: "rgba(6,182,212,0.25)"   },
  shortlisted: { text: "Kamu Shortlisted!", color: "#10b981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.25)"  },
  rejected:    { text: "Tidak Lolos",       color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)"   },
};

// ── Location Filters ──────────────────────────────────────────────────────────
export const LOCATION_FILTERS = [
  "Semua",
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Remote",
];
