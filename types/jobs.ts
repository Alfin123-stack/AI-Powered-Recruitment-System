// types/jobs.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth untuk Job, JobForm.
//
// Menggabungkan:
//   - types/jobs.ts
//   - shared/types/recruiter.ts :: Job      (subset — semua field ada di sini)
//   - shared/types/recruiter.ts :: JobForm  (dipindahkan ke sini)
//   - types/candidate/matches.ts :: JobWithMatch (dipindahkan ke sini)
// ─────────────────────────────────────────────────────────────────────────────

export type Job = {
  id: string;
  title: string;
  description?: string | null;
  requirements?: string | null;
  salary?: string | null;
  location?: string | null;
  type?: string | null;
  skills?: string[] | null;
  benefits?: string[] | null;
  deadline?: string | null;
  created_at?: string;
  is_active?: boolean;
  company_id?: string;
  companies?: {
    id?: string;
    name: string | null;
    description?: string | null;
    company_size?: string | null;
    logo_url?: string | null;
  } | null;
};

/** Form state untuk membuat / mengedit lowongan.
 *  skills & benefits disimpan sebagai string (comma-separated) di form,
 *  diparse ke array sebelum dikirim ke API. */
export type JobForm = {
  title: string;
  description: string;
  requirements: string;
  salary: string;
  location: string;
  type: string;
  skills: string;
  benefits: string;
  deadline: string;
};

/** Job yang sudah dihitung skor kecocokannya dengan kandidat. */
export type JobWithMatch = Job & {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  alreadyApplied: boolean;
  color: string;
};

// ── Local Types ───────────────────────────────────────────────────────────────

export type JobWithStats = Job & {
  applicantCount: number;
  shortlistedCount: number;
  reviewCount: number;
  avgMatchScore: number;
  topCandidates: {
    name: string;
    initials: string;
    color: string;
    matchScore: number;
  }[];
};

export type JobsSummaryData = {
  totalActive: number;
  totalApplicants: number;
  totalShortlisted: number;
  overallAvgMatch: number;
};
