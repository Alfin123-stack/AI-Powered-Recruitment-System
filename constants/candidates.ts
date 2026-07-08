// constants/candidates.ts
// Status, warna, dan pagination untuk tabel kandidat di sisi HR.

import type { CandidateStatus, StatusFilter } from "@/types/candidates";

// FIX: key "accepted" dihapus dari sini. CandidateStatus sudah tidak
// punya "accepted" lagi (lihat types/candidates.ts) — deriveDisplayStatus
// tidak pernah mengembalikan nilai ini ke `status`, karena backend
// langsung set status ke "hired" di baris yang sama saat offer_status
// jadi "accepted". Nilai "accepted" tetap tersimpan permanen sebagai
// histori di kolom offer_status (lihat OfferStatus di
// types/candidate/dashboard.ts), cuma tidak lagi relevan sebagai entry
// warna/label di sini karena tidak pernah dipakai untuk merender badge
// CandidateStatus.
export const STATUS_CONFIG: Record<
  CandidateStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  applied: {
    label: "Applied",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.1)",
    border: "rgba(148,163,184,0.2)",
  },
  review: {
    label: "Screening",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.2)",
  },
  shortlisted: {
    // FIX: label sebelumnya "Interview" — salah. Ini bikin badge status
    // menampilkan "Interview" begitu HR klik tombol Shortlist, padahal
    // status yang tersimpan memang benar "shortlisted" dan tidak ada
    // logic apa pun yang menunggu form interview diisi. Interview itu
    // jadwal terpisah (lihat types/calendar.ts), bukan tahap dari
    // CandidateStatus — jadi label di sini seharusnya cuma "Shortlisted".
    label: "Shortlisted",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
  },
  rejected: {
    label: "Rejected",
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.08)",
    border: "rgba(244,63,94,0.2)",
  },
  hired: {
    label: "Hired",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.25)",
  },
  offered: {
    label: "Offer Sent",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
  },
  declined: {
    label: "Offer Declined",
    color: "#6b7280",
    bg: "rgba(107,114,128,0.1)",
    border: "rgba(107,114,128,0.25)",
  },
  expired: {
    label: "Offer Expired",
    color: "#57534e",
    bg: "rgba(87,83,78,0.12)",
    border: "rgba(87,83,78,0.28)",
  },
  // TAMBAHAN: 3 status otomatis baru (lihat komentar di CandidateStatus,
  // types/candidates.ts, untuk penjelasan kapan tiap status ini di-set).
  interview: {
    label: "Interview",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.25)",
  },
  evaluated: {
    label: "Evaluated",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.1)",
    border: "rgba(99,102,241,0.25)",
  },
  onboard: {
    label: "Onboarding",
    color: "#0ea5e9",
    bg: "rgba(14,165,233,0.1)",
    border: "rgba(14,165,233,0.25)",
  },
} as const;

/** @deprecated Gunakan getPaletteColor dari @/constants/shared */
export { PALETTE_COLORS as JOB_COLORS } from "./shared";

export const ROWS_PER_PAGE = 8;

// FIX: Review + Shortlisted digabung jadi satu tab ("In Review") — tab
// dari 7 jadi 6. Tiap entry sekarang punya `statuses: CandidateStatus[]`
// (bisa lebih dari 1 status per tab) alih-alih 1 key tunggal seperti
// sebelumnya, supaya tab gabungan tetap bisa menghitung & memfilter kedua
// status itu tanpa mengubah nilai CandidateStatus di data aslinya.
//
// `key` tetap dipertahankan sebagai StatusFilter untuk dipakai sebagai
// activeStatus/onStatusChange (dan sebagai React key) — nilainya "review"
// dipakai sebagai representative key untuk tab gabungan, TAPI matching-nya
// selalu lewat array `statuses`, bukan `c.status === key`. Lihat
// CandidatesFilterBar.tsx (countFor/isActive) dan pastikan filtering baris
// tabel di CandidatesTable.tsx ikut pakai `statuses.includes(c.status)`,
// bukan strict equality — kalau di situ masih `c.status === activeStatus`,
// kandidat "shortlisted" tidak akan ikut kefilter saat tab "In Review"
// dipilih.
export const STATUS_TABS: Array<{
  key: StatusFilter;
  label: string;
  statuses: CandidateStatus[];
}> = [
  { key: "all", label: "Semua", statuses: [] },
  { key: "applied", label: "Applied", statuses: ["applied"] },
  {
    key: "review",
    label: "In Review",
    statuses: ["review", "shortlisted"],
  },
  { key: "interview", label: "Interview", statuses: ["interview"] },
  { key: "evaluated", label: "Evaluated", statuses: ["evaluated"] },
  { key: "offered", label: "Offer Sent", statuses: ["offered"] },
  // FIX: "onboard" dipisah jadi tab sendiri, tidak lagi digabung ke
  // "hired" — supaya konsisten dengan pola interview/evaluated (status
  // otomatis dapat tab sendiri) dan HR bisa filter kandidat yang sudah
  // dikirimi onboarding email secara terpisah dari yang baru "hired"
  // polos. `statuses: ["hired"]` di bawah jadi murni cuma "hired",
  // bukan lagi ["hired", "onboard"].
  { key: "hired", label: "Hired", statuses: ["hired"] },
  { key: "onboard", label: "Onboarding", statuses: ["onboard"] },
  { key: "rejected", label: "Rejected", statuses: ["rejected"] },
];