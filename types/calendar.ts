// ─────────────────────────────────────────────────────────────────────────────

export type InterviewType = "online" | "onsite";

export type InterviewStatus = "scheduled" | "done" | "cancelled" | "overdue";

export type ViewMode = "month" | "week" | "day";

export type Interview = {
  id: string;
  application_id: string;
  scheduled_at: string;
  type: InterviewType;
  location: string | null;
  notes?: string | null;
  status: InterviewStatus;

  // ===== TAMBAHAN =====
  // FIX: sebelumnya "pending" — bukan nilai valid untuk kolom `status` di
  // applications (lihat validStatuses di applicationController.js: applied,
  // review, shortlisted, interview, evaluated, offered, hired, onboard,
  // rejected — tidak ada "pending", itu nama kolom offer_status di baris
  // bawah ini). "applied" dan "review" juga sebelumnya hilang dari union
  // ini.
  // FIX 2: "interview", "evaluated", dan "onboard" ditambahkan di sini —
  // union ini sebelumnya tidak ikut diupdate waktu ketiga status itu
  // ditambahkan ke ApplicationStatus (types/candidate/dashboard.ts) dan ke
  // validStatuses backend, sehingga TypeScript menolak perbandingan
  // `interview.application_status === "evaluated"` di InterviewRow.tsx
  // sebagai perbandingan mustahil (TS2367) — union dan runtime value-nya
  // jadi tidak sinkron.
  application_status?:
    | "applied"
    | "review"
    | "shortlisted"
    | "interview"
    | "evaluated"
    | "offered"
    | "hired"
    | "onboard"
    | "rejected"
    | null;
  offer_status?: "pending" | "accepted" | "declined" | null;

  job_title?: string;
  company_name?: string;
  candidate_name?: string;
  candidate_id?: string;

  /**
   * Required for the Evaluation → Offer/Rejection email flow.
   * Backend must join this from `applications` / `users` in the
   * GET /api/interviews response, otherwise sendOfferLetterAction /
   * sendRejectionAction will not be able to send the email.
   */
  candidate_email?: string;

  // — Data interviewer
  interviewer_name?: string;
  interviewer_avatar?: string;

  // — Metadata tambahan
  duration_minutes?: number;
  round?: string;
  recording_duration?: string;
  created_at?: string;
};