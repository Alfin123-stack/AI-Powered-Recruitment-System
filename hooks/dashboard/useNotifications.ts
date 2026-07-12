"use client";

// Path: hooks/dashboard/useNotifications.ts
// Consumer: Topbar.tsx  →  useNotifications(token)
//
// This hook powers the bell-icon popup (TopbarNotifPopup). It is
// intentionally simpler than hooks/main/useNotifications.ts (which
// powers the full /notifications page) — no initialNotifs from SSR,
// no delete UI wired up yet. Keep this file's exported shape stable
// ({ notifs, loading, unreadCount, hasUnread, fetchNotifs, markAllRead,
// markOneRead }) since Topbar.tsx destructures it by name.

import { BASE_URL } from "@/constants/topbar";
import { Notif, NotifRaw, NotifType } from "@/types/main/notifications";
import { useState, useEffect, useCallback } from "react";

// FIX: previously missing "offer_letter" and "rejection" — notifs of
// those types were silently coerced to "general" here, which meant the
// bell popup (TopbarNotifPopup → NOTIF_TYPE_CFG[n.type]) always showed
// them with the generic icon/label instead of their real type.
const VALID_TYPES: NotifType[] = [
  "status_update",
  "interview",
  "general",
  "offer_letter",
  "rejection",
];

export function useNotifications(token?: string) {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifs = useCallback(async (): Promise<void> => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return; // keep last-known-good list on failure
      const data: NotifRaw[] = await res.json();
      setNotifs(
        (Array.isArray(data) ? data : []).map((n) => ({
          ...n,
          type: (VALID_TYPES.includes(n.type as NotifType)
            ? n.type
            : "general") as NotifType,
          created_at: n.created_at ?? n.time ?? new Date().toISOString(),
        })),
      );
    } catch {
      // silent — keep last-known-good list, don't wipe the bell popup
    } finally {
      setLoading(false);
    }
  }, [token]);

  const markAllRead = useCallback((): void => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    if (!token) return;
    fetch(`${BASE_URL}/api/notifications/read-all`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }, [token]);

  const markOneRead = useCallback(
    (id: string): void => {
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      if (!token) return;
      fetch(`${BASE_URL}/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    },
    [token],
  );

  // NEW: available for future use if the bell popup ever adds a delete
  // affordance. Not currently called anywhere in TopbarNotifPopup.tsx.
  const deleteNotif = useCallback(
    (id: string): void => {
      let removed: Notif | undefined;
      setNotifs((prev) => {
        removed = prev.find((n) => n.id === id);
        return prev.filter((n) => n.id !== id);
      });
      if (!token) return;
      fetch(`${BASE_URL}/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {
        if (removed) {
          setNotifs((prev) =>
            prev.some((n) => n.id === id) ? prev : [...prev, removed!],
          );
        }
      });
    },
    [token],
  );

  useEffect(() => {
    void fetchNotifs();
    const iv = setInterval(() => void fetchNotifs(), 30_000);
    return () => clearInterval(iv);
  }, [fetchNotifs]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  return {
    notifs,
    loading,
    unreadCount,
    hasUnread: unreadCount > 0,
    fetchNotifs,
    markAllRead,
    markOneRead,
    deleteNotif,
  };
}