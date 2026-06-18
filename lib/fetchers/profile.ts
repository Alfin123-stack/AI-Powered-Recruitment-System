// lib/fetchers/profile.ts
// ─────────────────────────────────────────────
// Server-side fetchers untuk data profile.
// Hanya dipanggil dari Server Component / Route Handler.
// ─────────────────────────────────────────────

import type { CandidateStats, CompanyData } from "@/types/main/profile";

import { API } from "@/lib/api";

/**
 * fetchCandidateStats
 * Paralel fetch jumlah lamaran & saved jobs milik candidate.
 * Gracefully returns zero jika salah satu request gagal.
 */
export async function fetchCandidateStats(
  token: string,
): Promise<CandidateStats> {
  try {
    const [appsRes, savedRes] = await Promise.allSettled([
      fetch(`${API}/api/applications/my`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
      fetch(`${API}/api/saved-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
    ]);

    const applicationCount =
      appsRes.status === "fulfilled" && appsRes.value.ok
        ? ((await appsRes.value.json()) as unknown[]).length
        : 0;

    const savedCount =
      savedRes.status === "fulfilled" && savedRes.value.ok
        ? ((await savedRes.value.json()) as unknown[]).length
        : 0;

    return { applicationCount, savedCount };
  } catch {
    return { applicationCount: 0, savedCount: 0 };
  }
}

/**
 * fetchCompanyData
 * Mengambil data perusahaan milik HR yang sedang login.
 * Mengembalikan null jika request gagal atau HR belum punya company.
 */
export async function fetchCompanyData(
  token: string,
): Promise<CompanyData | null> {
  try {
    const res = await fetch(`${API}/api/companies/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json() as Promise<CompanyData>;
  } catch {
    return null;
  }
}
