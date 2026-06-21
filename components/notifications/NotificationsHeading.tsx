"use client";

import { motion } from "framer-motion";
import { Bell, CheckCheck, RefreshCw } from "lucide-react";

interface NotificationsHeadingProps {
  unreadCount: number;
  subtitle: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  onMarkAllRead: () => void;
}

export default function NotificationsHeading({
  unreadCount,
  subtitle,
  isRefreshing,
  onRefresh,
  onMarkAllRead,
}: NotificationsHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6">
      <div className="flex items-center justify-between">
        {/* Left: icon + title/subtitle */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500/15 to-emerald-500/[0.04] border border-emerald-500/20">
            <Bell size={18} className="text-emerald-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-emerald-500 text-[0.52rem] font-bold text-black flex items-center justify-center border-[1.5px] border-[#080d0b]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>

          <div>
            <h1 className="font-extrabold text-[1.4rem] leading-none tracking-tight text-[#e8f5f0]">
              Notifications
            </h1>
            <p className="text-[0.72rem] mt-1 text-[#2e4438]">{subtitle}</p>
          </div>
        </div>

        {/* Right: refresh + mark-all-read */}
        <div className="flex items-center gap-2">
          <button
            title="Refresh notifications"
            aria-label="Refresh notifications"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 border border-white/[0.07] bg-white/[0.03] text-[#2e4438] hover:text-[#6aad8a]">
            <RefreshCw
              size={13}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>

          {unreadCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              title="Mark all notifications as read"
              aria-label="Mark all notifications as read"
              onClick={onMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.72rem] font-medium transition-all cursor-pointer whitespace-nowrap border border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400 hover:bg-emerald-500/10">
              <CheckCheck size={12} />
              Mark all read
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
