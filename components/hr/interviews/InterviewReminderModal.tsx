"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, X, CheckCircle2 } from "lucide-react";
import { Interview } from "@/types/hr/interviews";

export function InterviewReminderModal({
  interview,
  onClose,
}: {
  interview: Interview;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const options = [
    { label: "15 menit sebelumnya", value: "15" },
    { label: "30 menit sebelumnya", value: "30" },
    { label: "1 jam sebelumnya", value: "60" },
    { label: "1 hari sebelumnya", value: "1440" },
  ];

  const handleSend = () => {
    if (!selected) return;
    setSent(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="relative bg-[#0a100c] border border-emerald-500/20 rounded-[18px] w-full max-w-[340px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[9px] bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <Bell size={14} />
              </div>
              <div>
                <div className="text-[0.85rem] font-bold text-[#e8f0ec]">
                  Set Reminder
                </div>
                <div className="text-[0.7rem] text-[#5a8070]">
                  {interview.candidate_name}
                </div>
              </div>
            </div>
            <button
              title="close"
              onClick={onClose}
              className="w-7 h-7 rounded-[7px] bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#4d7060] hover:text-[#e8f0ec] transition-all cursor-pointer">
              <X size={12} />
            </button>
          </div>

          {sent ? (
            <div className="flex flex-col items-center py-4 gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={18} />
              </div>
              <span className="text-[0.83rem] text-emerald-400 font-semibold">
                Reminder diset!
              </span>
            </div>
          ) : (
            <>
              <p className="text-[0.75rem] text-[#5a8070] mb-3">
                Ingatkan saya sebelum interview:
              </p>
              <div className="flex flex-col gap-2 mb-4">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelected(opt.value)}
                    className={`flex items-center gap-3 px-3 py-[9px] rounded-[9px] border text-[0.8rem] text-left cursor-pointer transition-all ${
                      selected === opt.value
                        ? "bg-amber-500/10 border-amber-500/35 text-amber-400"
                        : "bg-[#080f0b] border-emerald-500/12 text-[#6a9080] hover:border-emerald-500/25 hover:text-[#c5d9cc]"
                    }`}>
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selected === opt.value
                          ? "border-amber-400 bg-amber-400"
                          : "border-[#3d5c49]"
                      }`}>
                      {selected === opt.value && (
                        <span className="w-1.5 h-1.5 rounded-full bg-black" />
                      )}
                    </span>
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSend}
                disabled={!selected}
                className="w-full py-[9px] rounded-[10px] bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-[0.82rem] font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
                <Bell size={13} /> Set Reminder
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
