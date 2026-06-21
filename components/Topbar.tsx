"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Plus,
  Settings,
  X,
  CheckCheck,
  Clock,
  ArrowRight,
  Inbox,
  LogOut,
  ChevronDown,
  Building2,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { DashboardUser } from "@/types/dashboard";

const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ─────────────────────────────────────────────────────────────────────
type NotifType = "status_update" | "interview" | "general";

type Notif = {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
};

type NotifRaw = Omit<Notif, "created_at"> & {
  created_at?: string;
  time?: string;
};

type Company = {
  name: string;
  id?: string;
  logo_url?: string | null;
};

type TopbarProps = {
  title: string;
  company?: Company | null;
  user?: DashboardUser | null;
  isHR?: boolean;
  pathname?: string;
  token?: string;
  role?: "hr" | "candidate";
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const NOTIF_TYPE_CFG: Record<
  NotifType,
  {
    bg: string;
    border: string;
    dotColor: string;
    emoji: string;
    label: string;
    labelColor: string;
  }
> = {
  status_update: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dotColor: "#34d399",
    emoji: "📋",
    label: "Status",
    labelColor: "text-emerald-400",
  },
  interview: {
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    dotColor: "#38bdf8",
    emoji: "📅",
    label: "Interview",
    labelColor: "text-sky-400",
  },
  general: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    dotColor: "#c4b5fd",
    emoji: "🔔",
    label: "Info",
    labelColor: "text-violet-400",
  },
};

const POPUP_LIMIT = 4;
const PROFILE_HREF = "/profile";

// ── Logout Spinner ────────────────────────────────────────────────────────────
function LogoutSpinner() {
  return (
    <svg
      className="animate-spin"
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true">
      <circle
        cx="6.5"
        cy="6.5"
        r="5"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path
        d="M11.5 6.5a5 5 0 0 0-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Notification Popup ────────────────────────────────────────────────────────
function NotifPopup({
  notifs,
  loading,
  onClose,
  onMarkAllRead,
  onMarkOneRead,
}: {
  notifs: Notif[];
  role: "hr" | "candidate";
  loading: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
  onMarkOneRead: (id: string) => void;
}) {
  const unread = notifs.filter((n) => !n.read).length;
  const hasMore = notifs.length > POPUP_LIMIT;
  const preview = [...notifs]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, POPUP_LIMIT);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-label="Notification panel"
      className="absolute right-0 top-[calc(100%+10px)] z-[200] w-[370px] overflow-hidden rounded-xl
        bg-[#0a0f0c] border border-white/[0.08]
        shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[0.88rem] text-[#dff0e8]">
            Notifications
          </span>
          {loading && (
            <span
              aria-label="Loading notifications"
              className="w-[5px] h-[5px] rounded-full animate-pulse bg-emerald-500/40"
            />
          )}
          {unread > 0 && (
            <span
              aria-label={`${unread} unread notifications`}
              className="rounded-full font-extrabold bg-emerald-500 text-black py-[1px] px-[7px] text-[10px]">
              {unread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              onClick={onMarkAllRead}
              title="Mark all notifications as read"
              aria-label="Mark all as read"
              className="flex items-center gap-[5px] text-[11px] font-semibold text-emerald-400 cursor-pointer
                bg-emerald-500/[0.07] hover:bg-emerald-500/[0.13]
                border border-emerald-500/20
                rounded-md px-[8px] py-[4px] transition-colors">
              <CheckCheck size={11} aria-hidden="true" /> Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            title="Close notifications"
            aria-label="Close notification panel"
            className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors
              bg-white/[0.04] border border-white/[0.07] text-[#3a5245]
              hover:bg-white/[0.08] hover:text-[#dff0e8]">
            <X size={12} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[320px]" role="list">
        {notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
              <Inbox size={18} className="text-[#2a4035]" aria-hidden="true" />
            </div>
            <div className="text-center">
              <p className="text-[0.8rem] font-semibold text-[#3d5a4a]">
                No notifications
              </p>
              <p className="text-[0.7rem] text-[#253b2e] mt-[2px]">
                Updates will appear here
              </p>
            </div>
          </div>
        ) : (
          preview.map((n, i) => {
            const cfg = NOTIF_TYPE_CFG[n.type] ?? NOTIF_TYPE_CFG.general;
            const isUnread = !n.read;
            return (
              <div
                key={n.id}
                role="listitem"
                onClick={() => isUnread && onMarkOneRead(n.id)}
                className={`group relative flex gap-3 px-4 py-3 transition-colors
                  ${i < preview.length - 1 ? "border-b border-white/[0.05]" : ""}
                  ${
                    isUnread
                      ? "bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer"
                      : "bg-transparent hover:bg-white/[0.01] cursor-default"
                  }`}>
                {/* Unread accent bar */}
                {isUnread && (
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-[20%] bottom-[20%] w-[2.5px] rounded-r-full"
                    style={{ background: cfg.dotColor }}
                  />
                )}
                <div
                  aria-hidden="true"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-[1px] text-[0.88rem] border ${cfg.bg} ${cfg.border}`}>
                  {cfg.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-[2px]">
                    <div className="flex items-center gap-[5px] min-w-0">
                      <span
                        className={`text-[0.62rem] font-bold tracking-[0.06em] uppercase flex-shrink-0 ${cfg.labelColor}`}>
                        {cfg.label}
                      </span>
                      <span
                        className={`font-semibold text-[0.79rem] leading-snug truncate ${isUnread ? "text-[#dff0e8]" : "text-[#5e8070]"}`}>
                        {n.title}
                      </span>
                    </div>
                    {isUnread && (
                      <button
                        title="Mark this notification as read"
                        aria-label={`Mark "${n.title}" as read`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkOneRead(n.id);
                        }}
                        className="flex-shrink-0 w-5 h-5 rounded mt-[2px] opacity-0 group-hover:opacity-100 transition-opacity
                          bg-emerald-500/10 border border-emerald-500/20
                          flex items-center justify-center hover:bg-emerald-500/20">
                        <CheckCheck
                          size={9}
                          className="text-emerald-400"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </div>
                  <p className="text-[0.73rem] leading-[1.45] line-clamp-2 mb-[4px] text-[#3a5245]">
                    {n.message}
                  </p>
                  <span className="flex items-center gap-1 text-[0.64rem] text-[#253b2e]">
                    <Clock size={8} aria-hidden="true" />{" "}
                    {timeAgo(n.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-[9px] border-t border-white/[0.06]">
        <span className="text-[0.67rem] text-[#253b2e]">
          {hasMore
            ? `${POPUP_LIMIT} of ${notifs.length} notifications`
            : notifs.length > 0
              ? `${notifs.length} notifications`
              : ""}
        </span>
        <Link
          href="/notifications"
          onClick={onClose}
          aria-label="View all notifications"
          className="flex items-center gap-1 font-semibold no-underline text-emerald-400 text-[11px] transition-colors hover:text-emerald-300">
          View all <ArrowRight size={11} aria-hidden="true" />
        </Link>
      </div>
    </motion.div>
  );
}

// ── User Dropdown ─────────────────────────────────────────────────────────────
function UserDropdown({
  user,
  isHR,
  company,
  onClose,
}: {
  user: DashboardUser;
  isHR: boolean;
  company?: Company | null;
  onClose: () => void;
}) {
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
      {/* User info */}
      <div className="px-4 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 mb-3">
          <div
            aria-hidden="true"
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-black text-[0.9rem] text-black flex-shrink-0">
            {getInitials(user.full_name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[0.88rem] text-[#dff0e8] truncate">
              {user.full_name}
            </p>
            <p className="text-[0.7rem] text-[#3a5245] truncate">
              {user.email}
            </p>
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

      {/* Actions */}
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
            <p className="text-[0.68rem] text-[#3a5245] leading-none">
              Back to main page
            </p>
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
          aria-label={
            isLoggingOut ? "Logout in progress" : "Sign out of account"
          }
          className={`w-full flex items-center gap-3 px-3 py-[9px] rounded-lg transition-colors group
            ${
              isLoggingOut
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-red-500/[0.06] cursor-pointer"
            }`}>
          <div
            className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors flex-shrink-0
              ${
                isLoggingOut
                  ? "bg-red-500/[0.08] border-red-500/20 text-red-400"
                  : "bg-white/[0.03] border-white/[0.07] text-[#5a3535] group-hover:text-red-400 group-hover:border-red-500/20"
              }`}>
            {isLoggingOut ? (
              <LogoutSpinner />
            ) : (
              <LogOut size={13} aria-hidden="true" />
            )}
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
            <div
              className="flex items-center gap-[3px] flex-shrink-0"
              aria-hidden="true">
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

// ── Icon Button ───────────────────────────────────────────────────────────────
type IconBtnProps = {
  onClick?: () => void;
  active?: boolean;
  children: React.ReactNode;
  title?: string;
  href?: string;
};

function IconBtn({ onClick, active, children, title, href }: IconBtnProps) {
  const cls = `w-[34px] h-[34px] rounded-lg border flex items-center justify-center transition-colors duration-150 cursor-pointer
    ${
      active
        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
        : "bg-[#0f1612] border-white/[0.08] text-[#7a9585] hover:border-white/[0.14] hover:text-[#e8f0ec]"
    }`;

  if (href) {
    return (
      <Link
        href={href}
        title={title}
        aria-label={title}
        className={`${cls} no-underline`}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} title={title} aria-label={title} className={cls}>
      {children}
    </button>
  );
}

// ── Main Topbar ───────────────────────────────────────────────────────────────
export default function Topbar({
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
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter((n) => !n.read).length;
  const hasUnread = unreadCount > 0;

  const fetchNotifs = async (): Promise<void> => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${base}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: NotifRaw[] = await res.json();
      setNotifs(
        (Array.isArray(data) ? data : []).map((n) => ({
          ...n,
          type: (["status_update", "interview", "general"].includes(n.type)
            ? n.type
            : "general") as NotifType,
          created_at: n.created_at ?? n.time ?? new Date().toISOString(),
        })),
      );
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = (): void => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    if (!token) return;
    fetch(`${base}/api/notifications/read-all`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  };

  const handleMarkOneRead = (id: string): void => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    if (!token) return;
    fetch(`${base}/api/notifications/${id}/read`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  };

  useEffect(() => {
    void fetchNotifs();
    const iv = setInterval(() => void fetchNotifs(), 30_000);
    return () => clearInterval(iv);
  }, [token]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 border-b border-white/[0.06] px-8 h-[62px] flex items-center justify-between bg-[rgba(10,15,13,0.94)] [backdrop-filter:blur(16px)]"
      role="banner">
      {/* Left: Title */}
      <div>
        <h1 className="font-bold text-[0.95rem] text-[#e8f0ec] leading-none">
          {title}
        </h1>
        {isHR && company && (
          <p className="text-[0.68rem] text-[#3a5245] mt-[4px] flex items-center gap-1">
            <Building2 size={9} aria-hidden="true" />
            {company.name}
          </p>
        )}
      </div>

      {/* Right: Actions */}
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

        {/* Bell */}
        <div className="relative" ref={notifRef}>
          <IconBtn
            active={showNotif}
            title="View notifications"
            onClick={() => {
              setShowNotif((v) => !v);
              setShowProfile(false);
              if (!showNotif) void fetchNotifs();
            }}>
            <Bell size={15} aria-hidden="true" />
          </IconBtn>
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
              <NotifPopup
                notifs={notifs}
                role={role}
                loading={loading}
                onClose={() => setShowNotif(false)}
                onMarkAllRead={handleMarkAllRead}
                onMarkOneRead={handleMarkOneRead}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Avatar + dropdown */}
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
            <div
              aria-hidden="true"
              className="w-[26px] h-[26px] rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-black text-[0.65rem] text-black flex-shrink-0 select-none">
              {user ? getInitials(user.full_name) : "U"}
            </div>
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
              <UserDropdown
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
