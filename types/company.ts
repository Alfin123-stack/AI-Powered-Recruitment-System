export type Company = {
  id: string;
  name: string;
  description: string | null;
  company_size: string | null;
  logo_url: string | null;
  industry?: string | null;
  location?: string | null;
  website?: string | null;
  // Field UI-only, di-assign saat fetch, tidak ada di DB
  openJobs?: number;
  tags?: string[] | undefined;
  color?: string;
};
