// lib/utils.ts
// ─────────────────────────────────────────────────────────────────────────────
// Canonical utility functions — semua helper umum dipusatkan di sini.
// ─────────────────────────────────────────────────────────────────────────────

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PALETTE_COLORS } from "@/constants/shared";

// ── Tailwind merge ────────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Color helpers ─────────────────────────────────────────────────────────────
// PALETTE_COLORS canonical ada di @/constants/shared — semua getColor re-export dari sini.
export { PALETTE_COLORS as PALETTE, getPaletteColor as getColor } from "@/constants/shared";

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ── Re-export dari constants/shared ──────────────────────────────────────────
export { STATUS_MAP as statusMap, RANK_COLORS as rankColors } from "@/constants/shared";

// ── Score color helpers ───────────────────────────────────────────────────────
export function getScoreColor(s: number): string {
  if (s >= 80) return "#10b981";
  if (s >= 65) return "#06b6d4";
  if (s >= 50) return "#f59e0b";
  return "#ef4444";
}

export function getScoreGradient(s: number): string {
  if (s >= 80) return "linear-gradient(90deg,#10b981,#06b6d4)";
  if (s >= 65) return "linear-gradient(90deg,#06b6d4,#8b5cf6)";
  if (s >= 50) return "linear-gradient(90deg,#f59e0b,#f97316)";
  return "linear-gradient(90deg,#ef4444,#ec4899)";
}

// ── Time helpers ──────────────────────────────────────────────────────────────

/**
 * timeAgo — format hari/minggu/bulan (ID).
 * Contoh: "Hari ini", "3 hari lalu", "2 minggu lalu"
 */
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

/**
 * timeAgoShort — format singkat menit/jam/hari.
 * Contoh: "5m lalu", "2j lalu", "3h lalu"
 */
export const timeAgoShort = (dateStr: string): string => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
  return `${Math.floor(diff / 86400)}h lalu`;
};

/**
 * timeAgoNotif — format untuk notifikasi dengan "Baru saja" + tanggal fallback.
 * Contoh: "Baru saja", "5m lalu", "2j lalu", "3h lalu", "12 Jan"
 */
export const timeAgoNotif = (dateStr: string): string => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}h lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
};

/**
 * timeAgoLong — format panjang menit/jam/hari.
 * Contoh: "5 menit lalu", "2 jam lalu", "3 hari lalu"
 */
export const timeAgoLong = (dateStr: string): string => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
};

// ── Date check helpers ────────────────────────────────────────────────────────
export const isToday = (d: string): boolean =>
  new Date(d).toDateString() === new Date().toDateString();

export const isTomorrow = (d: string): boolean => {
  const tom = new Date();
  tom.setDate(tom.getDate() + 1);
  return new Date(d).toDateString() === tom.toDateString();
};

// ── Date format helpers ───────────────────────────────────────────────────────
export const formatDeadline = (d: string | null): string =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

export const formatDateLong = (d: string): string =>
  new Date(d).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const formatTime = (d: string): string =>
  new Date(d).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

// ── String helpers ────────────────────────────────────────────────────────────
export function parseRequirements(
  raw: string | string[] | null | undefined,
): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((s) => s.trim()).filter(Boolean);
  return raw
    .split(/\\n|\n/)
    .map((s) => s.trim().replace(/^[-•*–]\s*/, ""))
    .filter(Boolean);
}

// ── Day label helper ──────────────────────────────────────────────────────────
export const getDayLabel = (d: string): string => {
  if (isToday(d)) return "Hari Ini";
  if (isTomorrow(d)) return "Besok";
  return formatDateLong(d);
};

// ── Card color helper ─────────────────────────────────────────────────────────
// Canonical untuk getCardColor berbasis index (pakai PALETTE_COLORS dari shared).
// Berbeda dengan hr/calendar.ts getCardColor yang pakai charCodeAt + object CARD_COLORS.
export const getCardColor = (index: number): string =>
  PALETTE_COLORS[index % PALETTE_COLORS.length];
