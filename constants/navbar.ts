export interface NavLink {
  label: string;
  href: string;
  iconName: "BriefcaseBusiness" | "Building2" | "ScanText" | "BookOpen";
}

export const NAV_LINKS: NavLink[] = [
  { label: "Jobs",        href: "/jobs",      iconName: "BriefcaseBusiness" },
  { label: "Companies",   href: "/companies", iconName: "Building2" },
  { label: "CV Analyzer", href: "/analyze",   iconName: "ScanText" },
  { label: "Blog",        href: "/blog",      iconName: "BookOpen" },
];

export const NAVBAR_ACTIVE_LINK_CLS =
  "text-emerald-400 bg-emerald-500/10";

export const NAVBAR_INACTIVE_LINK_CLS =
  "text-[#6b8878] hover:text-[#d4e8dd] hover:bg-white/[0.04]";

export const NAVBAR_MOBILE_ACTIVE_LINK_CLS =
  "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20";

export const NAVBAR_MOBILE_INACTIVE_LINK_CLS =
  "text-[#6b8878] border border-transparent hover:text-[#d4e8dd] hover:bg-white/[0.04]";