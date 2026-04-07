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

export const parseRequirements = (raw: string) =>
  raw
    ? raw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
