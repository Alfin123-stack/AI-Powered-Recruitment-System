export type DashboardUser = {
  id: string;
  email: string;
  full_name: string;
  role: "candidate" | "hr";
};

export type DashboardNavItem = {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  matchPrefix?: boolean;
};

/** @deprecated Gunakan `DashboardNavItem` */
export type NavItem = DashboardNavItem;

export type NavSection = {
  heading: string;
  items: DashboardNavItem[];
};
