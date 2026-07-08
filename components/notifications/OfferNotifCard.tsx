"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import type { Notif } from "@/types/main/notifications";
import { API } from "@/lib/api";

interface OfferNotifCardProps {
  notif: Notif;
  token: string;
  onResponded: (id: string, status: "accepted" | "declined") => void;
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

export default function OfferNotifCard({
  notif,
  token,
  onResponded,
}: OfferNotifCardProps) {
  const meta = notif.metadata;
  const offerStatus = meta?.offer_status ?? "pending";
  const countdown = useCountdown(meta?.expires_at);
  const isExpired = countdown === "Expired";
  const isPending = offerStatus === "pending" && !isExpired;

  const [loading, setLoading] = useState<"accept" | "decline" | null>(null);
  const [localStatus, setLocalStatus] = useState<
    "pending" | "accepted" | "declined" | "expired"
  >(isExpired ? "expired" : (offerStatus as "pending" | "accepted" | "declined"));

  const respond = async (action: "accept" | "decline") => {
    if (loading || localStatus !== "pending") return;
    setLoading(action);

    const newStatus = action === "accept" ? "accepted" : "declined";

    try {
      // Update offer status via backend
      if (meta?.application_id) {
        await fetch(`${API}/api/applications/${meta.application_id}/offer`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ offer_status: newStatus }),
        });
      }

      setLocalStatus(newStatus);
      onResponded(notif.id, newStatus);
    } catch (err) {
      console.error("[OfferNotifCard] respond error:", err);
    } finally {
      setLoading(null);
    }
  };

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

  const responded = statusConfig[localStatus];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[14px] overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg,rgba(16,185,129,0.07) 0%,rgba(6,182,212,0.04) 100%)",
        border: "1px solid rgba(16,185,129,0.2)",
      }}>
      {/* Top accent */}
      <div
        className="h-[2px]"
        style={{ background: "linear-gradient(90deg,#10b981,#06b6d4)" }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(16,185,129,0.12)" }}>
            <Gift size={16} className="text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
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

        {/* Response area */}
        {localStatus === "pending" ? (
          <div>
            {/* Expiry */}
            {countdown && countdown !== "Expired" && (
              <div className="flex items-center gap-1 mb-3">
                <Clock size={11} className="text-amber-400" />
                <span className="text-[0.7rem] text-amber-400 font-semibold">
                  {countdown}
                </span>
              </div>
            )}

            {/* Accept / Decline */}
            {isPending && (
              <div className="flex gap-2">
                <button
                  onClick={() => respond("decline")}
                  disabled={!!loading}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[9px] text-[0.78rem] font-semibold transition-all cursor-pointer border disabled:opacity-40"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.08)",
                    color: "#5d7a6a",
                  }}>
                  {loading === "decline" ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <XCircle size={12} />
                  )}
                  Decline
                </button>
                <button
                  onClick={() => respond("accept")}
                  disabled={!!loading}
                  className="flex-[2] flex items-center justify-center gap-1.5 py-2 rounded-[9px] text-[0.82rem] font-bold transition-all cursor-pointer border-0 disabled:opacity-40"
                  style={{ background: "#10b981", color: "#000" }}>
                  {loading === "accept" ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={12} />
                  )}
                  Accept Offer
                </button>
              </div>
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
