// ─────────────────────────────────────────────────────────────────────────────
// HR Dashboard — Server-side Data Fetcher
// ─────────────────────────────────────────────────────────────────────────────

import { getColor, getInitials } from "@/components/hr/dashboard/helpers";
import { API_BASE_URL, MAX_SKILLS_DISPLAYED } from "@/constants/hr-dashboard";
import type { RawApplication } from "@/types/hr-dashboard";
import type {
  CandidateExtended,
  Interview,
  CompanyInfo,
} from "@/types/hr-dashboard";

interface FetchDashboardDataResult {
  candidates: CandidateExtended[];
  interviews: Interview[];
  company: CompanyInfo | null;
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
          .slice(0, MAX_SKILLS_DISPLAYED)
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
