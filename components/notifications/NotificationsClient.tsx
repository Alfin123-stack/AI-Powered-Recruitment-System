"use client";

// ─── NotificationsClient ──────────────────────────────────────────────────────
// CSR boundary — receives SSR-hydrated data, owns all mutations + refresh.
//
// Token strategy:
//   The `token` prop comes from SSR and may expire during a long session.
//   Before every mutation we call supabase.auth.getSession() to grab a
//   fresh token — same pattern as the original NotificationsView.

import { useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import NotificationsHeading from "./NotificationsHeading";
import FilterBar from "./FilterBar";
import NotifList from "./NotifList";
import StatCard from "./StatCard";
import {
  fetchNotificationsClient,
  apiMarkRead,
  apiMarkAllRead,
  apiDeleteNotif,
} from "./api";
import type { Notif, StatDef, FilterId, UserMeta } from "./notifications";
import { DEFAULT_STATS } from "./config";

// Browser Supabase client — singleton, safe at module level.
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
);

// Always returns a valid, non-expired access token.
async function getFreshToken(fallback: string): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? fallback;
}

interface NotificationsClientProps {
  initialNotifs: Notif[];
  stats?: StatDef[];
  subtitle?: (opts: { unreadCount: number; user?: UserMeta }) => string;
  token: string;
  user: UserMeta | null;
}

function defaultSubtitle({
  unreadCount,
  user,
}: {
  unreadCount: number;
  user?: UserMeta | null;
}): string {
  const name = user?.user_metadata?.full_name ?? user?.full_name ?? undefined;
  const greeting = name ? `Hei, ${name.split(" ")[0]} — ` : "";
  return unreadCount > 0
    ? `${greeting}${unreadCount} notifikasi belum dibaca`
    : `${greeting}Semua notifikasi sudah dibaca`;
}

export default function NotificationsClient({
  initialNotifs,
  stats = DEFAULT_STATS,
  subtitle,
  token: tokenProp,
  user,
}: NotificationsClientProps) {
  const [notifs, setNotifs] = useState<Notif[]>(initialNotifs);
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const unreadCount = notifs.filter((n) => !n.read).length;

  // ── Manual refresh ─────────────────────────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const tok = await getFreshToken(tokenProp);
      const fresh = await fetchNotificationsClient(tok);
      setNotifs(fresh);
    } catch (err) {
      console.error("[NotificationsClient] refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [tokenProp, isRefreshing]);

  // ── Mark single read (optimistic + rollback) ───────────────────────────────
  const handleMarkRead = useCallback(
    async (id: string) => {
      // Snapshot previous state for rollback
      const prev = notifs.find((n) => n.id === id);

      // Optimistic update
      setNotifs((cur) =>
        cur.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );

      const tok = await getFreshToken(tokenProp);
      const ok = await apiMarkRead(id, tok);

      if (!ok) {
        // Rollback to exact previous value, not a hardcoded false
        setNotifs((cur) =>
          cur.map((n) =>
            n.id === id ? { ...n, read: prev?.read ?? false } : n,
          ),
        );
      }
    },
    [tokenProp, notifs],
  );

  // ── Mark all read (optimistic + rollback) ──────────────────────────────────
  const handleMarkAllRead = useCallback(async () => {
    // Snapshot for rollback
    const snapshot = notifs.map((n) => ({ id: n.id, read: n.read }));

    setNotifs((cur) => cur.map((n) => ({ ...n, read: true })));

    const tok = await getFreshToken(tokenProp);
    const ok = await apiMarkAllRead(tok);

    if (!ok) {
      setNotifs((cur) =>
        cur.map((n) => {
          const orig = snapshot.find((s) => s.id === n.id);
          return orig ? { ...n, read: orig.read } : n;
        }),
      );
    }
  }, [tokenProp, notifs]);

  // ── Delete (optimistic + rollback) ────────────────────────────────────────
  const handleDelete = useCallback(
    async (id: string) => {
      const removed = notifs.find((n) => n.id === id);
      setNotifs((cur) => cur.filter((n) => n.id !== id));

      const tok = await getFreshToken(tokenProp);
      const ok = await apiDeleteNotif(id, tok);

      if (!ok && removed) {
        setNotifs((cur) => {
          const exists = cur.some((n) => n.id === id);
          return exists ? cur : [...cur, removed];
        });
      }
    },
    [tokenProp, notifs],
  );

  const resolvedSubtitle = (subtitle ?? defaultSubtitle)({
    unreadCount,
    user: user ?? undefined,
  });

  return (
    <div className="relative max-w-[720px] mx-auto px-5 py-8">
      <NotificationsHeading
        unreadCount={unreadCount}
        subtitle={resolvedSubtitle}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onMarkAllRead={handleMarkAllRead}
      />

      <div className="grid grid-cols-3 gap-2 mb-6">
        {stats.map((s, i) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.getValue(notifs)}
            color={s.color}
            bg={s.bg}
            icon={s.icon}
            index={i}
          />
        ))}
      </div>

      <FilterBar
        activeFilter={activeFilter}
        notifs={notifs}
        unreadCount={unreadCount}
        onFilterChange={setActiveFilter}
      />

      <NotifList
        notifs={notifs}
        activeFilter={activeFilter}
        unreadCount={unreadCount}
        onMarkRead={handleMarkRead}
        onDelete={handleDelete}
      />
    </div>
  );
}
