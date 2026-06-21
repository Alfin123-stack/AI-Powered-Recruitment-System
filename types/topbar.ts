import type { DashboardUser } from "@/types/dashboard";


export type Company = {
  name: string;
  id?: string;
  logo_url?: string | null;
};

export type TopbarProps = {
  title: string;
  company?: Company | null;
  user?: DashboardUser | null;
  isHR?: boolean;
  pathname?: string;
  token?: string;
  role?: "hr" | "candidate";
};

export type IconBtnProps = {
  onClick?: () => void;
  active?: boolean;
  children: React.ReactNode;
  title?: string;
  href?: string;
};