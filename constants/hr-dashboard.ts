// ─────────────────────────────────────────────────────────────────────────────
// HR Dashboard — Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Durasi revalidasi ISR untuk data semi-statis (company info, job list). */
export const HR_DASHBOARD_REVALIDATE = 60; // detik

/** Base URL untuk semua API call server-side. */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/** Jumlah skill maksimal yang ditampilkan per kandidat. */
export const MAX_SKILLS_DISPLAYED = 5;
