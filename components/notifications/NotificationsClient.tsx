"use client";

// ─── components/notifications/NotificationsClient.tsx ─────────────────────────
// CSR boundary — menerima data dari SSR, mendelegasikan semua logic ke
// useNotifications hook. Komponen ini murni sebagai orkestrator UI.

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

// ── Helper subtitle default ─────────────────────────────────────────────────
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

// ── Komponen utama ──────────────────────────────────────────────────────────
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
      />
    </div>
  );
}
