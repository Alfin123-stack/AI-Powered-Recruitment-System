"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  MoreHorizontal,
  Check,
} from "lucide-react";
import { CandidateRaw, CandidateStatus } from "@/types/candidates";

export function CandidatesActionDropdown({
  candidate,
  onStatusChange,
  onView,
}: {
  candidate: CandidateRaw;
  onStatusChange: (id: string, status: CandidateStatus) => void;
  onView: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const updatePos = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const dropdownH = 160;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top =
      spaceBelow < dropdownH ? rect.top - dropdownH - 4 : rect.bottom + 4;
    setPos({ top, left: rect.right - 160 });
  }, []);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    updatePos();
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  // ── Item aksi (View Detail selalu aktif, tidak terkait status) ─────────
  const viewItem = {
    label: "View Detail",
    icon: Eye,
    action: () => {
      onView();
      setOpen(false);
    },
    color: "#e8f0ec",
  };

  // ── Item status — masing-masing dicek terhadap status kandidat saat ini ─
  const statusItems: Array<{
    label: string;
    status: CandidateStatus;
    icon: React.ElementType;
    color: string;
  }> = [
    {
      label: "Shortlist",
      status: "shortlisted",
      icon: ThumbsUp,
      color: "#10b981",
    },
    {
      label: "In Review",
      status: "review",
      icon: RotateCcw,
      color: "#06b6d4",
    },
    {
      label: "Reject",
      status: "rejected",
      icon: ThumbsDown,
      color: "#f43f5e",
    },
  ];

  const menu = (
    <AnimatePresence>
      {open && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="fixed z-[9999] rounded-[10px] overflow-hidden w-44"
            style={{
              top: pos.top,
              left: pos.left,
              background: "#141f19",
              border: "1px solid rgba(16,185,129,0.2)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}>
            {/* View Detail */}
            <button
              type="button"
              title={viewItem.label}
              onClick={(e) => {
                e.stopPropagation();
                viewItem.action();
              }}
              className="flex items-center gap-2 w-full px-3 py-[9px] text-[12px] font-semibold text-left transition-colors hover:bg-[rgba(16,185,129,0.06)]"
              style={{ color: viewItem.color }}>
              <viewItem.icon size={12} />
              {viewItem.label}
            </button>

            <div
              className="h-px mx-1"
              style={{ background: "rgba(16,185,129,0.1)" }}
            />

            {/* Status actions */}
            {statusItems.map(({ label, status, icon: Icon, color }) => {
              const isActive = candidate.status === status;
              return (
                <button
                  key={status}
                  type="button"
                  title={
                    isActive
                      ? `Kandidat sudah berstatus ${label}`
                      : `Ubah status ke ${label}`
                  }
                  disabled={isActive}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isActive) return;
                    onStatusChange(candidate.id, status);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between gap-2 w-full px-3 py-[9px] text-[12px] font-semibold text-left transition-colors disabled:cursor-default"
                  style={{
                    color,
                    background: isActive ? `${color}14` : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(16,185,129,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                  }}>
                  <span className="flex items-center gap-2">
                    <Icon size={12} />
                    {label}
                  </span>
                  {isActive && <Check size={12} />}
                </button>
              );
            })}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div>
      <button
        ref={btnRef}
        type="button"
        title="Candidate action options"
        onClick={handleOpen}
        className="w-7 h-7 flex items-center justify-center rounded-[7px] transition-colors text-[#7a9585] hover:bg-[rgba(16,185,129,0.08)]"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(16,185,129,0.12)",
        }}>
        <MoreHorizontal size={14} />
      </button>
      {typeof document !== "undefined" && createPortal(menu, document.body)}
    </div>
  );
}