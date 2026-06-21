import type { JobForm } from "@/types/jobs";

export const DAYS_ID = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTHS_ID = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const PALETTE_COLORS = [
  "#10b981",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#14b8a6",
  "#0d9488",
  "#f59e0b",
  "#f97316",
  "#ef4444",
  "#ec4899",
] as const;

export const getPaletteColor = (i: number): string =>
  PALETTE_COLORS[i % PALETTE_COLORS.length];

export const RANK_COLORS = ["#f59e0b", "#94a3b8", "#cd7f32"] as const;

export const STATUS_MAP: Record<string, { label: string; color: string }> = {
  applied:     { label: "Submitted",   color: "#06b6d4" },
  review:      { label: "In Review",   color: "#f59e0b" },
  shortlisted: { label: "Shortlisted", color: "#10b981" },
  rejected:    { label: "Rejected",    color: "#ef4444" },
};

export const IV_STATUS_MAP: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  scheduled: { label: "Scheduled",  color: "#06b6d4", bg: "rgba(6,182,212,0.08)"  },
  done:      { label: "Completed",  color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  cancelled: { label: "Cancelled",  color: "#ef4444", bg: "rgba(239,68,68,0.08)"  },
};

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

export const JOB_TYPE_FILTERS = [
  "All",
  "Remote",
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

export const STATUS_CONFIG_UI: Record<
  string,
  { text: string; color: string; bg: string; border: string }
> = {
  applied:     { text: "Application Submitted", color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)"  },
  review:      { text: "Under Review",          color: "#06b6d4", bg: "rgba(6,182,212,0.08)",   border: "rgba(6,182,212,0.25)"   },
  shortlisted: { text: "You're Shortlisted!",   color: "#10b981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.25)"  },
  rejected:    { text: "Not Selected",          color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)"   },
};

export const LOCATION_FILTERS = [
  "All",
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Remote",
];