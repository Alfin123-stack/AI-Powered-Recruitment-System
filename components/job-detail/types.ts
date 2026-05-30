// Shared types untuk job detail page

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
  created_at: string;
  is_active: boolean;
  companies: {
    id: string;
    name: string;
    description: string;
    company_size: string;
    logo_url: string | null;
  };
};
