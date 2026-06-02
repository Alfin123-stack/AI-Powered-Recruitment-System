// ─────────────────────────────────────────────────────────────────────────────
// HR DASHBOARD PAGE — Server Component (SSR + ISR)
// Route: app/dashboard/hr/page.tsx
//
// Rendering strategy:
//   • SSR  : fetch data di server saat request (real-time candidate data)
//   • ISR  : revalidate setiap 60 detik (company info, job list)
//   • CSR  : semua interaksi (status update, filter, modal) di HRDashboardClient
//   • Suspense + Skeleton : fallback saat server fetch lambat
//
// Auth strategy (UPDATED):
//   • Sebelumnya: baca "auth_token" dari cookies manual
//   • Sekarang   : Supabase SSR via createServerClient — konsisten dengan
//     halaman interviews. access_token dari Supabase session dipakai sebagai
//     Bearer pada semua API call.
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { HRDashboardClient } from "@/components/hr/dashboard/HRDashboardClient";
import { HRDashboardSkeleton } from "@/components/hr/dashboard/DashboardSkeleton";
import {
  CandidateExtended,
  Interview,
  CompanyInfo,
} from "@/components/hr/dashboard/types";
import { getColor, getInitials } from "@/components/hr/dashboard/helpers";

// ── ISR: revalidate setiap 60 detik (company info bersifat semi-static)
// Catatan: halaman ini masih boleh ISR karena sebagian data (company) semi-static.
// Untuk data kandidat & interview, fetch individual pakai cache: "no-store".
export const revalidate = 60;

// ── Tipe untuk raw API response ──────────────────────────────────────────────
interface RawApplication {
  id: string;
  candidate_name?: string;
  job_title?: string;
  job_id?: string;
  resume_score?: number;
  matching_score?: number;
  extracted_skills?: Array<string | { name?: string }>;
  status: string;
  created_at: string;
  cv_url?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE SESSION — SSR-safe, baca cookies dari request
// Pola identik dengan halaman interviews/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
async function getSupabaseSession() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // Server Component tidak bisa set cookie — no-op
        setAll() {},
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

// ── Server-side data fetching ─────────────────────────────────────────────────
async function fetchDashboardData(token: string): Promise<{
  candidates: CandidateExtended[];
  interviews: Interview[];
  company: CompanyInfo | null;
}> {
  const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Paralel fetch — tidak ada waterfall
  const [appsRes, ivsRes, companyRes] = await Promise.allSettled([
    // Kandidat & interview: selalu fresh karena data volatile + user-specific
    fetch(`${BASE}/api/applications/hr`, {
      headers,
      cache: "no-store",
    }),
    fetch(`${BASE}/api/interviews`, {
      headers,
      cache: "no-store",
    }),
    // Company info: ISR — cache 60 detik cukup karena jarang berubah
    fetch(`${BASE}/api/company`, {
      headers,
      next: { revalidate: 60 },
    }),
  ]);

  // ── Applications → CandidateExtended[] ──────────────────────────────────
  let candidates: CandidateExtended[] = [];
  if (appsRes.status === "fulfilled" && appsRes.value.ok) {
    const raw: RawApplication[] = await appsRes.value.json();
    candidates = (Array.isArray(raw) ? raw : []).map(
      (a: RawApplication, i: number): CandidateExtended => ({
        id: a.id,
        name: a.candidate_name || "Kandidat",
        avatar: getInitials(a.candidate_name || "KD"),
        job: a.job_title || "-",
        jobId: a.job_id,
        resumeScore: a.resume_score ?? 0,
        matchScore: a.matching_score ?? 0,
        skills: (a.extracted_skills || [])
          .slice(0, 5)
          .map((s) => (typeof s === "string" ? s : s?.name || "")),
        status: a.status,
        appliedDate: new Date(a.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
        createdAt: a.created_at,
        color: getColor(i),
        cv_url: a.cv_url || null,
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

// ── Async Server Component (inner) ───────────────────────────────────────────
// Dipisah agar <Suspense> bisa wrapping di atasnya dan skeleton tampil segera
async function HRDashboardServer() {
  // ── Auth via Supabase SSR ─────────────────────────────────────────────────
  const session = await getSupabaseSession();

  // Guard: belum login → redirect ke halaman login
  if (!session?.access_token) {
    redirect("/login");
  }

  const token = session.access_token;

  // ── Fetch data dengan Supabase access_token ───────────────────────────────
  const { candidates, interviews, company } = await fetchDashboardData(token);

  return (
    <HRDashboardClient
      initialCandidates={candidates}
      initialInterviews={interviews}
      company={company}
    />
  );
}

// ── Page Export (SSR + Suspense + Skeleton fallback) ─────────────────────────
export default function HRDashboardPage() {
  return (
    <Suspense fallback={<HRDashboardSkeleton />}>
      <HRDashboardServer />
    </Suspense>
  );
}

// ── Metadata (SSG-compatible) ─────────────────────────────────────────────────
export const metadata = {
  title: "HR Dashboard | AI Recruitment",
  description:
    "Monitor kandidat, jadwal interview, dan analitik rekrutmen secara real-time.",
};
