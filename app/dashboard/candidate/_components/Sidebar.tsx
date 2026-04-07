"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Target,
  User,
  Bell,
  X,
  CheckCheck,
  Clock,
  Bookmark,
} from "lucide-react";
import { CandidateUser, getInitials } from "./shared";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/dashboard/candidate", Icon: LayoutDashboard, label: "Dashboard" },
  {
    href: "/dashboard/candidate/applications",
    Icon: Briefcase,
    label: "Lamaranku",
  },
  { href: "/dashboard/candidate/saved", Icon: Bookmark, label: "Tersimpan" },
  { href: "/dashboard/candidate/matches", Icon: Target, label: "Job Matches" },
  { href: "/dashboard/candidate/profile", Icon: User, label: "Profil" },
];

// ── Types ─────────────────────────────────────────────────────────────────────
type Notif = {
  id: string;
  type: "status_update" | "interview" | "general";
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const timeAgo = (dateStr: string) => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
};

const notifConfig: Record<
  string,
  { color: string; bg: string; emoji: string }
> = {
  status_update: { color: "#10b981", bg: "rgba(16,185,129,0.12)", emoji: "📋" },
  interview: { color: "#06b6d4", bg: "rgba(6,182,212,0.12)", emoji: "📅" },
  general: { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", emoji: "🔔" },
};

// Bangun notifikasi dari data lamaran kandidat
const buildNotifications = (apps: any[]): Notif[] => {
  const notifs: Notif[] = [];

  apps.forEach((a) => {
    // Notif kalau status berubah dari applied
    if (a.status === "shortlisted") {
      notifs.push({
        id: `sl-${a.id}`,
        type: "status_update",
        title: "Kamu Shortlisted! 🎉",
        message: `Selamat! Lamaranmu untuk ${a.job_title || "posisi ini"} di ${a.company_name || "perusahaan"} lolos ke tahap berikutnya.`,
        time: a.created_at,
        read: false,
      });
    }
    if (a.status === "review") {
      notifs.push({
        id: `rv-${a.id}`,
        type: "status_update",
        title: "Lamaran Sedang Direview",
        message: `Lamaranmu untuk ${a.job_title || "posisi ini"} sedang ditinjau oleh tim HR.`,
        time: a.created_at,
        read: false,
      });
    }
    if (a.status === "rejected") {
      notifs.push({
        id: `rj-${a.id}`,
        type: "general",
        title: "Update Status Lamaran",
        message: `Lamaranmu untuk ${a.job_title || "posisi ini"} tidak dilanjutkan. Jangan menyerah, terus coba!`,
        time: a.created_at,
        read: true, // rejected langsung read supaya tidak terlalu menyedihkan
      });
    }
  });

  return notifs
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10);
};

// ── Notification Modal ────────────────────────────────────────────────────────
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
              Notifikasi muncul saat status lamaranmu berubah.
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
            href="/dashboard/candidate/applications"
            className="text-[0.75rem] text-emerald-400 hover:text-emerald-300 no-underline transition-colors">
            Lihat lamaran →
          </Link>
        </div>
      )}
    </motion.div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
export default function CandidateSidebar({
  user,
  token,
}: {
  user: CandidateUser | null;
  token?: string;
}) {
  const pathname = usePathname();
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/applications/my`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
      .then((r) => r.json())
      .then((data) =>
        setNotifs(buildNotifications(Array.isArray(data) ? data : [])),
      )
      .catch(() => {});
  }, [token]);

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

          {/* Notifikasi */}
          <button
            onClick={() => setShowNotif((v) => !v)}
            className={`flex items-center justify-between px-3 py-[10px] rounded-[9px] mx-2 mb-[2px] text-[0.86rem] font-medium cursor-pointer border w-[calc(100%-16px)] transition-all duration-200
              ${showNotif ? "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20" : "text-[#7a9585] bg-transparent border-transparent hover:text-[#e8f0ec] hover:bg-white/[0.04]"}`}>
            <span className="flex items-center gap-[10px]">
              <Bell size={15} /> Notifikasi
            </span>
            {unreadCount > 0 && (
              <span className="bg-emerald-500 text-black rounded-[4px] px-[6px] py-[1px] text-[0.65rem] font-extrabold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* User */}
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

      {/* Modal */}
      <AnimatePresence>
        {showNotif && (
          <NotificationModal
            notifs={notifs}
            onClose={() => setShowNotif(false)}
            onMarkAllRead={() =>
              setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}
