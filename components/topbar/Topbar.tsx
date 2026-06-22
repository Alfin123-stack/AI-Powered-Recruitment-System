"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Bell, Plus, FileText, Building2, ChevronDown } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { TopbarProps } from "@/types/topbar";

import { TopbarIconBtn } from "./TopbarIconBtn";
import { TopbarNotifPopup } from "./TopbarNotifPopup";
import { TopbarUserDropdown } from "./TopbarUserDropdown";
import { useNotifications } from "@/hooks/dashboard/useNotifications";
import { useOutsideClick } from "@/hooks/dashboard/useOutsideClick";
import { getInitials } from "@/lib/utils";

export function Topbar({
  title,
  company,
  user,
  isHR = false,
  pathname = "",
  token,
  role = "candidate",
}: TopbarProps) {
  const isJobsPage = pathname === "/dashboard/hr/jobs";

  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { notifs, loading, unreadCount, hasUnread, fetchNotifs, markAllRead, markOneRead } =
    useNotifications(token);

  useOutsideClick(
    [notifRef, profileRef],
    [() => setShowNotif(false), () => setShowProfile(false)],
  );

  return (
    <header
      className="sticky top-0 z-40 border-b border-white/[0.06] px-8 h-[62px] flex items-center justify-between bg-[rgba(10,15,13,0.94)] [backdrop-filter:blur(16px)]"
      role="banner">
      <div>
        <h1 className="font-bold text-[0.95rem] text-[#e8f0ec] leading-none">{title}</h1>
        {isHR && company && (
          <p className="text-[0.68rem] text-[#3a5245] mt-[4px] flex items-center gap-1">
            <Building2 size={9} aria-hidden="true" />
            {company.name}
          </p>
        )}
      </div>

      <nav aria-label="Topbar actions" className="flex items-center gap-[6px]">
        {isHR && !isJobsPage && (
          <Link href="/dashboard/hr/jobs" title="Create new job posting">
            <Button
              aria-label="Create new job posting"
              className="inline-flex items-center gap-[6px] bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.8rem] px-4 h-[34px] rounded-lg transition-colors">
              <Plus size={13} aria-hidden="true" /> Post Job
            </Button>
          </Link>
        )}

        {!isHR && (
          <Link
            href="/analyze"
            title="Upload and analyze your CV"
            aria-label="CV Analyzer — Upload and analyze your CV"
            className="hidden sm:inline-flex items-center gap-[6px] h-[34px] px-[14px] rounded-lg
              bg-white/[0.04] border border-white/[0.08]
              text-[#a0c0b0] text-[0.78rem] font-semibold no-underline
              hover:bg-white/[0.07] hover:text-[#d0e8dc] transition-colors">
            <FileText size={13} aria-hidden="true" /> CV Analyzer
          </Link>
        )}

        <div aria-hidden="true" className="w-px h-5 bg-white/[0.06] mx-[2px]" />

        <div className="relative" ref={notifRef}>
          <TopbarIconBtn
            active={showNotif}
            title="View notifications"
            onClick={() => {
              setShowNotif((v) => !v);
              setShowProfile(false);
              if (!showNotif) void fetchNotifs();
            }}>
            <Bell size={15} aria-hidden="true" />
          </TopbarIconBtn>
          {hasUnread && (
            <span
              aria-label={`${unreadCount} unread notifications`}
              className="absolute -top-[5px] -right-[5px] min-w-[16px] h-4 rounded-full
                bg-emerald-500 text-black text-[9px] font-extrabold
                flex items-center justify-center px-[3px]
                ring-2 ring-[#0a0f0c]
                pointer-events-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <AnimatePresence>
            {showNotif && (
              <TopbarNotifPopup
                notifs={notifs}
                loading={loading}
                onClose={() => setShowNotif(false)}
                onMarkAllRead={markAllRead}
                onMarkOneRead={markOneRead}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfile((v) => !v);
              setShowNotif(false);
            }}
            title="Open account menu"
            aria-label="Open user account menu"
            className={`flex items-center gap-[7px] h-[34px] pl-[4px] pr-[10px] rounded-lg border transition-colors duration-150 cursor-pointer
              ${
                showProfile
                  ? "bg-emerald-500/[0.07] border-emerald-500/25"
                  : "bg-[#0f1612] border-white/[0.08] hover:border-white/[0.14]"
              }`}>
            {/* Avatar — foto jika ada, fallback initials */}
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-[26px] h-[26px] rounded-md object-cover flex-shrink-0"
              />
            ) : (
              <div
                aria-hidden="true"
                className="w-[26px] h-[26px] rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-black text-[0.65rem] text-black flex-shrink-0 select-none">
                {user ? getInitials(user.full_name) : "U"}
              </div>
            )}
            <span className="hidden md:block text-[0.78rem] font-semibold text-[#c5d8cc] max-w-[90px] truncate">
              {user?.full_name?.split(" ")[0] ?? "User"}
            </span>
            <ChevronDown
              size={11}
              aria-hidden="true"
              className={`text-[#3a5245] transition-transform duration-200 flex-shrink-0 ${showProfile ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {showProfile && user && (
              <TopbarUserDropdown
                user={user}
                isHR={isHR}
                company={company}
                onClose={() => setShowProfile(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}