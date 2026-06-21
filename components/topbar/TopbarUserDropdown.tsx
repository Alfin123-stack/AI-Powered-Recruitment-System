"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Settings, ArrowRight, LogOut, Building2, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { DashboardUser } from "@/types/dashboard";
import type { Company } from "@/types/topbar";

import { TopbarLogoutSpinner } from "./TopbarLogoutSpinner";
import { getInitials } from "@/lib/utils";
import { PROFILE_HREF } from "@/constants/topbar";

type TopbarUserDropdownProps = {
  user: DashboardUser;
  isHR: boolean;
  company?: Company | null;
  onClose: () => void;
};

export function TopbarUserDropdown({ user, isHR, company, onClose }: TopbarUserDropdownProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (): Promise<void> => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      onClose();
      router.push("/");
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-label="User account menu"
      className="absolute right-0 top-[calc(100%+10px)] z-[200] w-[260px] overflow-hidden rounded-xl
        bg-[#0a0f0c] border border-white/[0.08]
        shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
      <div className="px-4 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 mb-3">
          <div
            aria-hidden="true"
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-black text-[0.9rem] text-black flex-shrink-0">
            {getInitials(user.full_name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[0.88rem] text-[#dff0e8] truncate">{user.full_name}</p>
            <p className="text-[0.7rem] text-[#3a5245] truncate">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-[3px] rounded text-[0.62rem] font-bold">
            ✓ {isHR ? "HR Manager" : "Candidate"}
          </span>
          {isHR && company && (
            <span className="inline-flex items-center gap-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-2 py-[3px] rounded text-[0.62rem] font-medium truncate max-w-[140px]">
              <Building2 size={9} aria-hidden="true" /> {company.name}
            </span>
          )}
        </div>
      </div>

      <div className="py-2 px-2">
        <Link
          href={PROFILE_HREF}
          onClick={onClose}
          title="Open profile settings page"
          aria-label="Profile, password and account settings"
          className="flex items-center gap-3 px-3 py-[9px] rounded-lg no-underline
            hover:bg-white/[0.04] transition-colors group">
          <div className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#3a5245] group-hover:text-emerald-400 transition-colors flex-shrink-0">
            <Settings size={13} aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-[0.82rem] font-semibold text-[#c5d8cc] group-hover:text-[#dff0e8] transition-colors leading-none mb-[3px]">
              Settings
            </p>
            <p className="text-[0.68rem] text-[#3a5245] leading-none">
              Profile, password &amp; account
            </p>
          </div>
          <ArrowRight
            size={11}
            aria-hidden="true"
            className="text-[#253b2e] group-hover:text-emerald-400 group-hover:translate-x-[2px] transition-all flex-shrink-0"
          />
        </Link>

        <Link
          href="/"
          onClick={onClose}
          title="Back to home page"
          aria-label="Navigate to home"
          className="flex items-center gap-3 px-3 py-[9px] rounded-lg no-underline
            hover:bg-white/[0.04] transition-colors group">
          <div className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#3a5245] group-hover:text-emerald-400 transition-colors flex-shrink-0">
            <LayoutDashboard size={13} aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-[0.82rem] font-semibold text-[#c5d8cc] group-hover:text-[#dff0e8] transition-colors leading-none mb-[3px]">
              Home
            </p>
            <p className="text-[0.68rem] text-[#3a5245] leading-none">Back to main page</p>
          </div>
          <ArrowRight
            size={11}
            aria-hidden="true"
            className="text-[#253b2e] group-hover:text-emerald-400 group-hover:translate-x-[2px] transition-all flex-shrink-0"
          />
        </Link>

        <div className="h-px bg-white/[0.05] mx-1 my-1" />

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={isLoggingOut ? "Logging out..." : "Sign out of this session"}
          aria-label={isLoggingOut ? "Logout in progress" : "Sign out of account"}
          className={`w-full flex items-center gap-3 px-3 py-[9px] rounded-lg transition-colors group
            ${isLoggingOut ? "opacity-70 cursor-not-allowed" : "hover:bg-red-500/[0.06] cursor-pointer"}`}>
          <div
            className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors flex-shrink-0
              ${
                isLoggingOut
                  ? "bg-red-500/[0.08] border-red-500/20 text-red-400"
                  : "bg-white/[0.03] border-white/[0.07] text-[#5a3535] group-hover:text-red-400 group-hover:border-red-500/20"
              }`}>
            {isLoggingOut ? <TopbarLogoutSpinner /> : <LogOut size={13} aria-hidden="true" />}
          </div>
          <div className="flex-1 text-left">
            <p
              className={`text-[0.82rem] font-semibold leading-none mb-[3px] transition-colors
                ${isLoggingOut ? "text-red-400" : "text-[#7a5555] group-hover:text-red-400"}`}>
              {isLoggingOut ? "Logging out..." : "Logout"}
            </p>
            <p className="text-[0.68rem] text-[#3a2525] leading-none">
              {isLoggingOut ? "Please wait" : "Log out of this session"}
            </p>
          </div>
          {isLoggingOut && (
            <div className="flex items-center gap-[3px] flex-shrink-0" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-[3px] h-[3px] rounded-full bg-red-400/60"
                  style={{
                    animation: "logoutDot 1.2s ease-in-out infinite",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          )}
        </button>
      </div>

      <style>{`
        @keyframes logoutDot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </motion.div>
  );
}
