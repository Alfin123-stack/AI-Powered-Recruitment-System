import { normalizeNotif } from "../helpers/main/notifications";
import type { Notif } from "../../types/main/notifications";

import { API } from "@/lib/api";


// ─── Server-side fetch (used in RSC / SSR) ────────────────────────────────────
// Called from Server Components — receives token from server session.
// Always fetches fresh data — notifications are per-user, mutable, and must
// reflect the latest read/unread state immediately after mark-read actions.
// Do NOT use `next: { revalidate }` here — Next.js Data Cache would serve
// stale results right after a mark-all-read mutation on full page reload.

export async function fetchNotificationsServer(
  token: string
): Promise<Notif[]> {
  try {
    const res = await fetch(`${API}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store", // always fresh — see note above
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: unknown[] = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((n) => normalizeNotif(n as Record<string, unknown>));
  } catch (err) {
    console.error("[fetchNotificationsServer] error:", err);
    return [];
  }
}

// ─── Client-side API calls (mutations) ────────────────────────────────────────
// These are called from Client Components for user actions.
// Consumer: hooks/main/useNotifications.ts — this hook is the single source
// of truth for notification fetch/mutation logic on the client. Do NOT
// re-implement inline fetch() calls elsewhere; always call these helpers so
// there is exactly one place that knows the endpoint shape and headers.

export async function apiMarkRead(
  id: string,
  token: string
): Promise<boolean> {
  try {
    const res = await fetch(`${API}/api/notifications/${id}/read`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiMarkAllRead(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API}/api/notifications/read-all`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiDeleteNotif(
  id: string,
  token: string
): Promise<boolean> {
  try {
    const res = await fetch(`${API}/api/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Delete every notification for the current user. Backend route:
// DELETE /api/notifications/all. Consumer: useNotifications.ts →
// handleDeleteAll (not wired into any UI button yet, kept ready for a
// future "Clear all" action on NotificationsHeading.tsx).
export async function apiDeleteAllNotifs(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API}/api/notifications/all`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Client-side refresh fetch ────────────────────────────────────────────────

export async function fetchNotificationsClient(
  token: string
): Promise<Notif[]> {
  const res = await fetch(`${API}/api/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store", // always fresh on manual refresh
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data: unknown[] = await res.json();
  if (!Array.isArray(data)) return [];
  return data.map((n) => normalizeNotif(n as Record<string, unknown>));
}