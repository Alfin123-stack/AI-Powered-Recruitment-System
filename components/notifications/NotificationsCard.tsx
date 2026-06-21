"use client";

import { motion } from "framer-motion";
import { CheckCheck, Clock } from "lucide-react";
import { timeAgo } from "../../lib/helpers/main/notifications";
import type { Notif } from "../../types/main/notifications";
import { TYPE_CONFIG } from "@/constants/main/notifications";

interface NotifCardProps {
  notif: Notif;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

export default function NotificationsCard({
  notif,
  onMarkRead,
  onDelete: _onDelete,
  index,
}: NotifCardProps) {
  const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.general;
  const Icon = cfg.iconEl;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{
        duration: 0.2,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative mb-2">
      <div
        className={`
          relative rounded-lg transition-all duration-150
          border
          ${
            notif.read
              ? "bg-[#0d1310] border-white/[0.06]"
              : `bg-[#101a14] ${cfg.border}`
          }
        `}>
        {/* Unread left accent bar */}
        {!notif.read && (
          <div
            className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-r-full"
            style={{ background: cfg.accentColors }}
          />
        )}

        <div className="flex items-start gap-3 px-4 py-3.5 pl-5">
          {/* Icon */}
          <div className="relative flex-shrink-0 mt-[1px]">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.iconBg} ${cfg.iconColor}`}>
              <Icon size={15} />
            </div>
            {!notif.read && (
              <span
                className={`absolute -top-[3px] -right-[3px] w-2 h-2 rounded-full ${cfg.dotColor} border-[1.5px] border-[#0d1310]`}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-[3px]">
              <p
                className={`text-[0.83rem] font-semibold leading-snug ${
                  notif.read ? "text-[#4a6a5a]" : "text-[#d8ece2]"
                }`}>
                {notif.title}
              </p>

              {/* Mark read button — only shown on hover for unread */}
              {!notif.read && (
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={() => onMarkRead(notif.id)}
                    title="Mark as read"
                    className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer ${cfg.iconBg} ${cfg.iconColor} transition-opacity hover:opacity-70`}>
                    <CheckCheck size={11} />
                  </button>
                </div>
              )}
            </div>

            <p className="text-[0.74rem] leading-relaxed mb-2.5 text-[#3e5a4c] line-clamp-2">
              {notif.message}
            </p>

            <div className="flex items-center gap-2">
              <span
                className={`text-[0.6rem] font-bold tracking-widest uppercase px-2 py-[3px] rounded ${cfg.pillBg} ${cfg.pillText}`}>
                {cfg.label}
              </span>
              <span className="flex items-center gap-1 text-[0.67rem] text-[#2a3e33]">
                <Clock size={9} />
                {timeAgo(notif.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
