export type SortKey = "score" | "match" | "name" | "date" | "applied_role";
export type SortDir = "asc" | "desc";

// FIX: "accepted" dibuang dari union ini. deriveDisplayStatus()
// (useCandidatesData.ts) tidak pernah mengembalikan nilai ini — begitu
// offer_status jadi "accepted", backend (updateOfferStatus) langsung set
// `status` ke "hired" di baris yang sama, jadi tidak ada window waktu di
// mana kandidat "accepted tapi belum hired" untuk dibaca dari data.
// Mempertahankannya di sini cuma menambah cabang kondisi tanpa manfaat.
// (Catatan: OfferStatus di candidate/dashboard.ts TETAP punya "accepted"
// — itu nilai kolom mentah `offer_status` dari backend, konsepnya beda
// dengan CandidateStatus yang sudah diturunkan/displayed.)
// TAMBAHAN: "interview", "evaluated", "onboard" — 3 status otomatis baru,
// tidak pernah dipilih manual dari dropdown/modal:
//   - "interview"  di-set begitu HR submit form "Create Interview"
//     (InterviewScheduleModal → useInterviewSchedule).
//   - "evaluated"   di-set begitu HR submit EvaluationModal dengan
//     rekomendasi "Hire" (useEvaluationFlow.handleHire), SEBELUM offer
//     letter benar-benar dikirim — supaya kalau HR batal di tengah jalan
//     ngisi OfferLetterModal, status kandidat tidak nyangkut jadi
//     "offered" padahal offer belum terkirim.
//   - "onboard"     di-set begitu HR sukses kirim onboarding email
//     (OnboardingModal → CandidatesTable.onSent), status lanjutan dari
//     "hired".
export type CandidateStatus =
  | "applied"
  | "review"
  | "shortlisted"
  | "interview"
  | "evaluated"
  | "rejected"
  | "hired"
  | "onboard"
  | "offered"
  | "declined"
  | "expired";

// FIX: diturunkan dari CandidateStatus + "all", bukan didefinisikan ulang
// manual. Sebelumnya ada risiko StatusFilter dan CandidateStatus saling
// tidak sinkron kalau salah satu ditambah statusnya belakangan.
export type StatusFilter = CandidateStatus | "all";

export type Candidate = {
  id: string;
  name: string;
  avatar: string;
  job: string;
  jobId: string;
  resumeScore: number;
  matchScore: number;
  skills: string[];
  status: CandidateStatus;
  appliedDate: string;
  color: string;
  cv_url: string | null;
  // Dibutuhkan fitur onboarding email (CandidatesActionDropdown &
  // CandidatesModal) — true kalau email detail onboarding sudah dikirim ke
  // kandidat ini, supaya tombolnya berubah jadi "Onboarding Terkirim" dan
  // tidak bisa dikirim dobel.
  onboarding_sent?: boolean;
};

export type DateFilter =
  | "Last 7 days"
  | "Last 30 days"
  | "Last 90 days"
  | "All time";

export interface JobMeta {
  key: string;
  label: string;
  color: string;
  count: number;
  todayCount: number;
}

export interface CandidateRaw extends Candidate {
  created_at: string;
  email: string;
  phone: string;
  location: string;
}