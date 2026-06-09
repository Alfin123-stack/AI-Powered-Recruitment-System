"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BellOff, Inbox } from "lucide-react";
import NotifCard from "./NotificationsCard";
import { groupNotifs, GROUP_ORDER } from "../../lib/helpers/notifications";
import type { FilterId, Notif } from "../../types/notifications";

// Re-export GROUP_ORDER from helpers so consumers can import from here too.
export { GROUP_ORDER };

interface NotifListProps {
  notifs: Notif[];
  activeFilter: FilterId;
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationsList({
  notifs,
  activeFilter,
  unreadCount,
  onMarkRead,
  onDelete,
}: NotifListProps) {
  // Filter
  const filtered = notifs.filter((n) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !n.read;
    return n.type === activeFilter;
  });

  // Empty state
  if (filtered.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/[0.05]"
          style={{ background: "rgba(13,19,16,0.9)" }}>
          {activeFilter === "unread" ? (
            <BellOff size={20} className="text-[#2e4438]" />
          ) : (
            <Inbox size={20} className="text-[#2e4438]" />
          )}
        </div>
        <p className="font-semibold text-[0.88rem] mb-1 text-[#8aada0]">
          {activeFilter === "unread"
            ? "Semua sudah dibaca"
            : "Tidak ada notifikasi"}
        </p>
        <p className="text-[0.73rem] text-[#2e4438]">
          {activeFilter === "unread"
            ? "Tidak ada notifikasi yang belum dibaca."
            : "Notifikasi akan muncul saat ada pembaruan."}
        </p>
      </motion.div>
    );
  }

  const grouped = groupNotifs(filtered);

  return (
    <AnimatePresence mode="popLayout">
      {GROUP_ORDER.map((group) => {
        const items = grouped[group];
        if (!items?.length) return null;

        return (
          <div key={group} className="mb-4">
            {/* Group label row */}
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-[0.6rem] font-bold tracking-[0.14em] uppercase text-[#1e3028]">
                {group}
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(255,255,255,0.03)" }}
              />
              <span className="text-[0.6rem] text-[#1e3028]">
                {items.length}
              </span>
            </div>

            <AnimatePresence>
              {items.map((n, i) => (
                <NotifCard
                  key={n.id}
                  notif={n}
                  onMarkRead={onMarkRead}
                  onDelete={onDelete}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        );
      })}
    </AnimatePresence>
  );
}
