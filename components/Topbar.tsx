"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Download,
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

import { DashboardUser } from "@/app/(role)/layout";
import { supabase } from "@/lib/supabase";

const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ─────────────────────────────────────────────────────────────────────
type Notif = {
  id: string;
  type: "status_update" | "interview" | "general";
  title: string;
  message: string;
  created_at: string;
  read: boolean;
};

type Company = { name: string; [key: string]: any };

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
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const timeAgo = (dateStr: string) => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
  return `${Math.floor(diff / 86400)}h lalu`;
};

const notifTypeCfg = {
  status_update: {
    bg: "bg-[rgba(52,211,153,0.12)]",
    border: "border-[rgba(52,211,153,0.2)]",
    dotColor: "#34d399",
    emoji: "📋",
    label: "Status",
    labelColor: "text-[#34d399]",
  },
  interview: {
    bg: "bg-[rgba(56,189,248,0.12)]",
    border: "border-[rgba(56,189,248,0.2)]",
    dotColor: "#38bdf8",
    emoji: "📅",
    label: "Interview",
    labelColor: "text-[#38bdf8]",
  },
  general: {
    bg: "bg-[rgba(196,181,253,0.12)]",
    border: "border-[rgba(196,181,253,0.2)]",
    dotColor: "#c4b5fd",
    emoji: "🔔",
    label: "Info",
    labelColor: "text-[#c4b5fd]",
  },
} as const;

const POPUP_LIMIT = 4;

const PROFILE_HREF = "/profile";

// ── Notification Popup ────────────────────────────────────────────────────────
function NotifPopup({
  notifs,
  role,
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
  const fullHref =
    role === "hr" ? "/notifications/hr" : "/notifications/candidate";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-0 top-[calc(100%+10px)] z-[200] w-[370px] overflow-hidden rounded-2xl
        bg-[#0a0f0c] border border-[rgba(52,211,153,0.15)]
        shadow-[0_24px_64px_rgba(0,0,0,0.75),0_0_0_1px_rgba(52,211,153,0.05)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(52,211,153,0.08)]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[0.88rem] text-[#dff0e8]">
            Notifikasi
          </span>
          {loading && (
            <span className="w-[5px] h-[5px] rounded-full animate-pulse bg-[rgba(52,211,153,0.5)]" />
          )}
          {unread > 0 && (
            <span className="rounded-full font-extrabold bg-[#34d399] text-[#041a0e] py-[1px] px-[7px] text-[10px] shadow-[0_0_8px_rgba(52,211,153,0.5)]">
              {unread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-[5px] text-[11px] font-semibold text-[#34d399] cursor-pointer
                bg-[rgba(52,211,153,0.08)] hover:bg-[rgba(52,211,153,0.15)]
                border border-[rgba(52,211,153,0.18)] hover:border-[rgba(52,211,153,0.35)]
                rounded-[6px] px-[8px] py-[4px] transition-all">
              <CheckCheck size={11} /> Baca semua
            </button>
          )}
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-[7px] flex items-center justify-center cursor-pointer transition-all
              bg-white/[0.04] border border-white/[0.08] text-[#3a5245]
              hover:bg-white/[0.08] hover:text-[#dff0e8]">
            <X size={12} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[320px]">
        {notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(52,211,153,0.06)] border border-[rgba(52,211,153,0.10)] flex items-center justify-center">
              <Inbox size={18} className="text-[#1e3028]" />
            </div>
            <div className="text-center">
              <p className="text-[0.8rem] font-semibold text-[#3d5a4a]">
                Tidak ada notifikasi
              </p>
              <p className="text-[0.7rem] text-[#253b2e] mt-[2px]">
                Pembaruan akan muncul di sini
              </p>
            </div>
          </div>
        ) : (
          preview.map((n, i) => {
            const cfg = notifTypeCfg[n.type] ?? notifTypeCfg.general;
            const isUnread = !n.read;
            return (
              <div
                key={n.id}
                onClick={() => isUnread && onMarkOneRead(n.id)}
                className={`group relative flex gap-3 px-4 py-3 transition-colors
                  ${i < preview.length - 1 ? "border-b border-[rgba(52,211,153,0.06)]" : ""}
                  ${
                    isUnread
                      ? "bg-[rgba(52,211,153,0.03)] hover:bg-[rgba(52,211,153,0.06)] cursor-pointer"
                      : "bg-transparent hover:bg-white/[0.02] cursor-default"
                  }`}>
                {isUnread && (
                  <div
                    className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-full"
                    style={{
                      background: cfg.dotColor,
                      boxShadow: `0 0 6px ${cfg.dotColor}`,
                    }}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-[1px] text-[0.88rem] border ${cfg.bg} ${cfg.border}`}>
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
                      <div className="relative flex-shrink-0 w-4 h-4 mt-[3px]">
                        <span
                          className="absolute inset-0 rounded-full group-hover:opacity-0 transition-opacity"
                          style={{
                            background: cfg.dotColor,
                            boxShadow: `0 0 6px ${cfg.dotColor}`,
                          }}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkOneRead(n.id);
                          }}
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity
                            bg-[rgba(52,211,153,0.2)] border border-[rgba(52,211,153,0.4)]
                            flex items-center justify-center hover:bg-[rgba(52,211,153,0.35)]">
                          <CheckCheck size={9} className="text-[#34d399]" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-[0.73rem] leading-[1.45] line-clamp-2 mb-[4px] text-[#3a5245]">
                    {n.message}
                  </p>
                  <span className="flex items-center gap-1 text-[0.64rem] text-[#253b2e]">
                    <Clock size={8} /> {timeAgo(n.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-[9px] border-t border-[rgba(52,211,153,0.08)]">
        <span className="text-[0.67rem] text-[#253b2e]">
          {hasMore
            ? `${POPUP_LIMIT} dari ${notifs.length} notifikasi`
            : notifs.length > 0
              ? `${notifs.length} notifikasi`
              : ""}
        </span>
        <Link
          href={fullHref}
          onClick={onClose}
          className="flex items-center gap-1 font-semibold no-underline text-[#34d399] text-[11px] transition-colors hover:text-[#6ee7b7]">
          Lihat semua <ArrowRight size={11} />
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

  const handleLogout = async () => {
    onClose();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-0 top-[calc(100%+10px)] z-[200] w-[260px] overflow-hidden rounded-2xl
        bg-[#0a0f0c] border border-[rgba(52,211,153,0.15)]
        shadow-[0_24px_64px_rgba(0,0,0,0.75),0_0_0_1px_rgba(52,211,153,0.05)]">
      {/* User info */}
      <div className="px-4 py-4 border-b border-[rgba(52,211,153,0.08)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-[10px] bg-[linear-gradient(135deg,#10b981,#06b6d4)] flex items-center justify-center font-black text-[0.9rem] text-black flex-shrink-0">
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
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-[3px] rounded-full text-[0.62rem] font-bold">
            ✓ {isHR ? "HR Manager" : "Kandidat"}
          </span>
          {isHR && company && (
            <span className="inline-flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-[3px] rounded-full text-[0.62rem] font-medium truncate max-w-[140px]">
              <Building2 size={9} /> {company.name}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="py-2 px-2">
        {/* Pengaturan */}
        <Link
          href={PROFILE_HREF}
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-[9px] rounded-[10px] no-underline
            hover:bg-[rgba(52,211,153,0.06)] transition-colors group">
          <div className="w-7 h-7 rounded-[7px] bg-[rgba(52,211,153,0.05)] border border-[rgba(52,211,153,0.1)] flex items-center justify-center text-[#3a5245] group-hover:text-emerald-400 group-hover:border-[rgba(52,211,153,0.28)] transition-colors flex-shrink-0">
            <Settings size={13} />
          </div>
          <div className="flex-1">
            <p className="text-[0.82rem] font-semibold text-[#c5d8cc] group-hover:text-[#dff0e8] transition-colors leading-none mb-[3px]">
              Pengaturan
            </p>
            <p className="text-[0.68rem] text-[#3a5245] leading-none">
              Profil, password & akun
            </p>
          </div>
          <ArrowRight
            size={11}
            className="text-[#253b2e] group-hover:text-[#34d399] group-hover:translate-x-[2px] transition-all flex-shrink-0"
          />
        </Link>

        {/* Divider */}
        <div className="h-px bg-[rgba(52,211,153,0.08)] mx-1 my-1" />

        {/* Keluar */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-[9px] rounded-[10px]
            hover:bg-red-500/[0.07] transition-colors group cursor-pointer">
          <div className="w-7 h-7 rounded-[7px] bg-red-500/[0.06] border border-red-500/[0.12] flex items-center justify-center text-[#5a3535] group-hover:text-red-400 group-hover:border-red-500/25 transition-colors flex-shrink-0">
            <LogOut size={13} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[0.82rem] font-semibold text-[#7a5555] group-hover:text-red-400 transition-colors leading-none mb-[3px]">
              Keluar
            </p>
            <p className="text-[0.68rem] text-[#3a2525] leading-none">
              Logout dari sesi ini
            </p>
          </div>
        </button>
      </div>
    </motion.div>
  );
}

// ── Icon Button ───────────────────────────────────────────────────────────────
function IconBtn({
  onClick,
  active,
  children,
  title,
  href,
}: {
  onClick?: () => void;
  active?: boolean;
  children: React.ReactNode;
  title?: string;
  href?: string;
}) {
  const cls = `w-[34px] h-[34px] rounded-[9px] border flex items-center justify-center transition-all duration-200 cursor-pointer
    ${
      active
        ? "bg-[rgba(52,211,153,0.10)] border-[rgba(52,211,153,0.40)] text-[#34d399]"
        : "bg-[#0f1612] border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/30 hover:text-[#e8f0ec]"
    }`;

  if (href) {
    return (
      <Link href={href} title={title} className={`${cls} no-underline`}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} title={title} className={cls}>
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

  const fetchNotifs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${base}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifs(
        (Array.isArray(data) ? data : []).map((n: any) => ({
          ...n,
          created_at: n.created_at ?? n.time,
        })),
      );
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    if (!token) return;
    fetch(`${base}/api/notifications/read-all`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  };

  const handleMarkOneRead = async (id: string) => {
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
    fetchNotifs();
    const iv = setInterval(fetchNotifs, 30_000);
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
    <div className="sticky top-0 z-40 border-b border-emerald-500/[0.1] px-8 h-[62px] flex items-center justify-between bg-[rgba(10,15,13,0.92)] [backdrop-filter:blur(20px)]">
      {/* ── Left: Title ── */}
      <div>
        <h1 className="font-bold text-[0.95rem] text-[#e8f0ec] leading-none">
          {title}
        </h1>
        {isHR && company && (
          <p className="text-[0.68rem] text-[#3a5245] mt-[4px] flex items-center gap-1">
            <Building2 size={9} />
            {company.name}
          </p>
        )}
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-[6px]">
        {/* HR: Export */}
        {isHR && (
          <IconBtn title="Export laporan">
            <Download size={14} />
          </IconBtn>
        )}

        {/* HR: Buat Lowongan */}
        {isHR && !isJobsPage && (
          <Link href="/dashboard/hr/jobs">
            <Button className="inline-flex items-center gap-[6px] bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] text-black font-bold text-[0.8rem] px-4 h-[34px] rounded-[9px] transition-all">
              <Plus size={13} /> Buat Lowongan
            </Button>
          </Link>
        )}

        {/* Candidate: Analisis CV shortcut */}
        {!isHR && (
          <Link
            href="/analyze"
            title="Upload & analisis CV kamu"
            className="hidden sm:inline-flex items-center gap-[6px] h-[34px] px-[14px] rounded-[9px]
              bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.15)]
              text-[#34d399] text-[0.78rem] font-semibold no-underline
              hover:bg-[rgba(16,185,129,0.11)] hover:border-[rgba(16,185,129,0.3)] transition-all">
            <FileText size={13} /> Analisis CV
          </Link>
        )}

        {/* Visual divider */}
        <div className="w-px h-5 bg-[rgba(52,211,153,0.08)] mx-[2px]" />

        {/* Bell */}
        <div className="relative" ref={notifRef}>
          <IconBtn
            active={showNotif}
            title="Notifikasi"
            onClick={() => {
              setShowNotif((v) => !v);
              setShowProfile(false);
              if (!showNotif) fetchNotifs();
            }}>
            <Bell size={15} />
          </IconBtn>
          {hasUnread && (
            <span
              className="absolute -top-[5px] -right-[5px] min-w-[16px] h-4 rounded-full
              bg-[#34d399] text-[#041a0e] text-[9px] font-extrabold
              flex items-center justify-center px-[3px]
              ring-2 ring-[#0a0f0c]
              shadow-[0_0_8px_rgba(52,211,153,0.65)]
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
            onClick={() => {
              setShowProfile((v) => !v);
              setShowNotif(false);
            }}
            className={`flex items-center gap-[7px] h-[34px] pl-[4px] pr-[10px] rounded-[10px] border transition-all duration-200 cursor-pointer
              ${
                showProfile
                  ? "bg-[rgba(52,211,153,0.08)] border-[rgba(52,211,153,0.32)]"
                  : "bg-[#0f1612] border-emerald-500/15 hover:border-emerald-500/25 hover:bg-[rgba(52,211,153,0.03)]"
              }`}>
            <div className="w-[26px] h-[26px] rounded-[7px] bg-[linear-gradient(135deg,#10b981,#06b6d4)] flex items-center justify-center font-black text-[0.65rem] text-black flex-shrink-0 select-none">
              {user ? getInitials(user.full_name) : "U"}
            </div>
            <span className="hidden md:block text-[0.78rem] font-semibold text-[#c5d8cc] max-w-[90px] truncate">
              {user?.full_name?.split(" ")[0] || "User"}
            </span>
            <ChevronDown
              size={11}
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
      </div>
    </div>
  );
}
