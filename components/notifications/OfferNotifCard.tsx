"use client";

import { motion } from "framer-motion";
import { Gift, CheckCircle2, XCircle, Clock, Mail, Trash2 } from "lucide-react";
import type { Notif } from "@/types/main/notifications";

interface OfferNotifCardProps {
  notif: Notif;
  /** Called when the user deletes this offer notification. */
  onDelete?: (id: string) => void;
}

function useCountdown(expiresAt?: string) {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h left`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return hours > 0 ? `${hours}h ${mins}m left` : `${mins}m left`;
}

export default function OfferNotifCard({ notif, onDelete }: OfferNotifCardProps) {
  const meta = notif.metadata;
  const offerStatus = meta?.offer_status ?? "pending";
  const countdown = useCountdown(meta?.expires_at);
  const isExpired = countdown === "Expired";
  const status: "pending" | "accepted" | "declined" | "expired" = isExpired
    ? "expired"
    : (offerStatus as "pending" | "accepted" | "declined");

  const statusConfig = {
    pending: null,
    accepted: {
      label: "Offer Accepted",
      color: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.2)",
      icon: CheckCircle2,
    },
    declined: {
      label: "Offer Declined",
      color: "#6b7280",
      bg: "rgba(107,114,128,0.06)",
      border: "rgba(107,114,128,0.15)",
      icon: XCircle,
    },
    expired: {
      label: "Offer Expired",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.06)",
      border: "rgba(245,158,11,0.15)",
      icon: Clock,
    },
  };

  const responded = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-[14px] overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg,rgba(16,185,129,0.07) 0%,rgba(6,182,212,0.04) 100%)",
        border: "1px solid rgba(16,185,129,0.2)",
      }}>
      {/* Top accent — keeps this card visually distinct from regular notif cards */}
      <div
        className="h-[2px]"
        style={{ background: "linear-gradient(90deg,#10b981,#06b6d4)" }}
      />

      {/* Delete button — only visible on hover, top-right corner */}
      {onDelete && (
        <button
          onClick={() => onDelete(notif.id)}
          title="Hapus notifikasi"
          className="absolute top-3 right-3 z-10 w-6 h-6 rounded-md flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[#5d7a6a] hover:text-red-400"
          style={{ background: "rgba(255,255,255,0.04)" }}>
          <Trash2 size={11} />
        </button>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(16,185,129,0.12)" }}>
            <Gift size={16} className="text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[0.85rem] font-bold text-[#e8f0ec]">
                {notif.title}
              </span>
              {!notif.read && (
                <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 flex-shrink-0" />
              )}
            </div>
            <p className="text-[0.75rem] text-[#7a9585] mt-[2px] leading-relaxed">
              {notif.message}
            </p>
          </div>
        </div>

        {/* Offer details */}
        {(meta?.salary || meta?.start_date) && (
          <div
            className="rounded-[10px] px-3 py-2.5 mb-3 flex gap-4 flex-wrap"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
            {meta.salary && (
              <div>
                <div className="text-[0.6rem] text-[#3a5245] uppercase tracking-wide font-bold mb-[2px]">
                  Salary
                </div>
                <div className="text-[0.82rem] font-bold text-emerald-400">
                  {meta.salary}
                </div>
              </div>
            )}
            {meta.start_date && (
              <div>
                <div className="text-[0.6rem] text-[#3a5245] uppercase tracking-wide font-bold mb-[2px]">
                  Start Date
                </div>
                <div className="text-[0.82rem] font-semibold text-[#c8d8d0]">
                  {new Date(meta.start_date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* HR message */}
        {meta?.notes && (
          <div
            className="rounded-[10px] px-3 py-2.5 mb-3"
            style={{
              background: "rgba(16,185,129,0.04)",
              borderLeft: "2px solid rgba(16,185,129,0.3)",
            }}>
            <div className="text-[0.6rem] text-[#3a5245] uppercase tracking-wide font-bold mb-1">
              Message from HR
            </div>
            <p className="text-[0.75rem] text-[#7a9585] leading-relaxed m-0">
              {meta.notes}
            </p>
          </div>
        )}

        {/* Response area — accept/decline dilakukan lewat link di email, bukan di sini */}
        {status === "pending" ? (
          <div
            className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5"
            style={{
              background: "rgba(6,182,212,0.05)",
              border: "1px solid rgba(6,182,212,0.15)",
            }}>
            <Mail size={14} className="text-cyan-400 flex-shrink-0" />
            <span className="text-[0.74rem] text-[#8aa8b8] leading-relaxed">
              Cek emailmu untuk menerima atau menolak offer ini.
            </span>
            {countdown && countdown !== "Expired" && (
              <span className="ml-auto flex items-center gap-1 text-[0.68rem] text-amber-400 font-semibold flex-shrink-0">
                <Clock size={10} />
                {countdown}
              </span>
            )}
          </div>
        ) : (
          responded && (
            <div
              className="flex items-center gap-2 rounded-[9px] px-3 py-2.5"
              style={{
                background: responded.bg,
                border: `1px solid ${responded.border}`,
              }}>
              <responded.icon size={14} style={{ color: responded.color }} />
              <span
                className="text-[0.78rem] font-bold"
                style={{ color: responded.color }}>
                {responded.label}
              </span>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}