// types/company.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth untuk type Company.
//
// Menggabungkan:
//   - types/company.ts (sebelumnya)
//   - shared/types/recruiter.ts :: Company (subset — description & company_size non-null di sana)
//     → dijadikan optional/nullable agar konsisten dengan data DB yang bisa null
// ─────────────────────────────────────────────────────────────────────────────

export type Company = {
  id:           string;
  name:         string;
  description:  string | null;
  company_size: string | null;
  logo_url:     string | null;
  industry?:    string | null;
  location?:    string | null;
  website?:     string | null;
  /** Alias UI-only untuk company_size — dipakai di profile.ts */
  size?:        string | null;
  // Field UI-only (di-assign saat fetch, tidak ada di DB)
  openJobs?: number;
  tags?:     string[];
  color?:    string;
};

/** Alias untuk Company — dipakai di konteks HR yang tidak butuh field UI-only. */
export type CompanyInfo = Company;
