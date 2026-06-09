"use client";

import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export function InterviewConfirmModal({
  type,
  candidateName,
  onConfirm,
  onCancel,
  loading,
}: {
  type: "done" | "cancelled";
  candidateName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const isDone = type === "done";
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.2 }}
        className="bg-[#0a100c] border border-emerald-500/20 rounded-[20px] w-full max-w-[360px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
        <div className="p-6">
          <div
            className="w-12 h-12 rounded-[13px] flex items-center justify-center mx-auto mb-4"
            style={{
              background: isDone
                ? "rgba(16,185,129,0.12)"
                : "rgba(239,68,68,0.12)",
              color: isDone ? "#10b981" : "#ef4444",
              border: `1px solid ${isDone ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
            }}>
            {isDone ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          </div>
          <div className="text-center mb-5">
            <div className="font-bold text-[1rem] text-[#e8f0ec] mb-1">
              {isDone ? "Tandai Interview Selesai?" : "Batalkan Interview?"}
            </div>
            <div className="text-[0.78rem] text-[#5a8070] mb-3">
              {candidateName}
            </div>
            <p className="text-[0.8rem] text-[#6a9080] leading-[1.65]">
              {isDone
                ? "Interview akan ditandai sebagai selesai. Aksi ini tidak dapat dibatalkan."
                : "Interview akan dibatalkan. Kamu masih bisa menjadwalkan ulang setelahnya."}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-[10px] rounded-[10px] bg-[#080f0b] border border-emerald-500/15 text-[#6a9080] text-[0.83rem] font-medium cursor-pointer hover:text-[#e8f0ec] hover:border-emerald-500/30 transition-all disabled:opacity-40">
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-[10px] rounded-[10px] text-[0.83rem] font-bold cursor-pointer transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              style={{
                background: isDone
                  ? "rgba(16,185,129,0.15)"
                  : "rgba(239,68,68,0.15)",
                border: `1px solid ${isDone ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.35)"}`,
                color: isDone ? "#10b981" : "#ef4444",
              }}>
              {loading && <Loader2 size={13} className="animate-spin" />}
              {isDone ? "Ya, Selesai" : "Ya, Batalkan"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
