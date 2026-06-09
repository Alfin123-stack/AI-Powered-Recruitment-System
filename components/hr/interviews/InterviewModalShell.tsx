"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

export function InterviewModalShell({
  title,
  subtitle,
  onClose,
  maxWidth = "max-w-[600px]",
  zIndex = "z-[100]",
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  maxWidth?: string;
  zIndex?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4 bg-black/80 backdrop-blur-[8px]`}>
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`relative w-full ${maxWidth} max-h-[92vh] flex flex-col bg-[#0a100c] border border-emerald-500/20 rounded-[20px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]`}>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent flex-shrink-0" />
        <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-500/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                {icon}
              </div>
            )}
            <div>
              <h2 className="font-bold text-[0.95rem] text-[#e8f0ec] leading-none">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[0.72rem] text-[#4d7060] mt-[3px]">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            title="close"
            onClick={onClose}
            className="w-8 h-8 rounded-[8px] bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#4d7060] hover:text-[#e8f0ec] hover:border-emerald-500/25 transition-all cursor-pointer">
            <X size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
