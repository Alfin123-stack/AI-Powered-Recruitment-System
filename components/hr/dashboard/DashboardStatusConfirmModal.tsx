"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { ConfirmableStatus } from "@/lib/helpers/hr/dashboardStatus";
import { STATUS_CONFIRM_INFO } from "@/lib/helpers/hr/dashboardStatus";

// Dipasang di DashboardCandidateModal (3 aksi: Shortlist/Review/Tolak) dan
// DashboardJobGroupTable (2 quick-action icon: Shortlist/Reject; tidak ada
// icon Review di row tabel). Pakai createPortal ke document.body supaya
// tidak ketimpa/terpotong overflow dari modal atau tabel yang memanggilnya,
// dan z-[300] — satu level di atas DashboardCandidateModal (z-[200]) supaya
// tetap terlihat kalau dipicu dari dalam modal itu.
export function DashboardStatusConfirmModal({
  status,
  candidateName,
  onConfirm,
  onCancel,
}: {
  status: ConfirmableStatus;
  candidateName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const info = STATUS_CONFIRM_INFO[status];
  const Icon = info.Icon;

  const modal = (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-[8px] p-4"
        role="dialog"
        aria-modal="true"
        aria-label={info.title}>
        <div className="absolute inset-0" onClick={onCancel} />
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-[360px] rounded-[20px] overflow-hidden bg-[#0a0f0c] border border-emerald-500/25"
          style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
          <div
            className="h-[3px] w-full"
            style={{
              background: `linear-gradient(90deg,${info.color},transparent)`,
            }}
          />
          <div className="p-6">
            <div
              className="w-12 h-12 rounded-[13px] flex items-center justify-center mx-auto mb-4"
              style={{
                background: info.bg,
                color: info.color,
                border: `1px solid ${info.border}`,
              }}>
              <Icon size={20} aria-hidden="true" />
            </div>
            <div className="text-center mb-5">
              <div className="font-black text-[0.95rem] text-[#e8f0ec] mb-1">
                {info.title}
              </div>
              <p className="text-[0.78rem] text-[#7a9585] leading-[1.65]">
                {info.description(candidateName)}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-[10px] rounded-[10px] text-[0.82rem] font-medium cursor-pointer transition-all bg-white/[0.05] border border-white/10 text-[#7a9585] hover:text-[#e8f0ec]">
                Batal
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 py-[10px] rounded-[10px] text-[0.82rem] font-bold cursor-pointer transition-all"
                style={{
                  background: info.bg,
                  border: `1px solid ${info.border}`,
                  color: info.color,
                }}>
                {info.confirmLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return typeof document !== "undefined"
    ? createPortal(modal, document.body)
    : null;
}
