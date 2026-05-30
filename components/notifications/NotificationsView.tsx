"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Bell,
  BellOff,
  CheckCheck,
  Clock,
  RefreshCw,
  ArrowLeft,
  Inbox,
  Sparkles,
  X,
  BarChart3,
  Calendar,
  FileText,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type NotifType = "status_update" | "interview" | "general";

export type Notif = {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
};

export type NavItem = {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
};

export type StatDef = {
  label: string;
  getValue: (notifs: Notif[]) => number;
  color: string;
  bg: string;
  icon: React.ReactNode;
};

export type UserMetadata = {
  full_name?: string;
};

export type User = {
  user_metadata?: UserMetadata;
  full_name?: string;
};

export type SubtitleOptions = {
  unreadCount: number;
  user?: User;
};

export interface NotificationsPageProps {
  role: "hr" | "candidate";
  backHref: string;
  navItems: NavItem[];
  stats?: StatDef[];
  subtitle?: (opts: SubtitleOptions) => string;
  token?: string;
  user?: User;
}

// ─── Config ────────────────────────────────────────────────────────────────────

const typeConfig = {
  status_update: {
    gradient: "from-emerald-500/10 to-teal-500/5",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    icon: <FileText size={16} />,
    dotColor: "bg-emerald-400",
    pillBg: "bg-emerald-500/10",
    pillText: "text-emerald-400",
    label: "Status",
    accentGradient: "from-emerald-400 to-emerald-600",
    shimmerGradient: "from-transparent via-emerald-400/60 to-transparent",
  },
  interview: {
    gradient: "from-sky-500/10 to-blue-500/5",
    border: "border-sky-500/20",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-400",
    icon: <Calendar size={16} />,
    dotColor: "bg-sky-400",
    pillBg: "bg-sky-500/10",
    pillText: "text-sky-400",
    label: "Interview",
    accentGradient: "from-sky-400 to-sky-600",
    shimmerGradient: "from-transparent via-sky-400/60 to-transparent",
  },
  general: {
    gradient: "from-violet-500/10 to-purple-500/5",
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    icon: <Bell size={16} />,
    dotColor: "bg-violet-400",
    pillBg: "bg-violet-500/10",
    pillText: "text-violet-400",
    label: "Umum",
    accentGradient: "from-violet-400 to-violet-600",
    shimmerGradient: "from-transparent via-violet-400/60 to-transparent",
  },
} as const;

const FILTERS = [
  { id: "all", label: "Semua" },
  { id: "unread", label: "Belum Dibaca" },
  { id: "status_update", label: "Status" },
  { id: "interview", label: "Interview" },
  { id: "general", label: "Umum" },
];

const DEFAULT_STATS: StatDef[] = [
  {
    label: "Total",
    getValue: (n) => n.length,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    icon: <BarChart3 size={18} />,
  },
  {
    label: "Belum Dibaca",
    getValue: (n) => n.filter((x) => !x.read).length,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    icon: <Bell size={18} />,
  },
  {
    label: "Interview",
    getValue: (n) => n.filter((x) => x.type === "interview").length,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    icon: <Calendar size={18} />,
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

const timeAgo = (dateStr: string) => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}h lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
};

type RawNotif = {
  id: string | number;
  type?: string;
  title?: string;
  message?: string;
  created_at?: string;
  time?: string;
  read?: boolean;
  is_read?: boolean;
};

const normalizeNotif = (n: RawNotif): Notif => {
  const type: NotifType =
    typeof n.type === "string" && n.type in typeConfig
      ? (n.type as NotifType)
      : "general";

  return {
    id: String(n.id),
    type,
    title: typeof n.title === "string" ? n.title : "",
    message: typeof n.message === "string" ? n.message : "",
    created_at:
      typeof n.created_at === "string"
        ? n.created_at
        : typeof n.time === "string"
          ? n.time
          : new Date().toISOString(),
    read:
      typeof n.read === "boolean"
        ? n.read
        : typeof n.is_read === "boolean"
          ? n.is_read
          : false,
  };
};

// ─── Skeleton ──────────────────────────────────────────────────────────────────

function NotifSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl px-4 py-4 flex gap-3 animate-pulse border border-white/5 bg-[#0d1310e6]">
          <div className="w-9 h-9 rounded-xl flex-shrink-0 bg-white/5" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3 rounded-md w-2/3 bg-white/5" />
            <div className="h-2 rounded-md w-full bg-white/[0.04]" />
            <div className="h-2 rounded-md w-4/5 bg-white/[0.03]" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── NotifCard ─────────────────────────────────────────────────────────────────

function NotifCard({
  notif,
  onMarkRead,
  onDelete,
  index,
}: {
  notif: Notif;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}) {
  const cfg = typeConfig[notif.type] ?? typeConfig.general;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{
        duration: 0.25,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative mb-2">
      <div
        className={[
          "relative rounded-xl overflow-hidden transition-all duration-200 border",
          notif.read
            ? "border-white/[0.06] bg-[#0d1310d9]"
            : `${cfg.border} bg-gradient-to-br ${cfg.gradient}`,
        ].join(" ")}>
        {/* Unread left accent bar */}
        {!notif.read && (
          <div
            className={`absolute left-0 top-3 bottom-3 w-[2.5px] rounded-r-full bg-gradient-to-b ${cfg.accentGradient}`}
          />
        )}

        {/* Top shimmer line for unread */}
        {!notif.read && (
          <div
            className={`absolute top-0 inset-x-0 h-px opacity-60 bg-gradient-to-r ${cfg.shimmerGradient}`}
          />
        )}

        <div className="flex items-start gap-3 px-4 py-3.5 pl-5">
          {/* Icon */}
          <div className="relative flex-shrink-0 mt-[1px]">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.iconBg} ${cfg.iconColor} border border-white/[0.07]`}>
              {cfg.icon}
            </div>
            {!notif.read && (
              <span
                className={`absolute -top-[3px] -right-[3px] w-2 h-2 rounded-full ${cfg.dotColor} border-[1.5px] border-[#080d0b]`}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-[3px]">
              <p
                className={`text-[0.83rem] font-semibold leading-snug ${
                  notif.read ? "text-[#5a7a6a]" : "text-[#e2f0ea]"
                }`}>
                {notif.title}
              </p>
              {/* Hover actions */}
              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                {!notif.read && (
                  <button
                    onClick={() => onMarkRead(notif.id)}
                    title="Tandai sebagai sudah dibaca"
                    aria-label="Tandai sebagai sudah dibaca"
                    className={`w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer ${cfg.iconBg} ${cfg.iconColor} transition-colors hover:opacity-80`}>
                    <CheckCheck size={11} />
                  </button>
                )}
                <button
                  onClick={() => onDelete(notif.id)}
                  title="Hapus notifikasi"
                  aria-label="Hapus notifikasi"
                  className="w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer text-[#3a5245] hover:text-red-400 hover:bg-red-500/10 transition-colors bg-white/[0.04]">
                  <X size={11} />
                </button>
              </div>
            </div>

            <p className="text-[0.74rem] leading-relaxed mb-2.5 text-[#3e5a4c] line-clamp-2">
              {notif.message}
            </p>

            <div className="flex items-center gap-2">
              <span
                className={`text-[0.6rem] font-bold tracking-widest uppercase px-2 py-[3px] rounded-md ${cfg.pillBg} ${cfg.pillText}`}>
                {cfg.label}
              </span>
              <span className="flex items-center gap-1 text-[0.67rem] text-[#2a3e33]">
                <Clock size={9} />
                {timeAgo(notif.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── StatCard ──────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
  bg,
  icon,
  index,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
  icon: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.06 + index * 0.06 }}
      className="flex items-center gap-3 rounded-xl px-4 py-3 border border-white/[0.05] bg-[#0d1310e6]">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg} ${color} border border-white/[0.07]`}>
        {icon}
      </div>
      <div>
        <div className={`font-bold text-[1.2rem] leading-none ${color}`}>
          {value}
        </div>
        <div className="text-[0.63rem] mt-[3px] text-[#2e4438]">{label}</div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function NotificationsView({
  role,
  backHref,
  navItems,
  stats = DEFAULT_STATS,
  subtitle,
  token: tokenProp,
  user: userProp,
}: NotificationsPageProps) {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "refreshing" | "done"
  >("idle");
  const [activeFilter, setActiveFilter] = useState("all");
  const [token, setToken] = useState(tokenProp ?? "");
  const [user, setUser] = useState<User | null>(userProp ?? null);

  // ── Resolve token ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (tokenProp) {
      setToken(tokenProp);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setToken(session.access_token);
        setUser(session.user as User);
      }
    });
  }, [tokenProp]);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchNotifs = useCallback(async (tok: string, isRefresh = false) => {
    if (!tok) return;
    setStatus(isRefresh ? "refreshing" : "loading");
    try {
      const res = await fetch(`${base}/api/notifications`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: unknown = await res.json();
      if (Array.isArray(data))
        setNotifs((data as RawNotif[]).map(normalizeNotif));
    } catch (err) {
      console.error("[NotificationsPage] fetch error:", err);
    } finally {
      setStatus("done");
    }
  }, []);

  useEffect(() => {
    if (token && status === "idle") fetchNotifs(token);
  }, [token, status, fetchNotifs]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleRefresh = () => fetchNotifs(token, true);

  const handleMarkRead = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    if (!token) return;
    fetch(`${base}/api/notifications/${id}/read`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n)),
      );
    });
  };

  const handleMarkAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    if (!token) return;
    fetch(`${base}/api/notifications/read-all`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  };

  const handleDelete = (id: string) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
    if (!token) return;
    fetch(`${base}/api/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  };

  // ── Derived ───────────────────────────────────────────────────────────────────
  const isLoading = status === "idle" || status === "loading";
  const isRefreshing = status === "refreshing";
  const unreadCount = notifs.filter((n) => !n.read).length;

  const filtered = notifs.filter((n) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !n.read;
    return n.type === activeFilter;
  });

  const grouped: Record<string, Notif[]> = {};
  filtered.forEach((n) => {
    const diff = (Date.now() - new Date(n.created_at).getTime()) / 1000;
    const g =
      diff < 86400
        ? "Hari ini"
        : diff < 172800
          ? "Kemarin"
          : diff < 604800
            ? "Minggu ini"
            : "Lebih lama";
    (grouped[g] = grouped[g] || []).push(n);
  });
  const groupOrder = ["Hari ini", "Kemarin", "Minggu ini", "Lebih lama"];

  const defaultSubtitle = ({ unreadCount, user }: SubtitleOptions): string => {
    const name = user?.user_metadata?.full_name ?? user?.full_name;
    const greeting = name ? `Hei, ${name.split(" ")[0]} — ` : "";
    return unreadCount > 0
      ? `${greeting}${unreadCount} notifikasi belum dibaca`
      : `${greeting}Semua notifikasi sudah dibaca`;
  };

  const resolvedSubtitle = (subtitle ?? defaultSubtitle)({
    unreadCount,
    user: user ?? undefined,
  });

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#080d0b]">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-48 w-[520px] h-[520px] rounded-full opacity-[0.04] bg-[radial-gradient(circle,#34d399,transparent_70%)]" />
        <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full opacity-[0.025] bg-[radial-gradient(circle,#38bdf8,transparent_70%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.015] bg-[radial-gradient(circle,#a78bfa,transparent_70%)]" />
      </div>

      {/* ── Topbar ── */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#080d0bd9] border-b border-white/[0.04]">
        <div className="max-w-[720px] mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href={backHref}
              title="Kembali ke halaman sebelumnya"
              aria-label="Kembali ke halaman sebelumnya"
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all no-underline border border-white/[0.07] bg-white/[0.03] text-[#3a5245] hover:text-[#6aad8a] hover:border-white/[0.12]">
              <ArrowLeft size={14} />
            </Link>
            <Link
              href="/"
              title="Halaman utama RecruitAI"
              aria-label="RecruitAI - Halaman utama"
              className="font-extrabold text-[0.95rem] flex items-center gap-1.5 no-underline ml-1 text-[#dff0e8]">
              <Sparkles size={13} className="text-emerald-400" />
              Recruit<em className="not-italic text-emerald-400">AI</em>
            </Link>
          </div>

          <nav
            className="flex items-center gap-[1px]"
            aria-label="Navigasi utama">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                title={label}
                aria-label={label}
                className="flex items-center gap-[5px] px-3 py-[5px] rounded-lg text-[0.73rem] font-medium no-underline transition-colors text-[#3a5245] hover:text-[#6aad8a]">
                <Icon size={12} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="relative max-w-[720px] mx-auto px-5 py-8">
        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500/15 to-emerald-500/[0.04] border border-emerald-500/20">
                <Bell size={18} className="text-emerald-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-emerald-500 text-[0.52rem] font-bold text-black flex items-center justify-center border-[1.5px] border-[#080d0b]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="font-extrabold text-[1.4rem] leading-none tracking-tight text-[#e8f5f0]">
                  Notifikasi
                </h1>
                <p className="text-[0.72rem] mt-1 text-[#2e4438]">
                  {isLoading ? "Memuat notifikasi..." : resolvedSubtitle}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing}
                title="Refresh notifikasi"
                aria-label="Refresh notifikasi"
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 border border-white/[0.07] bg-white/[0.03] text-[#2e4438] hover:text-[#6aad8a]">
                <RefreshCw
                  size={13}
                  className={isRefreshing ? "animate-spin" : ""}
                />
              </button>
              {unreadCount > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleMarkAllRead}
                  title="Tandai semua notifikasi sebagai sudah dibaca"
                  aria-label="Tandai semua notifikasi sebagai sudah dibaca"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.72rem] font-medium transition-all cursor-pointer whitespace-nowrap border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 bg-emerald-500/[0.06]">
                  <CheckCheck size={12} />
                  Baca semua
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {stats.map((s, i) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={isLoading ? 0 : s.getValue(notifs)}
              color={s.color}
              bg={s.bg}
              icon={s.icon}
              index={i}
            />
          ))}
        </div>

        {/* ── Filters ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-5">
          <div
            className="flex gap-[2px] p-[3px] rounded-xl overflow-x-auto scrollbar-none border border-white/[0.05] bg-[#0d1310f2]"
            role="tablist"
            aria-label="Filter notifikasi">
            {FILTERS.map((f) => {
              const count =
                f.id === "all"
                  ? notifs.length
                  : f.id === "unread"
                    ? unreadCount
                    : notifs.filter((n) => n.type === f.id).length;
              const active = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  role="tab"
                  title={`Filter: ${f.label}`}
                  aria-label={`Tampilkan notifikasi ${f.label}`}
                  className={[
                    "flex items-center gap-1 px-[10px] py-[5px] rounded-[9px] text-[0.72rem] font-medium cursor-pointer transition-all whitespace-nowrap",
                    active
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/18"
                      : "bg-transparent text-[#2e4438] border border-transparent",
                  ].join(" ")}>
                  {f.label}
                  {count > 0 && (
                    <span
                      className={[
                        "text-[0.57rem] font-bold px-[5px] py-[2px] rounded-[5px] ml-[1px]",
                        active
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-white/5 text-[#2e4438]",
                      ].join(" ")}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Content ── */}
        {isLoading ? (
          <NotifSkeleton />
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/[0.05] bg-[#0d1310e6]">
              {activeFilter === "unread" ? (
                <BellOff size={20} className="text-[#2e4438]" />
              ) : (
                <Inbox size={20} className="text-[#2e4438]" />
              )}
            </div>
            <p className="font-semibold text-[0.88rem] mb-1 text-[#8aada0]">
              {activeFilter === "unread"
                ? "Semua sudah dibaca"
                : "Tidak ada notifikasi"}
            </p>
            <p className="text-[0.73rem] text-[#2e4438]">
              {activeFilter === "unread"
                ? "Tidak ada notifikasi yang belum dibaca."
                : "Notifikasi akan muncul saat ada pembaruan."}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {groupOrder.map((group) => {
              const items = grouped[group];
              if (!items?.length) return null;
              return (
                <div key={group} className="mb-4">
                  {/* Group label */}
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="text-[0.6rem] font-bold tracking-[0.14em] uppercase text-[#1e3028]">
                      {group}
                    </span>
                    <div className="flex-1 h-px bg-white/[0.03]" />
                    <span className="text-[0.6rem] text-[#1e3028]">
                      {items.length}
                    </span>
                  </div>
                  <AnimatePresence>
                    {items.map((n, i) => (
                      <NotifCard
                        key={n.id}
                        notif={n}
                        onMarkRead={handleMarkRead}
                        onDelete={handleDelete}
                        index={i}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
