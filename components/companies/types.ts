export type Company = {
  id: string;
  name: string;
  description: string;
  company_size: string;
  logo_url: string | null;
  openJobs: number;
  location: string;
  tags: string[];
  color: string; // tidak ada di DB — di-assign dari getPaletteColor() saat fetch
};

export type Job = {
  id: string;
  title: string;
  description: string;
  requirements: string;
  salary: string;
  location: string;
  type: string;
  skills: string[];
  benefits: string[];
  deadline: string | null;
  is_active: boolean;
  created_at: string;
  company_id: string;
};
