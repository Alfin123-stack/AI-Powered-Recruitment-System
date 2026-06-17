// constants/candidate/dashboard.ts
// ─────────────────────────────────────────────────────────────────────────────
// CARD_COLORS, STATUS_MAP, IV_STATUS_MAP, DAYS_ID, MONTHS_ID
// → dikonsolidasi ke shared.ts, di-re-export di sini agar import lama tetap valid.
// ─────────────────────────────────────────────────────────────────────────────

export {
  PALETTE_COLORS as CARD_COLORS,
  STATUS_MAP,
  IV_STATUS_MAP,
  DAYS_ID,
  MONTHS_ID,
} from "../shared";

// ── FILTER_OPTIONS (khusus dashboard — beda dari saved.ts) ───────────────────
export const FILTER_OPTIONS = [
  { val: "all", label: "Semua" },
  { val: "applied", label: "Dikirim" },
  { val: "review", label: "Direview" },
  { val: "shortlisted", label: "Shortlisted" },
  { val: "rejected", label: "Ditolak" },
] as const;

// ── Tabs (untuk halaman applications) ────────────────────────────────────────
export const TABS = [
  { id: "all", label: "Semua" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "review", label: "Direview" },
  { id: "applied", label: "Dikirim" },
  { id: "rejected", label: "Ditolak" },
];

// ── Interview Tips ────────────────────────────────────────────────────────────
export const INTERVIEW_TIPS = [
  {
    icon: "BookOpen" as const,
    title: "Riset Perusahaan",
    desc: "Pelajari produk, visi-misi, dan kultur perusahaan.",
  },
  {
    icon: "Mic" as const,
    title: "Latihan Jawaban",
    desc: "Siapkan jawaban STAR untuk behavioral questions.",
  },
  {
    icon: "Target" as const,
    title: "Review Job Desc",
    desc: "Cocokkan pengalamanmu dengan requirement posisi.",
  },
  {
    icon: "Lightbulb" as const,
    title: "Siapkan Pertanyaan",
    desc: "Siapkan 2–3 pertanyaan cerdas untuk interviewer.",
  },
];
