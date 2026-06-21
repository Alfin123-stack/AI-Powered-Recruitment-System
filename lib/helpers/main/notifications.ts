import type { Notif, GroupKey } from "../../../types/main/notifications";
import { TYPE_CONFIG } from "@/constants/main/notifications";
export { timeAgoNotif as timeAgo } from "@/lib/utils";

export function normalizeNotif(n: Record<string, unknown>): Notif {
  const type =
    typeof n.type === "string" &&
    Object.prototype.hasOwnProperty.call(TYPE_CONFIG, n.type)
      ? (n.type as keyof typeof TYPE_CONFIG)
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

export const GROUP_ORDER: GroupKey[] = [
  "Today",
  "Yesterday",
  "This week",
  "Older",
];

export function groupNotifs(notifs: Notif[]): Record<GroupKey, Notif[]> {
  const groups: Record<GroupKey, Notif[]> = {
    Today: [],
    Yesterday: [],
    "This week": [],
    Older: [],
  };

  notifs.forEach((n) => {
    const diff = (Date.now() - new Date(n.created_at).getTime()) / 1000;
    if (diff < 86400) groups["Today"].push(n);
    else if (diff < 172800) groups["Yesterday"].push(n);
    else if (diff < 604800) groups["This week"].push(n);
    else groups["Older"].push(n);
  });

  return groups;
}