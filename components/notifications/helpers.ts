import type { Notif, GroupKey } from "./notifications";
import { typeConfig } from "./config";

// ─── Time ago helper ──────────────────────────────────────────────────────────

export function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}h lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

// ─── Normalize raw API response to typed Notif ────────────────────────────────

export function normalizeNotif(n: Record<string, unknown>): Notif {
  const type =
    typeof n.type === "string" &&
    Object.prototype.hasOwnProperty.call(typeConfig, n.type)
      ? (n.type as keyof typeof typeConfig)
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
}
// ─── Group order constant ─────────────────────────────────────────────────────

export const GROUP_ORDER: GroupKey[] = [
  "Hari ini",
  "Kemarin",
  "Minggu ini",
  "Lebih lama",
];

// ─── Group notifications by recency ──────────────────────────────────────────

export function groupNotifs(notifs: Notif[]): Record<GroupKey, Notif[]> {
  const groups: Record<GroupKey, Notif[]> = {
    "Hari ini": [],
    Kemarin: [],
    "Minggu ini": [],
    "Lebih lama": [],
  };

  notifs.forEach((n) => {
    const diff = (Date.now() - new Date(n.created_at).getTime()) / 1000;
    if (diff < 86400) groups["Hari ini"].push(n);
    else if (diff < 172800) groups["Kemarin"].push(n);
    else if (diff < 604800) groups["Minggu ini"].push(n);
    else groups["Lebih lama"].push(n);
  });

  return groups;
}
