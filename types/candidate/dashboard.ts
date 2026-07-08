// types/candidate-dashboard.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth untuk types kandidat.
//
// Menggabungkan:
//   - types/candidate-dashboard.ts
//   - shared/types/candidate.ts :: CandidateUser      → alias UserProfile
//   - shared/types/candidate.ts :: CandidateApplication → alias Application
//   - shared/types/recruiter.ts :: Application
//   - types/candidate/matches.ts :: Application (hanya job_id) → digabung ke sini
// ─────────────────────────────────────────────────────────────────────────────

export type { Job, JobWithMatch } from "../jobs";
export type { Interview, InterviewType, InterviewStatus } from "../calendar";

// ── Application Status ────────────────────────────────────────────────────────
// FIX: tambah "offered" — deriveDisplayStatus (useCandidatesData.ts &
// dashboard fetcher) bisa mengembalikan a.status apa adanya kalau HR baru
// pindahin kandidat ke "offered" secara manual tapi belum ada offer_status
// (belum kirim link offer). Tanpa "offered" di sini, `as CandidateStatus`
// di deriveDisplayStatus jadi type-unsafe secara diam-diam.
// TAMBAHAN: "interview" & "evaluated" — sama seperti "offered" di atas,
// ini nilai kolom `status` mentah yang di-set langsung lewat PUT
// /api/applications/:id/status (lihat useInterviewSchedule.ts &
// useEvaluationFlow.ts), bukan diturunkan dari offer_status. "onboard"
// juga ditambahkan di sini dengan alasan yang sama (di-set lewat
// updateStatus di useCandidatesData.ts saat onboarding email sukses
// terkirim). "declined"/"expired" TETAP tidak dimasukkan ke sini karena
// keduanya murni diturunkan dari offer_status di deriveDisplayStatus(),
// tidak pernah jadi nilai kolom `status` itu sendiri.
export type ApplicationStatus =
  | "applied"
  | "review"
  | "shortlisted"
  | "interview"
  | "evaluated"
  | "offered"
  | "hired"
  | "onboard"
  | "rejected";

// ── Offer Status ───────────────────────────────────────────────────────────────
// Satu sumber kebenaran untuk offer_status, dipakai di Application,
// RawApplication, dan CandidateUI (hr/dashboard.ts) — sebelumnya
// CandidateUI mendefinisikan union ini secara terpisah/inline, rawan
// ketinggalan sinkron kalau salah satu berubah.
export type OfferStatus = "pending" | "accepted" | "declined" | null;

export type Application = {
  id: string;
  job_id?: string;
  job_title: string;
  company_name?: string;
  candidate_name?: string;
  status: ApplicationStatus;
  matching_score?: number;
  resume_score?: number;
  cv_url?: string | null;
  extracted_skills?: Array<{ name: string; level?: number }>;
  candidate_email?: string;
  candidate_phone?: string;
  location?: string;
  created_at: string;
  // FIX: 3 field ini sebelumnya tidak ada sama sekali di type, padahal
  // deriveDisplayStatus() di useCandidatesData.ts sudah mengaksesnya
  // (a.offer_status, a.offer_expires_at) dan mapping candidates.ts
  // mengakses a.onboarding_sent. Tanpa ini, TS harusnya sudah error di
  // useCandidatesData.ts — kalau lolos build, kemungkinan strict mode
  // belum full nyala di situ. Tolong cek lagi setelah nambah ini, siapa
  // tau ada type error lain yang selama ini ketutup.
  offer_status?: OfferStatus;
  offer_expires_at?: string | null;
  onboarding_sent?: boolean;
};

/** @deprecated Gunakan `Application` */
export type CandidateApplication = Application;

// ── Raw Application dari API ──────────────────────────────────────────────────
export type RawApplication = {
  id: string;
  candidate_name?: string | null;
  job_title?: string | null;
  job_id?: string | null;
  resume_score?: number | null;
  matching_score?: number | null;
  extracted_skills?: Array<string | { name: string }>;
  status: ApplicationStatus; // FIX: sebelumnya `string` bebas
  created_at?: string;
  cv_url?: string | null;
  candidate_email?: string;
  candidate_phone?: string;
  location?: string;
  // FIX: sama seperti Application di atas — dipakai langsung di
  // fetchDashboardData (server-side fetcher): a.offer_status,
  // a.offer_expires_at, a.onboarding_sent.
  offer_status?: OfferStatus;
  offer_expires_at?: string | null;
  onboarding_sent?: boolean;
};

// ── CV Analysis ───────────────────────────────────────────────────────────────
export type CvAnalysis = {
  id?: string;
  resume_score: number;
  ats_score: number;
  overall_score: number;
  extracted_skills: { name: string; level: number }[];
  categories?: { label: string; score: number }[];
  strengths?: string[];
  improvements?: string[];
  file_name?: string;
  created_at: string;
};

// ── User Profile ──────────────────────────────────────────────────────────────
// Identik dengan CandidateUser di shared/types/candidate.ts
export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
};

/** @deprecated Gunakan `UserProfile` */
export type CandidateUser = UserProfile;

// ── Insight ───────────────────────────────────────────────────────────────────
export type InsightType = "tip" | "warning" | "success";

export type Insight = {
  type: InsightType;
  text: string;
};