"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  Users,
  TrendingUp,
  Bell,
  Settings,
  Calendar,
  Building2,
} from "lucide-react";
import { Company, getInitials } from "./shared";

const navItems = [
  { href: "/dashboard/hr/overview", Icon: BarChart3, label: "Dashboard" },
  { href: "/dashboard/hr/jobs", Icon: Briefcase, label: "Jobs" },
  { href: "/dashboard/hr/candidates", Icon: Users, label: "Candidates" },
  { href: "/dashboard/hr/analytics", Icon: TrendingUp, label: "Analytics" },
  { href: "/dashboard/hr/interviews", Icon: Calendar, label: "Interviews" },
];

export default function Sidebar({
  user,
  company,
}: {
  user: any;
  company: Company | null;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] flex-shrink-0 bg-[#0f1612] border-r border-emerald-500/15 flex flex-col fixed top-0 left-0 bottom-0 z-50">
      {/* Logo */}
      <Link
        href="/"
        className="px-5 py-[22px] pb-[18px] border-b border-emerald-500/15 font-extrabold text-[1.1rem] flex items-center gap-2 text-[#e8f0ec] no-underline">
        <span className="text-emerald-400">✦</span> Recruit
        <em className="not-italic text-emerald-400">AI</em>
      </Link>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto pt-2">
        <div className="px-3 pt-4 pb-2 text-[0.67rem] font-bold text-[#7a9585] tracking-[0.12em] uppercase">
          Menu
        </div>
        {navItems.map(({ href, Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-[10px] px-3 py-[10px] rounded-[9px] mx-2 mb-[2px] text-[0.86rem] font-medium border no-underline transition-all duration-200
                ${
                  active
                    ? "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20"
                    : "text-[#7a9585] bg-transparent border-transparent hover:text-[#e8f0ec] hover:bg-white/[0.04]"
                }`}>
              <Icon size={15} /> {label}
            </Link>
          );
        })}

        <div className="px-3 pt-4 pb-2 text-[0.67rem] font-bold text-[#7a9585] tracking-[0.12em] uppercase">
          Sistem
        </div>
        {[
          { Icon: Bell, label: "Notifikasi", badge: "3" },
          { Icon: Settings, label: "Pengaturan" },
        ].map(({ Icon, label, badge }, i) => (
          <button
            key={i}
            className="flex items-center justify-between px-3 py-[10px] rounded-[9px] mx-2 mb-[2px] text-[0.86rem] font-medium text-[#7a9585] cursor-pointer border border-transparent bg-transparent hover:text-[#e8f0ec] hover:bg-white/[0.04] w-[calc(100%-16px)] transition-all duration-200">
            <span className="flex items-center gap-[10px]">
              <Icon size={15} /> {label}
            </span>
            {badge && (
              <span className="bg-emerald-500 text-black rounded-[4px] px-[6px] py-[1px] text-[0.65rem] font-extrabold">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* User + Company */}
      <div className="border-t border-emerald-500/15 px-3 py-4">
        {company && (
          <div className="flex items-center gap-[6px] px-2 py-[6px] mb-1">
            <Building2 size={12} className="text-emerald-400 flex-shrink-0" />
            <span className="text-[0.72rem] text-emerald-400 font-semibold truncate">
              {company.name}
            </span>
          </div>
        )}
        <div className="flex items-center gap-[10px] px-2 py-[10px] rounded-[10px]">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center font-extrabold text-[0.75rem] text-emerald-400 flex-shrink-0">
            {user
              ? getInitials(user.user_metadata?.full_name || user.email || "HR")
              : "HR"}
          </div>
          <div>
            <div className="text-[0.82rem] font-semibold truncate max-w-[140px]">
              {user?.user_metadata?.full_name || "HR User"}
            </div>
            <div className="text-[0.7rem] text-[#7a9585]">HR Manager</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
