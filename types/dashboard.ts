export type DashboardUser = {
  id: string;
  email: string;
  full_name: string;
  role: "candidate" | "hr";
};

export type NavItem = {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  matchPrefix?: boolean;
};

export type NavSection = {
  heading: string;
  items: NavItem[];
};
