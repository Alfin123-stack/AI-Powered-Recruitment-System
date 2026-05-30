export const FILTERS = [
  "Semua",
  "Remote",
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

export const COLORS = [
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

export const statusConfig: Record<
  string,
  { text: string; color: string; bg: string; border: string }
> = {
  applied: {
    text: "Lamaran Terkirim",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
  },
  review: {
    text: "Sedang Direview",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.25)",
  },
  shortlisted: {
    text: "Kamu Shortlisted!",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.25)",
  },
  rejected: {
    text: "Tidak Lolos",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
  },
};

export const EMPTY_FORM = {
  title: "",
  description: "",
  requirements: "",
  salary: "",
  location: "",
  type: "Full-time",
  skills: "",
  benefits: "",
  deadline: "",
};

export const PALETTES = [
  { accent: "#10b981" },
  { accent: "#3b82f6" },
  { accent: "#8b5cf6" },
  { accent: "#f59e0b" },
  { accent: "#ef4444" },
  { accent: "#ec4899" },
];

export const getPalette = (i: number) => PALETTES[i % PALETTES.length];

export const LOCATION_FILTERS = [
  "Semua",
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Remote",
];
