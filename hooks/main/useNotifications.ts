"use client";

// Path: hooks/main/useNotifications.ts
// Consumer: NotificationsClient.tsx  →  useNotifications(initialNotifs, token)
//
// This hook powers the full /notifications page. Distinct from
// hooks/dashboard/useNotifications.ts (which powers the Topbar bell
// popup) — different signature, different return shape. Do NOT merge
// these two files; they have different callers with different needs
// (this one starts from SSR-fetched initialNotifs and supports delete).
//
// REFACTOR NOTE: all network calls now go through lib/fetchers/notifications.ts
// (apiMarkRead, apiMarkAllRead, apiDeleteNotif, apiDeleteAllNotifs,
// fetchNotificationsClient). This hook used to have its own inline fetch()
// calls hitting the same endpoints — that was dead-end duplication against
// the fetchers file, which nothing was actually importing. Now there is a
// single source of truth for endpoint shape, headers, and cache behavior.

import type { Notif } from "@/types/main/notifications";
import { useState, useEffect, useCallback } from "react";
import {
  apiDeleteAllNotifs,
  apiDeleteNotif,
  apiMarkAllRead,
  apiMarkRead,
  fetchNotificationsClient,
} from "@/lib/fetchers/notifications";

export function useNotifications(initialNotifs: Notif[] = [], token?: string) {
  const [notifs, setNotifs] = useState<Notif[]>(initialNotifs);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Keep in sync if the server-rendered initial data changes (e.g. on
  // navigation between role dashboards that both mount this hook).
  useEffect(() => {
    setNotifs(initialNotifs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNotifs]);

  const fetchNotifs = useCallback(async (): Promise<void> => {
    if (!token) return;
    setIsRefreshing(true);
    try {
      const data = await fetchNotificationsClient(token);
      setNotifs(data);
    } catch {
      // network failure — keep last-known-good list, don't wipe the UI
    } finally {
      setIsRefreshing(false);
    }
  }, [token]);

  const handleRefresh = useCallback((): void => {
    void fetchNotifs();
  }, [fetchNotifs]);

  const handleMarkAllRead = useCallback((): void => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    if (!token) return;
    void apiMarkAllRead(token);
  }, [token]);

  const handleMarkRead = useCallback(
    (id: string): void => {
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      if (!token) return;
      void apiMarkRead(id, token);
    },
    [token],
  );

  // Delete a single notification. Optimistically removes it from the
  // list; if the backend call fails, the item is restored so the UI
  // never claims a delete succeeded when it didn't.
  const handleDelete = useCallback(
    (id: string): void => {
      let removed: Notif | undefined;
      setNotifs((prev) => {
        removed = prev.find((n) => n.id === id);
        return prev.filter((n) => n.id !== id);
      });

      if (!token) return;

      apiDeleteNotif(id, token)
        .then((ok) => {
          if (!ok && removed) restore(removed);
        })
        .catch(() => {
          if (removed) restore(removed!);
        });

      function restore(n: Notif) {
        setNotifs((prev) =>
          prev.some((x) => x.id === n.id)
            ? prev
            : [...prev, n].sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime(),
              ),
        );
      }
    },
    [token],
  );

  // Delete every notification for the current user. Not wired into the
  // UI yet — exposed in case a "Clear all" action is added to
  // NotificationsHeading.tsx later (backend route DELETE
  // /api/notifications/all already exists).
  const handleDeleteAll = useCallback((): void => {
    let prevNotifs: Notif[] = [];
    setNotifs((prev) => {
      prevNotifs = prev;
      return [];
    });
    if (!token) return;
    apiDeleteAllNotifs(token).then((ok) => {
      if (!ok) setNotifs(prevNotifs);
    });
  }, [token]);

  useEffect(() => {
    const iv = setInterval(() => void fetchNotifs(), 30_000);
    return () => clearInterval(iv);
  }, [fetchNotifs]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  return {
    notifs,
    unreadCount,
    hasUnread: unreadCount > 0,
    isRefreshing,
    handleRefresh,
    handleMarkRead,
    handleMarkAllRead,
    handleDelete,
    handleDeleteAll,
  };
}