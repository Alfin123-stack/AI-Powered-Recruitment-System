// ─── hooks/useNotifications.ts ────────────────────────────────────────────────
// Custom hook — CLIENT-SIDE ONLY.
// Token di-refresh dari browser cookie sebelum setiap mutasi,
// dengan fallback ke tokenProp yang dikirim dari SSR.

import { useState, useCallback } from "react";

import {
  fetchNotificationsClient,
  apiMarkRead,
  apiMarkAllRead,
  apiDeleteNotif,
} from "@/lib/fetchers/notifications";
import type { Notif } from "@/types/notifications";
import { getBrowserSession } from "@/lib/auth/getBrowserSession";

async function getFreshToken(fallback: string): Promise<string> {
  const session = await getBrowserSession();
  return session?.access_token ?? fallback;
}

export function useNotifications(initialNotifs: Notif[], tokenProp: string) {
  const [notifs, setNotifs] = useState<Notif[]>(initialNotifs);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const unreadCount = notifs.filter((n) => !n.read).length;

  // ── Refresh manual ──────────────────────────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const tok = await getFreshToken(tokenProp);
      const fresh = await fetchNotificationsClient(tok);
      setNotifs(fresh);
    } catch (err) {
      console.error("[useNotifications] refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [tokenProp, isRefreshing]);

  // ── Tandai satu notif sudah dibaca (optimistic + rollback) ──────────────────
  const handleMarkRead = useCallback(
    async (id: string) => {
      const prev = notifs.find((n) => n.id === id);

      setNotifs((cur) =>
        cur.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );

      const tok = await getFreshToken(tokenProp);
      const ok = await apiMarkRead(id, tok);

      if (!ok) {
        setNotifs((cur) =>
          cur.map((n) =>
            n.id === id ? { ...n, read: prev?.read ?? false } : n,
          ),
        );
      }
    },
    [tokenProp, notifs],
  );

  // ── Tandai semua sudah dibaca (optimistic + rollback) ───────────────────────
  const handleMarkAllRead = useCallback(async () => {
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

  // ── Hapus notif (optimistic + rollback) ─────────────────────────────────────
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

  return {
    notifs,
    unreadCount,
    isRefreshing,
    handleRefresh,
    handleMarkRead,
    handleMarkAllRead,
    handleDelete,
  };
}
