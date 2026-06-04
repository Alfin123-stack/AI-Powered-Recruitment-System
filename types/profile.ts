// types/profile.ts

export type UserRole = "candidate" | "hr";

// ✅ Fix 1: user_metadata value hanya string | undefined, bukan number | boolean | null
export type UserMetadata = Record<string, string | undefined>;

export interface ProfileUser {
  id: string;
  email: string;
  created_at: string;
  user_metadata: UserMetadata;
}

export interface CompanyData {
  // ✅ Fix 2: tambahkan | null agar konsisten dengan data dari Supabase
  name: string;
  description: string | null;
  company_size: string | null;
}

export interface CandidateStats {
  applicationCount: number;
  savedCount: number;
}

export interface ServerProfileData extends CandidateStats {
  user: ProfileUser;
  token: string;
  role: UserRole;
  company: CompanyData | null;
}
