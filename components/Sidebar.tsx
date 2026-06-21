"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Building2 } from "lucide-react";
import { getInitials } from "@/lib/utils";

export type SidebarNavItem = {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  matchPrefix?: boolean;
};

export type SidebarNavSection = {
  heading?: string;
  items: SidebarNavItem[];
};

type SidebarUser = {
  full_name?: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: string | undefined;
  };
};

export interface SidebarProps {
  role: "hr" | "candidate";
  sections: SidebarNavSection[];
  user?: SidebarUser;
  company?: { name: string } | null;
  token?: string;
  displayName?: string;
  roleLabel?: string;
}

// ── Nav Item ──────────────────────────────────────────────────────────────────

function NavItem({
  href,
  icon: Icon,
  label,
  matchPrefix,
  badge,
}: SidebarNavItem & { badge?: number }) {
  const pathname = usePathname();
  const active = matchPrefix ? pathname.startsWith(href) : pathname === href;

  return (
    <Link
      href={href}
      className={`
        group mt-2 flex items-center gap-[10px] px-3 py-[9px] rounded-[10px] mx-2 mb-[1px]
        text-[0.82rem] font-medium no-underline relative overflow-hidden
        border transition-[color,background-color,border-color] duration-150
        ${
          active
            ? "text-[#34d399] bg-[rgba(52,211,153,0.09)] border-[rgba(52,211,153,0.18)]"
            : "text-[#7a9585] bg-transparent border-transparent hover:text-[#a7d9bf] hover:bg-[rgba(52,211,153,0.05)] hover:border-[rgba(52,211,153,0.10)]"
        }
      `}>
      {active && (
        <span className="absolute left-0 top-[20%] bottom-[20%] w-[2px] rounded-r-[2px] bg-[#34d399]" />
      )}
      <Icon
        size={15}
        className={`flex-shrink-0 transition-colors duration-150 ${
          active ? "text-[#34d399]" : "text-[#7a9585]"
        }`}
      />
      <span className="flex-1">{label}</span>
      {badge && badge > 0 && (
        <span className="rounded-[5px] font-extrabold bg-[#34d399] text-[#041a0e] text-[9px] px-[6px] leading-[16px]">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </Link>
  );
}

// ── Main Sidebar ──────────────────────────────────────────────────────────────

export default function Sidebar({
  role,
  sections,
  user,
  company,
  token: _token,
  displayName,
  roleLabel,
}: SidebarProps) {
  const resolvedName =
    displayName ??
    user?.full_name ??
    user?.user_metadata?.full_name ??
    user?.email ??
    (role === "hr" ? "HR User" : "Candidate");

  const resolvedRole = roleLabel ?? (role === "hr" ? "HR Manager" : "Candidate");
  const initials = getInitials(resolvedName);

  return (
    <aside className="w-[240px] flex-shrink-0 flex flex-col fixed top-0 left-0 bottom-0 z-50 overflow-hidden bg-[#0a0f0c] border-r border-[rgba(52,211,153,0.10)]">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-[linear-gradient(90deg,transparent,rgba(52,211,153,0.3),transparent)]" />

      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 px-5 py-[18px] no-underline font-extrabold text-[0.95rem] tracking-[-0.3px] text-[#dff0e8] border-b border-[rgba(52,211,153,0.08)]">
        <div className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0 bg-[rgba(52,211,153,0.12)] border border-[rgba(52,211,153,0.20)]">
          <Sparkles size={13} className="text-emerald-400" />
        </div>
        Recruit<em className="not-italic text-emerald-400">AI</em>
      </Link>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-2 [scrollbar-width:none]">
        {sections.map((section, si) => (
          <div key={si} className="mb-1">
            {section.heading && (
              <div className="px-4 pt-4 pb-[6px] text-[0.62rem] font-bold tracking-[0.12em] uppercase text-[#1a2e22]">
                {section.heading}
              </div>
            )}
            {section.items.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
        ))}
      </div>

      {/* User badge */}
      <div className="border-t border-[rgba(52,211,153,0.08)]">
        {company?.name && (
          <div className="flex items-center gap-[6px] px-5 pt-3 pb-1">
            <Building2 size={11} className="text-emerald-400 flex-shrink-0" />
            <span className="text-[0.7rem] font-semibold truncate text-[#34d399]">
              {company.name}
            </span>
          </div>
        )}
        <div className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px] mx-2 my-1 cursor-pointer transition-all border border-transparent hover:bg-[rgba(52,211,153,0.04)] hover:border-[rgba(52,211,153,0.08)]">
          <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center font-extrabold flex-shrink-0 text-[12px] tracking-[0.5px] bg-[rgba(52,211,153,0.10)] border border-[rgba(52,211,153,0.20)] text-[#34d399]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[0.8rem] font-semibold truncate text-[#dff0e8]">
              {resolvedName}
            </div>
            <div className="text-[0.67rem] text-[#1e3028]">{resolvedRole}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
