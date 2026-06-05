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
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
  return `${Math.floor(diff / 86400)}h lalu`;
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
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-label="Panel notifikasi"
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
            <span
              aria-label="Memuat notifikasi"
              className="w-[5px] h-[5px] rounded-full animate-pulse bg-[rgba(52,211,153,0.5)]"
            />
          )}
          {unread > 0 && (
            <span
              aria-label={`${unread} notifikasi belum dibaca`}
              className="rounded-full font-extrabold bg-[#34d399] text-[#041a0e] py-[1px] px-[7px] text-[10px] shadow-[0_0_8px_rgba(52,211,153,0.5)]">
              {unread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              onClick={onMarkAllRead}
              title="Tandai semua notifikasi sebagai sudah dibaca"
              aria-label="Tandai semua sebagai sudah dibaca"
              className="flex items-center gap-[5px] text-[11px] font-semibold text-[#34d399] cursor-pointer
                bg-[rgba(52,211,153,0.08)] hover:bg-[rgba(52,211,153,0.15)]
                border border-[rgba(52,211,153,0.18)] hover:border-[rgba(52,211,153,0.35)]
                rounded-[6px] px-[8px] py-[4px] transition-all">
              <CheckCheck size={11} aria-hidden="true" /> Baca semua
            </button>
          )}
          <button
            onClick={onClose}
            title="Tutup notifikasi"
            aria-label="Tutup panel notifikasi"
            className="w-6 h-6 rounded-[7px] flex items-center justify-center cursor-pointer transition-all
              bg-white/[0.04] border border-white/[0.08] text-[#3a5245]
              hover:bg-white/[0.08] hover:text-[#dff0e8]">
            <X size={12} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[320px]" role="list">
        {notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(52,211,153,0.06)] border border-[rgba(52,211,153,0.10)] flex items-center justify-center">
              <Inbox size={18} className="text-[#1e3028]" aria-hidden="true" />
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
            const cfg = NOTIF_TYPE_CFG[n.type] ?? NOTIF_TYPE_CFG.general;
            const isUnread = !n.read;
            return (
              <div
                key={n.id}
                role="listitem"
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
                    aria-hidden="true"
                    className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-full"
                    style={{
                      background: cfg.dotColor,
                      boxShadow: `0 0 6px ${cfg.dotColor}`,
                    }}
                  />
                )}
                <div
                  aria-hidden="true"
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
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full group-hover:opacity-0 transition-opacity"
                          style={{
                            background: cfg.dotColor,
                            boxShadow: `0 0 6px ${cfg.dotColor}`,
                          }}
                        />
                        <button
                          title="Tandai notifikasi ini sebagai sudah dibaca"
                          aria-label={`Tandai "${n.title}" sebagai sudah dibaca`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkOneRead(n.id);
                          }}
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity
                            bg-[rgba(52,211,153,0.2)] border border-[rgba(52,211,153,0.4)]
                            flex items-center justify-center hover:bg-[rgba(52,211,153,0.35)]">
                          <CheckCheck
                            size={9}
                            className="text-[#34d399]"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
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
      <div className="flex items-center justify-between px-4 py-[9px] border-t border-[rgba(52,211,153,0.08)]">
        <span className="text-[0.67rem] text-[#253b2e]">
          {hasMore
            ? `${POPUP_LIMIT} dari ${notifs.length} notifikasi`
            : notifs.length > 0
              ? `${notifs.length} notifikasi`
              : ""}
        </span>
        <Link
          href="/notifications"
          onClick={onClose}
          aria-label="Lihat semua notifikasi"
          className="flex items-center gap-1 font-semibold no-underline text-[#34d399] text-[11px] transition-colors hover:text-[#6ee7b7]">
          Lihat semua <ArrowRight size={11} aria-hidden="true" />
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
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-label="Menu akun pengguna"
      className="absolute right-0 top-[calc(100%+10px)] z-[200] w-[260px] overflow-hidden rounded-2xl
        bg-[#0a0f0c] border border-[rgba(52,211,153,0.15)]
        shadow-[0_24px_64px_rgba(0,0,0,0.75),0_0_0_1px_rgba(52,211,153,0.05)]">
      {/* User info */}
      <div className="px-4 py-4 border-b border-[rgba(52,211,153,0.08)]">
        <div className="flex items-center gap-3 mb-3">
          <div
            aria-hidden="true"
            className="w-10 h-10 rounded-[10px] bg-[linear-gradient(135deg,#10b981,#06b6d4)] flex items-center justify-center font-black text-[0.9rem] text-black flex-shrink-0">
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
          title="Buka halaman pengaturan profil"
          aria-label="Pengaturan profil, password dan akun"
          className="flex items-center gap-3 px-3 py-[9px] rounded-[10px] no-underline
            hover:bg-[rgba(52,211,153,0.06)] transition-colors group">
          <div className="w-7 h-7 rounded-[7px] bg-[rgba(52,211,153,0.05)] border border-[rgba(52,211,153,0.1)] flex items-center justify-center text-[#3a5245] group-hover:text-emerald-400 group-hover:border-[rgba(52,211,153,0.28)] transition-colors flex-shrink-0">
            <Settings size={13} aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-[0.82rem] font-semibold text-[#c5d8cc] group-hover:text-[#dff0e8] transition-colors leading-none mb-[3px]">
              Pengaturan
            </p>
            <p className="text-[0.68rem] text-[#3a5245] leading-none">
              Profil, password &amp; akun
            </p>
          </div>
          <ArrowRight
            size={11}
            aria-hidden="true"
            className="text-[#253b2e] group-hover:text-[#34d399] group-hover:translate-x-[2px] transition-all flex-shrink-0"
          />
        </Link>

        <div className="h-px bg-[rgba(52,211,153,0.08)] mx-1 my-1" />

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={isLoggingOut ? "Sedang keluar..." : "Keluar dari sesi ini"}
          aria-label={
            isLoggingOut ? "Sedang proses keluar" : "Keluar dari akun"
          }
          className={`w-full flex items-center gap-3 px-3 py-[9px] rounded-[10px] transition-colors group
            ${
              isLoggingOut
                ? "opacity-70 cursor-not-allowed bg-red-500/[0.04]"
                : "hover:bg-red-500/[0.07] cursor-pointer"
            }`}>
          <div
            className={`w-7 h-7 rounded-[7px] border flex items-center justify-center transition-colors flex-shrink-0
              ${
                isLoggingOut
                  ? "bg-red-500/[0.10] border-red-500/25 text-red-400"
                  : "bg-red-500/[0.06] border-red-500/[0.12] text-[#5a3535] group-hover:text-red-400 group-hover:border-red-500/25"
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
              {isLoggingOut ? "Keluar..." : "Keluar"}
            </p>
            <p className="text-[0.68rem] text-[#3a2525] leading-none">
              {isLoggingOut ? "Mohon tunggu sebentar" : "Logout dari sesi ini"}
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
  const cls = `w-[34px] h-[34px] rounded-[9px] border flex items-center justify-center transition-all duration-200 cursor-pointer
    ${
      active
        ? "bg-[rgba(52,211,153,0.10)] border-[rgba(52,211,153,0.40)] text-[#34d399]"
        : "bg-[#0f1612] border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/30 hover:text-[#e8f0ec]"
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
      className="sticky top-0 z-40 border-b border-emerald-500/[0.1] px-8 h-[62px] flex items-center justify-between bg-[rgba(10,15,13,0.92)] [backdrop-filter:blur(20px)]"
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
      <nav aria-label="Aksi topbar" className="flex items-center gap-[6px]">
        {isHR && (
          <IconBtn title="Export laporan HR" onClick={() => {}}>
            <Download size={14} aria-hidden="true" />
          </IconBtn>
        )}

        {isHR && !isJobsPage && (
          <Link href="/dashboard/hr/jobs" title="Buat lowongan baru">
            <Button
              aria-label="Buat lowongan baru"
              className="inline-flex items-center gap-[6px] bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] text-black font-bold text-[0.8rem] px-4 h-[34px] rounded-[9px] transition-all">
              <Plus size={13} aria-hidden="true" /> Buat Lowongan
            </Button>
          </Link>
        )}

        {!isHR && (
          <Link
            href="/analyze"
            title="Upload dan analisis CV kamu"
            aria-label="Analisis CV — Upload dan analisis CV kamu"
            className="hidden sm:inline-flex items-center gap-[6px] h-[34px] px-[14px] rounded-[9px]
              bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.15)]
              text-[#34d399] text-[0.78rem] font-semibold no-underline
              hover:bg-[rgba(16,185,129,0.11)] hover:border-[rgba(16,185,129,0.3)] transition-all">
            <FileText size={13} aria-hidden="true" /> Analisis CV
          </Link>
        )}

        <div
          aria-hidden="true"
          className="w-px h-5 bg-[rgba(52,211,153,0.08)] mx-[2px]"
        />

        {/* Bell */}
        <div className="relative" ref={notifRef}>
          <IconBtn
            active={showNotif}
            title="Lihat notifikasi"
            onClick={() => {
              setShowNotif((v) => !v);
              setShowProfile(false);
              if (!showNotif) void fetchNotifs();
            }}>
            <Bell size={15} aria-hidden="true" />
          </IconBtn>
          {hasUnread && (
            <span
              aria-label={`${unreadCount} notifikasi belum dibaca`}
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
            title="Buka menu akun"
            aria-label="Buka menu akun pengguna"
            aria-expanded={showProfile}
            className={`flex items-center gap-[7px] h-[34px] pl-[4px] pr-[10px] rounded-[10px] border transition-all duration-200 cursor-pointer
              ${
                showProfile
                  ? "bg-[rgba(52,211,153,0.08)] border-[rgba(52,211,153,0.32)]"
                  : "bg-[#0f1612] border-emerald-500/15 hover:border-emerald-500/25 hover:bg-[rgba(52,211,153,0.03)]"
              }`}>
            <div
              aria-hidden="true"
              className="w-[26px] h-[26px] rounded-[7px] bg-[linear-gradient(135deg,#10b981,#06b6d4)] flex items-center justify-center font-black text-[0.65rem] text-black flex-shrink-0 select-none">
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
