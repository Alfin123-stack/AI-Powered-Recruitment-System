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
        // FIX: token was never forwarded past this point before, so
        // OfferNotifCard's Accept/Decline buttons always sent an empty
        // Bearer token and failed auth. See NotificationsList.tsx /
        // NotificationsCard.tsx for the rest of the chain.
        token={token}
        onOfferResponded={(id, status) => {
          // Offer already marked read via NotificationsCard's onMarkRead
          // call. Nothing else required here right now, but this is the
          // hook point if you later want to e.g. refetch stats/counters
          // immediately after an accept/decline instead of waiting for
          // the next natural refresh.
        }}
      />
    </div>
  );
}