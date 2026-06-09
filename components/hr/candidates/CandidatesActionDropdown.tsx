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
} from "lucide-react";
import { CandidateExtended, CandidateStatus } from "@/types/candidates";

export function CandidatesActionDropdown({
  candidate,
  onStatusChange,
  onView,
}: {
  candidate: CandidateExtended;
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

  const menuItems: Array<{
    label: string;
    icon: React.ElementType;
    action: () => void;
    color: string;
  }> = [
    {
      label: "View Detail",
      icon: Eye,
      action: () => {
        onView();
        setOpen(false);
      },
      color: "#e8f0ec",
    },
    {
      label: "Shortlist",
      icon: ThumbsUp,
      action: () => {
        onStatusChange(candidate.id, "shortlisted");
        setOpen(false);
      },
      color: "#10b981",
    },
    {
      label: "In Review",
      icon: RotateCcw,
      action: () => {
        onStatusChange(candidate.id, "review");
        setOpen(false);
      },
      color: "#06b6d4",
    },
    {
      label: "Reject",
      icon: ThumbsDown,
      action: () => {
        onStatusChange(candidate.id, "rejected");
        setOpen(false);
      },
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
            className="fixed z-[9999] rounded-[10px] overflow-hidden w-40"
            style={{
              top: pos.top,
              left: pos.left,
              background: "#141f19",
              border: "1px solid rgba(16,185,129,0.2)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}>
            {menuItems.map(({ label, icon: Icon, action, color }) => (
              <button
                key={label}
                type="button"
                title={label}
                onClick={(e) => {
                  e.stopPropagation();
                  action();
                }}
                className="flex items-center gap-2 w-full px-3 py-[9px] text-[12px] font-semibold text-left transition-colors hover:bg-[rgba(16,185,129,0.06)]"
                style={{ color }}>
                <Icon size={12} />
                {label}
              </button>
            ))}
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
