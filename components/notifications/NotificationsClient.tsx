"use client";

import { useState } from "react";
import NotificationsHeading from "./NotificationsHeading";
import FilterBar from "./NotificationsFilter";
import NotifList from "./NotificationsList";
import StatCard from "./NotificationsStatCard";
import { useNotifications } from "../../hooks/main/useNotifications";
import type {
  NotificationsClientProps,
  FilterId,
  UserMeta,
} from "../../types/main/notifications";
import { DEFAULT_STATS } from "@/constants/main/notifications";

// ── Default subtitle helper ─────────────────────────────────────────────────
function defaultSubtitle({
  unreadCount,
  user,
}: {
  unreadCount: number;
  user?: UserMeta | null;
}): string {
  const name = user?.user_metadata?.full_name ?? user?.full_name ?? undefined;
  const greeting = name ? `Hi, ${name.split(" ")[0]} — ` : "";
  return unreadCount > 0
    ? `${greeting}${unreadCount} unread notifications`
    : `${greeting}All notifications read`;
}

// ── Main component ──────────────────────────────────────────────────────────
export default function NotificationsClient({
  initialNotifs,
  stats = DEFAULT_STATS,
  subtitle,
  token,
  user,
}: NotificationsClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  // NOTE: `token` is still needed here — useNotifications uses it for
  // refresh/mark-read/delete requests. It's just no longer forwarded
  // down to NotifList/NotifCard/OfferNotifCard, since offer_letter cards
  // are display-only now (accept/decline happens via the email link).
  const {
    notifs,
    unreadCount,
    isRefreshing,
    handleRefresh,
    handleMarkRead,
    handleMarkAllRead,
    handleDelete,
  } = useNotifications(initialNotifs, token);

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