"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, MoreHorizontal, RefreshCw, X } from "lucide-react";
import { Interview } from "@/types/hr/interviews";
import { InterviewDropItem } from "./InterviewDropItem";
import { useInterviewMoreDropdown } from "@/hooks/dashboard/hr/useInterviewMoreDropdown";

interface InterviewMoreDropdownProps {
  interview: Interview;
  onMarkDone: () => void;
  onCancel: () => void;
  onReschedule: () => void;
}

export function InterviewMoreDropdown({
  interview,
  onMarkDone,
  onCancel,
  onReschedule,
}: InterviewMoreDropdownProps) {
  const { open, toggle, close, pos, btnRef, dropRef } =
    useInterviewMoreDropdown();

  return (
    <>
      <button
        ref={btnRef}
        title="more options"
        onClick={toggle}
        className="w-7 h-7 rounded-[6px] flex items-center justify-center cursor-pointer transition-all duration-150 bg-white/[0.03] border border-emerald-500/[0.12] text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec]">
        <MoreHorizontal size={13} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={dropRef}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            style={{ position: "fixed", top: pos.top, right: pos.right }}
            className="z-[300] bg-[#0f1612] border border-white/[0.08] rounded-[11px] shadow-[0_16px_48px_rgba(0,0,0,0.55)] w-[168px] py-1">
            {interview.status === "scheduled" && (
              <>
                <InterviewDropItem
                  icon={Check}
                  label="Tandai Selesai"
                  hoverClass="hover:bg-emerald-500/10 hover:text-emerald-400"
                  onClick={() => {
                    close();
                    onMarkDone();
                  }}
                />
                <InterviewDropItem
                  icon={RefreshCw}
                  label="Reschedule"
                  hoverClass="hover:bg-cyan-500/10 hover:text-cyan-400"
                  onClick={() => {
                    close();
                    onReschedule();
                  }}
                />
                <div className="h-px bg-white/[0.06] my-[3px]" />
                <InterviewDropItem
                  icon={X}
                  label="Batalkan"
                  hoverClass="hover:bg-rose-500/10 hover:text-rose-400"
                  onClick={() => {
                    close();
                    onCancel();
                  }}
                />
              </>
            )}
            {(interview.status === "done" ||
              interview.status === "overdue" ||
              interview.status === "cancelled") && (
              <InterviewDropItem
                icon={RefreshCw}
                label="Jadwalkan Ulang"
                hoverClass="hover:bg-emerald-500/10 hover:text-emerald-400"
                onClick={() => {
                  close();
                  onReschedule();
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
