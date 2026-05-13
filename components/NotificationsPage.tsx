"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Clock,
  RefreshCw,
  ArrowLeft,
  BellOff,
  Inbox,
  Sparkles,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  icon: string;
};

export interface NotificationsPageProps {
  role: "hr" | "candidate";
  backHref: string;
  navItems: NavItem[];
  stats?: StatDef[];
  subtitle?: (opts: { unreadCount: number; user?: any }) => string;
  token?: string;
  user?: any;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const typeConfig = {
  status_update: {
    color: "#34d399",
    dim: "rgba(52,211,153,0.10)",
    border: "rgba(52,211,153,0.20)",
    glow: "rgba(52,211,153,0.06)",
    from: "#34d399",
    to: "#059669",
    icon: "📋",
    label: "Status",
  },
  interview: {
    color: "#38bdf8",
    dim: "rgba(56,189,248,0.10)",
    border: "rgba(56,189,248,0.20)",
    glow: "rgba(56,189,248,0.06)",
    from: "#38bdf8",
    to: "#0284c7",
    icon: "📅",
    label: "Interview",
  },
  general: {
    color: "#c4b5fd",
    dim: "rgba(196,181,253,0.10)",
    border: "rgba(196,181,253,0.20)",
    glow: "rgba(196,181,253,0.06)",
    from: "#c4b5fd",
    to: "#7c3aed",
    icon: "🔔",
    label: "Umum",
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
    color: "#34d399",
    bg: "rgba(52,211,153,0.10)",
    icon: "📊",
  },
  {
    label: "Belum Dibaca",
    getValue: (n) => n.filter((x) => !x.read).length,
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.10)",
    icon: "🔴",
  },
  {
    label: "Interview",
    getValue: (n) => n.filter((x) => x.type === "interview").length,
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.10)",
    icon: "📅",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// Handles field name differences between backends (read vs is_read, created_at vs time)
const normalizeNotif = (n: any): Notif => ({
  id: String(n.id),
  type: (n.type in typeConfig ? n.type : "general") as NotifType,
  title: n.title ?? "",
  message: n.message ?? "",
  created_at: n.created_at ?? n.time ?? new Date().toISOString(),
  read: n.read ?? n.is_read ?? false,
});

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function NotifSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl mb-2 px-4 py-4 flex gap-3 animate-pulse"
          style={{
            background: "rgba(13,19,16,0.9)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
          <div
            className="w-9 h-9 rounded-xl flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
          <div className="flex-1 space-y-2 py-1">
            <div
              className="h-3 rounded-md w-2/3"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
            <div
              className="h-2 rounded-md w-full"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
            <div
              className="h-2 rounded-md w-4/5"
              style={{ background: "rgba(255,255,255,0.03)" }}
            />
          </div>
        </div>
      ))}
    </>
  );
}

// ─── NotifCard ────────────────────────────────────────────────────────────────

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative mb-2">
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-[1px]"
        style={{
          background: notif.read
            ? "rgba(13,19,16,0.9)"
            : `linear-gradient(145deg, rgba(13,19,16,0.98), ${cfg.glow})`,
          border: `1px solid ${notif.read ? "rgba(255,255,255,0.05)" : cfg.border}`,
          boxShadow: notif.read
            ? "none"
            : `0 0 0 1px ${cfg.border}, 0 4px 24px ${cfg.glow}`,
        }}>
        {!notif.read && (
          <>
            <div
              className="absolute top-0 inset-x-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent 5%, ${cfg.from} 40%, ${cfg.to} 60%, transparent 95%)`,
              }}
            />
            <div
              className="absolute left-0 top-4 bottom-4 w-[2px] rounded-r-full"
              style={{
                background: `linear-gradient(180deg, ${cfg.from}, ${cfg.to})`,
              }}
            />
          </>
        )}

        <div className="flex items-start gap-3 px-4 py-4 pl-5">
          <div className="relative flex-shrink-0 mt-[1px]">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[0.95rem]"
              style={{
                background: cfg.dim,
                border: `1px solid ${cfg.border}`,
              }}>
              {cfg.icon}
            </div>
            {!notif.read && (
              <span
                className="absolute -top-[3px] -right-[3px] w-2 h-2 rounded-full border border-[#080d0b]"
                style={{ background: cfg.color }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-[3px]">
              <p
                className="text-[0.84rem] font-semibold leading-snug"
                style={{ color: notif.read ? "#8aada0" : "#e8f5f0" }}>
                {notif.title}
              </p>
              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                {!notif.read && (
                  <button
                    onClick={() => onMarkRead(notif.id)}
                    title="Tandai dibaca"
                    className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                    style={{ background: cfg.dim, color: cfg.color }}>
                    <CheckCheck size={11} />
                  </button>
                )}
                <button
                  onClick={() => onDelete(notif.id)}
                  title="Hapus"
                  className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer text-[#3a5245] hover:text-red-400 hover:bg-red-500/10"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  <X size={11} />
                </button>
              </div>
            </div>
            <p
              className="text-[0.75rem] leading-relaxed mb-3 line-clamp-2"
              style={{ color: "#4a6358" }}>
              {notif.message}
            </p>
            <div className="flex items-center gap-2">
              <span
                className="text-[0.6rem] font-bold tracking-widest uppercase px-2 py-[3px] rounded-md"
                style={{ background: cfg.dim, color: cfg.color }}>
                {cfg.label}
              </span>
              <span
                className="flex items-center gap-1 text-[0.67rem]"
                style={{ color: "#2e4438" }}>
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

// ─── StatPill ─────────────────────────────────────────────────────────────────

function StatPill({
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
  icon: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: 0.05 + index * 0.05 }}
      className="flex items-center gap-3 rounded-[14px] px-4 py-3"
      style={{
        background: "rgba(13,19,16,0.9)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}>
      <span
        className="text-base w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
        style={{ background: bg }}>
        {icon}
      </span>
      <div>
        <div
          className="font-bold text-[1.15rem] leading-none"
          style={{ color }}>
          {value}
        </div>
        <div className="text-[0.65rem] mt-[2px]" style={{ color: "#3a5245" }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NotificationsPage({
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
  const [user, setUser] = useState(userProp ?? null);

  // ── Resolve token ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (tokenProp) {
      setToken(tokenProp);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setToken(session.access_token);
        setUser(session.user);
      }
    });
  }, [tokenProp]);

  // ── Fetch real data ────────────────────────────────────────────────────────
  const fetchNotifs = useCallback(async (tok: string, isRefresh = false) => {
    if (!tok) return;
    setStatus(isRefresh ? "refreshing" : "loading");
    try {
      const res = await fetch(`${base}/api/notifications`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) setNotifs(data.map(normalizeNotif));
    } catch (err) {
      console.error("[NotificationsPage] fetch error:", err);
      // Keep current state on error — never reset to mock
    } finally {
      setStatus("done");
    }
  }, []);

  // Trigger fetch once token is ready
  useEffect(() => {
    if (token && status === "idle") fetchNotifs(token);
  }, [token, status, fetchNotifs]);

  // ── Handlers with optimistic updates ──────────────────────────────────────
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
      // Rollback
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

  // ── Derived ────────────────────────────────────────────────────────────────
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

  const defaultSubtitle = ({
    unreadCount,
    user,
  }: {
    unreadCount: number;
    user?: any;
  }) => {
    const name = user?.user_metadata?.full_name || user?.full_name;
    const greeting = name ? `Hei, ${name.split(" ")[0]} — ` : "";
    return unreadCount > 0
      ? `${greeting}${unreadCount} notifikasi belum dibaca`
      : `${greeting}Semua notifikasi sudah dibaca`;
  };
  const resolvedSubtitle = (subtitle ?? defaultSubtitle)({ unreadCount, user });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "#080d0b" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full opacity-[0.035]"
          style={{
            background: "radial-gradient(circle, #34d399, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 -left-20 w-[360px] h-[360px] rounded-full opacity-[0.025]"
          style={{
            background: "radial-gradient(circle, #38bdf8, transparent 70%)",
          }}
        />
      </div>

      {/* Topbar */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl"
        style={{
          background: "rgba(8,13,11,0.8)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}>
        <div className="max-w-[720px] mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href={backHref}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all no-underline"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#3a5245",
              }}>
              <ArrowLeft size={14} />
            </Link>
            <Link
              href="/"
              className="font-extrabold text-[0.95rem] flex items-center gap-[5px] no-underline ml-1"
              style={{ color: "#dff0e8" }}>
              <Sparkles size={13} className="text-emerald-400" />
              Recruit<em className="not-italic text-emerald-400">AI</em>
            </Link>
          </div>
          <nav className="flex items-center gap-[1px]">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-[5px] px-3 py-[5px] rounded-lg text-[0.73rem] font-medium no-underline transition-colors"
                style={{ color: "#3a5245" }}>
                <Icon size={12} /> {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="relative max-w-[720px] mx-auto px-5 py-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6">
          <div className="flex items-center gap-3">
            <div
              className="relative w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(52,211,153,0.14), rgba(52,211,153,0.04))",
                border: "1px solid rgba(52,211,153,0.22)",
              }}>
              <Bell size={16} className="text-emerald-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[0.52rem] font-bold text-black flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1
                className="font-extrabold text-[1.35rem] leading-none tracking-tight"
                style={{ color: "#e8f5f0" }}>
                Notifikasi
              </h1>
              <p
                className="text-[0.72rem] mt-[3px]"
                style={{ color: "#2e4438" }}>
                {isLoading ? "Memuat notifikasi..." : resolvedSubtitle}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {stats.map((s, i) => (
            <StatPill
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

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="flex items-center justify-between gap-2 mb-5">
          <div
            className="flex gap-[2px] p-[3px] rounded-xl overflow-x-auto scrollbar-none"
            style={{
              background: "rgba(13,19,16,0.95)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}>
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
                  className="flex items-center gap-[4px] px-[9px] py-[5px] rounded-[9px] text-[0.72rem] font-medium cursor-pointer transition-all whitespace-nowrap"
                  style={{
                    background: active
                      ? "rgba(52,211,153,0.10)"
                      : "transparent",
                    color: active ? "#34d399" : "#2e4438",
                    border: active
                      ? "1px solid rgba(52,211,153,0.18)"
                      : "1px solid transparent",
                  }}>
                  {f.label}
                  {count > 0 && (
                    <span
                      className="text-[0.57rem] font-bold px-[5px] py-[2px] rounded-[5px]"
                      style={{
                        background: active
                          ? "rgba(52,211,153,0.15)"
                          : "rgba(255,255,255,0.05)",
                        color: active ? "#34d399" : "#2e4438",
                      }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
              style={{
                background: "rgba(13,19,16,0.95)",
                border: "1px solid rgba(255,255,255,0.05)",
                color: "#2e4438",
              }}>
              <RefreshCw
                size={12}
                className={isRefreshing ? "animate-spin" : ""}
              />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-[5px] px-3 py-[6px] rounded-xl text-[0.72rem] font-medium transition-all cursor-pointer whitespace-nowrap"
                style={{
                  background: "rgba(13,19,16,0.95)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  color: "#2e4438",
                }}>
                <CheckCheck size={12} /> Baca semua
              </button>
            )}
          </div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <NotifSkeleton />
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: "rgba(13,19,16,0.9)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}>
              {activeFilter === "unread" ? (
                <BellOff size={20} style={{ color: "#2e4438" }} />
              ) : (
                <Inbox size={20} style={{ color: "#2e4438" }} />
              )}
            </div>
            <p
              className="font-semibold text-[0.88rem] mb-1"
              style={{ color: "#8aada0" }}>
              {activeFilter === "unread"
                ? "Semua sudah dibaca"
                : "Tidak ada notifikasi"}
            </p>
            <p className="text-[0.73rem]" style={{ color: "#2e4438" }}>
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
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span
                      className="text-[0.6rem] font-bold tracking-[0.14em] uppercase"
                      style={{ color: "#1e3028" }}>
                      {group}
                    </span>
                    <div
                      className="flex-1 h-px"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    />
                    <span
                      className="text-[0.6rem]"
                      style={{ color: "#1e3028" }}>
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
