"use client";

import { BASE_URL } from "@/constants/topbar";
import { Notif, NotifRaw, NotifType } from "@/types/main/notifications";
import { useState, useEffect } from "react";


const VALID_TYPES: NotifType[] = ["status_update", "interview", "general"];

export function useNotifications(token?: string) {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifs = async (): Promise<void> => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      // silent
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = (): void => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    if (!token) return;
    fetch(`${BASE_URL}/api/notifications/read-all`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  };

  const markOneRead = (id: string): void => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    if (!token) return;
    fetch(`${BASE_URL}/api/notifications/${id}/read`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  };

  useEffect(() => {
    void fetchNotifs();
    const iv = setInterval(() => void fetchNotifs(), 30_000);
    return () => clearInterval(iv);
  }, [token]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  return {
    notifs,
    loading,
    unreadCount,
    hasUnread: unreadCount > 0,
    fetchNotifs,
    markAllRead,
    markOneRead,
  };
}
