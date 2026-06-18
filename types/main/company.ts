export type Company = {
  id: string;
  name: string;
  description: string | null;
  company_size: string | null;
  logo_url: string | null;
  industry?: string | null;
  location?: string | null;
  website?: string | null;

  size?: string | null;

  openJobs?: number;
  tags?: string[];
  color?: string;
};

export type CompanyInfo = Company;
