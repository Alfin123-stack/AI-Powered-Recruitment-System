// constants/hr-dashboard.ts

import { FilterOption, LegendItem } from "@/types/hr/dashboard";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export const HR_DASHBOARD_REVALIDATE = 60; // detik

/** Base URL untuk semua API call — canonical di @/lib/api. */
export { API as API_BASE_URL } from "@/lib/api";

/** Jumlah skill maksimal yang ditampilkan per kandidat. */
export const MAX_SKILLS_DISPLAYED = 5;

export const REC_ICON_MAP = { CheckCircle2, AlertCircle, XCircle } as const;

// RANK_COLORS → canonical di constants/shared.ts
export { RANK_COLORS } from "../shared";

export const TABLE_HEADERS = [
  "#",
  "Kandidat",
  "AI Score",
  "Match",
  "Skills",
  "Rekomendasi",
  "Status",
  "Aksi",
] as const;

export const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "Semua Status" },
  { value: "applied", label: "Applied" },
  { value: "review", label: "In Review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Ditolak" },
];

// ── Constants ─────────────────────────────────────────────────────────────────
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

export const CALENDAR_LEGENDS: LegendItem[] = [
  { dot: "bg-emerald-400/60", label: "Hari ini" },
  { dot: "bg-cyan-400/60", label: "Has schedule" },
];

export const INDUSTRIES = [
  "Teknologi & Software",
  "E-commerce & Retail",
  "Keuangan & Fintech",
  "Kesehatan & Medis",
  "Pendidikan",
  "Manufaktur",
  "Lainnya",
] as const;

export const COMPANY_SIZES = [
  "1–10",
  "11–50",
  "51–200",
  "201–500",
  "500+",
] as const;
