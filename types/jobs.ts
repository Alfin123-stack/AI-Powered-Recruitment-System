// types/jobs.ts

export type Job = {
  id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  salary: string | null;
  location: string | null;
  type: string | null;
  skills: string[] | null;
  benefits: string[] | null;
  deadline: string | null;
  created_at: string;
  is_active: boolean;
  company_id: string;
  companies: {
    id: string;
    name: string | null;
    description: string | null;
    company_size: string | null;
    logo_url: string | null;
  } | null; // <-- this is the key fix
};
