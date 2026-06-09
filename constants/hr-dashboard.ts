import { FilterOption } from "@/types/hr-dashboard";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export const HR_DASHBOARD_REVALIDATE = 60; // detik

/** Base URL untuk semua API call server-side. */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/** Jumlah skill maksimal yang ditampilkan per kandidat. */
export const MAX_SKILLS_DISPLAYED = 5;

// ── Constants ─────────────────────────────────────────────────────────────────
export const REC_ICON_MAP = { CheckCircle2, AlertCircle, XCircle } as const;

export const RANK_COLORS = ["#f59e0b", "#94a3b8", "#cd7c38"] as const;

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
