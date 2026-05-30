"use client";

import { motion } from "framer-motion";
import { CheckCheck, Clock, X } from "lucide-react";
import { typeConfig } from "./config";
import { timeAgo } from "./helpers";
import type { Notif } from "./notifications";

interface NotifCardProps {
  notif: Notif;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

export default function NotifCard({
  notif,
  onMarkRead,
  onDelete,
  index,
}: NotifCardProps) {
  const cfg = typeConfig[notif.type] ?? typeConfig.general;
  const Icon = cfg.iconEl;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{
        duration: 0.25,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative mb-2">
      <div
        className={`
          relative rounded-xl overflow-hidden transition-all duration-200
          border ${notif.read ? "border-white/[0.06]" : cfg.border}
          ${!notif.read ? `bg-gradient-to-br ${cfg.gradient}` : ""}
        `}
        style={{ background: notif.read ? "rgba(13,19,16,0.85)" : undefined }}>
        {/* Unread left accent bar */}
        {!notif.read && (
          <div
            className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-r-full"
            style={{ background: cfg.accentColors }}
          />
        )}

        {/* Top shimmer line for unread */}
        {!notif.read && (
          <div
            className="absolute top-0 inset-x-0 h-px opacity-60"
            style={{ background: cfg.shimmerColors }}
          />
        )}

        <div className="flex items-start gap-3 px-4 py-3.5 pl-5">
          {/* Icon */}
          <div className="relative flex-shrink-0 mt-[1px]">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.iconBg} ${cfg.iconColor} border border-white/[0.07]`}>
              <Icon size={16} />
            </div>
            {!notif.read && (
              <span
                className={`absolute -top-[3px] -right-[3px] w-2 h-2 rounded-full ${cfg.dotColor} border-[1.5px] border-[#080d0b]`}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-[3px]">
              <p
                className={`text-[0.83rem] font-semibold leading-snug ${
                  notif.read ? "text-[#5a7a6a]" : "text-[#e2f0ea]"
                }`}>
                {notif.title}
              </p>

              {/* Hover actions */}
              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                {!notif.read && (
                  <button
                    onClick={() => onMarkRead(notif.id)}
                    title="Tandai dibaca"
                    className={`w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer ${cfg.iconBg} ${cfg.iconColor} transition-colors hover:opacity-80`}>
                    <CheckCheck size={11} />
                  </button>
                )}
                <button
                  onClick={() => onDelete(notif.id)}
                  title="Hapus"
                  className="w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer text-[#3a5245] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  <X size={11} />
                </button>
              </div>
            </div>

            <p className="text-[0.74rem] leading-relaxed mb-2.5 text-[#3e5a4c] line-clamp-2">
              {notif.message}
            </p>

            <div className="flex items-center gap-2">
              <span
                className={`text-[0.6rem] font-bold tracking-widest uppercase px-2 py-[3px] rounded-md ${cfg.pillBg} ${cfg.pillText}`}>
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
