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
