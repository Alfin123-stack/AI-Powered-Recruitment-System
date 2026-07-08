// ─────────────────────────────────────────────────────────────────────────────
// HR Dashboard — Server-side Data Fetcher
// ─────────────────────────────────────────────────────────────────────────────

import { getColor, getInitials } from "@/lib/helpers/hr/dashboard";
import type { CandidateUI, RawApplication } from "@/types/hr/dashboard";
import type { Interview, CompanyInfo } from "@/types/hr/dashboard";
import type { CandidateStatus } from "@/types/candidates";
import { API, API_BASE_URL } from "@/lib/api";
import { MAX_SKILLS_DISPLAYED } from "@/constants/hr/dashboard";

interface FetchDashboardDataResult {
  candidates: CandidateUI[];
  interviews: Interview[];
  company: CompanyInfo | null;
}

// ── Turunkan status tampilan dari `status` + `offer_status` +
// `offer_expires_at`, sama seperti deriveDisplayStatus di
// hooks/dashboard/hr/useCandidatesData.ts (halaman /candidates). ──────────
//
// "accepted" tetap tidak pernah dikembalikan di sini — begitu offer
// accepted, backend (updateOfferStatus) sudah men-set `status` ke "hired"
// di baris yang sama, jadi tidak ada state "accepted tapi belum hired"
// yang perlu ditampilkan terpisah.
//
// FIX: return type sebelumnya `string` — longgar, tidak sinkron lagi
// dengan CandidateUI.status yang sekarang bertipe CandidateStatus (lihat
// types/hr/dashboard.ts). Ini yang menyebabkan error "Type 'string' is
// not assignable to type 'CandidateStatus'" di pemanggilan
// `status: deriveDisplayStatus(a)` di bawah. Diketatkan jadi
// CandidateStatus — tidak perlu cast apa pun karena semua nilai yang
// di-return di sini ("declined", "expired", "offered", atau a.status)
// memang anggota CandidateStatus.
function deriveDisplayStatus(a: RawApplication): CandidateStatus {
  if (a.status === "hired" || a.status === "rejected") {
    return a.status;
  }

  if (a.offer_status === "declined") return "declined";

  if (a.offer_status === "pending") {
    const isExpired =
      !!a.offer_expires_at && new Date(a.offer_expires_at) < new Date();
    return isExpired ? "expired" : "offered";
  }

  return a.status;
}

export async function fetchDashboardData(
  token: string,
): Promise<FetchDashboardDataResult> {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const [appsRes, ivsRes, companyRes] = await Promise.allSettled([
    fetch(`${API_BASE_URL}/api/applications/hr`, {
      headers,
      cache: "no-store",
    }),
    fetch(`${API_BASE_URL}/api/interviews`, {
      headers,
      cache: "no-store",
    }),
    fetch(`${API_BASE_URL}/api/company`, {
      headers,
      next: { revalidate: 60 }, // company profile jarang berubah, ISR aman di sini
    }),
  ]);

  // ── Applications → CandidateUI[] ─────────────────────────────────────────
  let candidates: CandidateUI[] = [];
  if (appsRes.status === "fulfilled" && appsRes.value.ok) {
    const raw: RawApplication[] = await appsRes.value.json();
    candidates = (Array.isArray(raw) ? raw : []).map(
      (a: RawApplication, i: number): CandidateUI => ({
        id: a.id,
        name: a.candidate_name || "Kandidat",
        avatar: getInitials(a.candidate_name || "KD"),
        job: a.job_title || "-",
        jobId: a.job_id ?? "",
        resumeScore: a.resume_score ?? 0,
        matchScore: a.matching_score ?? 0,
        skills: (a.extracted_skills || [])
          .slice(0, MAX_SKILLS_DISPLAYED)
          .map((s) => (typeof s === "string" ? s : s?.name || "")),
        status: deriveDisplayStatus(a),
        appliedDate: a.created_at
          ? new Date(a.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            })
          : "-",
        createdAt: a.created_at ?? "",
        color: getColor(i),
        cv_url: a.cv_url || null,
        // FIX: 3 field ini sebelumnya tidak pernah dipetakan sama sekali,
        // walau backend (getHRApplications) sudah mengembalikannya:
        // - email kosong → OnboardingModal mengirim ke alamat kosong.
        // - onboarding_sent selalu undefined → tombol "Kirim Onboarding
        //   Email" selalu tampak belum terkirim setiap refresh.
        // - offer_status selalu undefined → canSendOnboarding di
        //   DashboardCandidateRanking.tsx cuma jalan dari fallback
        //   status === "hired".
        email: a.candidate_email || "",
        offer_status: a.offer_status ?? null,
        onboarding_sent: a.onboarding_sent ?? false,
      }),
    );
  }

  // ── Interviews ────────────────────────────────────────────────────────────
  let interviews: Interview[] = [];
  if (ivsRes.status === "fulfilled" && ivsRes.value.ok) {
    const raw = await ivsRes.value.json();
    interviews = Array.isArray(raw) ? raw : [];
  }

  // ── Company ───────────────────────────────────────────────────────────────
  let company: CompanyInfo | null = null;
  if (companyRes.status === "fulfilled" && companyRes.value.ok) {
    company = await companyRes.value.json();
  }

  return { candidates, interviews, company };
}

// fetchWithToken: generic fetcher dipakai untuk data per-user yang mutable
// (interviews, shortlisted candidates, dll). Default ke no-store — data
// hasil aksi user (schedule/reschedule/confirm) harus selalu fresh saat
// reload, tidak boleh kena Next.js Data Cache seperti kasus notifications.
export async function fetchWithToken<T>(
  path: string,
  token: string,
): Promise<T | null> {
  if (!token) return null;
  try {
    const res = await fetch(`${API}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}