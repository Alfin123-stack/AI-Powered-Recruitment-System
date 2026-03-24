"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Target,
  User,
  Bell,
} from "lucide-react";
import { CandidateUser, getInitials } from "./shared";

const navItems = [
  { href: "/dashboard/candidate", Icon: LayoutDashboard, label: "Dashboard" },
  {
    href: "/dashboard/candidate/applications",
    Icon: Briefcase,
    label: "Lamaranku",
  },
  { href: "/dashboard/candidate/matches", Icon: Target, label: "Job Matches" },
  { href: "/dashboard/candidate/profile", Icon: User, label: "Profil" },
];

export default function CandidateSidebar({
  user,
}: {
  user: CandidateUser | null;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] flex-shrink-0 bg-[#0f1612] border-r border-emerald-500/15 flex flex-col fixed top-0 left-0 bottom-0 z-50">
      <Link
        href="/"
        className="px-5 py-[22px] pb-[18px] border-b border-emerald-500/15 font-extrabold text-[1.1rem] flex items-center gap-2 text-[#e8f0ec] no-underline">
        <span className="text-emerald-400">✦</span> Recruit
        <em className="not-italic text-emerald-400">AI</em>
      </Link>

      <div className="flex-1 overflow-y-auto pt-2">
        <div className="px-3 pt-4 pb-2 text-[0.67rem] font-bold text-[#7a9585] tracking-[0.12em] uppercase">
          Menu
        </div>
        {navItems.map(({ href, Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-[10px] px-3 py-[10px] rounded-[9px] mx-2 mb-[2px] text-[0.86rem] font-medium border no-underline transition-all duration-200
                ${active ? "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20" : "text-[#7a9585] bg-transparent border-transparent hover:text-[#e8f0ec] hover:bg-white/[0.04]"}`}>
              <Icon size={15} /> {label}
            </Link>
          );
        })}

        <div className="px-3 pt-4 pb-2 text-[0.67rem] font-bold text-[#7a9585] tracking-[0.12em] uppercase">
          Lainnya
        </div>
        <Link
          href="/jobs"
          className="flex items-center gap-[10px] px-3 py-[10px] rounded-[9px] mx-2 mb-[2px] text-[0.86rem] font-medium text-[#7a9585] border border-transparent no-underline hover:text-[#e8f0ec] hover:bg-white/[0.04] transition-all">
          <Briefcase size={15} /> Cari Lowongan
        </Link>
        <Link
          href="/analyze"
          className="flex items-center gap-[10px] px-3 py-[10px] rounded-[9px] mx-2 mb-[2px] text-[0.86rem] font-medium text-[#7a9585] border border-transparent no-underline hover:text-[#e8f0ec] hover:bg-white/[0.04] transition-all">
          <FileText size={15} /> Analisis CV
        </Link>
        <button className="flex items-center justify-between px-3 py-[10px] rounded-[9px] mx-2 mb-[2px] text-[0.86rem] font-medium text-[#7a9585] cursor-pointer border border-transparent bg-transparent hover:text-[#e8f0ec] hover:bg-white/[0.04] w-[calc(100%-16px)] transition-all">
          <span className="flex items-center gap-[10px]">
            <Bell size={15} /> Notifikasi
          </span>
        </button>
      </div>

      <div className="border-t border-emerald-500/15 px-3 py-4">
        <div className="flex items-center gap-[10px] px-2 py-[10px] rounded-[10px]">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center font-extrabold text-[0.78rem] text-emerald-400 flex-shrink-0">
            {user ? getInitials(user.full_name) : "KD"}
          </div>
          <div>
            <div className="text-[0.82rem] font-semibold truncate max-w-[140px]">
              {user?.full_name || "Kandidat"}
            </div>
            <div className="text-[0.7rem] text-[#7a9585]">
              {user?.role || "Kandidat"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
