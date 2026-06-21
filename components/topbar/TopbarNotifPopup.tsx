import Link from "next/link";
import { CheckCheck, Clock, X, Inbox, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Notif } from "@/types/main/notifications";
import { NOTIF_TYPE_CFG, POPUP_LIMIT } from "@/constants/topbar";
import { timeAgo } from "@/lib/utils";


type TopbarNotifPopupProps = {
  notifs: Notif[];
  loading: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
  onMarkOneRead: (id: string) => void;
};

export function TopbarNotifPopup({
  notifs,
  loading,
  onClose,
  onMarkAllRead,
  onMarkOneRead,
}: TopbarNotifPopupProps) {
  const unread = notifs.filter((n) => !n.read).length;
  const hasMore = notifs.length > POPUP_LIMIT;
  const preview = [...notifs]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, POPUP_LIMIT);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-label="Notification panel"
      className="absolute right-0 top-[calc(100%+10px)] z-[200] w-[370px] overflow-hidden rounded-xl
        bg-[#0a0f0c] border border-white/[0.08]
        shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[0.88rem] text-[#dff0e8]">Notifications</span>
          {loading && (
            <span
              aria-label="Loading notifications"
              className="w-[5px] h-[5px] rounded-full animate-pulse bg-emerald-500/40"
            />
          )}
          {unread > 0 && (
            <span
              aria-label={`${unread} unread notifications`}
              className="rounded-full font-extrabold bg-emerald-500 text-black py-[1px] px-[7px] text-[10px]">
              {unread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              onClick={onMarkAllRead}
              title="Mark all notifications as read"
              aria-label="Mark all as read"
              className="flex items-center gap-[5px] text-[11px] font-semibold text-emerald-400 cursor-pointer
                bg-emerald-500/[0.07] hover:bg-emerald-500/[0.13]
                border border-emerald-500/20
                rounded-md px-[8px] py-[4px] transition-colors">
              <CheckCheck size={11} aria-hidden="true" /> Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            title="Close notifications"
            aria-label="Close notification panel"
            className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors
              bg-white/[0.04] border border-white/[0.07] text-[#3a5245]
              hover:bg-white/[0.08] hover:text-[#dff0e8]">
            <X size={12} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[320px]" role="list">
        {notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
              <Inbox size={18} className="text-[#2a4035]" aria-hidden="true" />
            </div>
            <div className="text-center">
              <p className="text-[0.8rem] font-semibold text-[#3d5a4a]">No notifications</p>
              <p className="text-[0.7rem] text-[#253b2e] mt-[2px]">Updates will appear here</p>
            </div>
          </div>
        ) : (
          preview.map((n, i) => {
            const cfg = NOTIF_TYPE_CFG[n.type] ?? NOTIF_TYPE_CFG.general;
            const isUnread = !n.read;
            return (
              <div
                key={n.id}
                role="listitem"
                onClick={() => isUnread && onMarkOneRead(n.id)}
                className={`group relative flex gap-3 px-4 py-3 transition-colors
                  ${i < preview.length - 1 ? "border-b border-white/[0.05]" : ""}
                  ${
                    isUnread
                      ? "bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer"
                      : "bg-transparent hover:bg-white/[0.01] cursor-default"
                  }`}>
                {isUnread && (
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-[20%] bottom-[20%] w-[2.5px] rounded-r-full"
                    style={{ background: cfg.dotColor }}
                  />
                )}
                <div
                  aria-hidden="true"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-[1px] text-[0.88rem] border ${cfg.bg} ${cfg.border}`}>
                  {cfg.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-[2px]">
                    <div className="flex items-center gap-[5px] min-w-0">
                      <span
                        className={`text-[0.62rem] font-bold tracking-[0.06em] uppercase flex-shrink-0 ${cfg.labelColor}`}>
                        {cfg.label}
                      </span>
                      <span
                        className={`font-semibold text-[0.79rem] leading-snug truncate ${isUnread ? "text-[#dff0e8]" : "text-[#5e8070]"}`}>
                        {n.title}
                      </span>
                    </div>
                    {isUnread && (
                      <button
                        title="Mark this notification as read"
                        aria-label={`Mark "${n.title}" as read`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkOneRead(n.id);
                        }}
                        className="flex-shrink-0 w-5 h-5 rounded mt-[2px] opacity-0 group-hover:opacity-100 transition-opacity
                          bg-emerald-500/10 border border-emerald-500/20
                          flex items-center justify-center hover:bg-emerald-500/20">
                        <CheckCheck size={9} className="text-emerald-400" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <p className="text-[0.73rem] leading-[1.45] line-clamp-2 mb-[4px] text-[#3a5245]">
                    {n.message}
                  </p>
                  <span className="flex items-center gap-1 text-[0.64rem] text-[#253b2e]">
                    <Clock size={8} aria-hidden="true" /> {timeAgo(n.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-[9px] border-t border-white/[0.06]">
        <span className="text-[0.67rem] text-[#253b2e]">
          {hasMore
            ? `${POPUP_LIMIT} of ${notifs.length} notifications`
            : notifs.length > 0
              ? `${notifs.length} notifications`
              : ""}
        </span>
        <Link
          href="/notifications"
          onClick={onClose}
          aria-label="View all notifications"
          className="flex items-center gap-1 font-semibold no-underline text-emerald-400 text-[11px] transition-colors hover:text-emerald-300">
          View all <ArrowRight size={11} aria-hidden="true" />
        </Link>
      </div>
    </motion.div>
  );
}
