"use client";

import { useState, useEffect, useRef } from "react";
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
  X,
  CheckCheck,
  Clock,
} from "lucide-react";
import { Company, getInitials, apiFetch } from "./shared";
import { motion, AnimatePresence } from "framer-motion";

const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const navItems = [
  { href: "/dashboard/hr/overview", Icon: BarChart3, label: "Dashboard" },
  { href: "/dashboard/hr/jobs", Icon: Briefcase, label: "Jobs" },
  { href: "/dashboard/hr/candidates", Icon: Users, label: "Candidates" },
  { href: "/dashboard/hr/analytics", Icon: TrendingUp, label: "Analytics" },
  { href: "/dashboard/hr/interviews", Icon: Calendar, label: "Interviews" },
];

type Notif = {
  id: string;
  type: "status_update" | "interview" | "general";
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const notifConfig: Record<string, { bg: string; emoji: string }> = {
  status_update: { bg: "rgba(16,185,129,0.12)", emoji: "📋" },
  interview: { bg: "rgba(6,182,212,0.12)", emoji: "📅" },
  general: { bg: "rgba(139,92,246,0.12)", emoji: "🔔" },
};

const timeAgo = (dateStr: string) => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
};

// ── Notification Modal ─────────────────────────────────────
function NotificationModal({
  notifs,
  onClose,
  onMarkAllRead,
}: {
  notifs: Notif[];
  onClose: () => void;
  onMarkAllRead: () => void;
}) {
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-[248px] top-[80px] z-[200] w-[360px] bg-[#0f1612] border border-emerald-500/20 rounded-[16px] shadow-[0_24px_64px_rgba(0,0,0,0.55)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-500/15">
        <div className="flex items-center gap-2">
          <span className="font-syne font-bold text-[0.95rem]">Notifikasi</span>
          {unread > 0 && (
            <span className="bg-emerald-500 text-black rounded-full px-[7px] py-[1px] text-[0.65rem] font-extrabold">
              {unread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-[0.72rem] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">
              <CheckCheck size={12} /> Tandai semua dibaca
            </button>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-[6px] bg-[#141f19] border border-emerald-500/15 flex items-center justify-center text-[#7a9585] hover:text-[#e8f0ec] cursor-pointer transition-colors">
            <X size={13} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto">
        {notifs.length === 0 ? (
          <div className="text-center py-14 text-[#7a9585]">
            <div className="text-[2.5rem] mb-3 opacity-20">🔔</div>
            <div className="text-[0.85rem] font-semibold mb-1">
              Tidak ada notifikasi
            </div>
            <p className="text-[0.75rem] max-w-[200px] mx-auto leading-relaxed">
              Notifikasi muncul saat ada lamaran baru atau jadwal interview.
            </p>
          </div>
        ) : (
          notifs.map((n, i) => {
            const cfg = notifConfig[n.type] ?? notifConfig.general;
            return (
              <div
                key={n.id}
                className={`flex gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02] cursor-default
                  ${i < notifs.length - 1 ? "border-b border-emerald-500/[0.08]" : ""}
                  ${!n.read ? "bg-emerald-500/[0.025]" : ""}`}>
                <div
                  className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0 mt-[2px] text-[1rem]"
                  style={{ background: cfg.bg }}>
                  {cfg.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-[0.82rem]">
                      {n.title}
                    </div>
                    {!n.read && (
                      <div className="w-[7px] h-[7px] rounded-full bg-emerald-400 flex-shrink-0 mt-[4px]" />
                    )}
                  </div>
                  <div className="text-[0.78rem] text-[#7a9585] mt-[3px] leading-[1.45]">
                    {n.message}
                  </div>
                  <div className="flex items-center gap-1 text-[0.67rem] text-[#7a9585]/50 mt-[5px]">
                    <Clock size={9} /> {timeAgo(n.time)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifs.length > 0 && (
        <div className="px-5 py-3 border-t border-emerald-500/15 flex justify-between items-center">
          <span className="text-[0.72rem] text-[#7a9585]">
            {notifs.length} notifikasi
          </span>
          <Link
            href="/dashboard/hr/candidates"
            className="text-[0.75rem] text-emerald-400 hover:text-emerald-300 no-underline transition-colors">
            Lihat kandidat →
          </Link>
        </div>
      )}
    </motion.div>
  );
}

// ── Sidebar ────────────────────────────────────────────────
export default function Sidebar({
  user,
  company,
  token,
}: {
  user: any;
  company: Company | null;
  token?: string;
}) {
  const pathname = usePathname();
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMarkAllRead = async () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch(`${base}/api/notifications/read-all`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(console.error);
  };

  // Di luar komponen — tidak menyebabkan masalah karena tidak pakai hooks
  const fetchNotifications = async (token: string) => {
    const res = await fetch(`${base}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    return (Array.isArray(data) ? data : []).map((n: any) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      time: n.created_at,
      read: n.read,
    }));
  };

  // Di dalam komponen
  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const notifs = await fetchNotifications(token);
        if (!cancelled) setNotifs(notifs);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const interval = setInterval(async () => {
      try {
        const notifs = await fetchNotifications(token);
        setNotifs(notifs);
      } catch (e) {
        console.error(e);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [token]);

  // handleToggleNotif juga pakai helper yang sama
  const handleToggleNotif = async () => {
    setShowNotif((v) => !v);
    if (!showNotif && token) {
      try {
        const notifs = await fetchNotifications(token);
        setNotifs(notifs);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Tutup kalau klik di luar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowNotif(false);
      }
    };
    if (showNotif) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotif]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div ref={wrapperRef}>
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

          {/* Notifikasi button */}
          <button
            onClick={handleToggleNotif}
            className={`flex items-center justify-between px-3 py-[10px] rounded-[9px] mx-2 mb-[2px] text-[0.86rem] font-medium cursor-pointer border w-[calc(100%-16px)] transition-all duration-200
              ${
                showNotif
                  ? "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20"
                  : "text-[#7a9585] bg-transparent border-transparent hover:text-[#e8f0ec] hover:bg-white/[0.04]"
              }`}>
            <span className="flex items-center gap-[10px]">
              <Bell size={15} />
              Notifikasi
              {loading && (
                <span className="w-[6px] h-[6px] rounded-full bg-emerald-400/50 animate-pulse" />
              )}
            </span>
            {unreadCount > 0 && (
              <span className="bg-emerald-500 text-black rounded-[4px] px-[6px] py-[1px] text-[0.65rem] font-extrabold">
                {unreadCount}
              </span>
            )}
          </button>

          <Link
            href="/dashboard/hr/settings"
            className={`flex items-center gap-[10px] px-3 py-[10px] rounded-[9px] mx-2 mb-[2px] text-[0.86rem] font-medium border no-underline transition-all duration-200
              ${
                pathname === "/dashboard/hr/settings"
                  ? "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20"
                  : "text-[#7a9585] bg-transparent border-transparent hover:text-[#e8f0ec] hover:bg-white/[0.04]"
              }`}>
            <Settings size={15} /> Pengaturan
          </Link>
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
                ? getInitials(
                    user.user_metadata?.full_name || user.email || "HR",
                  )
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

      {/* Notification dropdown */}
      <AnimatePresence>
        {showNotif && (
          <NotificationModal
            notifs={notifs}
            onClose={() => setShowNotif(false)}
            onMarkAllRead={handleMarkAllRead}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
