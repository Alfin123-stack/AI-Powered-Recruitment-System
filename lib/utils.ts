import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { COLORS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getColor = (id: string | number) => {
  const str = id.toString();
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return COLORS[Math.abs(hash) % COLORS.length];
};

export const timeAgo = (dateStr: string) => {
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000,
  );
  if (days === 0) return "Hari ini";
  if (days === 1) return "1 hari lalu";
  if (days < 7) return `${days} hari lalu`;
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
  return `${Math.floor(days / 30)} bulan lalu`;
};

export const formatDeadline = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

export function parseRequirements(
  raw: string | string[] | null | undefined,
): string[] {
  if (!raw) return [];

  // kalau sudah array
  if (Array.isArray(raw)) {
    return raw.map((s) => s.trim()).filter(Boolean);
  }

  // kalau string
  return raw
    .split(/\\n|\n/)
    .map((s) => s.trim().replace(/^[-•*–]\s*/, ""))
    .filter(Boolean);
}

export const statusMap: Record<string, { label: string; color: string }> = {
  shortlisted: { label: "Shortlisted", color: "#10b981" },
  applied: { label: "Applied", color: "#f59e0b" },
  review: { label: "In Review", color: "#06b6d4" },
  rejected: { label: "Ditolak", color: "#ef4444" },
};

export const rankColors = ["#f59e0b", "#94a3b8", "#cd7f32"];

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
