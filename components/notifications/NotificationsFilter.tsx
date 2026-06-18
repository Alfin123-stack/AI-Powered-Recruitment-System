"use client";

import { motion } from "framer-motion";

import type { FilterId, Notif } from "../../types/main/notifications";
import { FILTERS } from "@/constants/main/notifications";

interface NotificationsFilterProps {
  activeFilter: FilterId;
  notifs: Notif[];
  unreadCount: number;
  onFilterChange: (id: FilterId) => void;
}

export default function NotificationsFilter({
  activeFilter,
  notifs,
  unreadCount,
  onFilterChange,
}: NotificationsFilterProps) {
  function getCount(filterId: FilterId): number {
    if (filterId === "all") return notifs.length;
    if (filterId === "unread") return unreadCount;
    return notifs.filter((n) => n.type === filterId).length;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="mb-5">
      <div
        className="flex gap-[2px] p-[3px] rounded-xl overflow-x-auto scrollbar-none border border-white/[0.05]"
        style={{ background: "rgba(13,19,16,0.95)" }}>
        {FILTERS.map((f) => {
          const count = getCount(f.id);
          const active = activeFilter === f.id;

          return (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className="flex items-center gap-1 px-[10px] py-[5px] rounded-[9px] text-[0.72rem] font-medium cursor-pointer transition-all whitespace-nowrap"
              style={{
                background: active ? "rgba(52,211,153,0.10)" : "transparent",
                color: active ? "#34d399" : "#2e4438",
                border: active
                  ? "1px solid rgba(52,211,153,0.18)"
                  : "1px solid transparent",
              }}>
              {f.label}
              {count > 0 && (
                <span
                  className="text-[0.57rem] font-bold px-[5px] py-[2px] rounded-[5px] ml-[1px]"
                  style={{
                    background: active
                      ? "rgba(52,211,153,0.15)"
                      : "rgba(255,255,255,0.05)",
                    color: active ? "#34d399" : "#2e4438",
                  }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
